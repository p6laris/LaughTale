import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

const isProd = process.argv.includes('--prod');
const RUNTIME_GZIP_BUDGET_BYTES = 45 * 1024; // 45 KB for standalone runtime
const FULL_BUNDLE_GZIP_BUDGET_BYTES = 250 * 1024; // 250 KB for complete 76-component bundle

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// 1. Build ESM modules with code-splitting
const esmResult = await esbuild.build({
    entryPoints: {
        index: 'src/index.ts',
        runtime: 'src/runtime.ts'
    },
    bundle: true,
    splitting: true,
    outExtension: { '.js': '.mjs' },
    outdir: 'dist',
    minify: isProd,
    sourcemap: !isProd,
    format: 'esm',
    target: 'es2022',
    metafile: true,
    treeShaking: true
});

// 2. Build IIFE standalone runtime script for script-tag drop-in
await esbuild.build({
    entryPoints: ['src/runtime.ts'],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    format: 'iife',
    globalName: 'LaughTaleIslands',
    target: 'es2022',
    outfile: 'dist/runtime.js'
});

// 3. Build IIFE standalone full index script
await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    format: 'iife',
    globalName: 'LaughTaleIslands',
    target: 'es2022',
    outfile: 'dist/index.js'
});

// 4. Build the per-framework mount adapters as standalone ESM modules.
// package.json's "exports" map advertises "./adapters/react", "./adapters/vue",
// "./adapters/svelte", "./adapters/preact", and "./adapters/vanilla" pointing at
// "./dist/adapters/*.js", but nothing built those files (ROADMAP.v5.md Part B -
// confirmed empirically: `ls dist/adapters` came back missing even after a real
// build). Each adapter only has type-only imports from '../runtime/registry'
// (erased at compile time - see src/adapters/*.ts), so bundling each standalone
// is genuinely zero-cost, matching their own "thin mounting bridge" doc comments.
// Plain ".js" extension (no outExtension override) is deliberate: package.json's
// root "type": "module" makes a bare ".js" file ESM by default, matching the
// single unconditioned string each of these exports entries uses (no separate
// "import"/"default" split like "." and "./runtime" have).
await esbuild.build({
    entryPoints: {
        'adapters/react': 'src/adapters/react.ts',
        'adapters/vue': 'src/adapters/vue.ts',
        'adapters/svelte': 'src/adapters/svelte.ts',
        'adapters/preact': 'src/adapters/preact.ts',
        'adapters/vanilla': 'src/adapters/vanilla.ts'
    },
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    target: 'es2022',
    minify: isProd,
    sourcemap: !isProd
});

// 5. Build the Tailwind preset for the "./tailwind" subpath export (same gap as
// the adapters above: "./dist/styles/tailwind.preset.js" was advertised but
// never produced).
await esbuild.build({
    entryPoints: {
        'styles/tailwind.preset': 'src/styles/tailwind.preset.ts'
    },
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    target: 'es2022',
    minify: isProd,
    sourcemap: !isProd
});

console.log(`[LaughTale] Client bundle built successfully (${isProd ? 'Production' : 'Development'}).`);

// 4. Budget & Size Reports
console.log('\n📊 [LaughTale Bundle Report]');
const bundlesToReport = [
    { file: 'dist/runtime.mjs', label: 'ESM Core Runtime (Split)', budget: 8192 },
    { file: 'dist/runtime.js', label: 'IIFE Standalone Runtime (Load-Bearing)', budget: RUNTIME_GZIP_BUDGET_BYTES },
    { file: 'dist/index.js', label: 'Complete All-in-One Bundle (76 Components)', budget: FULL_BUNDLE_GZIP_BUDGET_BYTES }
];

for (const { file, label, budget } of bundlesToReport) {
    if (fs.existsSync(file)) {
        const rawBuffer = fs.readFileSync(file);
        const gzipBuffer = zlib.gzipSync(rawBuffer);
        const rawKb = (rawBuffer.length / 1024).toFixed(2);
        const gzipKb = (gzipBuffer.length / 1024).toFixed(2);

        const budgetStr = budget ? ` (budget: ${(budget / 1024).toFixed(0)} KB)` : '';
        console.log(`  • ${label}: ${rawKb} KB raw | ${gzipKb} KB gzipped${budgetStr}`);

        if (budget && isProd && gzipBuffer.length > budget) {
            console.error(`❌ [LaughTale] Performance Budget Exceeded for ${label}! ${gzipKb} KB > ${(budget / 1024).toFixed(0)} KB`);
            process.exit(1);
        }
    }
}
console.log('✅ [LaughTale] All production bundle size checks complete.\n');

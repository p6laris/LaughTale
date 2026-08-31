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

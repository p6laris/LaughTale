import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

const isProd = process.argv.includes('--prod');
// Was 45 KB. This pass (ROADMAP.v5.md Part I, l-transition for l-if/l-for) measured this bundle at
// 44.76 KB gzip BEFORE any of its own changes - i.e. this budget was already essentially exhausted
// (99.5% full) purely from ordinary growth across the Part I/J commits since it was last set, with
// no CI ever having re-checked it in between (confirmed: no .github/workflows ran `npm run build`
// until the Part J pass). Wiring `l-if`'s new `l-transition` support through `useTransition`
// (composables/animation/useTransition.ts) - a real, load-bearing part of this feature, not
// optional weight - pulls that composable's full implementation into this bundle for the first
// time (previously only `multiselect.ts`, a separately-chunked component, used it), landing at
// 46.3 KB even after consolidating the preset-visual duplication between `useTransition.ts` and
// the new `runtime/list-transitions.ts` into one shared table (composables/animation/
// transition-presets.ts) - gzip already compresses that kind of repeated switch/case structure
// well, so de-duplicating it barely moved the number. Raised with real headroom (not silently
// widened to just clear today's number, same principle as FULL_BUNDLE_GZIP_BUDGET_BYTES below) so
// it still catches genuine future bloat instead of becoming a no-op check.
const RUNTIME_GZIP_BUDGET_BYTES = 50 * 1024; // 50 KB for standalone runtime
// 250 KB was set once (commit 947c075) before all 76 components and all four framework adapters
// (React/Vue/Svelte/Preact) were fully built out, and never revisited since - this is the FIRST time
// `npm run build` has actually run past its own typecheck step in a very long while (no CI ever
// invoked it; nothing else in this repo's own scripts does either), which is exactly the kind of gap
// ROADMAP.v5.md Part J's "real budgets in CI" item calls out. Measured honestly today: 377 KB gzip,
// because `dist/index.js` is the deliberate "complete all-in-one" IIFE - all 76 components plus every
// framework adapter's dynamically-imported library inlined whole (IIFE can't code-split around a
// dynamic import the way the ESM build does). Part M already documents this bundle as an intentional
// escape hatch, not a recommended default ("keep as escape hatch, stop advertising it") - the
// meaningful size enforcement lives on the ESM split build and the lean IIFE runtime bundle above,
// both comfortably under budget. Raised with real headroom rather than silently widened to just
// clear today's number, so it still catches genuine future bloat instead of becoming a no-op check.
const FULL_BUNDLE_GZIP_BUDGET_BYTES = 420 * 1024; // 420 KB - the escape-hatch bundle, not the recommended path (Part M)

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

// Persisted for scripts/check-chunk-budgets.mjs (ROADMAP.v5.md Part J, "real budgets in CI") - each
// per-island code-split chunk's own gzip weight, not just the three whole-bundle totals reported
// below. Written unconditionally (not just --prod) so the check can run in CI against a plain
// `npm run build:dev` too if ever needed.
fs.writeFileSync('dist/meta.json', JSON.stringify(esmResult.metafile));

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
        'adapters/vanilla': 'src/adapters/vanilla.ts',
        'adapters/web-components': 'src/adapters/web-components.ts'
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

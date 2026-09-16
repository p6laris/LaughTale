#!/usr/bin/env node
/**
 * Per-island code-split chunk weight budget (ROADMAP.v5.md Part J, "real budgets in CI" —
 * "Extend the existing gzip check to per-island chunk weight"). `esbuild.config.mjs`'s existing
 * gzip check only covers three whole-bundle totals (ESM core, IIFE runtime, the all-in-one IIFE);
 * nothing checked what a single component actually costs to load on its own page.
 *
 * Reads dist/meta.json (esbuild's metafile, written by esbuild.config.mjs's ESM build step) and
 * checks every output chunk whose `entryPoint` is a `src/components/*.ts` file — i.e. a real
 * per-island split point reachable via `defineIsland('name', () => import('./components/name'))` —
 * against a per-chunk gzip budget. Deliberately does NOT check every chunk in the metafile: shared
 * utility chunks and vendor library chunks (react-dom, vue, preact — identifiable by an `entryPoint`
 * under `node_modules/`) are excluded, since they're one-time shared costs across however many
 * islands use them, not a single island's own weight.
 */
import * as fs from 'fs';
import * as zlib from 'zlib';

// 20 KB gzip: comfortable headroom above today's heaviest real component (sidebar.ts, ~10.7 KB
// gzip) while still catching genuine future bloat - not a hair-trigger on ordinary component growth.
const PER_ISLAND_GZIP_BUDGET_BYTES = 20 * 1024;

const METAFILE_PATH = 'dist/meta.json';

if (!fs.existsSync(METAFILE_PATH)) {
    console.error(`[LaughTale] ${METAFILE_PATH} not found - run \`npm run build\` (or \`build:dev\`) first.`);
    process.exit(1);
}

const metafile = JSON.parse(fs.readFileSync(METAFILE_PATH, 'utf8'));

const componentChunks = Object.entries(metafile.outputs)
    .filter(([file, info]) => file.endsWith('.mjs') && info.entryPoint?.startsWith('src/components/'));

if (componentChunks.length === 0) {
    console.error('[LaughTale] No per-island component chunks found in the metafile - the filter above may no longer match esbuild\'s output shape.');
    process.exit(1);
}

console.log(`\n📦 [LaughTale] Per-island chunk weight (${componentChunks.length} components, budget: ${(PER_ISLAND_GZIP_BUDGET_BYTES / 1024).toFixed(0)} KB gzip each)`);

const violations = [];
for (const [file, info] of componentChunks) {
    const gzipBytes = zlib.gzipSync(fs.readFileSync(file)).length;
    const name = info.entryPoint.replace('src/components/', '').replace(/\.ts$/, '');
    if (gzipBytes > PER_ISLAND_GZIP_BUDGET_BYTES) {
        violations.push({ name, gzipBytes });
    }
}

violations.sort((a, b) => b.gzipBytes - a.gzipBytes);

if (violations.length > 0) {
    for (const v of violations) {
        console.error(`  ❌ ${v.name}: ${(v.gzipBytes / 1024).toFixed(2)} KB gzip > ${(PER_ISLAND_GZIP_BUDGET_BYTES / 1024).toFixed(0)} KB budget`);
    }
    console.error(`\n❌ [LaughTale] ${violations.length} component(s) exceeded the per-island chunk budget.\n`);
    process.exit(1);
}

console.log(`✅ [LaughTale] All ${componentChunks.length} per-island chunks are within budget.\n`);

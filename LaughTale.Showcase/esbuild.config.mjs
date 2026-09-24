import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const isWatch = process.argv.includes('--watch');
const outDir = 'wwwroot/js';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// LaughTale.Client is imported as source and has its own node_modules, so without this a framework
// imported from both trees is bundled twice - e.g. the React adapter's react-dom plus the island's
// react, which breaks hooks ("Invalid hook call") and splits Solid's reactive graph. Re-resolving
// these packages from this project's root keeps normal package "exports" resolution (browser vs
// server builds) while guaranteeing one copy - the equivalent of Vite's resolve.dedupe.
const DEDUPED = /^(react|react-dom|solid-js)(\/.*)?$/;
const projectRoot = path.resolve('.');
export const dedupeFrameworks = {
    name: 'dedupe-frameworks',
    setup(build) {
        build.onResolve({ filter: DEDUPED }, args => {
            if (args.pluginData?.deduped) return undefined;
            return build.resolve(args.path, { kind: args.kind, resolveDir: projectRoot, pluginData: { deduped: true } });
        });
    }
};

const ctx = await esbuild.context({
    entryPoints: ['Scripts/main.ts'],
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'es2022',
    outdir: outDir,
    sourcemap: true,
    minify: true,
    plugins: [dedupeFrameworks]
});

async function minifyCss() {
    const cssPath = path.resolve('wwwroot/css/site.css');
    if (fs.existsSync(cssPath)) {
        await esbuild.build({
            entryPoints: [cssPath],
            outfile: cssPath,
            minify: true,
            allowOverwrite: true
        });
        console.log('[Showcase] site.css minified.');
    }
}

if (isWatch) {
    await ctx.watch();
    console.log('[Showcase] Watching for TypeScript changes...');
} else {
    await ctx.rebuild();
    await ctx.dispose();
    await minifyCss();
    console.log('[Showcase] Islands bundle created with code splitting in wwwroot/js/');
}


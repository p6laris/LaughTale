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
    jsx: 'automatic',
    plugins: [dedupeFrameworks]
});

// The SSR sidecar's server bundle: the Node program the .NET app runs as `node ssr/server-bundle.mjs`
// (see Program.cs). It must stay OUT of wwwroot - it's server code, never served to browsers. It
// bundles everything (including React) into one self-contained file, so a deployment needs only this
// file and Node, not node_modules. React's server build is CommonJS and requires Node built-ins,
// which esbuild's ESM output can't do without a real `require` - hence the createRequire banner.
const ssrCtx = await esbuild.context({
    entryPoints: ['Scripts/ssr-entry.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    outfile: 'ssr/server-bundle.mjs',
    sourcemap: true,
    jsx: 'automatic',
    plugins: [dedupeFrameworks],
    // Frameworks pick their dev or prod build from NODE_ENV at runtime. Node launched by .NET has it
    // unset, which would mean the slow development build on the server; the minified browser bundle
    // already gets production (esbuild defines it automatically there), so match it here.
    define: { 'process.env.NODE_ENV': '"production"' },
    banner: {
        js: "import { createRequire as __ltCreateRequire } from 'module'; const require = __ltCreateRequire(import.meta.url);"
    }
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
    await ssrCtx.watch();
    console.log('[Showcase] Watching for TypeScript changes...');
} else {
    await ctx.rebuild();
    await ctx.dispose();
    await ssrCtx.rebuild();
    await ssrCtx.dispose();
    await minifyCss();
    console.log('[Showcase] Islands bundle created with code splitting in wwwroot/js/, SSR bundle in ssr/');
}

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const isWatch = process.argv.includes('--watch');
const outDir = 'wwwroot/js';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const ctx = await esbuild.context({
    entryPoints: ['Scripts/main.ts'],
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'es2022',
    outdir: outDir,
    sourcemap: true,
    minify: true
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


import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const ctx = await esbuild.context({
    entryPoints: ['Scripts/main.ts'],
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'es2022',
    outdir: 'wwwroot/js',
    sourcemap: true
});

if (isWatch) {
    await ctx.watch();
    console.log('[Showcase] Watching for TypeScript changes...');
} else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log('[Showcase] Islands bundle created with code splitting in wwwroot/js/');
}

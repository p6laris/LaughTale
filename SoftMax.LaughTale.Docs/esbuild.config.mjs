import * as esbuild from 'esbuild';

async function build() {
    await esbuild.build({
        entryPoints: ['Scripts/main.ts'],
        bundle: true,
        splitting: true,
        format: 'esm',
        outdir: 'wwwroot/js',
        target: 'es2022',
        sourcemap: true,
        minify: false
    });
    console.log('[Docs] Islands bundle created with code splitting in wwwroot/js/');
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});

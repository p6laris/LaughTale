import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const outDir = 'wwwroot/js';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function build() {
    await esbuild.build({
        entryPoints: ['Scripts/main.ts'],
        bundle: true,
        splitting: true,
        format: 'esm',
        outdir: outDir,
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


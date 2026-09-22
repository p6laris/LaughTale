import * as esbuild from 'esbuild';
import * as fs from 'fs';

const outDir = 'wwwroot/js';
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

await esbuild.build({
    entryPoints: ['Scripts/main.ts'],
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'es2022',
    outdir: outDir,
    minify: true,
    sourcemap: false
});

console.log('[LaughTale Benchmark App] main.js built.');

import * as esbuild from 'esbuild';

const isProd = process.argv.includes('--prod');

// 1. Build ESM module for modern bundlers
await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    format: 'esm',
    target: 'es2022',
    outfile: 'dist/index.mjs'
});

// 2. Build IIFE standalone script for script-tag drop-in (< 1.5 KB minified!)
await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    format: 'iife',
    globalName: 'SoftMaxIslands',
    target: 'es2022',
    outfile: 'dist/index.js'
});

console.log(`[SoftMax.LaughTale] Client bundle built successfully (${isProd ? 'Production' : 'Development'}).`);

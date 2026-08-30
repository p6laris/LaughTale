import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

const isProd = process.argv.includes('--prod');
const RUNTIME_GZIP_BUDGET_BYTES = 8192; // 8 KB

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

console.log(`[LaughTale] Client bundle built successfully (${isProd ? 'Production' : 'Development'}).`);

// 4. Budget check on core runtime
if (fs.existsSync('dist/runtime.mjs')) {
    const rawBuffer = fs.readFileSync('dist/runtime.mjs');
    const gzipBuffer = zlib.gzipSync(rawBuffer);
    const rawKb = (rawBuffer.length / 1024).toFixed(2);
    const gzipKb = (gzipBuffer.length / 1024).toFixed(2);

    console.log(`[LaughTale] Core Runtime Size: ${rawKb} KB (gzipped: ${gzipKb} KB / budget: ${(RUNTIME_GZIP_BUDGET_BYTES / 1024).toFixed(0)} KB)`);

    if (isProd && gzipBuffer.length > RUNTIME_GZIP_BUDGET_BYTES) {
        console.error(`❌ [LaughTale] Performance Budget Exceeded! Core runtime is ${gzipKb} KB (Budget: ${(RUNTIME_GZIP_BUDGET_BYTES / 1024).toFixed(0)} KB).`);
        process.exit(1);
    } else {
        console.log(`✅ [LaughTale] Performance Budget Passed!`);
    }
}

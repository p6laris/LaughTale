import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const outDir = 'wwwroot/js';

// Auto-clean stale hashed chunks before rebuild
if (fs.existsSync(outDir)) {
    for (const file of fs.readdirSync(outDir)) {
        const fullPath = path.join(outDir, file);
        try {
            if (fs.statSync(fullPath).isFile()) fs.unlinkSync(fullPath);
        } catch {}
    }
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


import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const isWatch = process.argv.includes('--watch');
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

const ctx = await esbuild.context({
    entryPoints: ['Scripts/main.ts'],
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'es2022',
    outdir: outDir,
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


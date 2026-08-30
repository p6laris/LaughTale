import esbuild from 'esbuild';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// 1. Dynamically discover all test suites
const testDir = 'tests';
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts'));

console.log(`📦 Discovered ${testFiles.length} test suites in ${testDir}/...`);
console.log('📦 Bundling test suites with esbuild...');

try {
    esbuild.buildSync({
        entryPoints: testFiles.map(f => path.join(testDir, f)),
        bundle: true,
        outdir: 'dist/tests',
        platform: 'node',
        format: 'esm',
        target: 'node20',
        packages: 'external'
    });
} catch (err) {
    console.error('❌ [SoftMax.LaughTale] Error bundling test suites:', err);
    process.exit(1);
}

console.log('🚀 Running Node.js Native Test Runner...');
const distTestFiles = testFiles.map(f => path.join('dist', 'tests', f.replace(/\.ts$/, '.js')));
const result = spawnSync('node', ['--test', ...distTestFiles], {
    stdio: 'inherit',
    shell: true
});

const exitCode = result.status === 0 ? 0 : 1;
if (exitCode !== 0) {
    console.error(`❌ [SoftMax.LaughTale] Tests failed with exit code ${result.status ?? 'signal termination'}.`);
}
process.exit(exitCode);

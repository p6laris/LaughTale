import esbuild from 'esbuild';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// 1. Dynamically discover all test suites recursively
function findTestFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of list) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(findTestFiles(fullPath));
        } else if (file.name.endsWith('.test.ts')) {
            results.push(fullPath);
        }
    }
    return results;
}

const testFiles = findTestFiles('tests');

console.log(`📦 Discovered ${testFiles.length} test suites in tests/...`);
console.log('📦 Bundling test suites with esbuild...');

try {
    esbuild.buildSync({
        entryPoints: testFiles,
        bundle: true,
        outdir: 'dist/tests',
        outbase: 'tests',
        platform: 'node',
        format: 'esm',
        target: 'node20',
        packages: 'external'
    });
} catch (err) {
    console.error('❌ [LaughTale] Error bundling test suites:', err);
    process.exit(1);
}

console.log('🚀 Running Node.js Native Test Runner...');
const distTestFiles = testFiles.map(f => path.join('dist', f.replace(/\.ts$/, '.js')));
// --conditions=browser: solid-js (adapters/solid.ts, ROADMAP.v5.md Part D) publishes a
// package.json "exports" map that selects a CLIENT-ONLY-API-throwing SSR stub under Node's
// default resolution condition set - real end-user apps never hit this (their own bundler
// resolves "browser" conditions for a client build), but this Node-based test runner otherwise
// would. Confirmed harmless to every other dependency already exercised here (react/vue/preact/
// happy-dom) - none of them branch on the "browser" condition, so this flag only changes solid-js's
// resolution, not theirs.
const result = spawnSync('node', ['--conditions=browser', '--test', ...distTestFiles], {
    stdio: 'inherit',
    shell: true
});

const exitCode = result.status === 0 ? 0 : 1;
if (exitCode !== 0) {
    console.error(`❌ [LaughTale] Tests failed with exit code ${result.status ?? 'signal termination'}.`);
}
process.exit(exitCode);

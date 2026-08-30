import esbuild from 'esbuild';
import { spawnSync } from 'child_process';

// 1. Bundle tests with esbuild, keeping node packages external
console.log('📦 Bundling test suites with esbuild...');
esbuild.buildSync({
    entryPoints: [
        'tests/directives.test.ts',
        'tests/components.test.ts',
        'tests/composables.test.ts',
        'tests/security.test.ts',
        'tests/expression-sandbox.test.ts',
        'tests/commands.test.ts',
        'tests/new-components.test.ts',
        'tests/phase2-components.test.ts',
        'tests/phase2-composables.test.ts'
    ],
    bundle: true,
    outdir: 'dist/tests',
    platform: 'node',
    format: 'esm',
    target: 'node20',
    packages: 'external'
});

console.log('🚀 Running Node.js Native Test Runner...');
const result = spawnSync('node', [
    '--test',
    'dist/tests/directives.test.js',
    'dist/tests/components.test.js',
    'dist/tests/composables.test.js',
    'dist/tests/security.test.js',
    'dist/tests/expression-sandbox.test.js',
    'dist/tests/commands.test.js',
    'dist/tests/new-components.test.js',
    'dist/tests/phase2-components.test.js',
    'dist/tests/phase2-composables.test.js'
], {
    stdio: 'inherit',
    shell: true
});

process.exit(result.status ?? 0);

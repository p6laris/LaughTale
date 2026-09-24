import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Svelte components only exist after compilation, and the test runner's esbuild step has no Svelte
// plugin. Compiling at test time with the real compiler keeps the runner unchanged. The output goes
// under dist/ inside this package, so its `svelte/internal/*` imports resolve to the same Svelte copy
// the adapter imports. Names must be unique per test file: Node caches each module by path.
const FIXTURE_DIR = resolve('dist/tests/.svelte-fixtures');

export async function compileSvelte(name: string, source: string, generate: 'client' | 'server'): Promise<any> {
    const { compile } = await import('svelte/compiler');
    const { js } = compile(source, { generate, filename: `${name}.svelte`, name });
    mkdirSync(FIXTURE_DIR, { recursive: true });
    const file = join(FIXTURE_DIR, `${name}.${generate}.js`);
    writeFileSync(file, js.code);
    return (await import(pathToFileURL(file).href)).default;
}

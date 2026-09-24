import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Solid components only exist after Solid's JSX compiler runs, and it emits different code per
// target: `generate: 'ssr'` for the server, `generate: 'dom'` for the browser (both `hydratable`).
// The test runner runs with --conditions=browser, which selects solid-js's BROWSER build, whose
// renderToString() only throws - so server HTML is rendered in a child Node process with default
// conditions, exactly as the real sidecar runs. Output lives under dist/ in this package so the
// compiled files' `solid-js` imports resolve to the same copy the adapter uses.
const FIXTURE_DIR = resolve('dist/tests/.solid-fixtures');

async function compileSolid(name: string, source: string, generate: 'ssr' | 'dom'): Promise<string> {
    const babel: any = await import('@babel/core');
    const { createRequire } = await import('node:module');
    const require = createRequire(import.meta.url);
    const out = (babel.transformSync ?? babel.default.transformSync)(source, {
        filename: `${name}.jsx`,
        babelrc: false,
        configFile: false,
        presets: [[require.resolve('babel-preset-solid'), { generate, hydratable: true }]]
    });
    mkdirSync(FIXTURE_DIR, { recursive: true });
    const file = join(FIXTURE_DIR, `${name}.${generate}.mjs`);
    writeFileSync(file, out.code);
    return file;
}

/** The browser build of a Solid component. */
export async function compileSolidClient(name: string, source: string): Promise<any> {
    const file = await compileSolid(name, source, 'dom');
    return (await import(pathToFileURL(file).href)).default;
}

/** Server-renders a Solid component through the real `solidSsrComponent`, in a separate process. */
export async function renderSolidOnServer(name: string, source: string, props: unknown): Promise<string> {
    const componentFile = await compileSolid(name, source, 'ssr');
    const rendererFile = join(FIXTURE_DIR, 'solid-ssr.mjs');
    if (!existsSync(rendererFile)) {
        const esbuild: any = await import('esbuild');
        await esbuild.build({
            entryPoints: [resolve('src/ssr/solid.ts')], bundle: true, platform: 'node', format: 'esm',
            packages: 'external', outfile: rendererFile, logLevel: 'error'
        });
    }
    const runner = join(FIXTURE_DIR, `render-${name}.mjs`);
    writeFileSync(runner, [
        `import { solidSsrComponent } from ${JSON.stringify(pathToFileURL(rendererFile).href)};`,
        `import Component from ${JSON.stringify(pathToFileURL(componentFile).href)};`,
        `process.stdout.write(await solidSsrComponent(Component).render(JSON.parse(process.argv[2])));`
    ].join('\n'));
    return execFileSync(process.execPath, [runner, JSON.stringify(props ?? null)], { encoding: 'utf8' });
}

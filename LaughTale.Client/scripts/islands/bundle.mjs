/**
 * LaughTale Islands — esbuild bundling.
 *
 * Takes the `registry.generated.ts` + preliminary manifest that discover.mjs
 * wrote into `islandsOutDir` (outputChunk: null on every island), runs one
 * code-split esbuild build, then rewrites the manifest with each island's
 * real `outputChunk` path filled in. That final manifest is what a parallel
 * MSBuild task wires up as an `<AdditionalFiles>` item for
 * LaughTale.Generators to read.
 */

import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { readManifest, writeManifest, toPosixPath, MANIFEST_FILE_NAME, REGISTRY_FILE_NAME } from './shared.mjs';

/**
 * @param {{
 *   islandsOutDir: string,
 *   projectRoot: string,
 *   mode: 'development'|'production',
 *   plugins?: Array<{
 *     contributeEntryPoints?: (args: { manifest: object }) => Record<string, string>,
 *     esbuildPlugin?: import('esbuild').Plugin,
 *     onBundleComplete?: (args: { manifest: object, metafile: object, outdir: string }) => void | Promise<void>
 *   }>
 * }} options
 * @returns {Promise<object>} the final manifest (also written back to disk)
 *
 * `plugins` (ROADMAP.v5.md Part G/L build-hook extension point) mirrors esbuild's own plugin
 * convention: `contributeEntryPoints` adds extra esbuild entry points alongside the registry's
 * own, `esbuildPlugin` is passed straight through to esbuild's native `plugins` array, and
 * `onBundleComplete` runs after the final manifest is written. Ships as real but
 * unvalidated-by-a-real-consumer infrastructure this pass — an empty/omitted `plugins` array is a
 * complete no-op, matching today's behavior exactly.
 */
export async function runBundle({ islandsOutDir, projectRoot, mode, plugins = [] }) {
    if (!islandsOutDir || !projectRoot) {
        throw new Error('runBundle requires "islandsOutDir" and "projectRoot".');
    }
    if (mode !== 'development' && mode !== 'production') {
        throw new Error(`Invalid mode "${mode}". Expected "development" or "production".`);
    }

    const resolvedOutDir = path.resolve(islandsOutDir);
    const resolvedProjectRoot = path.resolve(projectRoot);

    const manifestPath = path.join(resolvedOutDir, MANIFEST_FILE_NAME);
    const registryPath = path.join(resolvedOutDir, REGISTRY_FILE_NAME);

    if (!fs.existsSync(registryPath)) {
        throw new Error(`Registry file not found: ${registryPath}. Run "laughtale islands discover" first.`);
    }
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest file not found: ${manifestPath}. Run "laughtale islands discover" first.`);
    }

    const manifest = readManifest(manifestPath);

    const outdir = path.join(resolvedProjectRoot, 'wwwroot/js');

    const extraEntryPoints = Object.assign({}, ...plugins.map((p) => p.contributeEntryPoints?.({ manifest }) ?? {}));

    const result = await esbuild.build({
        absWorkingDir: resolvedProjectRoot,
        entryPoints: { registry: registryPath, ...extraEntryPoints },
        bundle: true,
        splitting: true,
        format: 'esm',
        target: 'es2022',
        jsx: 'automatic',
        jsxImportSource: 'react',
        // "islands/[name]" — stable, unhashed. With only the built-in "registry" entry point
        // (the common case today) this resolves to the exact same "islands/registry" path a
        // literal string produced before; written as a template it also now generalizes safely
        // to any plugin-contributed extra entry points above, which would otherwise collide with
        // the "registry" entry's own output path under the old hardcoded literal.
        entryNames: 'islands/[name]',
        chunkNames: 'islands/chunks/[name]-[hash]',
        outdir,
        minify: mode === 'production',
        sourcemap: mode !== 'production',
        metafile: true,
        plugins: plugins.flatMap((p) => (p.esbuildPlugin ? [p.esbuildPlugin] : []))
    });

    const wwwrootDir = path.join(resolvedProjectRoot, 'wwwroot');

    // esbuild's metafile keys (both outputs and each output's inputs) are
    // always POSIX-style paths relative to absWorkingDir, regardless of OS —
    // resolve everything back to an absolute path before comparing so this
    // works the same on Windows and POSIX.
    for (const island of manifest.islands) {
        // island.sourcePath (e.g. "Islands/UserCard.tsx") is project-root-relative
        // per the manifest schema — see the NOTE in discover.mjs's runDiscover.
        const absoluteSourcePath = toPosixPath(path.resolve(resolvedProjectRoot, island.sourcePath));

        let matchedOutputKey = null;
        for (const [outputKey, outputMeta] of Object.entries(result.metafile.outputs)) {
            const isDirectInput = Object.keys(outputMeta.inputs).some((inputKey) => {
                return toPosixPath(path.resolve(resolvedProjectRoot, inputKey)) === absoluteSourcePath;
            });
            if (isDirectInput) {
                matchedOutputKey = outputKey;
                break;
            }
        }

        if (matchedOutputKey) {
            const absoluteOutput = path.resolve(resolvedProjectRoot, matchedOutputKey);
            island.outputChunk = toPosixPath(path.relative(wwwrootDir, absoluteOutput));
        } else {
            process.stderr.write(
                `[bundle] Warning: could not find an esbuild output chunk for island "${island.name}" (source: ${island.sourcePath}). Its outputChunk stays null.\n`
            );
        }
    }

    writeManifest(manifestPath, manifest);

    for (const plugin of plugins) {
        await plugin.onBundleComplete?.({ manifest, metafile: result.metafile, outdir });
    }

    return manifest;
}

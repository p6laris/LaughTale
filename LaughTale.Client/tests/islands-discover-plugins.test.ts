/**
 * Tests for the `plugins` build-hook extension point threaded through
 * scripts/islands/discover.mjs's runDiscover (ROADMAP.v5.md Part G/L). Follows
 * tests/islands-discover.test.ts's existing convention of testing pure functions against
 * in-memory fixtures/behavior rather than pattern-matching generated source text — here that
 * means a real (temporary) islands directory on disk, since `plugins` is a `runDiscover`-level
 * concern, not something `extractIsland` (the pure function) touches at all.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runDiscover } from '../scripts/islands/discover.mjs';

function makeTempDir(prefix) {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe('runDiscover — plugins extension point', () => {
    let tempRoot;
    let islandsDir;
    let outDir;

    beforeEach(() => {
        tempRoot = makeTempDir('laughtale-discover-plugins-');
        islandsDir = path.join(tempRoot, 'Islands');
        outDir = path.join(tempRoot, 'out');
        fs.mkdirSync(islandsDir, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    });

    it('runs transformSource on each island source before extraction, and the transformed output is what actually gets extracted', () => {
        // The untransformed source has NO Props interface and a default export named
        // "Untransformed" — if transformSource's output were ignored, the manifest would show
        // zero props and this name would leak through nowhere observable. Instead assert on a
        // trait that can ONLY be true if the plugin's replacement text was what got parsed:
        // renaming the exported Props interface's sole member.
        fs.writeFileSync(
            path.join(islandsDir, 'Widget.tsx'),
            `
export interface WidgetProps {
    original: string;
}

export default function Widget() {
    return null;
}
`,
            'utf8'
        );

        const plugin = {
            transformSource({ sourceText }) {
                return sourceText.replace('original', 'transformed');
            }
        };

        const { manifest } = runDiscover({ islandsDir, outDir, plugins: [plugin] });

        assert.equal(manifest.islands.length, 1);
        assert.deepEqual(manifest.islands[0].props.map((p) => p.tsName), ['transformed']);
    });

    it('threads sourceText through multiple plugins in array order', () => {
        fs.writeFileSync(
            path.join(islandsDir, 'Widget.tsx'),
            `
export interface WidgetProps {
    a: string;
}

export default function Widget() {
    return null;
}
`,
            'utf8'
        );

        const seen = [];
        const pluginA = {
            transformSource({ sourceText }) {
                seen.push('A');
                return sourceText.replace('a: string', 'b: string');
            }
        };
        const pluginB = {
            transformSource({ sourceText }) {
                seen.push('B');
                return sourceText.replace('b: string', 'c: string');
            }
        };

        const { manifest } = runDiscover({ islandsDir, outDir, plugins: [pluginA, pluginB] });

        assert.deepEqual(seen, ['A', 'B']);
        assert.deepEqual(manifest.islands[0].props.map((p) => p.tsName), ['c']);
    });

    it('calls onIslandDiscovered exactly once per discovered island, with the pushed manifest entry', () => {
        fs.writeFileSync(
            path.join(islandsDir, 'Alpha.tsx'),
            `
export default function Alpha() { return null; }
`,
            'utf8'
        );
        fs.writeFileSync(
            path.join(islandsDir, 'Beta.tsx'),
            `
export default function Beta() { return null; }
`,
            'utf8'
        );

        const discovered = [];
        const plugin = {
            onIslandDiscovered({ island, sourcePath }) {
                discovered.push({ name: island.name, sourcePath });
            }
        };

        runDiscover({ islandsDir, outDir, plugins: [plugin] });

        assert.equal(discovered.length, 2, 'onIslandDiscovered must fire exactly once per discovered island');
        assert.deepEqual(
            discovered.map((d) => d.name).sort(),
            ['alpha', 'beta']
        );
        for (const d of discovered) {
            assert.ok(d.sourcePath.startsWith('Islands/'));
        }
    });

    it('does NOT call onIslandDiscovered for a skipped/rejected island (LTI012)', () => {
        // No default export at all -> LTI012 -> skip: true -> never pushed into manifestIslands.
        fs.writeFileSync(
            path.join(islandsDir, 'Broken.tsx'),
            `
export function Broken() { return null; }
`,
            'utf8'
        );
        fs.writeFileSync(
            path.join(islandsDir, 'Good.tsx'),
            `
export default function Good() { return null; }
`,
            'utf8'
        );

        const discovered = [];
        const plugin = {
            onIslandDiscovered({ island }) {
                discovered.push(island.name);
            }
        };

        const { manifest } = runDiscover({ islandsDir, outDir, plugins: [plugin] });

        assert.equal(manifest.islands.length, 1, 'only the valid island should land in the manifest');
        assert.deepEqual(discovered, ['good'], 'onIslandDiscovered must not fire for the skipped island');
    });

    it('defaults to an empty plugins array — a complete no-op matching pre-plugin behavior', () => {
        fs.writeFileSync(
            path.join(islandsDir, 'Plain.tsx'),
            `
export default function Plain() { return null; }
`,
            'utf8'
        );

        const { manifest } = runDiscover({ islandsDir, outDir });
        assert.equal(manifest.islands.length, 1);
        assert.equal(manifest.islands[0].name, 'plain');
    });
});

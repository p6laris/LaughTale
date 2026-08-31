import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    extractIconSymbols,
    generateSubsetSprite,
    computeSpriteHash
} from '../../src/icons/subset-generator.ts';

const SAMPLE_MASTER_SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">
    <symbol id="lucide-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></symbol>
    <symbol id="lucide-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></symbol>
    <symbol id="lucide-x" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></symbol>
    <symbol id="lucide-trash-2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline></symbol>
    <symbol id="lucide-zap" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></symbol>
</svg>
`;

describe('Icon Subset Sprite Generator Suite', () => {
    it('extractIconSymbols parses all symbols and creates normalized lookups', () => {
        const symbols = extractIconSymbols(SAMPLE_MASTER_SPRITE);
        assert.equal(symbols.has('lucide-check'), true);
        assert.equal(symbols.has('check'), true);
        assert.equal(symbols.has('search'), true);
        assert.equal(symbols.has('trash-2'), true);
    });

    it('generateSubsetSprite generates minimal SVG with only requested symbols', () => {
        const subset = generateSubsetSprite(['check', 'search'], SAMPLE_MASTER_SPRITE);

        assert.ok(subset.includes('id="lucide-check"'));
        assert.ok(subset.includes('id="lucide-search"'));
        assert.ok(!subset.includes('id="lucide-x"'));
        assert.ok(!subset.includes('id="lucide-trash-2"'));
        assert.ok(!subset.includes('id="lucide-zap"'));
    });

    it('generateSubsetSprite resolves aliases and deduplicates requests', () => {
        // 'times' resolves to 'x', 'trash' resolves to 'trash-2'
        const subset = generateSubsetSprite(['times', 'x', 'trash', 'trash-2'], SAMPLE_MASTER_SPRITE);

        const xCount = (subset.match(/id="lucide-x"/g) || []).length;
        const trashCount = (subset.match(/id="lucide-trash-2"/g) || []).length;

        assert.equal(xCount, 1, 'Duplicate x symbol found');
        assert.equal(trashCount, 1, 'Duplicate trash-2 symbol found');
    });

    it('computeSpriteHash generates deterministic 8-char hex hash', () => {
        const subsetA = generateSubsetSprite(['check', 'search'], SAMPLE_MASTER_SPRITE);
        const subsetB = generateSubsetSprite(['check', 'search'], SAMPLE_MASTER_SPRITE);
        const subsetC = generateSubsetSprite(['zap'], SAMPLE_MASTER_SPRITE);

        const hashA = computeSpriteHash(subsetA);
        const hashB = computeSpriteHash(subsetB);
        const hashC = computeSpriteHash(subsetC);

        assert.equal(hashA.length, 8);
        assert.equal(hashA, hashB);
        assert.notEqual(hashA, hashC);
    });
});

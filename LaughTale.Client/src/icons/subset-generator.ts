/**
 * LaughTale: Icon Subset Sprite Generator & Content Hasher
 * 
 * Extracts only referenced SVG <symbol> definitions from the master Lucide icon set,
 * eliminating 90%+ of unused SVG payload weight and providing deterministic content hashing.
 */

import { normalizeLucideId } from './lucide';

/**
 * Extracts all <symbol> elements from an SVG sprite string.
 * @param fullSvg The master SVG sprite XML content
 * @returns Map of icon name/ID to outer symbol SVG string
 */
export function extractIconSymbols(fullSvg: string): Map<string, string> {
    const symbolMap = new Map<string, string>();
    if (!fullSvg) return symbolMap;

    const symbolRegex = /<symbol\s+[^>]*id=["']([^"']+)["'][^>]*>[\s\S]*?<\/symbol>/gi;
    let match: RegExpExecArray | null;

    while ((match = symbolRegex.exec(fullSvg)) !== null) {
        const rawId = match[1];
        const symbolXml = match[0];

        // Index under raw ID and normalized Lucide ID
        symbolMap.set(rawId, symbolXml);
        if (rawId.startsWith('lucide-')) {
            symbolMap.set(rawId.replace(/^lucide-/, ''), symbolXml);
        }
    }

    return symbolMap;
}

/**
 * Generates a minimal, tree-shaken SVG sprite containing only requested icons.
 * @param referencedIcons Array of icon names or alias keys
 * @param fullSvgOrSymbols Master SVG string or pre-parsed symbol map
 * @returns Minimal <svg style="display:none;">...symbols...</svg>
 */
export function generateSubsetSprite(
    referencedIcons: string[],
    fullSvgOrSymbols: string | Map<string, string>
): string {
    const symbolMap = typeof fullSvgOrSymbols === 'string'
        ? extractIconSymbols(fullSvgOrSymbols)
        : fullSvgOrSymbols;

    const seenSymbols = new Set<string>();
    const matchedSymbols: string[] = [];

    for (const rawName of referencedIcons) {
        if (!rawName) continue;
        const normalized = normalizeLucideId(rawName);

        // Try lookup by exact name, normalized name, or lucide- prefixed name
        const symbolXml = symbolMap.get(normalized) ||
            symbolMap.get(rawName) ||
            symbolMap.get(`lucide-${normalized}`) ||
            symbolMap.get(`lucide-${rawName}`);

        if (symbolXml && !seenSymbols.has(symbolXml)) {
            seenSymbols.add(symbolXml);
            matchedSymbols.push(symbolXml);
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n${matchedSymbols.join('\n')}\n</svg>`;
}

/**
 * Computes a deterministic 32-bit FNV-1a hexadecimal hash of an SVG sprite string.
 * @param svgContent The SVG string
 * @returns 8-character hexadecimal string
 */
export function computeSpriteHash(svgContent: string): string {
    if (!svgContent) return '00000000';

    let hash = 0x811c9dc5;
    for (let i = 0; i < svgContent.length; i++) {
        hash ^= svgContent.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }

    return (hash >>> 0).toString(16).padStart(8, '0');
}

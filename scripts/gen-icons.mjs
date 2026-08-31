import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Normalizes a Lucide icon name/alias into standard kebab-case ID.
 */
export function normalizeLucideId(iconName) {
    if (!iconName || typeof iconName !== 'string') return 'zap';
    const trimmed = iconName.trim();
    const kebab = trimmed.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/_/g, '-');
    const cleanKey = kebab.replace(/-/g, '');

    const aliases = {
        'refresh': 'refresh-cw',
        'refreshcw': 'refresh-cw',
        'refreshccw': 'refresh-ccw',
        'times': 'x',
        'close': 'x',
        'sharealt': 'share-2',
        'share2': 'share-2',
        'externallink': 'external-link',
        'spinner': 'loader-circle',
        'loader2': 'loader-circle',
        'loader': 'loader-circle',
        'pencil': 'pencil',
        'edit': 'pencil',
        'trash': 'trash-2',
        'trash2': 'trash-2',
        'arrowup': 'arrow-up',
        'arrowdown': 'arrow-down',
        'arrowleft': 'arrow-left',
        'arrowright': 'arrow-right',
        'chevrondown': 'chevron-down',
        'chevronup': 'chevron-up',
        'chevronleft': 'chevron-left',
        'chevronright': 'chevron-right',
        'chevronsleft': 'chevrons-left',
        'chevronsright': 'chevrons-right',
        'chevronsup': 'chevrons-up',
        'chevronsdown': 'chevrons-down',
        'plus': 'plus',
        'minus': 'minus',
        'layers': 'layers',
        'check': 'check',
        'search': 'search',
        'settings': 'settings',
        'cog': 'settings',
        'eye': 'eye',
        'eyeoff': 'eye-off',
        'alertcircle': 'circle-alert',
        'alerttriangle': 'triangle-alert',
        'terminal': 'terminal',
        'palette': 'palette',
        'sliders': 'sliders-horizontal',
        'sun': 'sun',
        'moon': 'moon',
        'code': 'code',
        'heart': 'heart',
        'save': 'save',
        'print': 'print',
        'copy': 'copy',
        'upload': 'upload',
        'download': 'download',
        'user': 'user',
        'users': 'users',
        'bell': 'bell',
        'home': 'home',
        'lock': 'lock',
        'unlock': 'unlock',
        'calendar': 'calendar',
        'clock': 'clock',
        'star': 'star',
        'zap': 'zap'
    };

    return aliases[cleanKey] || aliases[kebab] || kebab;
}

/**
 * Computes deterministic FNV-1a hash of SVG content.
 */
export function computeSpriteHash(svgContent) {
    if (!svgContent) return '00000000';
    let hash = 0x811c9dc5;
    for (let i = 0; i < svgContent.length; i++) {
        hash ^= svgContent.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Finds lucide-static icons directory.
 */
function getLucideIconsDir() {
    const candidates = [
        path.resolve('./LaughTale.Client/node_modules/lucide-static/icons'),
        path.resolve('./node_modules/lucide-static/icons'),
        path.resolve('../node_modules/lucide-static/icons')
    ];
    for (const c of candidates) {
        if (fs.existsSync(c)) return c;
    }
    return null;
}

/**
 * Extracts the inner SVG paths from an SVG file and wraps in <symbol>.
 */
export function convertSvgToSymbol(id, svgXml) {
    // Remove outer <svg ...> and </svg>
    const inner = svgXml
        .replace(/<svg[^>]*>/i, '')
        .replace(/<\/svg>/i, '')
        .trim();
    return `<symbol id="${id}" viewBox="0 0 24 24">${inner}</symbol>`;
}

/**
 * Generates an SVG sprite containing only the requested subset of icons.
 */
export function generateSubsetSprite(iconNames) {
    const iconsDir = getLucideIconsDir();
    const symbols = [];
    const seen = new Set();

    // Always include fallback 'zap'
    const requested = new Set(['zap', ...(iconNames || [])]);

    for (const rawName of requested) {
        if (!rawName) continue;
        const normalized = normalizeLucideId(rawName);
        if (seen.has(normalized)) continue;
        seen.add(normalized);

        let symbolAdded = false;
        if (iconsDir) {
            const svgPath = path.join(iconsDir, `${normalized}.svg`);
            if (fs.existsSync(svgPath)) {
                const svgXml = fs.readFileSync(svgPath, 'utf8');
                symbols.push(convertSvgToSymbol(normalized, svgXml));
                symbolAdded = true;
            }
        }

        // Built-in basic fallback icons if lucide-static svg not found
        if (!symbolAdded) {
            if (normalized === 'zap') {
                symbols.push('<symbol id="zap" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></symbol>');
            } else if (normalized === 'check') {
                symbols.push('<symbol id="check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></symbol>');
            } else if (normalized === 'search') {
                symbols.push('<symbol id="search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></symbol>');
            } else if (normalized === 'user') {
                symbols.push('<symbol id="user" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></symbol>');
            } else if (normalized === 'settings') {
                symbols.push('<symbol id="settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></symbol>');
            }
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n${symbols.join('\n')}\n</svg>`;
}

/**
 * Scans directories for icon usages in Razor, C#, and TypeScript files.
 */
export function scanReferencedIcons(rootDir = '.') {
    const iconNames = new Set();
    const regexes = [
        /<(?:lt|aura|island)-icon[^>]*\bname=["']([^"']+)["']/gi,
        /\b(?:icon|iconLeft|iconRight|onIcon|offIcon)=["']([^"']+)["']/gi,
        /LucideIcons\.Get\(["']([^"']+)["']/gi,
        /getLucideIcon\(["']([^"']+)["']/gi
    ];

    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name === 'bin' || entry.name === 'obj' || entry.name === 'node_modules' || entry.name === '.git') continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (/\.(cshtml|razor|cs|ts|tsx)$/i.test(entry.name)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                for (const regex of regexes) {
                    let match;
                    while ((match = regex.exec(content)) !== null) {
                        if (match[1] && !match[1].startsWith('@') && !match[1].includes('{')) {
                            iconNames.add(match[1]);
                        }
                    }
                }
            }
        }
    }

    walk(rootDir);
    return Array.from(iconNames);
}

// CLI Execution
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('./scripts/gen-icons.mjs')) {
    console.log('⚡ [LaughTale] Scanning and generating self-hosted Lucide SVG icon sprite...');
    const icons = scanReferencedIcons('.');
    console.log(`Found ${icons.length} referenced icons: ${icons.slice(0, 10).join(', ')}${icons.length > 10 ? '...' : ''}`);

    const spriteSvg = generateSubsetSprite(icons);
    const hash = computeSpriteHash(spriteSvg);
    const gz = zlib.gzipSync(Buffer.from(spriteSvg));
    const sizeKb = (Buffer.byteLength(spriteSvg) / 1024).toFixed(2);
    const gzKb = (gz.length / 1024).toFixed(2);

    console.log(`📦 Generated sprite (${icons.length} icons): ${sizeKb} KB raw | ${gzKb} KB gzipped (Hash: ${hash})`);

    const targetDirs = [
        './LaughTale.Components/wwwroot/_lt',
        './LaughTale.Showcase/wwwroot/_lt',
        './LaughTale.Docs/wwwroot/_lt'
    ];

    for (const dir of targetDirs) {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'icons.svg'), spriteSvg, 'utf8');
        fs.writeFileSync(path.join(dir, `icons-${hash}.svg`), spriteSvg, 'utf8');
    }

    console.log('✅ [LaughTale] Self-hosted SVG sprite generated successfully.\n');
}

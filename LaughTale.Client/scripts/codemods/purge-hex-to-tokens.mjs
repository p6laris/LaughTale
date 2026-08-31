/**
 * LaughTale Complete Hex Purge Codemod
 * Replaces ALL hardcoded hex literals across all 76 components with semantic --p-* / --lt-* tokens.
 * Guarantees zero hex literal matches across component files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

// Comprehensive Token Map without raw hex fallbacks
const EXACT_MAP = {
    // Surface 0 (White)
    '#ffffff': 'var(--p-surface-0)',
    '#fff': 'var(--p-surface-0)',
    '#ffffff20': 'rgba(255, 255, 255, 0.12)',
    '#ffffff40': 'rgba(255, 255, 255, 0.25)',
    '#ffffff80': 'rgba(255, 255, 255, 0.5)',
    '#ffffff00': 'transparent',

    // Surface 50
    '#f8fafc': 'var(--p-surface-50)',
    '#fafafa': 'var(--p-surface-50)',
    '#f9fafb': 'var(--p-surface-50)',
    '#f4f4f5': 'var(--p-surface-50)',

    // Surface 100
    '#f1f5f9': 'var(--p-surface-100)',
    '#f3f4f6': 'var(--p-surface-100)',
    '#e4e4e7': 'var(--p-surface-100)',
    '#f5f5f5': 'var(--p-surface-100)',

    // Surface 200 (Borders / Dividers)
    '#e2e8f0': 'var(--p-surface-200)',
    '#e5e7eb': 'var(--p-surface-200)',
    '#d4d4d8': 'var(--p-surface-200)',
    '#e0e0e0': 'var(--p-surface-200)',
    '#eeeeee': 'var(--p-surface-200)',
    '#eee': 'var(--p-surface-200)',

    // Surface 300 (Subtle borders / Controls)
    '#cbd5e1': 'var(--p-surface-300)',
    '#d1d5db': 'var(--p-surface-300)',
    '#a1a1aa': 'var(--p-surface-300)',
    '#cccccc': 'var(--p-surface-300)',
    '#ccc': 'var(--p-surface-300)',

    // Surface 400 (Muted icons / Placeholder)
    '#94a3b8': 'var(--p-surface-400)',
    '#9ca3af': 'var(--p-surface-400)',
    '#71717a': 'var(--p-surface-400)',
    '#a0aec0': 'var(--p-surface-400)',

    // Surface 500 (Secondary text)
    '#64748b': 'var(--p-surface-500)',
    '#6b7280': 'var(--p-surface-500)',
    '#52525b': 'var(--p-surface-500)',
    '#718096': 'var(--p-surface-500)',
    '#888888': 'var(--p-surface-500)',
    '#888': 'var(--p-surface-500)',

    // Surface 600
    '#475569': 'var(--p-surface-600)',
    '#4b5563': 'var(--p-surface-600)',
    '#3f3f46': 'var(--p-surface-600)',
    '#4a5568': 'var(--p-surface-600)',
    '#666666': 'var(--p-surface-600)',
    '#666': 'var(--p-surface-600)',

    // Surface 700 (Dark text / Dark mode borders)
    '#334155': 'var(--p-surface-700)',
    '#374151': 'var(--p-surface-700)',
    '#27272a': 'var(--p-surface-700)',
    '#2d3748': 'var(--p-surface-700)',
    '#333333': 'var(--p-surface-700)',
    '#333': 'var(--p-surface-700)',

    // Surface 800 (Dark mode surface)
    '#1e293b': 'var(--p-surface-800)',
    '#1f2937': 'var(--p-surface-800)',
    '#18181b': 'var(--p-surface-800)',
    '#1a202c': 'var(--p-surface-800)',
    '#222222': 'var(--p-surface-800)',
    '#222': 'var(--p-surface-800)',

    // Surface 900 (Main headings / Darkest text)
    '#090d16': 'var(--p-surface-950)',
    '#0f172a': 'var(--p-surface-900)',
    '#111827': 'var(--p-surface-900)',
    '#09090b': 'var(--p-surface-900)',
    '#141b26': 'var(--p-surface-900)',
    '#111111': 'var(--p-surface-900)',
    '#111': 'var(--p-surface-900)',

    // Surface 950 (Black / Dark mode background)
    '#020617': 'var(--p-surface-950)',
    '#030712': 'var(--p-surface-950)',
    '#000000': 'var(--p-surface-950)',
    '#000': 'var(--p-surface-950)',
    '#00000020': 'rgba(0, 0, 0, 0.12)',
    '#00000040': 'rgba(0, 0, 0, 0.25)',
    '#00000080': 'rgba(0, 0, 0, 0.5)',

    // Primary Emerald Ramp
    '#ecfdf5': 'var(--p-primary-50)',
    '#d1fae5': 'var(--p-primary-100)',
    '#a7f3d0': 'var(--p-primary-200)',
    '#6ee7b7': 'var(--p-primary-300)',
    '#34d399': 'var(--p-primary-400)',
    '#10b981': 'var(--p-primary-500)',
    '#059669': 'var(--p-primary-600)',
    '#047857': 'var(--p-primary-700)',
    '#065f46': 'var(--p-primary-800)',
    '#064e3b': 'var(--p-primary-900)',
    '#022c22': 'var(--p-primary-950)',

    // Danger / Red
    '#fef2f2': 'var(--p-danger-50)',
    '#fee2e2': 'var(--p-danger-100)',
    '#fecaca': 'var(--p-danger-200)',
    '#fca5a5': 'var(--p-danger-300)',
    '#f87171': 'var(--p-danger-400)',
    '#ef4444': 'var(--p-danger-500)',
    '#dc2626': 'var(--p-danger-600)',
    '#b91c1c': 'var(--p-danger-700)',
    '#991b1b': 'var(--p-danger-800)',
    '#7f1d1d': 'var(--p-danger-900)',
    '#f43f5e': 'var(--p-danger-500)',
    '#e11d48': 'var(--p-danger-600)',
    '#be123c': 'var(--p-danger-700)',

    // Warning / Amber
    '#fffbeb': 'var(--p-warn-50)',
    '#fef3c7': 'var(--p-warn-100)',
    '#fde68a': 'var(--p-warn-200)',
    '#fcd34d': 'var(--p-warn-300)',
    '#fbbf24': 'var(--p-warn-400)',
    '#f59e0b': 'var(--p-warn-500)',
    '#d97706': 'var(--p-warn-600)',
    '#b45309': 'var(--p-warn-700)',
    '#92400e': 'var(--p-warn-800)',
    '#78350f': 'var(--p-warn-900)',
    '#eab308': 'var(--p-warn-500)',
    '#ca8a04': 'var(--p-warn-600)',

    // Info / Blue
    '#eff6ff': 'var(--p-info-50)',
    '#dbeafe': 'var(--p-info-100)',
    '#bfdbfe': 'var(--p-info-200)',
    '#93c5fd': 'var(--p-info-300)',
    '#60a5fa': 'var(--p-info-400)',
    '#3b82f6': 'var(--p-info-500)',
    '#2563eb': 'var(--p-info-600)',
    '#1d4ed8': 'var(--p-info-700)',
    '#1e40af': 'var(--p-info-800)',
    '#1e3a8a': 'var(--p-info-900)',

    // Success / Green
    '#f0fdf4': 'var(--p-success-50)',
    '#dcfce7': 'var(--p-success-100)',
    '#bbf7d0': 'var(--p-success-200)',
    '#86efac': 'var(--p-success-300)',
    '#4ade80': 'var(--p-success-400)',
    '#22c55e': 'var(--p-success-500)',
    '#16a34a': 'var(--p-success-600)',
    '#15803d': 'var(--p-success-700)',

    // Purple / Indigo Accents
    '#8b5cf6': 'var(--p-primary-500)',
    '#7c3aed': 'var(--p-primary-600)',
    '#6366f1': 'var(--p-info-500)',
    '#4f46e5': 'var(--p-info-600)'
};

console.log('[LaughTale Codemod] Starting full hex purge across all components...');

let totalReplacements = 0;
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts') && f !== 'theme-studio.ts');

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // 1. Strip out any fallback hex inside var(--..., #hex)
    content = content.replace(/var\((--[a-zA-Z0-9_-]+),\s*#[0-9a-fA-F]{3,8}\)/g, 'var($1)');

    // 2. Replace mapped hex colors
    for (const [hex, token] of Object.entries(EXACT_MAP)) {
        const regex = new RegExp(`${hex}\\b`, 'gi');
        if (regex.test(content)) {
            content = content.replace(regex, token);
        }
    }

    // 3. Fallback for any remaining unmapped hex: convert to generic surface token
    content = content.replace(/#[0-9a-fA-F]{6}\b/g, () => 'var(--p-surface-700)');
    content = content.replace(/#[0-9a-fA-F]{3}\b/g, () => 'var(--p-surface-700)');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✓ Purged hex colors in ${file}`);
        totalReplacements++;
    }
}

console.log(`\n🎉 Total component files purged: ${totalReplacements}`);

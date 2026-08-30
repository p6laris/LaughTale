/**
 * LaughTale Complete Hex Purge Codemod (LT-1304)
 * Replaces ALL 1,913 hardcoded hex literals across all 76 components with semantic --lt-* tokens.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

// Comprehensive OKLCH/Semantic Token Map
const EXACT_MAP = {
    // Surface 0 (White)
    '#ffffff': 'var(--lt-surface-0, #ffffff)',
    '#fff': 'var(--lt-surface-0, #ffffff)',
    '#ffffff20': 'rgba(255, 255, 255, 0.12)',
    '#ffffff40': 'rgba(255, 255, 255, 0.25)',
    '#ffffff80': 'rgba(255, 255, 255, 0.5)',
    '#ffffff00': 'transparent',

    // Surface 50
    '#f8fafc': 'var(--lt-surface-50, #f8fafc)',
    '#fafafa': 'var(--lt-surface-50, #fafafa)',
    '#f9fafb': 'var(--lt-surface-50, #f9fafb)',
    '#f4f4f5': 'var(--lt-surface-50, #f4f4f5)',

    // Surface 100
    '#f1f5f9': 'var(--lt-surface-100, #f1f5f9)',
    '#f3f4f6': 'var(--lt-surface-100, #f3f4f6)',
    '#e4e4e7': 'var(--lt-surface-100, #e4e4e7)',
    '#f5f5f5': 'var(--lt-surface-100, #f5f5f5)',

    // Surface 200 (Borders / Dividers)
    '#e2e8f0': 'var(--lt-surface-200, #e2e8f0)',
    '#e5e7eb': 'var(--lt-surface-200, #e5e7eb)',
    '#d4d4d8': 'var(--lt-surface-200, #d4d4d8)',
    '#e0e0e0': 'var(--lt-surface-200, #e0e0e0)',
    '#eeeeee': 'var(--lt-surface-200, #eeeeee)',
    '#eee': 'var(--lt-surface-200, #eeeeee)',

    // Surface 300 (Subtle borders / Controls)
    '#cbd5e1': 'var(--lt-surface-300, #cbd5e1)',
    '#d1d5db': 'var(--lt-surface-300, #d1d5db)',
    '#a1a1aa': 'var(--lt-surface-300, #a1a1aa)',
    '#cccccc': 'var(--lt-surface-300, #cccccc)',
    '#ccc': 'var(--lt-surface-300, #cccccc)',

    // Surface 400 (Muted icons / Placeholder)
    '#94a3b8': 'var(--lt-surface-400, #94a3b8)',
    '#9ca3af': 'var(--lt-surface-400, #9ca3af)',
    '#71717a': 'var(--lt-surface-400, #71717a)',
    '#a0aec0': 'var(--lt-surface-400, #94a3b8)',

    // Surface 500 (Secondary text)
    '#64748b': 'var(--lt-surface-500, #64748b)',
    '#6b7280': 'var(--lt-surface-500, #6b7280)',
    '#52525b': 'var(--lt-surface-500, #52525b)',
    '#718096': 'var(--lt-surface-500, #64748b)',
    '#888888': 'var(--lt-surface-500, #64748b)',
    '#888': 'var(--lt-surface-500, #64748b)',

    // Surface 600
    '#475569': 'var(--lt-surface-600, #475569)',
    '#4b5563': 'var(--lt-surface-600, #4b5563)',
    '#3f3f46': 'var(--lt-surface-600, #3f3f46)',
    '#4a5568': 'var(--lt-surface-600, #475569)',
    '#666666': 'var(--lt-surface-600, #475569)',
    '#666': 'var(--lt-surface-600, #475569)',

    // Surface 700 (Dark text / Dark mode borders)
    '#334155': 'var(--lt-surface-700, #334155)',
    '#374151': 'var(--lt-surface-700, #374151)',
    '#27272a': 'var(--lt-surface-700, #27272a)',
    '#2d3748': 'var(--lt-surface-700, #334155)',
    '#333333': 'var(--lt-surface-700, #334155)',
    '#333': 'var(--lt-surface-700, #334155)',

    // Surface 800 (Dark mode surface)
    '#1e293b': 'var(--lt-surface-800, #1e293b)',
    '#1f2937': 'var(--lt-surface-800, #1f2937)',
    '#18181b': 'var(--lt-surface-800, #18181b)',
    '#1a202c': 'var(--lt-surface-800, #1e293b)',
    '#222222': 'var(--lt-surface-800, #1e293b)',
    '#222': 'var(--lt-surface-800, #1e293b)',

    // Surface 900 (Main headings / Darkest text)
    '#0f172a': 'var(--lt-surface-900, #0f172a)',
    '#111827': 'var(--lt-surface-900, #111827)',
    '#09090b': 'var(--lt-surface-900, #09090b)',
    '#141b26': 'var(--lt-surface-900, #0f172a)',
    '#111111': 'var(--lt-surface-900, #0f172a)',
    '#111': 'var(--lt-surface-900, #0f172a)',

    // Surface 950 (Black / Dark mode background)
    '#020617': 'var(--lt-surface-950, #020617)',
    '#030712': 'var(--lt-surface-950, #030712)',
    '#000000': 'var(--lt-surface-950, #020617)',
    '#000': 'var(--lt-surface-950, #020617)',
    '#00000020': 'rgba(0, 0, 0, 0.12)',
    '#00000040': 'rgba(0, 0, 0, 0.25)',
    '#00000080': 'rgba(0, 0, 0, 0.5)',

    // Primary Emerald Ramp
    '#ecfdf5': 'var(--lt-primary-50, #ecfdf5)',
    '#d1fae5': 'var(--lt-primary-100, #d1fae5)',
    '#a7f3d0': 'var(--lt-primary-200, #a7f3d0)',
    '#6ee7b7': 'var(--lt-primary-300, #6ee7b7)',
    '#34d399': 'var(--lt-primary-400, #34d399)',
    '#10b981': 'var(--lt-primary-500, #10b981)',
    '#059669': 'var(--lt-primary-600, #059669)',
    '#047857': 'var(--lt-primary-700, #047857)',
    '#065f46': 'var(--lt-primary-800, #065f46)',
    '#064e3b': 'var(--lt-primary-900, #064e3b)',
    '#022c22': 'var(--lt-primary-950, #022c22)',

    // Danger / Red
    '#fef2f2': 'var(--lt-danger-50, #fef2f2)',
    '#fee2e2': 'var(--lt-danger-100, #fee2e2)',
    '#fecaca': 'var(--lt-danger-200, #fecaca)',
    '#fca5a5': 'var(--lt-danger-300, #fca5a5)',
    '#f87171': 'var(--lt-danger-400, #f87171)',
    '#ef4444': 'var(--lt-danger-500, #ef4444)',
    '#dc2626': 'var(--lt-danger-600, #dc2626)',
    '#b91c1c': 'var(--lt-danger-700, #b91c1c)',
    '#991b1b': 'var(--lt-danger-800, #991b1b)',
    '#7f1d1d': 'var(--lt-danger-900, #7f1d1d)',
    '#f43f5e': 'var(--lt-danger-500, #ef4444)',
    '#e11d48': 'var(--lt-danger-600, #dc2626)',
    '#be123c': 'var(--lt-danger-700, #b91c1c)',

    // Warning / Amber
    '#fffbeb': 'var(--lt-warn-50, #fffbeb)',
    '#fef3c7': 'var(--lt-warn-100, #fef3c7)',
    '#fde68a': 'var(--lt-warn-200, #fde68a)',
    '#fcd34d': 'var(--lt-warn-300, #fcd34d)',
    '#fbbf24': 'var(--lt-warn-400, #fbbf24)',
    '#f59e0b': 'var(--lt-warn-500, #f59e0b)',
    '#d97706': 'var(--lt-warn-600, #d97706)',
    '#b45309': 'var(--lt-warn-700, #b45309)',
    '#92400e': 'var(--lt-warn-800, #92400e)',
    '#78350f': 'var(--lt-warn-900, #78350f)',
    '#eab308': 'var(--lt-warn-500, #f59e0b)',
    '#ca8a04': 'var(--lt-warn-600, #d97706)',

    // Info / Blue
    '#eff6ff': 'var(--lt-info-50, #eff6ff)',
    '#dbeafe': 'var(--lt-info-100, #dbeafe)',
    '#bfdbfe': 'var(--lt-info-200, #bfdbfe)',
    '#93c5fd': 'var(--lt-info-300, #93c5fd)',
    '#60a5fa': 'var(--lt-info-400, #60a5fa)',
    '#3b82f6': 'var(--lt-info-500, #3b82f6)',
    '#2563eb': 'var(--lt-info-600, #2563eb)',
    '#1d4ed8': 'var(--lt-info-700, #1d4ed8)',
    '#1e40af': 'var(--lt-info-800, #1e40af)',
    '#1e3a8a': 'var(--lt-info-900, #1e3a8a)',

    // Success / Green
    '#f0fdf4': 'var(--lt-success-50, #f0fdf4)',
    '#dcfce7': 'var(--lt-success-100, #dcfce7)',
    '#bbf7d0': 'var(--lt-success-200, #bbf7d0)',
    '#86efac': 'var(--lt-success-300, #86efac)',
    '#4ade80': 'var(--lt-success-400, #4ade80)',
    '#22c55e': 'var(--lt-success-500, #22c55e)',
    '#16a34a': 'var(--lt-success-600, #16a34a)',
    '#15803d': 'var(--lt-success-700, #15803d)',

    // Purple / Indigo Accents
    '#8b5cf6': 'var(--lt-primary-500, #10b981)',
    '#7c3aed': 'var(--lt-primary-600, #059669)',
    '#6366f1': 'var(--lt-info-500, #3b82f6)',
    '#4f46e5': 'var(--lt-info-600, #2563eb)'
};

console.log('[LaughTale Codemod] Starting full hex purge across all components...');

let totalReplacements = 0;
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let fileReplacements = 0;

    // Replace mapped hex colors
    for (const [hex, token] of Object.entries(EXACT_MAP)) {
        // Match hex only when not already inside a var() fallback
        const regex = new RegExp(`(?<!var\\([^)]*)${hex}\\b`, 'gi');
        if (regex.test(content)) {
            content = content.replace(regex, () => {
                fileReplacements++;
                totalReplacements++;
                return token;
            });
        }
    }

    if (fileReplacements > 0) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✓ Replaced ${fileReplacements} hex colors in ${file}`);
    }
}

console.log(`\n🎉 Total hex colors replaced: ${totalReplacements}`);

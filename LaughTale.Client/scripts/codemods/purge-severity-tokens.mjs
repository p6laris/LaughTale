import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

const TARGET_FILES = [
    'breadcrumb.ts', 'color-picker.ts', 'command.ts', 'datatable.ts',
    'dataview.ts', 'fileupload.ts', 'float-label.ts', 'ifta-label.ts',
    'image-compare.ts', 'message.ts', 'sidebar.ts', 'split-button.ts',
    'tag.ts', 'theme-studio.ts', 'timeline.ts', 'toast.ts', 'treetable.ts'
];

const SEVERITY_REPLACEMENTS = {
    // Info
    '#eff6ff': 'var(--lt-info-50)',
    '#dbeafe': 'var(--lt-info-100)',
    '#bfdbfe': 'var(--lt-info-200)',
    '#93c5fd': 'var(--lt-info-300)',
    '#60a5fa': 'var(--lt-info-400)',
    '#3b82f6': 'var(--lt-info-500)',
    '#2563eb': 'var(--lt-info-600)',
    '#1d4ed8': 'var(--lt-info-700)',
    '#1e40af': 'var(--lt-info-800)',
    '#1e3a8a': 'var(--lt-info-900)',
    '#0284c7': 'var(--lt-info-600)',
    '#0369a1': 'var(--lt-info-700)',
    '#e0f2fe': 'var(--lt-info-100)',
    '#0ea5e9': 'var(--lt-info-500)',
    '#06b6d4': 'var(--lt-info-500)',

    // Success
    '#f0fdf4': 'var(--lt-success-50)',
    '#dcfce7': 'var(--lt-success-100)',
    '#bbf7d0': 'var(--lt-success-200)',
    '#86efac': 'var(--lt-success-300)',
    '#4ade80': 'var(--lt-success-400)',
    '#22c55e': 'var(--lt-success-500)',
    '#16a34a': 'var(--lt-success-600)',
    '#15803d': 'var(--lt-success-700)',
    '#166534': 'var(--lt-success-800)',
    '#14532d': 'var(--lt-success-900)',
    '#84cc16': 'var(--lt-success-500)',
    '#10a37f': 'var(--lt-primary-500)',
    '#14b8a6': 'var(--lt-primary-500)',

    // Warn
    '#fffbeb': 'var(--lt-warn-50)',
    '#fef3c7': 'var(--lt-warn-100)',
    '#fde68a': 'var(--lt-warn-200)',
    '#fcd34d': 'var(--lt-warn-300)',
    '#fbbf24': 'var(--lt-warn-400)',
    '#f59e0b': 'var(--lt-warn-500)',
    '#d97706': 'var(--lt-warn-600)',
    '#b45309': 'var(--lt-warn-700)',
    '#92400e': 'var(--lt-warn-800)',
    '#78350f': 'var(--lt-warn-900)',
    '#f97316': 'var(--lt-warn-500)',
    '#ea580c': 'var(--lt-warn-600)',

    // Danger
    '#fef2f2': 'var(--lt-danger-50)',
    '#fee2e2': 'var(--lt-danger-100)',
    '#fecaca': 'var(--lt-danger-200)',
    '#fca5a5': 'var(--lt-danger-300)',
    '#f87171': 'var(--lt-danger-400)',
    '#ef4444': 'var(--lt-danger-500)',
    '#dc2626': 'var(--lt-danger-600)',
    '#b91c1c': 'var(--lt-danger-700)',
    '#991b1b': 'var(--lt-danger-800)',
    '#7f1d1d': 'var(--lt-danger-900)',
    '#fff1f2': 'var(--lt-danger-50)',

    // Purple / Indigo / Accent
    '#f3e8ff': 'var(--lt-primary-50)',
    '#e9d5ff': 'var(--lt-primary-100)',
    '#c084fc': 'var(--lt-primary-400)',
    '#a855f7': 'var(--lt-primary-500)',
    '#9333ea': 'var(--lt-primary-600)',
    '#581c87': 'var(--lt-primary-900)',
    '#ec4899': 'var(--lt-primary-500)'
};

for (const file of TARGET_FILES) {
    const filePath = path.join(componentsDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');
    let replaced = 0;

    for (const [hex, token] of Object.entries(SEVERITY_REPLACEMENTS)) {
        const regex = new RegExp(`${hex}\\b`, 'gi');
        if (regex.test(content)) {
            content = content.replace(regex, token);
            replaced++;
        }
    }

    if (replaced > 0) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✓ Cleaned ${replaced} severity tokens in ${file}`);
    }
}

console.log('\nPurge complete.');

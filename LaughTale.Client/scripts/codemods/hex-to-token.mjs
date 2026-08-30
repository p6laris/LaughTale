/**
 * LaughTale Migration Codemod: Hex to Semantic Tokens (LT-1206)
 * Replaces hardcoded hex literals in components with semantic design tokens.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

const HEX_TOKEN_MAP = {
    '#ffffff': 'var(--lt-surface-0, #ffffff)',
    '#ffffff': 'var(--lt-surface-0, #ffffff)',
    '#f8fafc': 'var(--lt-surface-50, #f8fafc)',
    '#f1f5f9': 'var(--lt-surface-100, #f1f5f9)',
    '#e2e8f0': 'var(--lt-surface-200, #e2e8f0)',
    '#cbd5e1': 'var(--lt-surface-300, #cbd5e1)',
    '#94a3b8': 'var(--lt-surface-400, #94a3b8)',
    '#64748b': 'var(--lt-surface-500, #64748b)',
    '#475569': 'var(--lt-surface-600, #475569)',
    '#334155': 'var(--lt-surface-700, #334155)',
    '#1e293b': 'var(--lt-surface-800, #1e293b)',
    '#0f172a': 'var(--lt-surface-900, #0f172a)',
    '#020617': 'var(--lt-surface-950, #020617)',
    '#10b981': 'var(--lt-primary-500, #10b981)',
    '#059669': 'var(--lt-primary-600, #059669)',
    '#ef4444': 'var(--lt-danger-500, #ef4444)',
    '#f59e0b': 'var(--lt-warn-500, #f59e0b)',
    '#3b82f6': 'var(--lt-info-500, #3b82f6)'
};

console.log('[LaughTale Codemod] Scanning components for hex literals...');

let totalReplacements = 0;
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    for (const [hex, token] of Object.entries(HEX_TOKEN_MAP)) {
        const regex = new RegExp(`(?<!var\\([^)]*)${hex}`, 'gi');
        if (regex.test(content)) {
            content = content.replace(regex, token);
            modified = true;
            totalReplacements++;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✓ Updated tokens in: ${file}`);
    }
}

console.log(`\n[LaughTale Codemod] Completed. Total token replacements: ${totalReplacements}.\n`);

/**
 * LaughTale Master Token Migration Codemod (LT-1304 / LT-1105)
 * Converts all legacy --p-* variables and hardcoded hex fallbacks across all 76 components
 * into pure semantic --lt-* tokens with zero hardcoded hex literals.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

let totalReplacements = 0;

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // 1. Convert var(--p-surface-X, #hex) -> var(--lt-surface-X)
    content = content.replace(/var\(--p-surface-(\d+)(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-surface-$1)');
    
    // 2. Convert var(--p-primary-X, #hex) -> var(--lt-primary-X)
    content = content.replace(/var\(--p-primary-(\d+)(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-primary-$1)');
    content = content.replace(/var\(--p-primary-color(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-primary-500)');
    content = content.replace(/var\(--p-primary-color-text(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-surface-0)');

    // 3. Convert var(--p-danger/warn/info/success-X, #hex) -> var(--lt-*)
    content = content.replace(/var\(--p-danger-(\d+)(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-danger-$1)');
    content = content.replace(/var\(--p-warn-(\d+)(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-warn-$1)');
    content = content.replace(/var\(--p-info-(\d+)(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-info-$1)');
    content = content.replace(/var\(--p-success-(\d+)(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-success-$1)');

    // 4. Convert text tokens
    content = content.replace(/var\(--p-text-color(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-text-primary)');
    content = content.replace(/var\(--p-text-muted-color(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-text-muted)');
    content = content.replace(/var\(--p-border-color(?:,\s*#[0-9a-fA-F]+)?\)/g, 'var(--lt-surface-200)');

    // 5. Convert radius tokens
    content = content.replace(/var\(--p-border-radius(?:,\s*[^)]+)?\)/g, 'var(--lt-radius)');
    content = content.replace(/var\(--p-border-radius-sm(?:,\s*[^)]+)?\)/g, 'var(--lt-radius-sm)');
    content = content.replace(/var\(--p-border-radius-lg(?:,\s*[^)]+)?\)/g, 'var(--lt-radius-lg)');

    // 6. Convert any remaining hardcoded hex in component CSS/templates (excluding theme-studio preset palettes)
    if (file !== 'theme-studio.ts') {
        content = content.replace(/#ffffff\b|#fff\b/gi, 'var(--lt-surface-0)');
        content = content.replace(/#020617\b|#000000\b|#000\b/gi, 'var(--lt-surface-950)');
        content = content.replace(/#0f172a\b|#111827\b/gi, 'var(--lt-surface-900)');
        content = content.replace(/#1e293b\b|#18181b\b/gi, 'var(--lt-surface-800)');
        content = content.replace(/#334155\b|#27272a\b/gi, 'var(--lt-surface-700)');
        content = content.replace(/#475569\b|#3f3f46\b/gi, 'var(--lt-surface-600)');
        content = content.replace(/#64748b\b|#52525b\b/gi, 'var(--lt-surface-500)');
        content = content.replace(/#94a3b8\b|#71717a\b/gi, 'var(--lt-surface-400)');
        content = content.replace(/#cbd5e1\b|#a1a1aa\b/gi, 'var(--lt-surface-300)');
        content = content.replace(/#e2e8f0\b|#d4d4d8\b/gi, 'var(--lt-surface-200)');
        content = content.replace(/#f1f5f9\b|#e4e4e7\b/gi, 'var(--lt-surface-100)');
        content = content.replace(/#f8fafc\b|#f4f4f5\b|#fafafa\b/gi, 'var(--lt-surface-50)');
        content = content.replace(/#10b981\b/gi, 'var(--lt-primary-500)');
        content = content.replace(/#059669\b/gi, 'var(--lt-primary-600)');
        content = content.replace(/#047857\b/gi, 'var(--lt-primary-700)');
        content = content.replace(/#ecfdf5\b/gi, 'var(--lt-primary-50)');
        content = content.replace(/#d1fae5\b/gi, 'var(--lt-primary-100)');
        content = content.replace(/#a7f3d0\b/gi, 'var(--lt-primary-200)');
        content = content.replace(/#6ee7b7\b/gi, 'var(--lt-primary-300)');
        content = content.replace(/#34d399\b/gi, 'var(--lt-primary-400)');
        content = content.replace(/#ef4444\b|#f43f5e\b/gi, 'var(--lt-danger-500)');
        content = content.replace(/#f59e0b\b/gi, 'var(--lt-warn-500)');
        content = content.replace(/#3b82f6\b/gi, 'var(--lt-info-500)');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        totalReplacements++;
        console.log(`  ✓ Migrated tokens in: ${file}`);
    }
}

console.log(`\n🎉 Migrated tokens in ${totalReplacements} component files.`);

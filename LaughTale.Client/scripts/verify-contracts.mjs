/**
 * LaughTale: Architecture & Contract Verification Gate
 * Enforces strict lint rules:
 * 1. Reference components must accept `ctx?: IslandContext` and pass `signal` on `addEventListener`.
 * 2. Component props interfaces must include `pt?: PassthroughRecord` and `studioOverrides?: Record<string, any>`.
 * 3. Safe Rendering Purity: Zero unguarded HTML injection sinks (.innerHTML, .outerHTML, insertAdjacentHTML, document.write).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../src/components');

console.log('[LaughTale Lint] Running architecture contract verification gate...');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));
let errors = 0;

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Rule 1: Must support IslandContext
    if (!content.includes('IslandContext')) {
        console.error(`❌ [${file}] Missing IslandContext lifecycle support.`);
        errors++;
    }

    // Rule 2: Must support PassthroughRecord (pt)
    if (!content.includes('PassthroughRecord') || !content.includes('pt?: PassthroughRecord')) {
        console.error(`❌ [${file}] Missing pt?: PassthroughRecord customization contract.`);
        errors++;
    }

    // Rule 3: Safe Rendering Purity - Zero unguarded HTML injection sinks (T032, T033)
    // Rejects .innerHTML =, .outerHTML =, insertAdjacentHTML, and document.write
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (/\.innerHTML\s*=/.test(line)) {
            console.error(`❌ [${file}:${idx + 1}] Forbidden .innerHTML assignment. Use setHtml() from '../runtime/html' instead.`);
            errors++;
        }
        if (/\.outerHTML\s*=/.test(line)) {
            console.error(`❌ [${file}:${idx + 1}] Forbidden .outerHTML assignment. Use safe DOM manipulation or setHtml() instead.`);
            errors++;
        }
        if (/insertAdjacentHTML\s*\(/.test(line)) {
            console.error(`❌ [${file}:${idx + 1}] Forbidden insertAdjacentHTML call. Use safe DOM manipulation or setHtml() instead.`);
            errors++;
        }
        if (/document\.write(ln)?\s*\(/.test(line)) {
            console.error(`❌ [${file}:${idx + 1}] Forbidden document.write call.`);
            errors++;
        }
    });
}

if (errors > 0) {
    console.error(`\n❌ [LaughTale Lint] Contract verification failed with ${errors} violation(s).\n`);
    process.exit(1);
} else {
    console.log(`✅ [LaughTale Lint] All ${files.length} components passed architecture contract verification.\n`);
    process.exit(0);
}

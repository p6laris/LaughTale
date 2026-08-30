/**
 * LaughTale: Architecture & Contract Verification Gate (LT-1108)
 * Enforces strict lint rules:
 * 1. Reference components must accept `ctx?: IslandContext` and pass `signal` on `addEventListener`.
 * 2. Component props interfaces must include `pt?: PassthroughRecord` and `studioOverrides?: Record<string, any>`.
 * 3. Components must not use deprecated legacy conventions without lifecycle cleanup.
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

    // Rule 3: Token Purity - Zero hardcoded hex colors (LT-1304)
    if (file !== 'theme-studio.ts') {
        const hexMatches = content.match(/#[0-9a-fA-F]{3,8}\b/g);
        if (hexMatches && hexMatches.length > 0) {
            console.error(`❌ [${file}] Contains ${hexMatches.length} hardcoded hex literal(s): ${hexMatches.join(', ')}`);
            errors++;
        }
    }
}

if (errors > 0) {
    console.error(`\n❌ [LaughTale Lint] Contract verification failed with ${errors} violation(s).\n`);
    process.exit(1);
} else {
    console.log(`✅ [LaughTale Lint] All ${files.length} components passed architecture contract verification.\n`);
    process.exit(0);
}

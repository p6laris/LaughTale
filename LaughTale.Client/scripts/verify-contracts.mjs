/**
 * LaughTale: Architecture & Contract Verification Gate
 * Enforces strict lint rules:
 * 1. Signal-bound Event Listeners: All addEventListener registrations must pass options containing signal.
 * 2. Passthrough Customization: Component props must support pt?: PassthroughRecord.
 * 3. Safe Rendering Purity: Zero unguarded HTML injection sinks (.innerHTML, .outerHTML, insertAdjacentHTML, document.write).
 * 4. Observer Teardown: Every MutationObserver, ResizeObserver, or IntersectionObserver must have a corresponding disconnect().
 * 5. Interval Teardown: Every setInterval must have a corresponding clearInterval().
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../src/components');

console.log('[LaughTale Lint] Running architecture contract verification gate...');

export function splitTopLevel(argsStr) {
    const parts = [];
    let depth = 0;
    let cur = '';
    let inStr = false;
    let quote = '';
    for (let i = 0; i < argsStr.length; i++) {
        const ch = argsStr[i];
        if (inStr) {
            cur += ch;
            if (ch === quote && argsStr[i - 1] !== '\\') inStr = false;
        } else if (ch === '"' || ch === "'" || ch === '`') {
            inStr = true;
            quote = ch;
            cur += ch;
        } else if (ch === '(' || ch === '{' || ch === '[') {
            depth++;
            cur += ch;
        } else if (ch === ')' || ch === '}' || ch === ']') {
            depth--;
            cur += ch;
        } else if (ch === ',' && depth === 0) {
            parts.push(cur.trim());
            cur = '';
        } else {
            cur += ch;
        }
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts;
}

export function findUnmanagedListeners(content) {
    const violations = [];
    const re = /addEventListener\s*\(/g;
    let m;
    while ((m = re.exec(content)) !== null) {
        const start = re.lastIndex;
        let depth = 1;
        let i = start;
        let inStr = false;
        let quote = '';
        while (i < content.length && depth > 0) {
            const ch = content[i];
            if (inStr) {
                if (ch === quote && content[i - 1] !== '\\') inStr = false;
            } else if (ch === '"' || ch === "'" || ch === '`') {
                inStr = true;
                quote = ch;
            } else if (ch === '(') {
                depth++;
            } else if (ch === ')') {
                depth--;
            }
            i++;
        }
        const argsStr = content.slice(start, i - 1);
        const parts = splitTopLevel(argsStr);
        const opts = parts.length >= 3 ? parts.slice(2).join(',') : '';
        if (!/\bsignal\b/.test(opts)) {
            const lineNumber = content.slice(0, m.index).split('\n').length;
            const snippet = content.slice(m.index, i).replace(/\s+/g, ' ').slice(0, 80);
            violations.push({ line: lineNumber, snippet });
        }
    }
    return violations;
}

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));
let errors = 0;

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Rule 1: Signal-bound Event Listeners (balanced-paren parse)
    const unmanaged = findUnmanagedListeners(content);
    for (const v of unmanaged) {
        console.error(`❌ [${file}:${v.line}] Unmanaged event listener without signal: ${v.snippet}`);
        errors++;
    }

    // Rule 2: Must support PassthroughRecord (pt)
    if (!content.includes('PassthroughRecord') || !content.includes('pt?: PassthroughRecord')) {
        console.error(`❌ [${file}] Missing pt?: PassthroughRecord customization contract.`);
        errors++;
    }

    // Rule 3: Safe Rendering Purity - Zero unguarded HTML injection sinks
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

    // Rule 4: Observer Teardown (new Observer requires disconnect)
    const observerMatch = content.match(/new\s+(MutationObserver|ResizeObserver|IntersectionObserver)\s*\(/);
    if (observerMatch) {
        if (!/\.disconnect\s*\(\)/.test(content)) {
            const line = content.slice(0, observerMatch.index).split('\n').length;
            console.error(`❌ [${file}:${line}] Undisconnected observer: ${observerMatch[1]} instantiated without corresponding disconnect().`);
            errors++;
        }
    }

    // Rule 5: Interval Teardown (setInterval requires clearInterval)
    const intervalMatch = content.match(/\bsetInterval\s*\(/);
    if (intervalMatch) {
        if (!/\bclearInterval\s*\(/.test(content)) {
            const line = content.slice(0, intervalMatch.index).split('\n').length;
            console.error(`❌ [${file}:${line}] Uncleared interval: setInterval instantiated without corresponding clearInterval().`);
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

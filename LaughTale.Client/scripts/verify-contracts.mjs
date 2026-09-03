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
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../src/components');
const patternsFile = path.resolve(__dirname, '../src/accessibility/patterns.ts');

let PATTERNS = {};
if (fs.existsSync(patternsFile)) {
    const patternsContent = fs.readFileSync(patternsFile, 'utf-8');
    const pMatch = patternsContent.match(/export\s+const\s+PATTERNS[^{]+({[\s\S]+?});\s*$/);
    if (pMatch) {
        try {
            PATTERNS = vm.runInNewContext('(' + pMatch[1] + ')');
        } catch (e) {
            console.error('[LaughTale Lint] Warning: Failed to parse PATTERNS from patterns.ts', e);
        }
    }
}

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

    // Helper to parse export const a11y: PatternDeclaration = { ... };
    const a11yMatch = content.match(/export\s+const\s+a11y(?:\s*:\s*PatternDeclaration)?\s*=\s*({[\s\S]*?});/);
    let a11yDecl = null;
    if (a11yMatch) {
        try {
            a11yDecl = vm.runInNewContext('(' + a11yMatch[1] + ')');
        } catch {
            a11yDecl = null;
        }
    }

    // Rule 6: a11y-declaration-required (FR-005)
    if (!a11yDecl) {
        console.error(`❌ [${file}] a11y-declaration-required: Component must export an 'a11y: PatternDeclaration' declaration.`);
        errors++;
    } else {
        // Rule 7: a11y-pattern-conformance (FR-006, FR-007, FR-008, FR-017)
        if (a11yDecl.kind === 'pattern') {
            const def = PATTERNS[a11yDecl.pattern];
            if (!def) {
                console.error(`❌ [${file}] a11y-pattern-conformance: Unknown pattern '${a11yDecl.pattern}'.`);
                errors++;
            } else {
                // Check role
                const roleRegex = new RegExp(`role=["']${def.role}["']|role:\\s*["']${def.role}["']|setAttribute\\(\\s*['"]role['"]\\s*,\\s*['"]${def.role}['"]\\)|data-role=["']${def.role}["']`);
                if (!roleRegex.test(content)) {
                    console.error(`❌ [${file}] a11y-pattern-conformance: Pattern '${a11yDecl.pattern}' requires role='${def.role}'.`);
                    errors++;
                }

                // Check required attributes
                for (const attrReq of def.requiredAttributes) {
                    if (attrReq.includes('|')) {
                        const opts = attrReq.split('|');
                        const hasOpt = opts.some(opt => content.includes(opt) || new RegExp(`\\b${opt.replace(/^aria-/, '')}\\b\\s*:`).test(content));
                        if (!hasOpt) {
                            console.error(`❌ [${file}] a11y-pattern-conformance: Pattern '${a11yDecl.pattern}' requires at least one of '${attrReq}'.`);
                            errors++;
                        }
                    } else {
                        const shortKey = attrReq.replace(/^aria-/, '');
                        const hasAttr = content.includes(attrReq) || new RegExp(`\\b${shortKey}\\b\\s*:`).test(content);
                        if (!hasAttr) {
                            console.error(`❌ [${file}] a11y-pattern-conformance: Pattern '${a11yDecl.pattern}' requires attribute '${attrReq}'.`);
                            errors++;
                        }
                    }
                }

                // Check required states
                for (const stateReq of def.requiredStates) {
                    const shortKey = stateReq.replace(/^aria-/, '');
                    const hasState = content.includes(stateReq) || new RegExp(`\\b${shortKey}\\b\\s*:`).test(content);
                    if (!hasState) {
                        console.error(`❌ [${file}] a11y-pattern-conformance: Pattern '${a11yDecl.pattern}' requires state '${stateReq}'.`);
                        errors++;
                    }
                }

                // Rule 10: a11y-modal-traps-focus (FR-010)
                if (def.modal) {
                    if (!/useFocusTrap\s*\(/.test(content)) {
                        console.error(`❌ [${file}] a11y-modal-traps-focus: Modal pattern '${a11yDecl.pattern}' must call useFocusTrap.`);
                        errors++;
                    }
                }

                // Rule 11: a11y-nonmodal-does-not-trap (FR-012)
                if (!def.modal) {
                    if (/useFocusTrap\s*\(/.test(content)) {
                        console.error(`❌ [${file}] a11y-nonmodal-does-not-trap: Non-modal pattern '${a11yDecl.pattern}' must not call useFocusTrap.`);
                        errors++;
                    }
                }
            }
        } else if (a11yDecl.kind === 'native') {
            // Rule 8: a11y-native-not-overridden (FR-009)
            const rendersElem = content.includes(`<${a11yDecl.element}`) ||
                                content.includes(`createElement('${a11yDecl.element}')`) ||
                                content.includes(`createElement("${a11yDecl.element}")`);
            if (!rendersElem) {
                console.error(`❌ [${file}] a11y-native-not-overridden: Declared native element '<${a11yDecl.element}>' not found in component.`);
                errors++;
            }
            if (a11yDecl.element === 'button' && /role=["']button["']/.test(content)) {
                console.error(`❌ [${file}] a11y-native-not-overridden: Native <button> must not have redundant role="button".`);
                errors++;
            }
            if (a11yDecl.element === 'textarea' && /role=["']textbox["']/.test(content)) {
                console.error(`❌ [${file}] a11y-native-not-overridden: Native <textarea> must not have redundant role="textbox".`);
                errors++;
            }
        } else if (a11yDecl.kind === 'presentational') {
            // Rule 9: a11y-presentational-is-inert (FR-009, SC-009)
            const interactive = content.match(/<(button|input|select|textarea)\b/i);
            if (interactive) {
                console.error(`❌ [${file}] a11y-presentational-is-inert: Presentational component must not render interactive element '<${interactive[1]}>'.`);
                errors++;
            }
            const widgetRole = content.match(/role=["'](dialog|listbox|combobox|menu|menubar|radiogroup|checkbox|slider|tablist|tree|grid|toolbar|tooltip|progressbar)\b/i);
            if (widgetRole) {
                console.error(`❌ [${file}] a11y-presentational-is-inert: Presentational component must not declare widget role '${widgetRole[1]}'.`);
                errors++;
            }
            const stateAttr = content.match(/\b(aria-expanded|aria-selected|aria-checked|aria-modal)\b/i);
            if (stateAttr) {
                console.error(`❌ [${file}] a11y-presentational-is-inert: Presentational component must not declare interactive state '${stateAttr[1]}'.`);
                errors++;
            }
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

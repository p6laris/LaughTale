#!/usr/bin/env node
/**
 * LaughTale Adoption Metrics Harness
 *
 * Prints a JSON object of adoption counters. Every roadmap gate reads from
 * this file so that "done" is a number, not an opinion.
 *
 * Usage:
 *   node scripts/audit-metrics.mjs            # human table
 *   node scripts/audit-metrics.mjs --json     # machine JSON
 *   node scripts/audit-metrics.mjs --check    # exit 1 if any metric regressed vs baseline.json
 *
 * Run from LaughTale.Client/.
 */
import * as fs from 'fs';
import * as path from 'path';

const COMPONENT_DIR = 'src/components';
const BASELINE_PATH = 'scripts/metrics-baseline.json';

if (!fs.existsSync(COMPONENT_DIR)) {
    console.error(`[metrics] FATAL: ${COMPONENT_DIR} not found. Run this from LaughTale.Client/.`);
    process.exit(2);
}

const files = fs.readdirSync(COMPONENT_DIR).filter(f => f.endsWith('.ts'));
const read = f => fs.readFileSync(path.join(COMPONENT_DIR, f), 'utf8');
const countAll = (s, re) => (s.match(re) || []).length;

const TOTAL = files.length;
const m = {
    componentsTotal: TOTAL,

    // --- SECURITY -----------------------------------------------------------
    // Components assigning innerHTML at all.
    innerHtmlComponents: 0,
    // innerHTML assignments NOT going through the html`` tagged template.
    innerHtmlRawAssignments: 0,
    // Components referencing any escaping/sanitizing helper.
    escapeAdoption: 0,
    // addEventListener calls that do NOT pass an AbortSignal in the same call.
    listenersUnmanaged: 0,
    listenersTotal: 0,
    // Observers constructed vs disconnected.
    observersCreated: 0,
    observersDisconnected: 0,

    // --- ACCESSIBILITY ------------------------------------------------------
    ariaZeroComponents: 0,
    focusTrapAdoption: 0,
    virtualizerAdoption: 0,

    // --- STYLE / BLOAT ------------------------------------------------------
    inlineStyleAttributes: 0,
    rawSvgLiterals: 0,
    // Hex NOT inside a var(--token, #fallback) slot — the real violations.
    hexHardcoded: 0,
    // Hex inside a var() fallback slot — legitimate, must NOT be "fixed".
    hexInVarFallback: 0,

    // --- API CONSISTENCY ----------------------------------------------------
    eventsNamespaced: 0,
    eventsBare: 0,

    // --- ADOPTION (later phases) --------------------------------------------
    // Components participating in native form submission via ElementInternals.
    formAssociationAdoption: 0,
    // Components implementing the registry's createHandle imperative contract.
    handleAdoption: 0,
    // Components honouring text direction (dir/rtl or CSS logical properties).
    rtlAdoption: 0,
    // Explicit escape hatches. Should stay small; a spike means the primitive is being defeated.
    unsafeCalls: 0,
    // Adapters declaring the update(props) contract (no-remount refresh).
    adapterUpdateSupport: 0,
};

for (const f of files) {
    const s = read(f);

    if (/\.innerHTML\s*=/.test(s)) m.innerHtmlComponents++;
    // Raw = innerHTML assignment whose right-hand side does not start with html`
    m.innerHtmlRawAssignments += countAll(s, /\.innerHTML\s*=\s*(?!html`)/g);

    if (/sanitizeHtml|sanitizeUrl|escapeHtml|isSafeAttribute|\bhtml`/.test(s)) m.escapeAdoption++;

    const addCalls = countAll(s, /addEventListener\s*\(/g);
    // A listener is "managed" if 'signal' appears within 160 chars of the call.
    const managed = countAll(s, /addEventListener\s*\([^;]{0,160}?signal/g);
    m.listenersTotal += addCalls;
    m.listenersUnmanaged += Math.max(0, addCalls - managed);

    m.observersCreated += countAll(s, /new\s+(Resize|Mutation|Intersection)Observer/g);
    m.observersDisconnected += countAll(s, /\.disconnect\s*\(\)/g);

    if (!/aria-/.test(s)) m.ariaZeroComponents++;
    if (/useFocusTrap/.test(s)) m.focusTrapAdoption++;
    if (/useVirtualizer/.test(s)) m.virtualizerAdoption++;

    m.inlineStyleAttributes += countAll(s, /style="/g);
    m.rawSvgLiterals += countAll(s, /<svg[\s>]/g);

    const allHex = countAll(s, /#[0-9a-fA-F]{3,8}\b/g);
    const fallbackHex = countAll(s, /var\(\s*--[a-zA-Z0-9-]+\s*,[^)]*#[0-9a-fA-F]{3,8}/g);
    m.hexInVarFallback += fallbackHex;
    m.hexHardcoded += Math.max(0, allHex - fallbackHex);

    for (const ev of s.match(/CustomEvent\(\s*'([a-zA-Z:_-]+)'/g) || []) {
        if (ev.includes(':')) m.eventsNamespaced++; else m.eventsBare++;
    }

    if (/ElementInternals|attachInternals|setFormValue/.test(s)) m.formAssociationAdoption++;
    if (/createHandle/.test(s)) m.handleAdoption++;
    if (/dir\s*===|rtl|inline-start|inline-end|margin-inline|padding-inline|inset-inline/.test(s)) m.rtlAdoption++;
    m.unsafeCalls += countAll(s, /unsafe\s*\(/g);
}

// Adapters are a separate directory from components.
const ADAPTER_DIR = 'src/adapters';
if (fs.existsSync(ADAPTER_DIR)) {
    for (const f of fs.readdirSync(ADAPTER_DIR).filter(x => x.endsWith('.ts') && x !== 'index.ts')) {
        const s = fs.readFileSync(path.join(ADAPTER_DIR, f), 'utf8');
        if (/update\s*[(:]/.test(s)) m.adapterUpdateSupport++;
    }
}

// Metrics where a LOWER number is better. --check enforces monotonic improvement.
const LOWER_IS_BETTER = [
    'innerHtmlRawAssignments', 'listenersUnmanaged', 'ariaZeroComponents',
    'inlineStyleAttributes', 'rawSvgLiterals', 'hexHardcoded', 'eventsBare',
];
// Metrics where a HIGHER number is better.
const HIGHER_IS_BETTER = [
    'escapeAdoption', 'focusTrapAdoption', 'virtualizerAdoption',
    'formAssociationAdoption', 'handleAdoption', 'rtlAdoption', 'adapterUpdateSupport',
];

const args = process.argv.slice(2);

if (args.includes('--json')) {
    console.log(JSON.stringify(m, null, 2));
    process.exit(0);
}

if (args.includes('--check')) {
    if (!fs.existsSync(BASELINE_PATH)) {
        console.error(`[metrics] FATAL: no baseline at ${BASELINE_PATH}. Run with --save first.`);
        process.exit(2);
    }
    const base = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
    let failed = 0;
    for (const k of LOWER_IS_BETTER) {
        if (m[k] > base[k]) {
            console.error(`❌ REGRESSION  ${k}: ${base[k]} → ${m[k]} (must not increase)`);
            failed++;
        }
    }
    for (const k of HIGHER_IS_BETTER) {
        if (m[k] < base[k]) {
            console.error(`❌ REGRESSION  ${k}: ${base[k]} → ${m[k]} (must not decrease)`);
            failed++;
        }
    }
    if (failed) {
        console.error(`\n[metrics] ${failed} regression(s). Commit rejected.`);
        process.exit(1);
    }
    console.log('✅ [metrics] No regressions against baseline.');
    process.exit(0);
}

if (args.includes('--save')) {
    fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(m, null, 2) + '\n');
    console.log(`[metrics] Baseline written to ${BASELINE_PATH}`);
    process.exit(0);
}

const pad = s => String(s).padEnd(26);
console.log('\n  LaughTale Adoption Metrics');
console.log('  ' + '─'.repeat(46));
for (const [k, v] of Object.entries(m)) {
    const dir = LOWER_IS_BETTER.includes(k) ? '↓' : HIGHER_IS_BETTER.includes(k) ? '↑' : ' ';
    console.log(`  ${dir} ${pad(k)} ${String(v).padStart(6)}`);
}
console.log('');

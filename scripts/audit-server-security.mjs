#!/usr/bin/env node
/**
 * LaughTale Server Security Metrics Harness (LT-2204)
 *
 * Scans C# source files for fail-open authorization sites, service-absence
 * skips, optional allowlists, and unguarded data endpoints.
 *
 * Usage:
 *   node scripts/audit-server-security.mjs            # human table
 *   node scripts/audit-server-security.mjs --json     # machine JSON
 *   node scripts/audit-server-security.mjs --check    # exit 1 if any counter > 0
 */

import * as fs from 'fs';
import * as path from 'path';

const IGNORE_DIRS = new Set(['bin', 'obj', '.git', 'node_modules', 'specs', '.specify', 'LaughTale.Tests']);

function findCsFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (!IGNORE_DIRS.has(entry.name)) {
                results.push(...findCsFiles(path.join(dir, entry.name)));
            }
        } else if (entry.isFile() && entry.name.endsWith('.cs')) {
            results.push(path.join(dir, entry.name));
        }
    }
    return results;
}

const rootDir = process.cwd();
const csFiles = findCsFiles(rootDir);

let failOpenAuthorizationSites = 0;
let serviceAbsenceSkips = 0;
let allowlistOptionalSites = 0;
let unguardedDataEndpoints = 0;

for (const file of csFiles) {
    const content = fs.readFileSync(file, 'utf8');

    // 1. failOpenAuthorizationSites (expected 5)
    // Spelling A: !IsNullOrWhiteSpace(x) && authService != null (4 sites: IslandTagHelperBase, IslandEndpointExtensions, IslandTagHelper, IslandGenerator)
    // Spelling B: if (IsNullOrWhiteSpace(policy)) return true; (1 site: IIslandAuthorizationRegistry:132)
    const failOpenSpellingA = content.match(/(!\s*(?:string\.)?IsNullOrWhiteSpace\s*\([^)]*\)\s*&&\s*authService\s*!=\s*null|authService\s*!=\s*null\s*&&\s*!\s*(?:string\.)?IsNullOrWhiteSpace\s*\([^)]*\))/g);
    if (failOpenSpellingA) {
        failOpenAuthorizationSites += failOpenSpellingA.length;
    }

    const failOpenSpellingB = content.match(/if\s*\(\s*(?:string\.)?IsNullOrWhiteSpace\s*\([^)]*\)\s*\)\s*(?:\{\s*return\s+true\s*;\s*\}|return\s+true\s*;)/g);
    if (failOpenSpellingB) {
        failOpenAuthorizationSites += failOpenSpellingB.length;
    }

    // 2. serviceAbsenceSkips (expected 5)
    // Four && authService != null plus if (antiforgery != null) at IslandEndpointExtensions.cs:47
    const authServiceSkips = content.match(/(?:&&\s*authService\s*!=\s*null|authService\s*!=\s*null\s*&&)/g);
    if (authServiceSkips) {
        serviceAbsenceSkips += authServiceSkips.length;
    }

    const antiforgerySkips = content.match(/if\s*\(\s*antiforgery\s*!=\s*null\s*\)/g);
    if (antiforgerySkips) {
        serviceAbsenceSkips += antiforgerySkips.length;
    }

    // 3. allowlistOptionalSites (expected 3: QueryableExtensions.cs:89, :119, :184)
    const allowlistSkips = content.match(/allowedFields\s*!=\s*null/g);
    if (allowlistSkips) {
        allowlistOptionalSites += allowlistSkips.length;
    }

    // 4. unguardedDataEndpoints (expected 1: MapIslandData MapPost handler at IslandEndpointExtensions.cs:112)
    // Detect MapPost handler blocks that call queryProvider without evaluating authorization first
    const mapPostRegex = /endpoints\.MapPost\s*\([^;]+?=>\s*\{([\s\S]*?)\}\s*\)/g;
    let match;
    while ((match = mapPostRegex.exec(content)) !== null) {
        const handlerBody = match[1];
        if (handlerBody.includes('queryProvider(')) {
            const queryProviderIndex = handlerBody.indexOf('queryProvider(');
            const evaluateIndex = handlerBody.indexOf('EvaluateAsync');
            if (evaluateIndex === -1 || evaluateIndex > queryProviderIndex) {
                unguardedDataEndpoints++;
            }
        }
    }
}

const metrics = {
    failOpenAuthorizationSites,
    serviceAbsenceSkips,
    allowlistOptionalSites,
    unguardedDataEndpoints,
};

const args = process.argv.slice(2);

if (args.includes('--json')) {
    console.log(JSON.stringify(metrics, null, 2));
    process.exit(0);
}

if (args.includes('--check')) {
    let failed = false;
    for (const [k, v] of Object.entries(metrics)) {
        if (v > 0) {
            console.error(`❌ SECURITY DEFECT: ${k} = ${v} (must be 0)`);
            failed = true;
        }
    }
    if (failed) {
        console.error('\n[security] Defect(s) detected. Gate failed.');
        process.exit(1);
    }
    console.log('✅ [security] All server security gates passed (all counters 0).');
    process.exit(0);
}

const pad = s => String(s).padEnd(28);
console.log('\n  LaughTale Server Security Metrics');
console.log('  ' + '─'.repeat(46));
for (const [k, v] of Object.entries(metrics)) {
    console.log(`  ↓ ${pad(k)} ${String(v).padStart(6)}`);
}
console.log('');

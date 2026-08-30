/**
 * LaughTale Migration Codemod: Batch Retrofit Components (LT-1301 - LT-1308)
 * Ensures:
 * 1. IslandContext & PassthroughRecord imports in every component
 * 2. `pt?: PassthroughRecord; studioOverrides?: Record<string, any>;` on props interfaces
 * 3. `(container: HTMLElement, props: ..., ctx?: IslandContext)` on default island export functions
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

console.log('[LaughTale Codemod] Running batch retrofit across all 76 components...');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));
let retrofittedCount = 0;

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // 1. Ensure parts & IslandContext imports
    if (!content.includes("from '../runtime/parts'")) {
        const importParts = "import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';\nimport type { IslandContext } from '../runtime/registry';\n";
        content = importParts + content;
        modified = true;
    }

    // 2. Ensure pt and studioOverrides on Props interface
    const propsInterfaceMatch = content.match(/export interface (\w+Props)\s*\{([\s\S]*?)\}/);
    if (propsInterfaceMatch) {
        const [fullMatch, interfaceName, body] = propsInterfaceMatch;
        let newBody = body;
        if (!newBody.includes('pt?: PassthroughRecord')) {
            newBody = newBody.trimEnd() + '\n    pt?: PassthroughRecord;\n    studioOverrides?: Record<string, any>;\n';
            content = content.replace(fullMatch, `export interface ${interfaceName} {${newBody}}`);
            modified = true;
        }
    }

    // 3. Ensure Island default export accepts ctx?: IslandContext
    const exportMatch = content.match(/export default function (\w+Island|\w+)\s*\((container:\s*HTMLElement,\s*props:[^,\)]+)\)/);
    if (exportMatch) {
        const [fullMatch, fnName, params] = exportMatch;
        content = content.replace(fullMatch, `export default function ${fnName}(${params}, ctx?: IslandContext)`);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        retrofittedCount++;
        console.log(`  ✓ Retrofitted component: ${file}`);
    }
}

console.log(`\n[LaughTale Codemod] Completed. Retrofitted ${retrofittedCount} components.\n`);

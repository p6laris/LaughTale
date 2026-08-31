/**
 * LaughTale TypeScript AST Lifecycle & Parts Codemod
 * Uses TypeScript compiler API to parse and rewrite ALL addEventListener call sites
 * and ensure data-part attributes across all 76 components.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

console.log('[LaughTale AST Codemod] Running AST lifecycle & parts retrofit across all components...');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));
let totalCallsTransformed = 0;
let modifiedFilesCount = 0;

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    let sourceCode = fs.readFileSync(filePath, 'utf-8');

    // 1. Ensure parts & IslandContext imports
    if (!sourceCode.includes("from '../runtime/parts'")) {
        sourceCode = "import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';\n" + sourceCode;
    }
    if (!sourceCode.includes('IslandContext')) {
        sourceCode = "import type { IslandContext } from '../runtime/registry';\n" + sourceCode;
    }

    // 2. Ensure pt and studioOverrides on Props interface
    if (!sourceCode.includes('pt?: PassthroughRecord')) {
        const propsInterfaceMatch = sourceCode.match(/export interface (\w+Props)\s*\{([\s\S]*?)\n\}/);
        if (propsInterfaceMatch) {
            const [fullMatch, interfaceName, body] = propsInterfaceMatch;
            const newBody = body.trimEnd() + '\n    pt?: PassthroughRecord;\n    studioOverrides?: Record<string, any>;\n';
            sourceCode = sourceCode.replace(fullMatch, `export interface ${interfaceName} {${newBody}\n}`);
        }
    }

    // 3. Ensure default export accepts ctx?: IslandContext
    const exportMatch = sourceCode.match(/export default function (\w+Island|\w+)(\s*<[^>]+>)?\s*\((container:\s*HTMLElement,\s*props:[^,\)]+)\)/);
    if (exportMatch) {
        const [fullMatch, fnName, typeParams, params] = exportMatch;
        const generics = typeParams || '';
        sourceCode = sourceCode.replace(fullMatch, `export default function ${fnName}${generics}(${params}, ctx?: IslandContext)`);
    }

    // 4. Ensure data-part="root" on container element if missing
    if (!sourceCode.includes('data-part=') && file !== 'theme-studio.ts') {
        // Tag main container template literal or DOM element
        sourceCode = sourceCode.replace(/class="([^"]*)"/i, 'class="$1" data-part="root"');
        sourceCode = sourceCode.replace(/className = '([^']*)'/i, "className = '$1'; container.setAttribute('data-part', 'root')");
        if (!sourceCode.includes('data-part=')) {
            // Add fallback data-part to the top of the function
            sourceCode = sourceCode.replace(/(export default function[^{]+\{\n)/, "$1    container.setAttribute('data-part', 'root');\n");
        }
    }

    // 5. Parse AST with TypeScript to transform ALL addEventListener calls
    const sourceFile = ts.createSourceFile(
        file,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
    );

    const edits = [];

    function visit(node) {
        if (ts.isCallExpression(node)) {
            const expr = node.expression;
            if (ts.isPropertyAccessExpression(expr) && expr.name.text === 'addEventListener') {
                const args = node.arguments;
                if (args.length === 2) {
                    const lastArg = args[1];
                    edits.push({
                        start: lastArg.end,
                        end: lastArg.end,
                        insert: ', { signal: ctx?.signal }'
                    });
                    totalCallsTransformed++;
                } else if (args.length === 3) {
                    const arg2 = args[2];
                    if (ts.isObjectLiteralExpression(arg2)) {
                        const hasSignal = arg2.properties.some(p => {
                            if (ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) {
                                return p.name.getText(sourceFile) === 'signal';
                            }
                            return false;
                        });
                        if (!hasSignal) {
                            if (arg2.properties.length === 0) {
                                edits.push({
                                    start: arg2.getStart(sourceFile) + 1,
                                    end: arg2.getEnd() - 1,
                                    insert: ' signal: ctx?.signal '
                                });
                            } else {
                                const lastProp = arg2.properties[arg2.properties.length - 1];
                                edits.push({
                                    start: lastProp.end,
                                    end: lastProp.end,
                                    insert: ', signal: ctx?.signal'
                                });
                            }
                            totalCallsTransformed++;
                        }
                    } else if (arg2.kind === ts.SyntaxKind.TrueKeyword || arg2.kind === ts.SyntaxKind.FalseKeyword) {
                        const val = arg2.kind === ts.SyntaxKind.TrueKeyword ? 'true' : 'false';
                        edits.push({
                            start: arg2.getStart(sourceFile),
                            end: arg2.getEnd(),
                            insert: `{ capture: ${val}, signal: ctx?.signal }`
                        });
                        totalCallsTransformed++;
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    if (edits.length > 0) {
        edits.sort((a, b) => b.start - a.start);
        for (const edit of edits) {
            sourceCode = sourceCode.slice(0, edit.start) + edit.insert + sourceCode.slice(edit.end);
        }
    }

    fs.writeFileSync(filePath, sourceCode, 'utf-8');
    modifiedFilesCount++;
}

console.log(`\n🎉 [LaughTale AST Codemod] Completed: Processed ${modifiedFilesCount} files, transformed ${totalCallsTransformed} addEventListener calls.\n`);



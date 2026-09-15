/**
 * LaughTale Islands — discovery & parsing.
 *
 * Scans a user's `Islands/**` directory for `.ts`/`.tsx` files, parses each
 * with the TypeScript compiler API (syntactic AST only — no ts.Program, no
 * TypeChecker, matching the existing precedent in
 * scripts/codemods/batch-retrofit.mjs), and produces:
 *   - `islands.manifest.g.json` — read by LaughTale.Generators to emit one
 *     typed TagHelper per discovered island.
 *   - `registry.generated.ts` — a build artifact (not committed source) that
 *     registers each island with the client runtime's `defineIsland`.
 *
 * `extractIsland` is the single most load-bearing function in this file: it
 * is pure (no fs, no esbuild) so it can be unit-tested directly against
 * in-memory source strings — see tests/islands-discover.test.ts.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
import {
    deriveIslandName,
    isValidIslandName,
    ISLAND_NAME_REGEX,
    toPascalCase,
    findReservedNameCollision,
    mapTsType,
    createManifest,
    writeManifest,
    toPosixPath,
    MANIFEST_FILE_NAME,
    REGISTRY_FILE_NAME
} from './shared.mjs';

// ---------------------------------------------------------------------------
// extractIsland — pure parsing logic
// ---------------------------------------------------------------------------

function hasModifierKind(node, kind) {
    const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    return !!modifiers?.some((m) => m.kind === kind);
}

function isExported(node) {
    return hasModifierKind(node, ts.SyntaxKind.ExportKeyword);
}

/**
 * Finds all top-level exported interface/type-alias declarations whose name
 * ends in "Props". Only top-level statements are considered — props
 * interfaces are always top-level exports by convention, so there is no need
 * to recurse into nested scopes (unlike batch-retrofit.mjs's full-tree
 * ts.forEachChild walk, which solves a different problem).
 */
function findPropsTypeCandidates(sourceFile) {
    const candidates = [];
    for (const statement of sourceFile.statements) {
        if (!isExported(statement)) continue;
        if (ts.isInterfaceDeclaration(statement) && statement.name.text.endsWith('Props')) {
            candidates.push({ kind: 'interface', node: statement, name: statement.name.text });
        } else if (ts.isTypeAliasDeclaration(statement) && statement.name.text.endsWith('Props')) {
            candidates.push({ kind: 'typeAlias', node: statement, name: statement.name.text });
        }
    }
    return candidates;
}

/**
 * Returns the ts.PropertySignature-bearing member list for a Props
 * candidate. A type alias only has enumerable members when its RHS is an
 * inline object type literal (`type FooProps = { ... }`); any other alias
 * shape (union, mapped type, reference to another type, ...) yields no
 * members here, so that island is simply treated as having zero props with
 * no diagnostic — not exercised by the test suite, but keeps this from
 * throwing on an unusual-but-valid `*Props` alias.
 */
function getPropsMembers(candidate) {
    if (candidate.kind === 'interface') {
        return candidate.node.members;
    }
    const aliasType = candidate.node.type;
    return ts.isTypeLiteralNode(aliasType) ? aliasType.members : [];
}

function getMemberName(member, sourceFile) {
    const name = member.name;
    if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
        return name.text;
    }
    return name.getText(sourceFile);
}

/**
 * True iff the file has a top-level `export default function Name() {}` or
 * `export default function () {}` (named or anonymous function DECLARATION
 * carrying both the `export` and `default` modifiers).
 *
 * Explicitly NOT supported in v1 (LTI012 is raised instead):
 *   - `const Foo = () => {}; export default Foo;` (arrow function assigned to
 *     a variable, then separately exported)
 *   - `export default SomeOtherExport;` (bare identifier re-export)
 *   - class components (`export default class Foo { ... }`)
 * All three of those are parsed as something other than a FunctionDeclaration
 * with export+default modifiers (typically a ts.ExportAssignment, or a
 * ClassDeclaration) — this is a real v1 limitation, not an oversight; a
 * later version could special-case ExportAssignment-wrapped arrow functions,
 * but doing so is out of scope here.
 */
function hasValidDefaultExportFunction(sourceFile) {
    return sourceFile.statements.some((statement) => {
        if (!ts.isFunctionDeclaration(statement)) return false;
        return hasModifierKind(statement, ts.SyntaxKind.ExportKeyword) && hasModifierKind(statement, ts.SyntaxKind.DefaultKeyword);
    });
}

/**
 * Diagnostic codes whose presence means the WHOLE island is skipped (no
 * manifest entry, no TagHelper generated) rather than just one dropped prop.
 * LTI015 is deliberately excluded even though it is "error" severity — see
 * the `skip` doc on extractIsland below.
 */
const SKIP_ISLAND_CODES = new Set(['LTI011', 'LTI012', 'LTI014']);

/**
 * Parses `sourceText` and extracts everything needed to describe one island.
 *
 * @param {string} sourceText raw file contents
 * @param {string} fileName a filename ending in .ts or .tsx — used only to
 *   pick the TS/TSX script kind and as the AST's nominal file name; does NOT
 *   need to exist on disk.
 * @param {string} relativePath the file's path relative to the islands root
 *   (e.g. "Forms/UserCard.tsx"), used purely for kebab-case name derivation.
 *   Kept separate from fileName so this function never touches the
 *   filesystem or does its own path resolution.
 * @returns {{
 *   name: string,
 *   typeName: string|null,
 *   props: Array<{tsName:string,csharpName:string,tsType:string,csharpType:string,optional:boolean}>,
 *   diagnostics: Array<{code:string,severity:'warning'|'error',message:string}>,
 *   scriptKind: 'ts'|'tsx',
 *   skip: boolean
 * }}
 *   `skip` is a derived convenience computed FROM `diagnostics`, never set
 *   independently — but NOTE it is intentionally NOT simply "any
 *   error-severity diagnostic is present". LTI015 is "error" severity (per
 *   spec) yet must NOT skip the island — it drops just the one offending
 *   prop, exactly like the "warning"-severity LTI010. So `skip` is computed
 *   from an explicit per-code allowlist (SKIP_ISLAND_CODES above), not from
 *   severity. Severity and "does this skip the whole island" are two
 *   different axes that happen to agree for every code except LTI015.
 */
export function extractIsland(sourceText, fileName, relativePath) {
    const scriptKind = fileName.toLowerCase().endsWith('.tsx') ? 'tsx' : 'ts';
    const sourceFile = ts.createSourceFile(
        fileName,
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        scriptKind === 'tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );

    const diagnostics = [];

    // ---- Props extraction (LTI011, LTI010, LTI015) -------------------------
    const propsCandidates = findPropsTypeCandidates(sourceFile);
    let typeName = null;
    const props = [];

    if (propsCandidates.length > 1) {
        diagnostics.push({
            code: 'LTI011',
            severity: 'error',
            message: `Found ${propsCandidates.length} exported *Props types (${propsCandidates
                .map((c) => c.name)
                .join(', ')}) in one file; an island file must export exactly one. Skipping this island.`
        });
    } else if (propsCandidates.length === 1) {
        const candidate = propsCandidates[0];
        typeName = candidate.name;

        for (const member of getPropsMembers(candidate)) {
            if (!ts.isPropertySignature(member) || !member.name) continue;

            const tsName = getMemberName(member, sourceFile);
            const optional = !!member.questionToken;

            // Reserved-name collisions take priority over type mappability:
            // a prop named e.g. `class: SomeWeirdType` is reported once, as
            // a collision, not twice (collision + unmappable type).
            const reservedMatch = findReservedNameCollision(tsName);
            if (reservedMatch) {
                diagnostics.push({
                    code: 'LTI015',
                    severity: 'error',
                    message: `Prop "${tsName}" collides with the reserved field "${reservedMatch}", which the generated TagHelper always synthesizes itself. Dropping this prop; rename it in the source to keep it.`
                });
                continue;
            }

            const mapped = mapTsType(member.type);
            if (!mapped) {
                const typeText = member.type ? member.type.getText(sourceFile) : '(implicit any)';
                diagnostics.push({
                    code: 'LTI010',
                    severity: 'warning',
                    message: `Prop "${tsName}" has an unsupported type "${typeText}" and was dropped; the island will still be generated without it. Supported types: string, number, boolean, string[] / Array<string>, and string-literal unions.`
                });
                continue;
            }

            props.push({
                tsName,
                csharpName: toPascalCase(tsName),
                tsType: mapped.tsType,
                csharpType: optional ? `${mapped.csharpType}?` : mapped.csharpType,
                optional
            });
        }
    }
    // propsCandidates.length === 0: valid — not every island needs typed
    // props — props stays [] and no diagnostic is emitted.

    // ---- Default export validation (LTI012) --------------------------------
    if (!hasValidDefaultExportFunction(sourceFile)) {
        diagnostics.push({
            code: 'LTI012',
            severity: 'error',
            message:
                'No default export function declaration found. Islands require `export default function Name(...) { ... }` (named or anonymous). ' +
                'Arrow functions assigned to a variable and then exported, bare identifier re-exports (`export default Foo;`), and class components are not supported in v1.'
        });
    }

    // ---- Name derivation (LTI014) -------------------------------------------
    const name = deriveIslandName(relativePath);
    if (!isValidIslandName(name)) {
        diagnostics.push({
            code: 'LTI014',
            severity: 'error',
            message: `Derived island name "${name}" does not match the required pattern ${ISLAND_NAME_REGEX}. Rename the file/folder so its kebab-cased form is valid.`
        });
    }

    const skip = diagnostics.some((d) => SKIP_ISLAND_CODES.has(d.code));

    return { name, typeName, props, diagnostics, scriptKind, skip };
}

// ---------------------------------------------------------------------------
// runDiscover — CLI-invokable wrapper (filesystem + manifest/registry output)
// ---------------------------------------------------------------------------

function isIslandSourceFile(fileName) {
    if (fileName.endsWith('.d.ts')) return false;
    return fileName.endsWith('.ts') || fileName.endsWith('.tsx');
}

/** Hand-rolled recursive directory walk — no glob dependency exists in this package yet. */
function walkIslandFiles(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkIslandFiles(fullPath, results);
        } else if (entry.isFile() && isIslandSourceFile(entry.name)) {
            results.push(fullPath);
        }
    }
    return results;
}

/** Prints diagnostics to stderr in a greppable `[CODE] path: message` format so `dotnet build`'s <Exec> output surfaces them directly. */
function printDiagnostics(sourcePath, diagnostics) {
    for (const diagnostic of diagnostics) {
        process.stderr.write(`[${diagnostic.code}] ${sourcePath}: ${diagnostic.message}\n`);
    }
}

/**
 * Discovers every island under `islandsDir`, writes the preliminary manifest
 * (`outputChunk: null` on every island — bundle.mjs fills that in later) and
 * `registry.generated.ts` into `outDir`.
 *
 * NOTE: `sourcePath` on each manifest island is written as
 * `"<basename(islandsDir)>/<relativePath>"`. That string is only meaningful
 * as a project-root-relative path (e.g. "Islands/UserCard.tsx") under the
 * expected convention that `islandsDir`'s PARENT directory is the consuming
 * project's root — i.e. `islandsDir === path.join(projectRoot, 'Islands')`.
 * bundle.mjs relies on this same convention when it resolves `sourcePath`
 * back to an absolute path via `path.resolve(projectRoot, sourcePath)`.
 *
 * `plugins` (ROADMAP.v5.md Part G/L build-hook extension point) is an optional array of plugin
 * objects, each of which may implement:
 *   - `transformSource({ sourceText, filePath, relativePath })` — returns a (possibly unchanged)
 *     replacement source string, run on each island's source text BEFORE `extractIsland` parses
 *     it. Called in plugin-array order, threading the output of one plugin into the next.
 *   - `onIslandDiscovered({ island, sourcePath })` — called once per successfully discovered
 *     (i.e. non-skipped) island, after it has been pushed into the manifest.
 * This ships as real but unvalidated-by-a-real-consumer infrastructure this pass (see the plan) —
 * an empty/omitted `plugins` array is a complete no-op, matching today's behavior exactly.
 */
export function runDiscover({ islandsDir, outDir, plugins = [] }) {
    if (!islandsDir || !outDir) {
        throw new Error('runDiscover requires both "islandsDir" and "outDir".');
    }

    const resolvedIslandsDir = path.resolve(islandsDir);
    if (!fs.existsSync(resolvedIslandsDir) || !fs.statSync(resolvedIslandsDir).isDirectory()) {
        throw new Error(`Islands directory not found: ${resolvedIslandsDir}`);
    }

    const islandsRoot = path.basename(resolvedIslandsDir);
    const files = walkIslandFiles(resolvedIslandsDir).sort();

    const manifestIslands = [];
    const registryLines = [];

    for (const absoluteFilePath of files) {
        const relativePath = toPosixPath(path.relative(resolvedIslandsDir, absoluteFilePath));
        const sourcePath = `${islandsRoot}/${relativePath}`;

        const buffer = fs.readFileSync(absoluteFilePath);
        const contentHash = `sha256:${crypto.createHash('sha256').update(buffer).digest('hex')}`;
        let sourceText = buffer.toString('utf8');

        for (const plugin of plugins) {
            sourceText = plugin.transformSource?.({ sourceText, filePath: absoluteFilePath, relativePath }) ?? sourceText;
        }

        const result = extractIsland(sourceText, absoluteFilePath, relativePath);
        printDiagnostics(sourcePath, result.diagnostics);

        if (result.skip) {
            // LTI011 / LTI012 / LTI014 — structurally broken island, no
            // TagHelper generated for it. Diagnostics already went to
            // stderr above; it is simply omitted from the manifest.
            continue;
        }

        const islandEntry = {
            name: result.name,
            typeName: result.typeName,
            sourcePath,
            scriptKind: result.scriptKind,
            contentHash,
            outputChunk: null,
            props: result.props,
            diagnostics: result.diagnostics
        };
        manifestIslands.push(islandEntry);

        for (const plugin of plugins) {
            plugin.onIslandDiscovered?.({ island: islandEntry, sourcePath });
        }

        registryLines.push(`defineIsland('${result.name}', () => import('${toPosixPath(absoluteFilePath)}'));`);
    }

    const manifest = createManifest({ islandsRoot, islands: manifestIslands });

    const resolvedOutDir = path.resolve(outDir);
    const manifestPath = path.join(resolvedOutDir, MANIFEST_FILE_NAME);
    const registryPath = path.join(resolvedOutDir, REGISTRY_FILE_NAME);

    writeManifest(manifestPath, manifest);

    const registrySource =
        [
            '// AUTO-GENERATED by laughtale islands discover — do not edit.',
            "import { defineIsland } from 'laughtale/islands';",
            '',
            ...registryLines
        ].join('\n') + '\n';

    fs.mkdirSync(resolvedOutDir, { recursive: true });
    fs.writeFileSync(registryPath, registrySource, 'utf8');

    return { manifest, manifestPath, registryPath };
}

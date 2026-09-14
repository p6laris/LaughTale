/**
 * LaughTale Islands — shared helpers used by both discover.mjs and bundle.mjs.
 *
 * Holds:
 *   - kebab-case island-name derivation + the validation regex (copied verbatim
 *     from LaughTale.Generators/IslandGenerator.cs's IsValidIslandName so the
 *     Node and C# sides can never silently drift apart)
 *   - the TS-syntax -> C# type mapping table
 *   - the reserved prop-name list (fields the C# TagHelper generator always
 *     synthesizes itself, so a user-authored prop of the same name would collide)
 *   - manifest read/write helpers (islands.manifest.g.json)
 */

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// ---------------------------------------------------------------------------
// Island name derivation & validation
// ---------------------------------------------------------------------------

/**
 * Verbatim copy of LaughTale.Generators/IslandGenerator.cs's IsValidIslandName
 * regex. Keep these two in sync by hand — there is no shared source of truth
 * across the C#/Node boundary.
 */
export const ISLAND_NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidIslandName(name) {
    return typeof name === 'string' && ISLAND_NAME_REGEX.test(name);
}

/**
 * kebab-cases a single path segment (a folder name or a filename-without-
 * extension), inserting dashes at camelCase/acronym boundaries first so
 * "UserCard" -> "user-card" and "APIKey" -> "api-key", then collapsing any
 * remaining run of non [a-z0-9] characters (spaces, underscores, unicode,
 * punctuation, ...) into a single dash. Leading/trailing dashes are trimmed.
 *
 * This can legitimately reduce a segment to the empty string — e.g. a
 * segment made up entirely of punctuation/underscores/non-ASCII characters
 * (`"___"`, `"$$$"`, `"日本語"`) has nothing in `[a-z0-9]` to preserve. Empty
 * segments are filtered out by deriveIslandName, and if *every* segment goes
 * empty, deriveIslandName returns `""`, which fails ISLAND_NAME_REGEX — see
 * the LTI014 handling in discover.mjs. deriveIslandName is deliberately NOT
 * guaranteed to always produce a regex-valid name; callers must still run
 * isValidIslandName on the result.
 */
function kebabCaseSegment(segment) {
    return segment
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .replace(/[^A-Za-z0-9]+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

/**
 * Derives an island's kebab-case name from its path relative to the islands
 * root, joining folder segments with `-` — e.g. "Forms/UserCard.tsx" ->
 * "forms-user-card". Pure string manipulation: does no path resolution and
 * touches no filesystem, so it is directly unit-testable.
 *
 * NOT guaranteed to return a value that satisfies ISLAND_NAME_REGEX (see
 * kebabCaseSegment above) — callers must validate the result themselves.
 */
export function deriveIslandName(relativePath) {
    const normalized = relativePath.replace(/\\/g, '/');
    const withoutExt = normalized.replace(/\.tsx?$/i, '');
    const segments = withoutExt.split('/').filter(Boolean);
    const kebabSegments = segments.map(kebabCaseSegment).filter(Boolean);
    return kebabSegments.join('-');
}

/**
 * Converts a camelCase TS prop name to the PascalCase C# property name the
 * generator emits, e.g. "userName" -> "UserName". TS prop names are always
 * camelCase by convention, so a first-character uppercase is sufficient.
 */
export function toPascalCase(tsName) {
    if (tsName.length === 0) return tsName;
    return tsName.charAt(0).toUpperCase() + tsName.slice(1);
}

// ---------------------------------------------------------------------------
// Reserved prop names (collide with fields IslandTagHelperBase / the
// generator always synthesizes itself — see LTI015)
// ---------------------------------------------------------------------------

export const RESERVED_PROP_NAMES = Object.freeze([
    'pt',
    'studioOverrides',
    'class',
    'style',
    'id',
    'hydrate',
    'framework',
    'persist',
    'media',
    'policy'
]);

const RESERVED_PROP_NAMES_LOWER = new Map(RESERVED_PROP_NAMES.map((n) => [n.toLowerCase(), n]));

/**
 * Case-insensitively checks `tsName` against the reserved prop list. Returns
 * the canonical (correctly-cased) reserved name it collided with, or `null`
 * if there's no collision.
 */
export function findReservedNameCollision(tsName) {
    return RESERVED_PROP_NAMES_LOWER.get(tsName.toLowerCase()) ?? null;
}

// ---------------------------------------------------------------------------
// TS syntax -> C# type mapping table
// ---------------------------------------------------------------------------

/**
 * Maps a property's syntactic TS type node to its wire/C# type per the
 * mapping table in ROADMAP.v5.md Part B. This inspects syntax only (node
 * kinds), never resolved/checked types — there is no ts.Program or
 * TypeChecker anywhere in this pipeline, matching batch-retrofit.mjs's
 * existing precedent of pure AST-shape inspection.
 *
 * Returns `{ tsType, csharpType }` (csharpType is the REQUIRED-shape type;
 * callers append '?' themselves for optional props) or `null` when the type
 * cannot be mapped — the caller drops the prop and emits LTI010 in that case.
 */
export function mapTsType(typeNode) {
    if (!typeNode) return null;

    if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
        return { tsType: 'string', csharpType: 'string' };
    }
    if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
        return { tsType: 'number', csharpType: 'double' };
    }
    if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
        return { tsType: 'boolean', csharpType: 'bool' };
    }

    // string[]
    if (ts.isArrayTypeNode(typeNode) && typeNode.elementType.kind === ts.SyntaxKind.StringKeyword) {
        return { tsType: 'string[]', csharpType: 'string[]' };
    }

    // Array<string>
    if (
        ts.isTypeReferenceNode(typeNode) &&
        ts.isIdentifier(typeNode.typeName) &&
        typeNode.typeName.text === 'Array' &&
        typeNode.typeArguments?.length === 1 &&
        typeNode.typeArguments[0].kind === ts.SyntaxKind.StringKeyword
    ) {
        return { tsType: 'string[]', csharpType: 'string[]' };
    }

    // String-literal union, e.g. 'a' | 'b' | 'c' — every member must be a
    // string literal (a mixed or non-string-literal union is NOT mapped).
    if (ts.isUnionTypeNode(typeNode) && typeNode.types.length > 0) {
        const allStringLiterals = typeNode.types.every(
            (member) => ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal)
        );
        if (allStringLiterals) {
            return { tsType: 'string', csharpType: 'string' };
        }
    }

    return null;
}

// ---------------------------------------------------------------------------
// Manifest read/write helpers
// ---------------------------------------------------------------------------

export const MANIFEST_SCHEMA_URL = 'https://laughtale.dev/schemas/islands-manifest-v1.json';
export const MANIFEST_SCHEMA_VERSION = 1;
export const MANIFEST_FILE_NAME = 'islands.manifest.g.json';
export const REGISTRY_FILE_NAME = 'registry.generated.ts';

/** Formats a Date as an ISO-8601 UTC timestamp without milliseconds, e.g. "2026-09-14T18:30:00Z". */
export function formatUtcTimestamp(date) {
    return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function createManifest({ islandsRoot, islands, generatedAt = new Date() }) {
    return {
        $schema: MANIFEST_SCHEMA_URL,
        schemaVersion: MANIFEST_SCHEMA_VERSION,
        generatedAtUtc: formatUtcTimestamp(generatedAt),
        islandsRoot,
        islands
    };
}

export function readManifest(manifestPath) {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(raw);
}

export function writeManifest(manifestPath, manifest) {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

/** Normalizes an absolute filesystem path to forward-slash form for import specifiers / metafile comparisons. */
export function toPosixPath(p) {
    return p.split(path.sep).join('/');
}

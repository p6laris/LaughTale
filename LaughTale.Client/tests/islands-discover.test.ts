/**
 * Unit tests for scripts/islands/discover.mjs's extractIsland() — the single
 * most load-bearing function in the island-discovery pipeline (a parallel
 * C# generator task trusts its output verbatim). Tested purely against
 * in-memory source strings; no filesystem or esbuild involved.
 *
 * Convention: an island is "skipped" (LTI011 / LTI012 / LTI014) iff
 * `result.skip === true`. Note this is NOT the same as "any error-severity
 * diagnostic present" — LTI015 is error-severity but does not skip the
 * island (see discover.mjs's SKIP_ISLAND_CODES for why).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractIsland } from '../scripts/islands/discover.mjs';
import { isValidIslandName } from '../scripts/islands/shared.mjs';

describe('extractIsland — valid islands', () => {
    it('extracts required + optional props of every supported type with correct C# type strings', () => {
        const source = `
export interface UserCardProps {
    userName: string;
    avatarUrl?: string;
    age: number;
    isActive?: boolean;
    tags: string[];
    roles?: Array<string>;
    status: 'active' | 'inactive' | 'pending';
    theme?: 'light' | 'dark';
}

export default function UserCard(props: UserCardProps) {
    return null;
}
`;
        const result = extractIsland(source, 'UserCard.tsx', 'UserCard.tsx');

        assert.equal(result.skip, false);
        assert.deepEqual(result.diagnostics, []);
        assert.equal(result.name, 'user-card');
        assert.equal(result.typeName, 'UserCardProps');
        assert.equal(result.scriptKind, 'tsx');
        assert.deepEqual(result.props, [
            { tsName: 'userName', csharpName: 'UserName', tsType: 'string', csharpType: 'string', optional: false },
            { tsName: 'avatarUrl', csharpName: 'AvatarUrl', tsType: 'string', csharpType: 'string?', optional: true },
            { tsName: 'age', csharpName: 'Age', tsType: 'number', csharpType: 'double', optional: false },
            { tsName: 'isActive', csharpName: 'IsActive', tsType: 'boolean', csharpType: 'bool?', optional: true },
            { tsName: 'tags', csharpName: 'Tags', tsType: 'string[]', csharpType: 'string[]', optional: false },
            { tsName: 'roles', csharpName: 'Roles', tsType: 'string[]', csharpType: 'string[]?', optional: true },
            { tsName: 'status', csharpName: 'Status', tsType: 'string', csharpType: 'string', optional: false },
            { tsName: 'theme', csharpName: 'Theme', tsType: 'string', csharpType: 'string?', optional: true }
        ]);
    });

    it('supports a Props type declared as a `type X = { ... }` alias, not just an interface', () => {
        const source = `
export type WidgetProps = {
    label: string;
};

export default function Widget() {}
`;
        const result = extractIsland(source, 'Widget.ts', 'Widget.ts');

        assert.equal(result.skip, false);
        assert.equal(result.scriptKind, 'ts');
        assert.equal(result.typeName, 'WidgetProps');
        assert.deepEqual(result.props, [
            { tsName: 'label', csharpName: 'Label', tsType: 'string', csharpType: 'string', optional: false }
        ]);
        assert.deepEqual(result.diagnostics, []);
    });

    it('treats zero exported *Props types as valid: empty props array, no diagnostic', () => {
        const source = `
export default function Simple() {
    return null;
}
`;
        const result = extractIsland(source, 'Simple.tsx', 'Simple.tsx');

        assert.equal(result.skip, false);
        assert.equal(result.typeName, null);
        assert.deepEqual(result.props, []);
        assert.deepEqual(result.diagnostics, []);
    });

    it('ignores a *Props interface that is not exported (treated the same as zero candidates)', () => {
        const source = `
interface InternalProps {
    foo: string;
}

export default function Internal() {}
`;
        const result = extractIsland(source, 'Internal.tsx', 'Internal.tsx');

        assert.equal(result.skip, false);
        assert.equal(result.typeName, null);
        assert.deepEqual(result.props, []);
        assert.deepEqual(result.diagnostics, []);
    });
});

describe('extractIsland — LTI011 (ambiguous Props types)', () => {
    it('flags two exported *Props types in one file and signals skip', () => {
        const source = `
export interface FooProps { a: string; }
export interface BarProps { b: string; }

export default function Foo() {}
`;
        const result = extractIsland(source, 'Foo.tsx', 'Foo.tsx');

        assert.equal(result.skip, true);
        assert.equal(result.typeName, null);
        assert.deepEqual(result.props, []);
        assert.ok(result.diagnostics.some((d) => d.code === 'LTI011' && d.severity === 'error'));
    });
});

describe('extractIsland — LTI010 (unmappable prop type)', () => {
    it('drops a prop with an unresolvable type but keeps other valid props on the same interface', () => {
        const source = `
export interface WidgetProps {
    title: string;
    data: SomeImportedType;
}

export default function Widget() {}
`;
        const result = extractIsland(source, 'Widget.tsx', 'Widget.tsx');

        assert.equal(result.skip, false);
        assert.deepEqual(result.props, [
            { tsName: 'title', csharpName: 'Title', tsType: 'string', csharpType: 'string', optional: false }
        ]);
        const diagnostic = result.diagnostics.find((d) => d.code === 'LTI010');
        assert.ok(diagnostic, 'expected an LTI010 diagnostic');
        assert.equal(diagnostic.severity, 'warning');
        assert.ok(diagnostic.message.includes('data'));
    });
});

describe('extractIsland — LTI015 (reserved prop name)', () => {
    it('drops a prop colliding with a reserved TagHelper field, but does NOT skip the island', () => {
        const source = `
export interface BadProps {
    class: string;
    label: string;
}

export default function Bad() {}
`;
        const result = extractIsland(source, 'Bad.tsx', 'Bad.tsx');

        // LTI015 is error-severity per spec, but unlike LTI011/012/014 it only
        // drops the one prop — the island itself is still generated.
        assert.equal(result.skip, false);
        assert.deepEqual(result.props, [
            { tsName: 'label', csharpName: 'Label', tsType: 'string', csharpType: 'string', optional: false }
        ]);
        const diagnostic = result.diagnostics.find((d) => d.code === 'LTI015');
        assert.ok(diagnostic, 'expected an LTI015 diagnostic');
        assert.equal(diagnostic.severity, 'error');
        assert.ok(diagnostic.message.includes('class'));
    });

    it('is case-insensitive when matching reserved names', () => {
        const source = `
export interface BadProps {
    Class: string;
    label: string;
}

export default function Bad() {}
`;
        const result = extractIsland(source, 'Bad.tsx', 'Bad.tsx');

        assert.equal(result.skip, false);
        assert.equal(result.props.length, 1);
        assert.equal(result.props[0].tsName, 'label');
        assert.ok(result.diagnostics.some((d) => d.code === 'LTI015'));
    });
});

describe('extractIsland — LTI012 (default export shape)', () => {
    it('accepts a named function declaration as the default export', () => {
        const source = `
export default function Foo() {
    return null;
}
`;
        const result = extractIsland(source, 'Foo.ts', 'Foo.ts');
        assert.equal(result.skip, false);
        assert.deepEqual(result.diagnostics, []);
        assert.equal(result.scriptKind, 'ts');
    });

    it('accepts an anonymous function declaration as the default export', () => {
        const source = `
export default function () {
    return null;
}
`;
        const result = extractIsland(source, 'Anon.tsx', 'Anon.tsx');
        assert.equal(result.skip, false);
        assert.deepEqual(result.diagnostics, []);
    });

    it('rejects an arrow function assigned to a variable then exported (LTI012, skip)', () => {
        const source = `
const Foo = () => {
    return null;
};

export default Foo;
`;
        const result = extractIsland(source, 'Foo.tsx', 'Foo.tsx');
        assert.equal(result.skip, true);
        assert.ok(result.diagnostics.some((d) => d.code === 'LTI012' && d.severity === 'error'));
    });

    it('rejects a bare identifier re-export (LTI012, skip)', () => {
        const source = `
export default SomeOtherExport;
`;
        const result = extractIsland(source, 'Foo.tsx', 'Foo.tsx');
        assert.equal(result.skip, true);
        assert.ok(result.diagnostics.some((d) => d.code === 'LTI012' && d.severity === 'error'));
    });

    it('rejects a class component default export (LTI012, skip)', () => {
        const source = `
export default class Foo {
    render() { return null; }
}
`;
        const result = extractIsland(source, 'Foo.tsx', 'Foo.tsx');
        assert.equal(result.skip, true);
        assert.ok(result.diagnostics.some((d) => d.code === 'LTI012' && d.severity === 'error'));
    });

    it('reports LTI012 when there is no default export at all', () => {
        const source = `
export function Foo() {
    return null;
}
`;
        const result = extractIsland(source, 'Foo.tsx', 'Foo.tsx');
        assert.equal(result.skip, true);
        assert.ok(result.diagnostics.some((d) => d.code === 'LTI012' && d.severity === 'error'));
    });
});

describe('extractIsland — name derivation (LTI014)', () => {
    it('derives a kebab-case name from a nested relative path, joining folder segments with "-"', () => {
        const source = `
export default function UserCard() {
    return null;
}
`;
        const result = extractIsland(source, 'UserCard.tsx', 'Forms/UserCard.tsx');
        assert.equal(result.name, 'forms-user-card');
        assert.equal(result.skip, false);
    });

    /**
     * deriveIslandName is NOT guaranteed to always produce a regex-valid
     * name: a path segment made up entirely of characters outside [a-z0-9]
     * (here, an all-underscore filename) kebab-cases down to the empty
     * string, which fails ISLAND_NAME_REGEX. This is a genuine, reachable
     * failure of the derivation logic (not merely a hypothetical), so this
     * test drives it end-to-end through extractIsland rather than only
     * testing regex validation in isolation.
     */
    it('flags a derived name that fails the kebab-case regex (LTI014) and skips the island', () => {
        const source = `
export default function Placeholder() {
    return null;
}
`;
        const result = extractIsland(source, '___.tsx', '___.tsx');
        assert.equal(result.name, '');
        assert.equal(result.skip, true);
        assert.ok(result.diagnostics.some((d) => d.code === 'LTI014' && d.severity === 'error'));
    });

    it('isValidIslandName (used to implement the LTI014 check) matches the C# IsValidIslandName regex exactly', () => {
        assert.equal(isValidIslandName('user-card'), true);
        assert.equal(isValidIslandName('forms-user-card'), true);
        assert.equal(isValidIslandName('counter-1'), true);
        assert.equal(isValidIslandName(''), false);
        assert.equal(isValidIslandName('User-Card'), false); // uppercase not allowed
        assert.equal(isValidIslandName('user--card'), false); // double dash
        assert.equal(isValidIslandName('-user-card'), false); // leading dash
        assert.equal(isValidIslandName('user-card-'), false); // trailing dash
    });
});

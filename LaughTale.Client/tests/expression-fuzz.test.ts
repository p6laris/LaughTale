/**
 * LaughTale: Directive Expression Parser/Evaluator Property-Based Fuzz Suite
 *
 * Complements expression-sandbox.test.ts's ~40 hand-picked known attack payloads with randomly
 * GENERATED expressions, checked against invariants rather than fixed expected outputs (ROADMAP.v5.md
 * Part I). Deliberately zero new dependency (no fast-check et al.) - a small seeded PRNG plus a
 * generator written directly against the grammar documented in
 * `src/directives/expression/GRAMMAR.md` is enough, and keeps this suite consistent with the rest of
 * the framework's "no dependency for something this small" posture.
 *
 * Every property below is checked over MANY random inputs per run, with the seed logged on the one
 * assertion that would tell you which input failed - re-run with that seed hardcoded to reproduce.
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseExpressionToAst, evaluateAst } from '../src/directives/expression/evaluator.ts';
import { Parser, ParseError } from '../src/directives/expression/parser.ts';

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32) - deterministic across runs unless SEED env var
// is overridden, so a failure is reproducible by hardcoding the logged seed.
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
    return function (): number {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const SEED = Number(process.env.LAUGHTALE_FUZZ_SEED ?? 1337);
const rand = mulberry32(SEED);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const int = (max: number): number => Math.floor(rand() * max);

// ---------------------------------------------------------------------------
// Random expression generator, built directly against GRAMMAR.md's productions.
// Deliberately mixes safe names with every forbidden identifier/property the
// lexer/parser/evaluator blocklists know about, so the generator routinely
// tries to reach them through arbitrary member/index/call nesting - not just
// as a bare top-level identifier the way a hand-written payload list would.
// ---------------------------------------------------------------------------
const SAFE_IDENTIFIERS = ['count', 'user', 'items', 'isActive', 'nested', 'a', 'b', 'x', 'y', 'fn'];
const FORBIDDEN_IDENTIFIERS = [
    'window', 'document', 'globalThis', 'top', 'parent', 'frames', 'self', 'location',
    'localStorage', 'sessionStorage', 'indexedDB', 'cookie', 'eval', 'Function',
    'XMLHttpRequest', 'fetch', 'setTimeout', 'setInterval', 'process', 'require'
];
const FORBIDDEN_PROPERTIES = ['constructor', '__proto__', 'prototype', '__defineGetter__', '__lookupSetter__'];
const ALL_IDENTIFIERS = [...SAFE_IDENTIFIERS, ...FORBIDDEN_IDENTIFIERS];
const ALL_PROPERTIES = ['name', 'value', 'length', 'role', 'inner', ...FORBIDDEN_PROPERTIES];
const BINARY_OPS = ['+', '-', '*', '/', '%', '==', '!=', '===', '!==', '<', '<=', '>', '>=', '&&', '||', '??'];
const UNARY_OPS = ['!', '+', '-', '~', 'typeof'];

function genLiteral(): string {
    return pick([
        String(int(1000)),
        `${int(100)}.${int(100)}`,
        `"${pick(['a', 'hello', ''])}"`,
        "'x'",
        'true',
        'false',
        'null',
        'undefined',
        '`plain template`'
    ]);
}

/** Builds a random expression string up to `depth` levels of nesting. */
function genExpr(depth: number): string {
    if (depth <= 0) {
        return rand() < 0.5 ? genLiteral() : pick(ALL_IDENTIFIERS);
    }

    switch (int(9)) {
        case 0:
            return genLiteral();
        case 1:
            return pick(ALL_IDENTIFIERS);
        case 2: {
            // member/index/call chain off a random base - the main vector for reaching
            // a forbidden name through nesting rather than as a bare identifier.
            let expr = pick(ALL_IDENTIFIERS);
            const chainLength = 1 + int(3);
            for (let i = 0; i < chainLength; i++) {
                switch (int(4)) {
                    case 0: expr = `${expr}.${pick(ALL_PROPERTIES)}`; break;
                    case 1: expr = `${expr}?.${pick(ALL_PROPERTIES)}`; break;
                    case 2: expr = `${expr}[${genExpr(0)}]`; break;
                    case 3: expr = `${expr}(${rand() < 0.5 ? '' : genExpr(depth - 1)})`; break;
                }
            }
            return expr;
        }
        case 3:
            return `(${genExpr(depth - 1)} ${pick(BINARY_OPS)} ${genExpr(depth - 1)})`;
        case 4:
            return `${pick(UNARY_OPS)}${pick(UNARY_OPS) === 'typeof' ? ' ' : ''}${genExpr(depth - 1)}`;
        case 5:
            return `(${genExpr(depth - 1)} ? ${genExpr(depth - 1)} : ${genExpr(depth - 1)})`;
        case 6:
            return `[${genExpr(depth - 1)}, ${genExpr(depth - 1)}]`;
        case 7:
            return `{ ${pick(ALL_PROPERTIES)}: ${genExpr(depth - 1)} }`;
        default:
            return `(${genExpr(depth - 1)})`;
    }
}

const ITERATIONS = 500;
const MAX_DEPTH = 4;

describe('Directive Expression Parser/Evaluator Fuzz Suite (seed=' + SEED + ')', () => {

    it(`parses or cleanly rejects ${ITERATIONS} random syntactically-intended expressions (never throws a non-Error, never hangs)`, () => {
        for (let i = 0; i < ITERATIONS; i++) {
            const src = genExpr(MAX_DEPTH);
            try {
                parseExpressionToAst(src);
            } catch (err) {
                assert.ok(
                    err instanceof Error,
                    `Iteration ${i} (seed ${SEED}): parser threw a non-Error for input: ${JSON.stringify(src)} -> ${String(err)}`
                );
            }
        }
    });

    it(`never resolves a forbidden identifier/property to its real value, across ${ITERATIONS} randomly nested expressions`, () => {
        // Deliberately puts REAL dangerous references directly under their forbidden names in scope,
        // so the check is meaningful: if the evaluator's name-based blocklist ever had a gap, this
        // would surface it by exposing the real globalThis/eval/Function/a real "secret" value.
        const secret = { cookie: 'super-secret-session-token' };
        const dangerousScope: Record<string, any> = {
            window: globalThis,
            document: secret,
            globalThis,
            top: globalThis,
            eval,
            Function,
            fetch: () => { throw new Error('fetch should never be reachable'); },
            constructor: secret,
            __proto__: secret,
            // safe values the generator also references, so most generated expressions are
            // meaningful rather than immediately bottoming out to `undefined`
            count: 42,
            user: { name: 'Alice', role: 'admin' },
            items: [1, 2, 3],
            isActive: true,
            nested: { inner: { value: 100 } },
            a: 1, b: 2, x: 3, y: 4,
            fn: (v: any) => v
        };

        for (let i = 0; i < ITERATIONS; i++) {
            const src = genExpr(MAX_DEPTH);
            let result: any;
            try {
                const ast = parseExpressionToAst(src);
                if (!ast) continue;
                result = evaluateAst(ast, dangerousScope);
            } catch {
                continue; // a parse/eval error is fine here - only a leaked dangerous value is not
            }

            assert.notStrictEqual(result, globalThis, `Iteration ${i} (seed ${SEED}): "${src}" resolved to globalThis`);
            assert.notStrictEqual(result, eval, `Iteration ${i} (seed ${SEED}): "${src}" resolved to eval`);
            assert.notStrictEqual(result, Function, `Iteration ${i} (seed ${SEED}): "${src}" resolved to Function`);
            assert.notStrictEqual(result, secret, `Iteration ${i} (seed ${SEED}): "${src}" resolved to the guarded secret object`);
            if (result && typeof result === 'object') {
                assert.notStrictEqual(
                    (result as any).cookie,
                    'super-secret-session-token',
                    `Iteration ${i} (seed ${SEED}): "${src}" exposed the guarded cookie value`
                );
            }
        }
    });

    it('parsing the same source string twice is deterministic (structurally identical ASTs)', () => {
        for (let i = 0; i < 200; i++) {
            const src = genExpr(MAX_DEPTH);
            let first: unknown;
            let firstThrew = false;
            try {
                first = Parser.parse(src);
            } catch {
                firstThrew = true;
            }

            let second: unknown;
            let secondThrew = false;
            try {
                second = Parser.parse(src);
            } catch {
                secondThrew = true;
            }

            assert.equal(firstThrew, secondThrew, `Iteration ${i} (seed ${SEED}): "${src}" threw inconsistently across two parses`);
            if (!firstThrew) {
                assert.deepEqual(second, first, `Iteration ${i} (seed ${SEED}): "${src}" produced different ASTs on re-parse`);
            }
        }
    });

    it('deeply nested grouping fails as a catchable stack-overflow Error, not a hang or a native crash', () => {
        const deeplyNested = '('.repeat(50_000) + '1' + ')'.repeat(50_000);
        assert.throws(
            () => Parser.parse(deeplyNested),
            (err: unknown) => err instanceof Error,
            'deeply nested parens should throw a real Error (typically a RangeError), never hang'
        );
    });

    it('random character-level mutations of valid expressions never throw a non-Error or hang', () => {
        const base = [
            'user.name === "Alice" && items.length > 0',
            'isActive ? count + 1 : count - 1',
            '(a + b) * (x - y) / 2',
            'nested.inner.value ?? 0',
            'items[0] + items[1]',
            'fn(a, b, c)'
        ];

        for (let i = 0; i < ITERATIONS; i++) {
            const chars = pick(base).split('');
            const mutations = 1 + int(4);
            for (let m = 0; m < mutations; m++) {
                const idx = int(chars.length);
                switch (int(3)) {
                    case 0: chars.splice(idx, 1); break; // delete
                    case 1: chars.splice(idx, 0, pick('(){}[]"\'.,;+-*/%!?:&|='.split(''))); break; // insert
                    case 2: chars[idx] = pick('(){}[]"\'.,;+-*/%!?:&|='.split('')); break; // swap
                }
            }
            const mutated = chars.join('');

            try {
                parseExpressionToAst(mutated);
            } catch (err) {
                assert.ok(
                    err instanceof Error,
                    `Iteration ${i} (seed ${SEED}): mutated input threw a non-Error: ${JSON.stringify(mutated)} -> ${String(err)}`
                );
            }
        }
    });

    it('ParseError instances are real Error subclasses carrying a position', () => {
        assert.throws(() => Parser.parse('a +'), (err: unknown) => {
            assert.ok(err instanceof ParseError);
            assert.ok(err instanceof Error);
            assert.equal(typeof err.pos, 'number');
            return true;
        });
    });
});

/**
 * LaughTale: Directive Expression Evaluator
 * Tree-walking AST interpreter ensuring total isolation and zero global scope leakage.
 */

import { ASTNode, IdentifierNode, MemberExpressionNode, IndexExpressionNode } from './ast';
import { Parser } from './parser';

const FORBIDDEN_PROPERTIES = new Set([
    'constructor',
    '__proto__',
    'prototype',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__'
]);

const FORBIDDEN_IDENTIFIERS = new Set([
    'window',
    'document',
    'globalThis',
    'top',
    'parent',
    'frames',
    'self',
    'location',
    'localStorage',
    'sessionStorage',
    'indexedDB',
    'cookie',
    'eval',
    'Function',
    'XMLHttpRequest',
    'fetch',
    'setTimeout',
    'setInterval',
    'setImmediate',
    'clearTimeout',
    'clearInterval',
    'clearImmediate',
    'process',
    'require',
    'importScripts'
]);

const SAFE_BUILTINS: Record<string, any> = {
    Math: Object.freeze(Math),
    Number: Object.freeze(Number),
    String: Object.freeze(String),
    Boolean: Object.freeze(Boolean),
    Date: Object.freeze(Date),
    Array: Object.freeze(Array),
    Object: Object.freeze(Object),
    JSON: Object.freeze(JSON),
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite,
    encodeURI: encodeURI,
    encodeURIComponent: encodeURIComponent,
    decodeURI: decodeURI,
    decodeURIComponent: decodeURIComponent
};

const astCache = new Map<string, ASTNode>();
const MAX_CACHE_SIZE = 500;

export function parseExpressionToAst(expr: string): ASTNode | null {
    const trimmed = expr.trim();
    if (!trimmed) return null;

    let ast = astCache.get(trimmed);
    if (!ast) {
        ast = Parser.parse(trimmed);
        if (astCache.size >= MAX_CACHE_SIZE) {
            const firstKey = astCache.keys().next().value;
            if (firstKey) astCache.delete(firstKey);
        }
        astCache.set(trimmed, ast);
    }
    return ast;
}

export function evaluateAst(ast: ASTNode, state: Record<string, any>, extraContext: Record<string, any> = {}): any {
    switch (ast.type) {
        case 'Literal':
            return ast.value;

        case 'Identifier': {
            const name = ast.name;
            if (FORBIDDEN_PROPERTIES.has(name) || FORBIDDEN_IDENTIFIERS.has(name)) {
                console.warn(`[LaughTale Security] Blocked access to forbidden identifier: "${name}"`);
                return undefined;
            }
            if (extraContext && Object.prototype.hasOwnProperty.call(extraContext, name)) {
                return extraContext[name];
            }
            if (state && Object.prototype.hasOwnProperty.call(state, name)) {
                return state[name];
            }
            if (state && name in state && !FORBIDDEN_PROPERTIES.has(name)) {
                return state[name];
            }
            if (Object.prototype.hasOwnProperty.call(SAFE_BUILTINS, name)) {
                return SAFE_BUILTINS[name];
            }
            return undefined;
        }

        case 'UnaryExpression': {
            const val = evaluateAst(ast.argument, state, extraContext);
            switch (ast.operator) {
                case '!': return !val;
                case '+': return +val;
                case '-': return -val;
                case '~': return ~val;
                case 'typeof': return typeof val;
                default: return undefined;
            }
        }

        case 'BinaryExpression': {
            const left = evaluateAst(ast.left, state, extraContext);
            const right = evaluateAst(ast.right, state, extraContext);
            switch (ast.operator) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                case '%': return left % right;
                case '==': return left == right;
                case '===': return left === right;
                case '!=': return left != right;
                case '!==': return left !== right;
                case '<': return left < right;
                case '<=': return left <= right;
                case '>': return left > right;
                case '>=': return left >= right;
                case 'in': return (typeof right === 'object' && right !== null) ? left in right : false;
                case 'instanceof': return (typeof right === 'function') ? left instanceof right : false;
                default: return undefined;
            }
        }

        case 'LogicalExpression': {
            const left = evaluateAst(ast.left, state, extraContext);
            switch (ast.operator) {
                case '&&':
                    return left ? evaluateAst(ast.right, state, extraContext) : left;
                case '||':
                    return left ? left : evaluateAst(ast.right, state, extraContext);
                case '??':
                    return (left !== null && left !== undefined) ? left : evaluateAst(ast.right, state, extraContext);
                default:
                    return undefined;
            }
        }

        case 'ConditionalExpression': {
            const test = evaluateAst(ast.test, state, extraContext);
            return test
                ? evaluateAst(ast.consequent, state, extraContext)
                : evaluateAst(ast.alternate, state, extraContext);
        }

        case 'MemberExpression': {
            const obj = evaluateAst(ast.object, state, extraContext);
            if (obj == null) {
                return undefined;
            }
            const prop = ast.property;
            if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
                console.warn(`[LaughTale Security] Blocked access to restricted property: "${prop}"`);
                return undefined;
            }
            return obj[prop];
        }

        case 'IndexExpression': {
            const obj = evaluateAst(ast.object, state, extraContext);
            if (obj == null) {
                return undefined;
            }
            const idx = evaluateAst(ast.index, state, extraContext);
            const prop = String(idx);
            if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
                console.warn(`[LaughTale Security] Blocked access to restricted property: "${prop}"`);
                return undefined;
            }
            return obj[idx];
        }

        case 'CallExpression': {
            let fn: any;
            let thisArg: any = state;

            if (ast.callee.type === 'MemberExpression') {
                const obj = evaluateAst(ast.callee.object, state, extraContext);
                if (obj == null) return undefined;
                const prop = ast.callee.property;
                if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
                    console.warn(`[LaughTale Security] Blocked call to restricted property: "${prop}"`);
                    return undefined;
                }
                fn = obj[prop];
                thisArg = obj;
            } else if (ast.callee.type === 'IndexExpression') {
                const obj = evaluateAst(ast.callee.object, state, extraContext);
                if (obj == null) return undefined;
                const idx = evaluateAst(ast.callee.index, state, extraContext);
                const prop = String(idx);
                if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
                    console.warn(`[LaughTale Security] Blocked call to restricted property: "${prop}"`);
                    return undefined;
                }
                fn = obj[idx];
                thisArg = obj;
            } else {
                fn = evaluateAst(ast.callee, state, extraContext);
            }

            if (typeof fn !== 'function') {
                return undefined;
            }

            // Security guard: never allow executing Function constructor or eval
            if (fn === Function || (typeof eval !== 'undefined' && fn === eval)) {
                console.warn('[LaughTale Security] Blocked execution of dynamic Function/eval constructor');
                return undefined;
            }

            const args = ast.args.map(arg => evaluateAst(arg, state, extraContext));
            return fn.apply(thisArg, args);
        }

        case 'ArrayLiteral':
            return ast.elements.map(el => evaluateAst(el, state, extraContext));

        case 'ObjectLiteral': {
            const obj: Record<string, any> = {};
            for (const prop of ast.properties) {
                if (FORBIDDEN_PROPERTIES.has(prop.key)) {
                    console.warn(`[LaughTale Security] Blocked object literal key: "${prop.key}"`);
                    continue;
                }
                obj[prop.key] = evaluateAst(prop.value, state, extraContext);
            }
            return obj;
        }

        case 'TemplateLiteral': {
            return ast.quasis.join('');
        }

        case 'AssignmentExpression': {
            const val = evaluateAst(ast.right, state, extraContext);
            return applyAssignment(ast.left, ast.operator, val, state, extraContext);
        }

        case 'UpdateExpression': {
            return applyUpdate(ast.argument, ast.operator, ast.prefix, state, extraContext);
        }

        case 'SequenceExpression': {
            let result: any = undefined;
            for (const expr of ast.expressions) {
                result = evaluateAst(expr, state, extraContext);
            }
            return result;
        }

        default:
            return undefined;
    }
}

function applyAssignment(
    target: IdentifierNode | MemberExpressionNode | IndexExpressionNode,
    operator: string,
    value: any,
    state: Record<string, any>,
    extraContext: Record<string, any>
): any {
    if (target.type === 'Identifier') {
        const name = target.name;
        if (FORBIDDEN_PROPERTIES.has(name) || FORBIDDEN_IDENTIFIERS.has(name)) {
            console.warn(`[LaughTale Security] Blocked assignment to restricted identifier: "${name}"`);
            return undefined;
        }

        const targetObj = (extraContext && name in extraContext) ? extraContext : state;
        const current = targetObj[name];
        let next = value;

        if (operator === '+=') next = current + value;
        else if (operator === '-=') next = current - value;
        else if (operator === '*=') next = current * value;
        else if (operator === '/=') next = current / value;

        targetObj[name] = next;
        return next;
    }

    if (target.type === 'MemberExpression') {
        const obj = evaluateAst(target.object, state, extraContext);
        if (obj == null) return undefined;
        const prop = target.property;
        if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
            console.warn(`[LaughTale Security] Blocked assignment to restricted property: "${prop}"`);
            return undefined;
        }

        const current = obj[prop];
        let next = value;
        if (operator === '+=') next = current + value;
        else if (operator === '-=') next = current - value;
        else if (operator === '*=') next = current * value;
        else if (operator === '/=') next = current / value;

        obj[prop] = next;
        return next;
    }

    if (target.type === 'IndexExpression') {
        const obj = evaluateAst(target.object, state, extraContext);
        if (obj == null) return undefined;
        const idx = evaluateAst(target.index, state, extraContext);
        const prop = String(idx);
        if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
            console.warn(`[LaughTale Security] Blocked assignment to restricted property: "${prop}"`);
            return undefined;
        }

        const current = obj[idx];
        let next = value;
        if (operator === '+=') next = current + value;
        else if (operator === '-=') next = current - value;
        else if (operator === '*=') next = current * value;
        else if (operator === '/=') next = current / value;

        obj[idx] = next;
        return next;
    }

    return undefined;
}

function applyUpdate(
    target: IdentifierNode | MemberExpressionNode | IndexExpressionNode,
    operator: '++' | '--',
    prefix: boolean,
    state: Record<string, any>,
    extraContext: Record<string, any>
): any {
    const delta = operator === '++' ? 1 : -1;

    if (target.type === 'Identifier') {
        const name = target.name;
        if (FORBIDDEN_PROPERTIES.has(name) || FORBIDDEN_IDENTIFIERS.has(name)) {
            return undefined;
        }
        const targetObj = (extraContext && name in extraContext) ? extraContext : state;
        const oldVal = Number(targetObj[name] ?? 0);
        const newVal = oldVal + delta;
        targetObj[name] = newVal;
        return prefix ? newVal : oldVal;
    }

    if (target.type === 'MemberExpression') {
        const obj = evaluateAst(target.object, state, extraContext);
        if (obj == null) return undefined;
        const prop = target.property;
        if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
            return undefined;
        }
        const oldVal = Number(obj[prop] ?? 0);
        const newVal = oldVal + delta;
        obj[prop] = newVal;
        return prefix ? newVal : oldVal;
    }

    if (target.type === 'IndexExpression') {
        const obj = evaluateAst(target.object, state, extraContext);
        if (obj == null) return undefined;
        const idx = evaluateAst(target.index, state, extraContext);
        const prop = String(idx);
        if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
            return undefined;
        }
        const oldVal = Number(obj[idx] ?? 0);
        const newVal = oldVal + delta;
        obj[idx] = newVal;
        return prefix ? newVal : oldVal;
    }

    return undefined;
}

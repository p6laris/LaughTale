import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderSkeleton, renderEmptyState, renderErrorState } from '../../src/runtime/states.ts';

describe('Component State Convention & Presentation Suite', () => {
    it('renderSkeleton: produces accessible pulse loader with correct lines', () => {
        const html = renderSkeleton({ lines: 3, height: '2rem' });
        assert.ok(html.includes('role="status"'));
        assert.ok(html.includes('aria-busy="true"'));
        assert.ok(html.includes('height: 2rem'));
        assert.equal((html.match(/lt-skeleton-line/g) || []).length, 3);
    });

    it('renderEmptyState: generates semantic empty prompt', () => {
        const html = renderEmptyState({ message: 'No items in the catalogue', icon: '<svg>icon</svg>' });
        assert.ok(html.includes('role="status"'));
        assert.ok(html.includes('No items in the catalogue'));
        assert.ok(html.includes('<svg>icon</svg>'));
    });

    it('renderErrorState: generates alert container with danger styling', () => {
        const html = renderErrorState({ message: 'Failed to fetch inventory from server' });
        assert.ok(html.includes('role="alert"'));
        assert.ok(html.includes('Failed to fetch inventory from server'));
        assert.ok(html.includes('var(--lt-danger-bg'));
    });
});

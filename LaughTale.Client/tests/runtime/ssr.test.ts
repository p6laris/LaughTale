import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hasSsrContent, getSsrRoot, markSsrHydrated, SSR_ATTR, SSR_HYDRATED_ATTR } from '../../src/runtime/ssr.ts';

describe('SSR Progressive Enhancement & Detection Suite', () => {
    it('detects SSR content on container with data-lt-ssr attribute', () => {
        const container = document.createElement('div');
        container.setAttribute(SSR_ATTR, 'true');

        assert.equal(hasSsrContent(container), true);
        assert.equal(getSsrRoot(container), container);
    });

    it('detects SSR content on child element with data-lt-ssr attribute', () => {
        const container = document.createElement('div');
        const child = document.createElement('table');
        child.setAttribute(SSR_ATTR, 'true');
        container.appendChild(child);

        assert.equal(hasSsrContent(container), true);
        assert.equal(getSsrRoot(container), child);
    });

    it('returns false for container without SSR markup', () => {
        const container = document.createElement('div');
        assert.equal(hasSsrContent(container), false);
        assert.equal(getSsrRoot(container), null);
    });

    it('marks SSR container as hydrated', () => {
        const container = document.createElement('div');
        const child = document.createElement('div');
        child.setAttribute(SSR_ATTR, 'true');
        container.appendChild(child);

        markSsrHydrated(container);
        assert.equal(container.getAttribute(SSR_HYDRATED_ATTR), 'true');
        assert.equal(child.getAttribute(SSR_HYDRATED_ATTR), 'true');
    });
});

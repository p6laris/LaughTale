import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { injectIslandStyle, clearAllIslandStyles } from '../../src/runtime/styles.ts';

describe('Browser Support & Compatibility Fallbacks Suite (LT-905)', () => {
    beforeEach(() => {
        clearRegistry();
        clearAllIslandStyles();
        document.body.innerHTML = '';
    });

    it('injectIslandStyle falls back to <style> tag injection when adoptedStyleSheets is absent', () => {
        injectIslandStyle('legacy-widget', '.legacy-widget { color: red; }');

        const styleEl = document.querySelector('style[data-island-style="legacy-widget"]') ||
                        document.querySelector('#laughtale-style-legacy-widget') ||
                        document.querySelector('style');

        assert.ok(styleEl !== null, 'Style element should be injected into document');
        assert.ok(styleEl?.textContent?.includes('.legacy-widget'));
    });

    it('hydrateIsland with strategy="idle" executes via fallback timer', async () => {
        let mounted = false;
        defineIsland('idle-fallback', async () => {
            return {
                default: () => {
                    mounted = true;
                }
            };
        });

        const container = document.createElement('div');
        container.setAttribute('data-island', 'idle-fallback');
        container.setAttribute('data-hydrate', 'idle');
        document.body.appendChild(container);

        hydrateIsland(container);

        // Allow fallback timer (200ms) to fire
        await new Promise(r => setTimeout(r, 250));

        assert.equal(mounted, true, 'Idle island should execute via fallback timer');
    });

    it('hydrateIsland with strategy="visible" executes immediately when IntersectionObserver is not available', async () => {
        let mounted = false;
        defineIsland('visible-fallback', async () => {
            return {
                default: () => {
                    mounted = true;
                }
            };
        });

        const container = document.createElement('div');
        container.setAttribute('data-island', 'visible-fallback');
        container.setAttribute('data-hydrate', 'visible');
        document.body.appendChild(container);

        hydrateIsland(container);

        await new Promise(r => setTimeout(r, 60));

        assert.equal(mounted, true, 'Visible island should mount cleanly');
    });
});

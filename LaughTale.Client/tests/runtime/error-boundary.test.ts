import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { renderErrorBoundary } from '../../src/runtime/error-boundary.ts';

describe('Island Error Boundary & Dev-Mode Overlay Suite (LT-904)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
        (window as any).__LAUGHTALE_DEV__ = true;
    });

    it('activates server-rendered fallback template when hydration fails', async () => {
        defineIsland('failing-chart', async () => {
            return {
                default: () => {
                    throw new Error('WebGL context lost!');
                }
            };
        });

        const container = document.createElement('div');
        container.setAttribute('data-island', 'failing-chart');
        container.setAttribute('data-hydrate', 'load');
        container.innerHTML = `
            <template data-slot="fallback">
                <div class="static-fallback-chart">Static Chart Snapshot</div>
            </template>
        `;
        document.body.appendChild(container);

        hydrateIsland(container);

        // Wait for async execution
        await new Promise(r => setTimeout(r, 50));

        assert.ok(container.innerHTML.includes('Static Chart Snapshot'));
    });

    it('activates data-fallback attribute content when template is omitted', async () => {
        defineIsland('failing-widget', async () => {
            return {
                default: () => {
                    throw new Error('API fetch error');
                }
            };
        });

        const container = document.createElement('div');
        container.setAttribute('data-island', 'failing-widget');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-fallback', '<p>Service temporarily unavailable</p>');
        document.body.appendChild(container);

        hydrateIsland(container);

        await new Promise(r => setTimeout(r, 50));

        assert.ok(container.innerHTML.includes('Service temporarily unavailable'));
    });

    it('renders dev-mode diagnostic overlay with stack trace and retry trigger', () => {
        const container = document.createElement('div');
        container.setAttribute('data-island', 'crash-island');
        document.body.appendChild(container);

        const error = new Error('Explicit render failure');
        renderErrorBoundary(container, 'crash-island', error);

        const overlay = container.querySelector('.laughtale-dev-error-overlay');
        assert.ok(overlay !== null, 'Overlay should be mounted in dev mode');
        assert.ok(overlay?.textContent?.includes('Hydration Error: <crash-island>'));
        assert.ok(overlay?.textContent?.includes('Explicit render failure'));

        const retryButton = overlay?.querySelector('button');
        assert.ok(retryButton !== null, 'Retry button should be present in dev overlay');
    });
});

/**
 * Preact server renderer for the SSR sidecar host. Only ever bundled by the app's own server build,
 * so these static imports resolve to (and get deduped with) the app's single Preact copy.
 */

import { h } from 'preact';
import { renderToString } from 'preact-render-to-string';
import type { SsrComponent } from './host';

export function preactSsrComponent(Component: any): SsrComponent {
    return {
        framework: 'preact',
        render(props: unknown): string {
            const resolved = props !== null && typeof props === 'object' ? props : {};
            return renderToString(h(Component, resolved as any));
        }
    };
}

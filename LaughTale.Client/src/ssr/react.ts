/**
 * React server renderer for the SSR sidecar host. Only ever bundled by the app's own server build,
 * so these static imports resolve to (and get deduped with) the app's single React copy.
 */

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import type { SsrComponent } from './host';

export function reactSsrComponent(Component: any): SsrComponent {
    return {
        framework: 'react',
        render(props: unknown): string {
            const resolved = props !== null && typeof props === 'object' ? props : {};
            return renderToString(createElement(Component, resolved));
        }
    };
}

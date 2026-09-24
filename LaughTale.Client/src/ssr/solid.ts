/**
 * SolidJS server renderer for the SSR sidecar host. Only ever bundled by the app's own server build,
 * so this import resolves to (and gets deduped with) the app's single Solid copy - its server build,
 * which Node's "node" export condition selects.
 *
 * Solid's JSX compiler emits different code for the server and the browser, and hydration needs
 * both sides compiled with `hydratable: true`: the component passed here must come from the server
 * build (`generate: 'ssr'`), and the browser island imports the same file compiled with
 * `generate: 'dom'`.
 */

import { createComponent, renderToString } from 'solid-js/web';
import type { SsrComponent } from './host';

export function solidSsrComponent(Component: any): SsrComponent {
    return {
        framework: 'solid',
        render(props: unknown): string {
            const resolved = props !== null && typeof props === 'object' ? props : {};
            // The same root shape the browser adapter hydrates (a factory returning
            // createComponent(Component, props)), so both sides generate identical data-hk keys.
            return renderToString(() => createComponent(Component, resolved as any));
        }
    };
}

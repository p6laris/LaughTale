/**
 * Svelte 5 server renderer for the SSR sidecar host. Only ever bundled by the app's own server build,
 * so this import resolves to (and gets deduped with) the app's single Svelte copy.
 *
 * Svelte compiles each component differently for the server and the browser, so the component
 * passed here must come from the server build (`generate: 'server'`); the browser island imports
 * the same .svelte file compiled with `generate: 'client'`.
 */

import { render } from 'svelte/server';
import type { SsrComponent } from './host';

export function svelteSsrComponent(Component: any): SsrComponent {
    return {
        framework: 'svelte',
        async render(props: unknown): Promise<string> {
            const resolved = props !== null && typeof props === 'object' ? props : {};
            // Awaiting the result also covers components that use Svelte's async rendering. `body`
            // keeps Svelte's <!--[--> hydration markers, which the browser's hydrate() requires;
            // `head` (<svelte:head> content) has nowhere to go inside an island and is dropped.
            const result = await render(Component, { props: resolved as any });
            return result.body;
        }
    };
}

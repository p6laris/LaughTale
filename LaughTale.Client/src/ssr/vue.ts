/**
 * Vue server renderer for the SSR sidecar host. Only ever bundled by the app's own server build,
 * so these imports resolve to (and get deduped with) the app's single Vue copy.
 */

import type { SsrComponent } from './host';

export function vueSsrComponent(Component: any): SsrComponent {
    return {
        framework: 'vue',
        async render(props: unknown): Promise<string> {
            // Loaded on first render, not at import time: Vue's runtime-dom captures the global
            // `document` when it first evaluates, so evaluating it as a side effect of importing this
            // module could pin a missing document for code in the same process that later mounts Vue
            // against a DOM (tests using happy-dom do exactly that).
            const { createSSRApp, h } = await import('vue');
            const { renderToString } = await import('vue/server-renderer');
            const resolved = props !== null && typeof props === 'object' ? props : {};
            // The same root shape the browser adapter mounts (a render function returning
            // h(Component, props)), so hydration walks an identical vnode tree. A fresh app per render
            // keeps requests from sharing state.
            const app = createSSRApp({ render: () => h(Component, resolved as any) });
            return renderToString(app);
        }
    };
}

/**
 * Preact / React Adapter for LaughTale
 * Enables full React/Preact JSX components with hooks inside 3 KB footprint.
 */

export interface PreactAdapterOptions {
    hydrate?: boolean;
}

export function createPreactIsland(
    Component: any,
    options: PreactAdapterOptions = {}
) {
    return async (container: HTMLElement, props: any) => {
        try {
            // Dynamic import of preact if available or fallback
            const preactPkg = 'preact';
            const preact: any = await import(/* @vite-ignore */ preactPkg);
            const h = preact.h || preact.default?.h;
            const render = preact.render || preact.default?.render;

            if (render && h) {
                render(h(Component, props), container);
                return () => render(null, container);
            }
        } catch {
            console.warn('[LaughTale] Preact package not found in bundle. Rendering component directly.');
            if (typeof Component === 'function') {
                return Component(container, props);
            }
        }
    };
}

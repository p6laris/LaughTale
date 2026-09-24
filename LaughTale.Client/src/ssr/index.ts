/**
 * LaughTale SSR sidecar library (`laughtale/ssr`). Framework renderers live in their own entry
 * points (`laughtale/ssr/react`, ...) so importing the host never pulls in a framework.
 */

export { startSsrHost } from './host';
export type { SsrComponent, SsrFramework, SsrHost, SsrHostIo } from './host';

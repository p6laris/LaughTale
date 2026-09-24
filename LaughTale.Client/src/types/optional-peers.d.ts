/**
 * Ambient declarations for optional framework peer dependencies.
 *
 * react/react-dom/svelte are resolved only via dynamic `import()` at runtime by the framework
 * adapters (adapters/react.ts, adapters/svelte.ts) - a real consumer installs whichever one it
 * needs, this package's own "zero-dependency core" design never requires them, and every adapter
 * already treats the imported module as `any` (`const React: any = await import('react')`).
 * `react`/`react-dom` don't ship their own .d.ts (confirmed: no `types` field, no .d.ts in either
 * package root) and `@types/react`/`@types/react-dom` are deliberately not installed for the same
 * reason `svelte` itself isn't (ROADMAP.v5.md Part D: no compiler toolchain in this repo to verify
 * a Svelte-specific fix against). Without this, `tsc --noEmit` - and therefore `npm run build`,
 * which gates the production bundle + gzip budget check on it - fails outright, unrelated to
 * anything about the adapters' actual runtime behavior.
 */
declare module 'react';
declare module 'react-dom';
declare module 'react-dom/client';
declare module 'svelte';
declare module 'react-dom/server';

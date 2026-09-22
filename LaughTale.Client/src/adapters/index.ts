/**
 * LaughTale Framework Mount Adapters
 * Provides zero-cost, thin mounting bridges for Vanilla, React, Vue, Svelte, Preact, Web
 * Components, Solid, and Alpine (ROADMAP.v5.md Part D "New adapters").
 */

import { createVanillaIsland } from './vanilla';
import { createReactIsland } from './react';
import { createVueIsland } from './vue';
import { createSvelteIsland } from './svelte';
import { createPreactIsland } from './preact';
import { createWebComponentIsland } from './web-components';
import { createSolidIsland } from './solid';
import { createAlpineIsland } from './alpine';
import { registerAdapter } from './registry';

export * from './vanilla';
export * from './react';
export * from './vue';
export * from './svelte';
export * from './preact';
export * from './web-components';
export * from './solid';
export * from './alpine';
export * from './registry';

// Populate the named adapter registry (ROADMAP.v5.md Part G/L) so plugins/authored islands can
// resolve a framework by name via `getAdapter` / `defineFrameworkIsland` instead of importing an
// adapter file directly. Purely additive: every existing direct `createReactIsland(...)`-style
// call site keeps working completely unchanged.
registerAdapter('react', createReactIsland);
registerAdapter('vue', createVueIsland);
registerAdapter('preact', createPreactIsland);
registerAdapter('svelte', createSvelteIsland);
registerAdapter('vanilla', createVanillaIsland);
registerAdapter('web-components', createWebComponentIsland);
registerAdapter('solid', createSolidIsland);
registerAdapter('alpine', createAlpineIsland);

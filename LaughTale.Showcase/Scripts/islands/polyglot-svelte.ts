import { createSvelteIsland } from '../../../LaughTale.Client/src/adapters/svelte';
import PolyglotSvelte from './svelte/PolyglotSvelte.svelte';

// The component lives in its own .svelte file so the server bundle (Scripts/ssr-entry.ts) can import
// it too - compiled there for the server, here for the browser.
export default createSvelteIsland(PolyglotSvelte);

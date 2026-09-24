import { createVueIsland } from '../../../LaughTale.Client/src/adapters/vue';
import PolyglotVue from './vue/PolyglotVue';

// The raw component lives in its own file so the server bundle (Scripts/ssr-entry.ts) can import it
// without this browser-side island wrapper.
export default createVueIsland(PolyglotVue);

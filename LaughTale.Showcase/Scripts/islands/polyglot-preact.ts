import { createPreactIsland } from '../../../LaughTale.Client/src/adapters/preact';
import PolyglotPreact from './preact/PolyglotPreact';

// The raw component lives in its own file so the server bundle (Scripts/ssr-entry.ts) can import it
// without this browser-side island wrapper.
export default createPreactIsland(PolyglotPreact);

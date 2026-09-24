import { createReactIsland } from '../../../LaughTale.Client/src/index';
import PolyglotReact from './react/PolyglotReact';

// The raw component lives in its own file so the server bundle (Scripts/ssr-entry.ts) can import it
// without this browser-side island wrapper.
export default createReactIsland(PolyglotReact);

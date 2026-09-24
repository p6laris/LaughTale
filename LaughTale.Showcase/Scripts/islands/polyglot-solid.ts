import { createSolidIsland } from '../../../LaughTale.Client/src/adapters/solid';
import PolyglotSolid from './solid/PolyglotSolid';

// The component lives in its own file so the server bundle (Scripts/ssr-entry.ts) can import it
// too - compiled there with Solid's server output, here with its browser output.
export default createSolidIsland(PolyglotSolid);

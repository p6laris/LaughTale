import { startSsrHost } from '../../LaughTale.Client/src/ssr/index';
import { reactSsrComponent } from '../../LaughTale.Client/src/ssr/react';
import { preactSsrComponent } from '../../LaughTale.Client/src/ssr/preact';
import PolyglotReact from './islands/react/PolyglotReact';
import PolyglotPreact from './islands/preact/PolyglotPreact';

// Entry point of the SSR sidecar's server bundle (built to ssr/server-bundle.mjs). The .NET app runs
// this with Node and asks it, over stdin/stdout, to render these islands by name. Keys must match the
// island names used in Razor (<island name="...">); islands not listed here render client-side only.
startSsrHost({
    'polyglot-react': reactSsrComponent(PolyglotReact),
    'polyglot-preact': preactSsrComponent(PolyglotPreact)
});

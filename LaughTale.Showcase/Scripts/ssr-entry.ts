import { startSsrHost } from '../../LaughTale.Client/src/ssr/index';
import { reactSsrComponent } from '../../LaughTale.Client/src/ssr/react';
import { preactSsrComponent } from '../../LaughTale.Client/src/ssr/preact';
import { vueSsrComponent } from '../../LaughTale.Client/src/ssr/vue';
import { svelteSsrComponent } from '../../LaughTale.Client/src/ssr/svelte';
import { solidSsrComponent } from '../../LaughTale.Client/src/ssr/solid';
import PolyglotReact from './islands/react/PolyglotReact';
import PolyglotPreact from './islands/preact/PolyglotPreact';
import PolyglotVue from './islands/vue/PolyglotVue';
import PolyglotSvelte from './islands/svelte/PolyglotSvelte.svelte';
import PolyglotSolid from './islands/solid/PolyglotSolid';

// Entry point of the SSR sidecar's server bundle (built to ssr/server-bundle.mjs). The .NET app runs
// this with Node and asks it, over stdin/stdout, to render these islands by name. Keys must match the
// island names used in Razor (<island name="...">); islands not listed here render client-side only.
startSsrHost({
    'polyglot-react': reactSsrComponent(PolyglotReact),
    'polyglot-preact': preactSsrComponent(PolyglotPreact),
    'polyglot-vue': vueSsrComponent(PolyglotVue),
    'polyglot-svelte': svelteSsrComponent(PolyglotSvelte),
    'polyglot-solid': solidSsrComponent(PolyglotSolid)
});

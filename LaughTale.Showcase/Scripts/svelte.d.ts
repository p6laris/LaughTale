// .svelte files are compiled by esbuild-svelte (see esbuild.config.mjs); TypeScript only needs to
// know they export a component.
declare module '*.svelte' {
    const component: any;
    export default component;
}

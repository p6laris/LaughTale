using System.Globalization;
using Microsoft.AspNetCore.Localization;
using LaughTale.Core.Assets;
using LaughTale.Core.Caching;
using LaughTale.Core.Configuration;
using LaughTale.Core.Endpoints;
using LaughTale.Core.Extensions;
using LaughTale.Core.Performance;
using LaughTale.Core.Plugins;
using LaughTale.Core.Streaming;
using LaughTale.Showcase.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add Razor Pages and LaughTale framework with Kurdish & global localization
builder.Services.AddRazorPages();
builder.Services.AddLaughTaleCompression();
builder.Services.AddLaughTale(opt =>
{
    opt.Localization.DefaultCulture = "en-US";
    opt.Localization.SupportedCultures = ["en-US", "ku", "ckb", "ar-SA", "es-ES", "fr-FR", "de-DE", "tr-TR"];
    opt.Refresh.AllowUndeclaredIslands = true;

    // ROADMAP.v5.md Part E "Route rules": the /Partials demo has no per-request user state, so it's
    // genuinely safe to let a shared cache serve it briefly - a real example of the config table, not
    // just a unit-tested-in-isolation feature.
    opt.RouteRules.AddRule("/Partials", "public, max-age=60");
});

// ROADMAP.v5.md Part F "Typed config & sessions": AdminApiKey stays server-only; PublicApiBaseUrl and
// FeatureFlagName ([ClientExposed]) are dehydrated into ctx.state('config') on every request.
builder.Services.AddLaughTaleTypedConfig<ShowcaseAppConfig>(builder.Configuration.GetSection("ShowcaseApp"));

// ROADMAP.v5.md Part F "Cache tags & live invalidation" / "Incremental regeneration": a NAMED policy
// (not the global base policy) so only /CacheTagsDemo opts in - RespectNoStorePolicy is chained since
// this policy caches more than one known-always-public route class, matching this feature's own
// safety requirement (see RespectNoStorePolicy's doc comment).
builder.Services.AddLaughTaleOutputCache(options =>
{
    options.AddPolicy("laughtale-demo", b => b
        .Expire(TimeSpan.FromSeconds(15))
        .AddPolicy(typeof(RespectNoStorePolicy)));
});

// ROADMAP.v5.md Part G/L "Validation: Cache tags" - the second of the two deferred validation
// plugins. Auto-tags a cached response with island:<name> for every island it rendered, using only
// the public LaughTalePlugin API. See /PluginCacheTagsDemo for the live proof (no HttpContext.Tag(...)
// call anywhere on that page, unlike /CacheTagsDemo's own hand-written Part F version).
builder.Services.AddLaughTalePlugin(new IslandCacheTagsPlugin());

// ROADMAP.v5.md Part B "Asset pipeline" (integrity manifest): enables lt-integrity on <script>/<link>.
builder.Services.AddLaughTaleAssetIntegrity();

// ROADMAP.v5.md Part H "image optimization": enables lt-optimize on <img> (auto width/height,
// default lazy loading). See /ImageOptimizationDemo.
builder.Services.AddLaughTaleImageOptimization();

// ROADMAP.v5.md Part H "Deployment presets": a real health endpoint, not a stub - every target this
// preset covers (Azure App Service, a container orchestrator, an IIS/ARR front end) wants one to
// probe. Deliberately unauthenticated/uncached (no antiforgery, no [IslandPrivate] on the path) so an
// external prober never gets tangled in this app's own auth or output-cache policies.
builder.Services.AddHealthChecks();

var supportedCultures = new[]
{
    new CultureInfo("en-US"),
    new CultureInfo("ku"),
    new CultureInfo("ckb"),
    new CultureInfo("ar-SA"),
    new CultureInfo("es-ES"),
    new CultureInfo("fr-FR"),
    new CultureInfo("de-DE"),
    new CultureInfo("tr-TR")
};

var localizationOptions = new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en-US"),
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures
};

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
// ROADMAP.v5.md Part G/L: fans OnResponseStartingAsync out to every registered LaughTalePlugin
// (IslandCacheTagsPlugin above). Registered early, before UseRouting(), per the middleware's own
// doc comment - a real gap this pass found: nothing had ever actually wired this into an app's
// pipeline before, so OnResponseStartingAsync had never run outside a unit test.
app.UseLaughTalePlugins();
app.UseResponseCompression();
app.UseLaughTaleStaticAssetsCaching();
app.UseLaughTaleRouteRules();
app.UseLaughTaleTypedConfig();
// ROADMAP.v5.md Part E "Out-of-order streaming": registered AFTER UseResponseCompression so this
// middleware's own late-fragment writes stay nested inside compression's still-active stream wrapper
// for the whole request lifecycle, instead of writing raw bytes after compression already finalized -
// GZip/Brotli streams support incremental FlushAsync, so a real browser negotiating gzip/brotli still
// gets a single, correctly-compressed streamed response, shell and fragments alike.
app.UseLaughTaleOutOfOrderStreaming();
app.UseStaticFiles();

app.UseRequestLocalization(localizationOptions);

app.UseRouting();

app.UseLaughTaleOutputCache();

app.MapHealthChecks("/healthz");
// ROADMAP.v5.md Part H "instrumentation hook": accepts client-reported hydration timing and turns it
// into an island.hydrate Activity under LaughTaleActivitySource, alongside every island.render span
// IslandTagHelperBase already creates server-side.
app.MapLaughTaleIslandTelemetry();
// ROADMAP.v5.md Part J "Report Core Web Vitals": accepts client-reported LCP/CLS/INP, unblocked now
// that the instrumentation hook above is real.
app.MapLaughTaleWebVitals();
app.MapRazorPages();

app.Run();

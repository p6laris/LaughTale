using System.Globalization;
using Microsoft.AspNetCore.Localization;
using LaughTale.Core.Extensions;
using LaughTale.Core.Performance;
using LaughTale.Core.Streaming;

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
app.UseResponseCompression();
app.UseLaughTaleStaticAssetsCaching();
app.UseLaughTaleRouteRules();
// ROADMAP.v5.md Part E "Out-of-order streaming": registered AFTER UseResponseCompression so this
// middleware's own late-fragment writes stay nested inside compression's still-active stream wrapper
// for the whole request lifecycle, instead of writing raw bytes after compression already finalized -
// GZip/Brotli streams support incremental FlushAsync, so a real browser negotiating gzip/brotli still
// gets a single, correctly-compressed streamed response, shell and fragments alike.
app.UseLaughTaleOutOfOrderStreaming();
app.UseStaticFiles();

app.UseRequestLocalization(localizationOptions);

app.UseRouting();

app.MapRazorPages();

app.Run();

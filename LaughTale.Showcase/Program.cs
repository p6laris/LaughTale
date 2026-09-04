using System.Globalization;
using Microsoft.AspNetCore.Localization;
using LaughTale.Core.Extensions;
using LaughTale.Core.Performance;

var builder = WebApplication.CreateBuilder(args);

// Add Razor Pages and LaughTale framework with Kurdish & global localization
builder.Services.AddRazorPages();
builder.Services.AddLaughTaleCompression();
builder.Services.AddLaughTale(opt =>
{
    opt.Localization.DefaultCulture = "en-US";
    opt.Localization.SupportedCultures = ["en-US", "ku", "ckb", "ar-SA", "es-ES", "fr-FR", "de-DE", "tr-TR"];
    opt.Refresh.AllowUndeclaredIslands = true;
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
app.UseStaticFiles();

app.UseRequestLocalization(localizationOptions);

app.UseRouting();

app.MapRazorPages();

app.Run();

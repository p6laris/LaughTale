using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Configuration;
using LaughTale.Core.Extensions;
using LaughTale.Core.Localization;
using LaughTale.Components.Extensions;
using LaughTale.Components.Localization;
using Xunit;

namespace LaughTale.Tests;

/// <summary>
/// Exercises LaughTale.Core's generic localization mechanism (ILaughTaleLocalizer,
/// LaughTaleLocalizationOptions) in isolation, using a fake built-in locale registered directly
/// via AddBuiltInLocale rather than depending on any concrete/typed locale-pack shape.
/// </summary>
public class LocalizationTests
{
    [Fact]
    public void Localizer_ResolvesEnglishByDefault()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTaleComponents();
        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();
        var enCulture = CultureInfo.GetCultureInfo("en-US");

        Assert.Equal("Today", localizer.GetString("today", enCulture));
        Assert.Equal("Clear", localizer.GetString("clear", enCulture));
        Assert.Equal("No results found", localizer.GetString("emptyFilterMessage", enCulture));
        Assert.False(localizer.IsRightToLeft(enCulture));
    }

    [Fact]
    public void Localizer_ResolvesArabicAndDetectsRTL()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTaleComponents();
        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();
        var arCulture = CultureInfo.GetCultureInfo("ar-SA");

        Assert.Equal("اليوم", localizer.GetString("today", arCulture));
        Assert.Equal("مسح", localizer.GetString("clear", arCulture));
        Assert.Equal("لم يتم العثور على نتائج", localizer.GetString("emptyFilterMessage", arCulture));
        Assert.True(localizer.IsRightToLeft(arCulture));
    }

    [Fact]
    public void Localizer_ResolvesKurdishAndDetectsRTL()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTaleComponents();
        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();
        var kuCulture = CultureInfo.GetCultureInfo("ku");

        Assert.Equal("ئەمڕۆ", localizer.GetString("today", kuCulture));
        Assert.Equal("سڕینەوە", localizer.GetString("clear", kuCulture));
        Assert.Equal("هیچ ئەنجامێک نەدۆزرایەوە", localizer.GetString("emptyFilterMessage", kuCulture));
        Assert.True(localizer.IsRightToLeft(kuCulture));
    }

    /// <summary>
    /// Confirms all 10 built-in locale packs (LaughTale.Components.Localization.LaughTaleBuiltInLocales)
    /// are actually seeded into DI once AddLaughTaleComponents() runs, and that each resolves through
    /// the generic ILaughTaleLocalizer surface.
    /// </summary>
    [Fact]
    public void BuiltInLocales_ContainsStandardLanguagesAndResolveThroughLocalizer()
    {
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("en"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("ku"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("ckb"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("ar"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("es"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("fr"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("de"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("tr"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("zh"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("ja"));

        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTaleComponents();
        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();

        foreach (var culture in new[] { "es", "fr", "de", "tr", "zh", "ja" })
        {
            var dict = localizer.GetDictionary(CultureInfo.GetCultureInfo(culture));
            Assert.NotEmpty(dict);
            Assert.True(dict.ContainsKey("today"));
        }
    }

    [Fact]
    public void Localizer_FormatsParameterizedStrings()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTaleComponents();
        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();
        var enCulture = CultureInfo.GetCultureInfo("en-US");
        var arCulture = CultureInfo.GetCultureInfo("ar-SA");

        var enFormatted = localizer.GetString("showingRecordsTemplate", enCulture, 1, 10, 50);
        Assert.Equal("Showing 1 to 10 of 50 entries", enFormatted);

        var arFormatted = localizer.GetString("showingRecordsTemplate", arCulture, 1, 10, 50);
        Assert.Contains("1", arFormatted);
        Assert.Contains("10", arFormatted);
        Assert.Contains("50", arFormatted);
    }

    [Fact]
    public void Localizer_SupportsCustomDictionaryOverrides()
    {
        var services = new ServiceCollection();
        services.AddLaughTale(options =>
        {
            options.Localization.AddLocale("en-GB", dict =>
            {
                dict["today"] = "Present Day";
                dict["customKey"] = "Custom Value";
            });
        });

        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();
        var customCulture = CultureInfo.GetCultureInfo("en-GB");

        Assert.Equal("Present Day", localizer.GetString("today", customCulture));
        Assert.Equal("Custom Value", localizer.GetString("customKey", customCulture));
    }

    /// <summary>
    /// Custom dictionaries (AddLocale) must always win over built-in dictionaries
    /// (AddBuiltInLocale/AddLaughTaleComponents), regardless of DI registration order.
    /// </summary>
    [Fact]
    public void Localizer_CustomDictionaryOverridesBuiltInRegardlessOfOrder()
    {
        var services = new ServiceCollection();
        // Components' built-ins are seeded first here, then a user override — but priority must
        // not depend on this ordering; AddLocale (custom) always outranks AddBuiltInLocale.
        services.AddLaughTaleComponents();
        services.AddLaughTale(options =>
        {
            options.Localization.AddLocale("en", dict =>
            {
                dict["today"] = "Overridden Today";
            });
        });

        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();

        Assert.Equal("Overridden Today", localizer.GetString("today", CultureInfo.GetCultureInfo("en-US")));
    }

    /// <summary>
    /// Exercises the generic built-in-locale registration mechanism (AddBuiltInLocale) directly,
    /// without depending on LaughTale.Components' concrete locale packs at all — this is the
    /// Core-only mechanism test called out by the roadmap: Core must support built-in-style
    /// registration purely in terms of plain string dictionaries.
    /// </summary>
    [Fact]
    public void Localizer_ResolvesFakeBuiltInLocaleRegisteredDirectlyAgainstCore()
    {
        var services = new ServiceCollection();
        services.AddLaughTale(options =>
        {
            options.Localization.AddBuiltInLocale("fr-FAKE", dict =>
            {
                dict["today"] = "Aujourd'hui (fake)";
                dict["dir"] = "ltr";
            });
        });

        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();
        var fakeCulture = CultureInfo.GetCultureInfo("fr-FAKE");

        Assert.Equal("Aujourd'hui (fake)", localizer.GetString("today", fakeCulture));
        Assert.False(localizer.IsRightToLeft(fakeCulture));

        var dict = localizer.GetDictionary(fakeCulture);
        Assert.IsAssignableFrom<IReadOnlyDictionary<string, string>>(dict);
    }

    [Fact]
    public void Localizer_FallbackReturnsKeyWhenNotFound()
    {
        var localizer = new LaughTaleLocalizer();
        var result = localizer.GetString("nonExistentKey_12345");
        Assert.Equal("nonExistentKey_12345", result);
    }

    [Fact]
    public void DependencyInjection_RegistersILaughTaleLocalizer()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();

        var sp = services.BuildServiceProvider();
        var localizer = sp.GetService<ILaughTaleLocalizer>();

        Assert.NotNull(localizer);
    }
}

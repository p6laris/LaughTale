using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Configuration;
using LaughTale.Core.Extensions;
using LaughTale.Core.Localization;
using Xunit;

namespace LaughTale.Tests;

public class LocalizationTests
{
    [Fact]
    public void BuiltInLocales_ContainsStandardLanguages()
    {
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("en"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("ar"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("es"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("fr"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("de"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("tr"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("zh"));
        Assert.True(LaughTaleBuiltInLocales.Locales.ContainsKey("ja"));
    }

    [Fact]
    public void Localizer_ResolvesEnglishByDefault()
    {
        var localizer = new LaughTaleLocalizer();
        var enCulture = CultureInfo.GetCultureInfo("en-US");

        Assert.Equal("Today", localizer.GetString("today", enCulture));
        Assert.Equal("Clear", localizer.GetString("clear", enCulture));
        Assert.Equal("No results found", localizer.GetString("emptyFilterMessage", enCulture));
        Assert.False(localizer.IsRightToLeft(enCulture));
    }

    [Fact]
    public void Localizer_ResolvesArabicAndDetectsRTL()
    {
        var localizer = new LaughTaleLocalizer();
        var arCulture = CultureInfo.GetCultureInfo("ar-SA");

        Assert.Equal("اليوم", localizer.GetString("today", arCulture));
        Assert.Equal("مسح", localizer.GetString("clear", arCulture));
        Assert.Equal("لم يتم العثور على نتائج", localizer.GetString("emptyFilterMessage", arCulture));
        Assert.True(localizer.IsRightToLeft(arCulture));
    }

    [Fact]
    public void Localizer_FormatsParameterizedStrings()
    {
        var localizer = new LaughTaleLocalizer();
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
                dict.Today = "Present Day";
                dict["customKey"] = "Custom Value";
            });
        });

        var sp = services.BuildServiceProvider();
        var localizer = sp.GetRequiredService<ILaughTaleLocalizer>();
        var customCulture = CultureInfo.GetCultureInfo("en-GB");

        Assert.Equal("Present Day", localizer.GetString("today", customCulture));
        Assert.Equal("Custom Value", localizer.GetString("customKey", customCulture));
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

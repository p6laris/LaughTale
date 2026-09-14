using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;

namespace LaughTale.Core.Localization;

/// <summary>
/// Default implementation of ILaughTaleLocalizer supporting built-in dictionaries,
/// custom user dictionaries, and ASP.NET Core IStringLocalizer / IHtmlLocalizer integration.
/// Core has no knowledge of any concrete/typed locale-pack shape: it only ever reads and
/// writes plain <see cref="IDictionary{TKey, TValue}"/> maps of translation keys to values.
/// </summary>
public sealed class LaughTaleLocalizer : ILaughTaleLocalizer
{
    private static readonly IReadOnlyDictionary<string, string> EmptyDictionary =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

    private readonly LaughTaleLocalizationOptions _locOptions;
    private readonly IServiceProvider? _serviceProvider;
    private readonly ILogger<LaughTaleLocalizer> _logger;

    public LaughTaleLocalizer(
        IOptions<LaughTaleOptions>? options = null,
        IServiceProvider? serviceProvider = null,
        ILogger<LaughTaleLocalizer>? logger = null)
    {
        _locOptions = options?.Value?.Localization ?? new LaughTaleLocalizationOptions();
        _serviceProvider = serviceProvider;
        _logger = logger ?? NullLogger<LaughTaleLocalizer>.Instance;
    }

    public string this[string key] => GetString(key, CultureInfo.CurrentUICulture);

    public string GetString(string key, params object[] arguments)
    {
        return GetString(key, CultureInfo.CurrentUICulture, arguments);
    }

    public string GetString(string key, CultureInfo? culture, params object[] arguments)
    {
        if (string.IsNullOrWhiteSpace(key)) return string.Empty;

        var targetCulture = culture ?? CultureInfo.CurrentUICulture;

        // 1. Try ASP.NET Core IStringLocalizer if registered
        var stringLocalizerValue = TryLookupStringLocalizer(key, targetCulture);
        if (!string.IsNullOrEmpty(stringLocalizerValue))
        {
            return FormatSafe(stringLocalizerValue, targetCulture, arguments);
        }

        // 2. Lookup in the resolved LaughTale dictionary for this culture
        var dict = GetDictionary(targetCulture);
        if (!dict.TryGetValue(key, out var value) || string.IsNullOrEmpty(value))
        {
            value = key;
        }

        return FormatSafe(value, targetCulture, arguments);
    }

    public IReadOnlyDictionary<string, string> GetDictionary(CultureInfo? culture = null)
    {
        var targetCulture = culture ?? CultureInfo.CurrentUICulture;
        var cultureName = targetCulture.Name; // e.g. "ar-SA"
        var langCode = targetCulture.TwoLetterISOLanguageName; // e.g. "ar"

        // 1. Check custom dictionary by exact culture code
        if (_locOptions.CustomDictionaries.TryGetValue(cultureName, out var customExact))
        {
            return AsReadOnly(customExact);
        }

        // 2. Check custom dictionary by language code
        if (_locOptions.CustomDictionaries.TryGetValue(langCode, out var customLang))
        {
            return AsReadOnly(customLang);
        }

        // 3. Check built-in dictionaries by exact culture code
        if (_locOptions.BuiltInDictionaries.TryGetValue(cultureName, out var builtInExact))
        {
            return AsReadOnly(builtInExact);
        }

        // 4. Check built-in dictionaries by language code
        if (_locOptions.BuiltInDictionaries.TryGetValue(langCode, out var builtInLang))
        {
            return AsReadOnly(builtInLang);
        }

        // 5. Nothing registered for this culture: fall through to an empty map so callers
        //    (GetString/the indexer) fall back to the raw key rather than throwing.
        return EmptyDictionary;
    }

    public bool IsRightToLeft(CultureInfo? culture = null)
    {
        var targetCulture = culture ?? CultureInfo.CurrentUICulture;
        if (targetCulture.TextInfo.IsRightToLeft)
        {
            return true;
        }

        var dict = GetDictionary(targetCulture);
        return dict.TryGetValue("dir", out var dir) && string.Equals(dir, "rtl", StringComparison.OrdinalIgnoreCase);
    }

    private static IReadOnlyDictionary<string, string> AsReadOnly(IDictionary<string, string> dict)
    {
        return dict is IReadOnlyDictionary<string, string> ro ? ro : new Dictionary<string, string>(dict, StringComparer.OrdinalIgnoreCase);
    }

    private string? TryLookupStringLocalizer(string key, CultureInfo culture)
    {
        if (_serviceProvider == null || _locOptions.StringLocalizerResourceSource == null)
            return null;

        try
        {
            var factory = _serviceProvider.GetService<IStringLocalizerFactory>();
            if (factory != null)
            {
                var localizer = factory.Create(_locOptions.StringLocalizerResourceSource);
                var localizedString = localizer[key];
                if (localizedString != null && !localizedString.ResourceNotFound)
                {
                    return localizedString.Value;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogTrace(ex, "Could not resolve IStringLocalizer for key: {Key}", key);
        }

        return null;
    }

    private static string FormatSafe(string format, CultureInfo culture, object[]? arguments)
    {
        if (arguments == null || arguments.Length == 0)
        {
            return format;
        }

        try
        {
            return string.Format(culture, format, arguments);
        }
        catch
        {
            return format;
        }
    }
}

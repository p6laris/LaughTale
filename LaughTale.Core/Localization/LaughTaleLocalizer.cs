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

        // 5. Nothing registered for the ambient/requested culture: fall back to the configured
        //    DefaultCulture's own built-in dictionary (steps 1-4 skip this when targetCulture already
        //    IS the default culture, since that would have matched at step 3/4 already) rather than
        //    giving up to an empty map immediately. This is what actually makes "resolve to sensible
        //    English text... not null/empty, so existing English-speaking apps see no behavior
        //    change" (this class's own stated contract) true regardless of the process's ambient
        //    CultureInfo.CurrentUICulture - which is NOT guaranteed to be "en"/"en-US" just because a
        //    caller never configured localization: a bare Linux environment with no locale
        //    configured (e.g. a fresh CI container) resolves the current UI culture to the invariant
        //    culture, not "en-US", causing every prop default lookup to silently return the raw
        //    dictionary key instead of English text - confirmed the hard way when this was first
        //    exercised in a real CI run rather than only ever run on developer machines with an
        //    en-US OS locale already set. `DefaultCulture` (LaughTaleLocalizationOptions, "en-US" by
        //    default) already existed for exactly this purpose but was never actually consulted here.
        if (!string.IsNullOrEmpty(_locOptions.DefaultCulture))
        {
            try
            {
                // Guarded: under globalization-invariant deployment mode (DOTNET_SYSTEM_GLOBALIZATION_
                // INVARIANT=1, a legitimate, real .NET deployment option this class must not crash
                // under just because it was never configured for), only CultureInfo.InvariantCulture
                // itself can be constructed - "en-US" throws CultureNotFoundException there. That mode
                // isn't a reason to skip this fallback though: BuiltInDictionaries' own key strings
                // ("en-US", "en", ...) can still be looked up directly without ever constructing a
                // CultureInfo for them.
                var defaultCulture = new CultureInfo(_locOptions.DefaultCulture);
                if (_locOptions.BuiltInDictionaries.TryGetValue(defaultCulture.Name, out var builtInDefaultExact))
                {
                    return AsReadOnly(builtInDefaultExact);
                }
                if (_locOptions.BuiltInDictionaries.TryGetValue(defaultCulture.TwoLetterISOLanguageName, out var builtInDefaultLang))
                {
                    return AsReadOnly(builtInDefaultLang);
                }
            }
            catch (CultureNotFoundException)
            {
                // Can't construct a CultureInfo at all here, so derive the language-code prefix by
                // plain string splitting instead ("en-US" -> "en") - built-in dictionaries are
                // registered under the bare 2-letter code (LaughTaleBuiltInLocales), not "en-US".
                if (_locOptions.BuiltInDictionaries.TryGetValue(_locOptions.DefaultCulture, out var builtInDefaultLiteral))
                {
                    return AsReadOnly(builtInDefaultLiteral);
                }
                var prefix = _locOptions.DefaultCulture.Split('-')[0];
                if (_locOptions.BuiltInDictionaries.TryGetValue(prefix, out var builtInDefaultPrefix))
                {
                    return AsReadOnly(builtInDefaultPrefix);
                }
            }
        }

        // 6. Truly nothing registered anywhere (not even the default culture): fall through to an
        //    empty map so callers (GetString/the indexer) fall back to the raw key rather than
        //    throwing.
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

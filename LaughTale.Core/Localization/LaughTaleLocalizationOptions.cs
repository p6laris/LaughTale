using System;
using System.Collections.Generic;

namespace LaughTale.Core.Localization;

/// <summary>
/// Options for configuring LaughTale Internationalization and ASP.NET Core IStringLocalizer integration.
/// </summary>
public sealed class LaughTaleLocalizationOptions
{
    /// <summary>
    /// Gets or sets whether LaughTale localization engine is enabled. Default: true.
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Gets or sets the default fallback culture. Default: "en-US".
    /// </summary>
    public string DefaultCulture { get; set; } = "en-US";

    /// <summary>
    /// Gets or sets the list of supported cultures.
    /// </summary>
    public IList<string> SupportedCultures { get; set; } = new List<string>
    {
        "en-US", "ku", "ckb", "ckb-IQ", "ar-SA", "es-ES", "fr-FR", "de-DE", "tr-TR", "zh-CN", "ja-JP"
    };

    /// <summary>
    /// Optional resource marker type used to resolve ASP.NET Core IStringLocalizer&lt;T&gt;.
    /// </summary>
    public Type? StringLocalizerResourceSource { get; set; }

    /// <summary>
    /// Custom dictionary overrides registered per culture key.
    /// </summary>
    public IDictionary<string, LaughTaleLocaleDictionary> CustomDictionaries { get; set; } =
        new Dictionary<string, LaughTaleLocaleDictionary>(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Registers or configures custom locale dictionary for the specified culture.
    /// </summary>
    public LaughTaleLocalizationOptions AddLocale(string culture, Action<LaughTaleLocaleDictionary> configure)
    {
        if (string.IsNullOrWhiteSpace(culture)) return this;
        if (!CustomDictionaries.TryGetValue(culture, out var dict))
        {
            dict = new LaughTaleLocaleDictionary { Locale = culture };
            CustomDictionaries[culture] = dict;
        }
        configure(dict);
        return this;
    }

    /// <summary>
    /// Registers an ASP.NET Core IStringLocalizer resource type to bridge with LaughTale.
    /// </summary>
    /// <typeparam name="TResource">The resource marker class type.</typeparam>
    public LaughTaleLocalizationOptions UseStringLocalizer<TResource>()
    {
        StringLocalizerResourceSource = typeof(TResource);
        return this;
    }
}

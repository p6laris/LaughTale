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
    /// Custom (end-user-authored) dictionary overrides registered per culture key, as plain
    /// key/value translation maps. Always takes priority over <see cref="BuiltInDictionaries"/>
    /// regardless of DI registration order.
    /// </summary>
    public IDictionary<string, IDictionary<string, string>> CustomDictionaries { get; set; } =
        new Dictionary<string, IDictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Built-in dictionary packs registered per culture key, as plain key/value translation maps.
    /// Populated by packages such as LaughTale.Components' DI registration (e.g. AddLaughTaleComponents)
    /// and always ranked below anything registered via <see cref="AddLocale"/>.
    /// </summary>
    public IDictionary<string, IDictionary<string, string>> BuiltInDictionaries { get; set; } =
        new Dictionary<string, IDictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Registers or configures a custom (end-user) locale dictionary for the specified culture.
    /// Custom dictionaries always take priority over built-in ones.
    /// </summary>
    public LaughTaleLocalizationOptions AddLocale(string culture, Action<IDictionary<string, string>> configure)
    {
        AddLocaleCore(CustomDictionaries, culture, configure);
        return this;
    }

    /// <summary>
    /// Registers or configures a built-in locale dictionary for the specified culture. Intended for
    /// use by component/locale-pack libraries seeding their default vocabulary; always ranked below
    /// anything registered via <see cref="AddLocale"/>.
    /// </summary>
    public LaughTaleLocalizationOptions AddBuiltInLocale(string culture, Action<IDictionary<string, string>> configure)
    {
        AddLocaleCore(BuiltInDictionaries, culture, configure);
        return this;
    }

    private static void AddLocaleCore(
        IDictionary<string, IDictionary<string, string>> dictionaries,
        string culture,
        Action<IDictionary<string, string>> configure)
    {
        if (string.IsNullOrWhiteSpace(culture)) return;
        if (!dictionaries.TryGetValue(culture, out var dict))
        {
            dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            dictionaries[culture] = dict;
        }
        configure(dict);
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

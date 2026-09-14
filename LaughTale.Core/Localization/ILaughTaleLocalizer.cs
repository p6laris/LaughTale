using System.Collections.Generic;
using System.Globalization;

namespace LaughTale.Core.Localization;

/// <summary>
/// Core localization service for LaughTale UI components and runtime islands.
/// Provides culture-aware string lookup, built-in translation dictionaries,
/// and seamless bridge with ASP.NET Core's IStringLocalizer and IHtmlLocalizer.
/// </summary>
public interface ILaughTaleLocalizer
{
    /// <summary>
    /// Gets the localized string for the specified key using CultureInfo.CurrentUICulture.
    /// </summary>
    /// <param name="key">The translation key (e.g. "emptyMessage", "choose", "today").</param>
    /// <returns>The localized string or fallback key.</returns>
    string this[string key] { get; }

    /// <summary>
    /// Gets the formatted localized string for the specified key using CultureInfo.CurrentUICulture.
    /// </summary>
    /// <param name="key">The translation key.</param>
    /// <param name="arguments">Format arguments.</param>
    /// <returns>The formatted localized string.</returns>
    string GetString(string key, params object[] arguments);

    /// <summary>
    /// Gets the formatted localized string for the specified key and explicit culture.
    /// </summary>
    /// <param name="key">The translation key.</param>
    /// <param name="culture">Target culture.</param>
    /// <param name="arguments">Format arguments.</param>
    /// <returns>The formatted localized string.</returns>
    string GetString(string key, CultureInfo? culture, params object[] arguments);

    /// <summary>
    /// Retrieves the complete key/value translation dictionary for the specified culture.
    /// Core has no knowledge of any concrete/typed locale-pack shape — callers that want a
    /// typed authoring surface (e.g. LaughTale.Components' LaughTaleLocaleDictionary) can
    /// flatten it down to this generic shape before registering it.
    /// </summary>
    /// <param name="culture">The target culture, or CultureInfo.CurrentUICulture if null.</param>
    /// <returns>A read-only key/value map of all translations registered for the culture.</returns>
    IReadOnlyDictionary<string, string> GetDictionary(CultureInfo? culture = null);

    /// <summary>
    /// Determines whether the specified culture (or current UI culture) is right-to-left.
    /// </summary>
    /// <param name="culture">The target culture, or CultureInfo.CurrentUICulture if null.</param>
    /// <returns>True if the culture is RTL; otherwise false.</returns>
    bool IsRightToLeft(CultureInfo? culture = null);
}

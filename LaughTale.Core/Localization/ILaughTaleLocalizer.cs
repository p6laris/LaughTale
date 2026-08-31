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
    /// Retrieves the complete client-side locale dictionary for the specified culture.
    /// </summary>
    /// <param name="culture">The target culture, or CultureInfo.CurrentUICulture if null.</param>
    /// <returns>The locale dictionary containing all component translations and date/number settings.</returns>
    LaughTaleLocaleDictionary GetDictionary(CultureInfo? culture = null);

    /// <summary>
    /// Determines whether the specified culture (or current UI culture) is right-to-left.
    /// </summary>
    /// <param name="culture">The target culture, or CultureInfo.CurrentUICulture if null.</param>
    /// <returns>True if the culture is RTL; otherwise false.</returns>
    bool IsRightToLeft(CultureInfo? culture = null);
}

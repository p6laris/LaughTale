using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;

namespace SoftMax.LaughTale.Core.Diagnostics;

/// <summary>
/// Development runtime diagnostic validator for LaughTale Islands.
/// Zero runtime overhead in Production environments.
/// </summary>
public static class IslandDiagnostics
{
    private static readonly Regex KebabCaseRegex = new(@"^[a-z0-9]+(-[a-z0-9]+)*$", RegexOptions.Compiled);

    /// <summary>
    /// Validates island attributes and emits diagnostic warnings in Development mode.
    /// </summary>
    public static void ValidateIsland(
        string islandName,
        HydrateStrategy hydrate,
        string? media,
        bool persist,
        TagHelperOutput output)
    {
        if (!LaughTaleEnvironment.IsDevelopment)
        {
            return;
        }

        // 1. Kebab-case naming check
        if (string.IsNullOrWhiteSpace(islandName) || !KebabCaseRegex.IsMatch(islandName))
        {
            output.Attributes.SetAttribute(
                "data-laughtale-warning-name",
                $"Invalid island name '{islandName}'. Island names must be non-empty lowercase kebab-case (e.g. 'my-widget').");
        }

        // 2. Media attribute check (media query only evaluated when hydrate is Media)
        if (!string.IsNullOrWhiteSpace(media) && hydrate != HydrateStrategy.Media)
        {
            output.Attributes.SetAttribute(
                "data-laughtale-warning-media",
                $"Media query '{media}' was specified but hydrate strategy is '{hydrate}'. The media attribute is only evaluated when hydrate='Media'.");
        }

        // 3. Persist check (persistence requires Load strategy for safe navigation preservation)
        if (persist && hydrate != HydrateStrategy.Load)
        {
            output.Attributes.SetAttribute(
                "data-laughtale-warning-persist",
                $"Persist is enabled with hydrate='{hydrate}'. Persistent islands must use hydrate='Load' to ensure safe state retention across client-side navigation.");
        }
    }
}

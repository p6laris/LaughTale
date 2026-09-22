using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Enums;

namespace LaughTale.Core.Diagnostics;

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
        TagHelperOutput output,
        bool hasNoRenderedContent = false)
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

        // 4. Fallback/SSR-content check (ROADMAP.v5.md Part D "Framework SSR sidecar": LaughTale has
        // no real multi-framework SSR today - a React/Vue/Svelte/Preact/Solid/Alpine/Vanilla island's
        // wrapper div renders genuinely empty unless BuildSsrHtml() is overridden or child markup is
        // provided, since only Razor/hand-authored server content is real here, not a rendered
        // component. That's an acceptable, often DESIRED trade for a deferred strategy (Idle/Visible/
        // Media/Interaction all legitimately expect nothing to show until later - Visible's whole
        // point is "0 KB until scrolled into view"). It's only a real problem for hydrate="Load",
        // which promises the island is critical/above-the-fold - an island claiming that but shipping
        // zero server-rendered content is a real, silent blank-flash bug, not a stylistic choice.
        if (hasNoRenderedContent && hydrate == HydrateStrategy.Load)
        {
            output.Attributes.SetAttribute(
                "data-laughtale-warning-no-fallback",
                $"Island '{islandName}' uses hydrate=\"Load\" (implying critical, above-the-fold content) but rendered no server-side markup - it will show a BLANK gap until its client JS chunk loads and mounts. LaughTale has no true multi-framework SSR (see ROADMAP.v5.md Part D 'Framework SSR sidecar') - override BuildSsrHtml() with real fallback/skeleton markup, provide child content inside the <island> tag, or use a deferred strategy (Idle/Visible/Interaction) if a brief blank gap is actually acceptable.");
        }
    }
}

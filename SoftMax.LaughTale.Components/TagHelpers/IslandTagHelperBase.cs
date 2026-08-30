using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Foundation base class for all LaughTale Aura island TagHelpers.
/// Automatically handles core island metadata (data-island, data-hydrate, data-framework, data-persist, data-media),
/// standard HTML passthrough attributes (class, style, id), and props JSON serialization.
/// </summary>
public abstract class IslandTagHelperBase : TagHelper
{
    /// <summary>
    /// The unique client-side island registration name (e.g. "datatable", "datepicker").
    /// </summary>
    public abstract string IslandName { get; }

    /// <summary>
    /// Hydration lifecycle strategy (Load, Idle, Visible, Media, Interaction, Never). Default is Load.
    /// </summary>
    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    /// <summary>
    /// Client-side framework adapter (Vanilla, Preact, React, Vue, Svelte, Lit). Default is Vanilla.
    /// </summary>
    [HtmlAttributeName("framework")]
    public IslandFramework Framework { get; set; } = IslandFramework.Vanilla;

    /// <summary>
    /// Whether the island DOM subtree persists across client-side SPA navigations.
    /// </summary>
    [HtmlAttributeName("persist")]
    public bool Persist { get; set; } = false;

    /// <summary>
    /// Media query condition used when HydrateStrategy is Media (e.g. "(min-width: 768px)").
    /// </summary>
    [HtmlAttributeName("media")]
    public string? Media { get; set; }

    /// <summary>
    /// CSS class string passed through to the island wrapper container.
    /// </summary>
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    /// <summary>
    /// Inline style string passed through to the island wrapper container.
    /// </summary>
    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    /// <summary>
    /// DOM element id passed through to the island wrapper container.
    /// </summary>
    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    /// <summary>
    /// Builds the component-specific props payload to be serialized into data-props.
    /// Return an anonymous object, record, dictionary, or custom props model.
    /// </summary>
    protected virtual object? BuildProps() => null;

    /// <summary>
    /// Override to customize the wrapper HTML element tag. Default is "div".
    /// </summary>
    protected virtual string WrapperTagName => "div";

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = WrapperTagName;
        output.TagMode = TagMode.StartTagAndEndTag;

        output.Attributes.SetAttribute("data-island", IslandName);
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (Framework != IslandFramework.Vanilla)
        {
            output.Attributes.SetAttribute("data-framework", Framework.ToString().ToLowerInvariant());
        }

        if (Persist)
        {
            output.Attributes.SetAttribute("data-persist", "true");
        }

        if (!string.IsNullOrWhiteSpace(Media))
        {
            output.Attributes.SetAttribute("data-media", Media);
        }

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        if (!string.IsNullOrWhiteSpace(Id))
        {
            output.Attributes.SetAttribute("id", Id);
        }

        var props = BuildProps();
        if (props != null)
        {
            output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        }

        var childContent = await output.GetChildContentAsync();
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent(childContent);
        }
    }
}

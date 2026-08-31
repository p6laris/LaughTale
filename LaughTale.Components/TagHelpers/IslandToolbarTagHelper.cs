using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Enums;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise LaughTale Aura Toolbar container component.
/// </summary>
[HtmlTargetElement("island-toolbar")]
[HtmlTargetElement("p-toolbar")]
public class IslandToolbarTagHelper : TagHelper
{
    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; } = "Actions";

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Visible;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "toolbar");
        output.Attributes.SetAttribute("aria-orientation", "horizontal");
        if (!string.IsNullOrWhiteSpace(AriaLabel))
        {
            output.Attributes.SetAttribute("aria-label", AriaLabel);
        }

        var baseClass = "p-toolbar p-component";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        output.Attributes.SetAttribute("data-island", "toolbar");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        var props = new
        {
            ariaLabel = AriaLabel
        };
        output.Attributes.SetAttribute("data-props", JsonSerializer.Serialize(props));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}

/// <summary>
/// Toolbar start grouping section.
/// </summary>
[HtmlTargetElement("island-toolbar-start")]
[HtmlTargetElement("island-toolbar-group-start")]
[HtmlTargetElement("p-toolbar-start")]
[HtmlTargetElement("p-toolbar-group-start")]
public class IslandToolbarStartTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        var baseClass = "p-toolbar-start p-toolbar-group-start";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}

/// <summary>
/// Toolbar center grouping section.
/// </summary>
[HtmlTargetElement("island-toolbar-center")]
[HtmlTargetElement("island-toolbar-group-center")]
[HtmlTargetElement("p-toolbar-center")]
[HtmlTargetElement("p-toolbar-group-center")]
public class IslandToolbarCenterTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        var baseClass = "p-toolbar-center p-toolbar-group-center";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}

/// <summary>
/// Toolbar end grouping section.
/// </summary>
[HtmlTargetElement("island-toolbar-end")]
[HtmlTargetElement("island-toolbar-group-end")]
[HtmlTargetElement("p-toolbar-end")]
[HtmlTargetElement("p-toolbar-group-end")]
public class IslandToolbarEndTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        var baseClass = "p-toolbar-end p-toolbar-group-end";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}

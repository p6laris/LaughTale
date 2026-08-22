using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;
using System.Threading.Tasks;

namespace SoftMax.LaughTale.Core.TagHelpers;

/// <summary>
/// ASP.NET Core MVC &amp; Razor Pages TagHelper for rendering Islands with multi-framework, slots, and streaming SSR support.
/// </summary>
[HtmlTargetElement("island", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTagHelper : TagHelper
{
    [HtmlAttributeName("name")]
    public string Name { get; set; } = string.Empty;

    [HtmlAttributeName("props")]
    public object? Props { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("framework")]
    public IslandFramework Framework { get; set; } = IslandFramework.Vanilla;

    [HtmlAttributeName("media")]
    public string? Media { get; set; }

    [HtmlAttributeName("persist")]
    public string? Persist { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        output.Attributes.SetAttribute("data-island", Name);
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(Props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (Framework != IslandFramework.Vanilla)
        {
            output.Attributes.SetAttribute("data-framework", Framework.ToString().ToLowerInvariant());
        }

        if (!string.IsNullOrWhiteSpace(Persist))
        {
            output.Attributes.SetAttribute("data-persist", Persist);
        }

        if (!string.IsNullOrWhiteSpace(Media))
        {
            output.Attributes.SetAttribute("data-media", Media);
        }

        if (!string.IsNullOrWhiteSpace(Id))
        {
            output.Attributes.SetAttribute("id", Id);
        }

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        var childContent = await output.GetChildContentAsync();
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent($"<div data-slot=\"default\" class=\"island-slot\">{childContent.GetContent()}</div><!--island:end:{Name}-->");
        }
    }
}

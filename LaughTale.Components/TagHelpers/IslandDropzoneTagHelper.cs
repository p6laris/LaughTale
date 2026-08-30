using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise File Vault Dropzone TagHelper.
/// </summary>
[HtmlTargetElement("island-dropzone", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandDropzoneTagHelper : TagHelper
{
    [HtmlAttributeName("name")]
    public string Name { get; set; } = "file-upload";

    [HtmlAttributeName("max-size-mb")]
    public int MaxSizeMb { get; set; } = 10;

    [HtmlAttributeName("allowed-extensions")]
    public string[] AllowedExtensions { get; set; } = new[] { ".pdf", ".png", ".jpg", ".docx" };

    [HtmlAttributeName("title")]
    public string Title { get; set; } = "Upload Documents";

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Visible;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var props = new
        {
            name = Name,
            maxSizeMb = MaxSizeMb,
            allowedExtensions = AllowedExtensions,
            title = Title
        };

        output.Attributes.SetAttribute("data-island", "dropzone");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}

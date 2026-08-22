using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Searchable Hierarchical TreeSelect TagHelper.
/// </summary>
[HtmlTargetElement("island-tree-select", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTreeSelectTagHelper : TagHelper
{
    [HtmlAttributeName("nodes")]
    public List<TreeNode> Nodes { get; set; } = new();

    [HtmlAttributeName("placeholder")]
    public string Placeholder { get; set; } = "Select item...";

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

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
            nodes = Nodes,
            placeholder = Placeholder,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("data-island", "tree-select");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}

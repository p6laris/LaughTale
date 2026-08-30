using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Models;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Filterable &amp; Sortable Enterprise DataGrid TagHelper.
/// </summary>
[HtmlTargetElement("island-datagrid", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandDataGridTagHelper : TagHelper
{
    [HtmlAttributeName("columns")]
    public List<DataGridCol> Columns { get; set; } = new();

    [HtmlAttributeName("data")]
    public object? Data { get; set; }

    [HtmlAttributeName("page-size")]
    public int PageSize { get; set; } = 5;

    [HtmlAttributeName("title")]
    public string Title { get; set; } = "Enterprise Records";

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
            columns = Columns,
            data = Data ?? new object[0],
            pageSize = PageSize,
            title = Title
        };

        output.Attributes.SetAttribute("data-island", "datagrid");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}

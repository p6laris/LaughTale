using System.Collections.Generic;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Enums;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// TagHelper for <island-tree-select /> / <island-treeselect /> — Aura Hierarchical TreeSelect
/// </summary>
[HtmlTargetElement("island-tree-select")]
[HtmlTargetElement("island-treeselect")]
public class IslandTreeSelectTagHelper : TagHelper
{
    [HtmlAttributeName("nodes")]
    public List<TreeNode>? Nodes { get; set; }

    [HtmlAttributeName("options")]
    public List<TreeNode>? Options { get; set; }

    [HtmlAttributeName("departments")]
    public List<TreeNode>? Departments { get; set; }

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("selected-value")]
    public string? SelectedValue { get; set; }

    [HtmlAttributeName("selection-mode")]
    public string SelectionMode { get; set; } = "single";

    [HtmlAttributeName("display")]
    public string Display { get; set; } = "comma";

    [HtmlAttributeName("placeholder")]
    public string Placeholder { get; set; } = "Select Item";

    [HtmlAttributeName("filter")]
    public bool Filter { get; set; } = false;

    [HtmlAttributeName("show-clear")]
    public bool ShowClear { get; set; } = false;

    [HtmlAttributeName("clearable")]
    public bool Clearable { get; set; } = false;

    [HtmlAttributeName("variant")]
    public InputVariant Variant { get; set; } = InputVariant.Outlined;

    [HtmlAttributeName("size")]
    public ComponentSize Size { get; set; } = ComponentSize.Normal;

    [HtmlAttributeName("fluid")]
    public bool Fluid { get; set; } = false;

    [HtmlAttributeName("invalid")]
    public bool Invalid { get; set; } = false;

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("input-id")]
    public string? InputId { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    [HtmlAttributeName("header")]
    public string? Header { get; set; }

    [HtmlAttributeName("footer")]
    public string? Footer { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Fallback attribute resolution
        if (context.AllAttributes.TryGetAttribute("selectionMode", out var smAttr) || context.AllAttributes.TryGetAttribute("selection-mode", out smAttr))
        {
            SelectionMode = smAttr.Value?.ToString() ?? "single";
        }
        if (context.AllAttributes.TryGetAttribute("display", out var dispAttr))
        {
            Display = dispAttr.Value?.ToString() ?? "comma";
        }
        if (context.AllAttributes.TryGetAttribute("filter", out var fAttr))
        {
            if (bool.TryParse(fAttr.Value?.ToString(), out var f)) Filter = f;
            else if (fAttr.Value != null) Filter = true;
        }
        if (context.AllAttributes.TryGetAttribute("showClear", out var scAttr) || context.AllAttributes.TryGetAttribute("show-clear", out scAttr) || context.AllAttributes.TryGetAttribute("clearable", out scAttr))
        {
            if (bool.TryParse(scAttr.Value?.ToString(), out var sc)) ShowClear = sc;
            else if (scAttr.Value != null) ShowClear = true;
        }
        if (context.AllAttributes.TryGetAttribute("variant", out var varAttr))
        {
            if (System.Enum.TryParse<InputVariant>(varAttr.Value?.ToString(), true, out var vr)) Variant = vr;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (System.Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var rootClasses = new List<string> { "laughtale-treeselect", "p-treeselect" };
        if (Fluid) rootClasses.Add("p-treeselect-fluid");
        if (Variant == InputVariant.Filled) rootClasses.Add("variant-filled");
        if (Size != ComponentSize.Normal) rootClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Invalid) rootClasses.Add("is-invalid");
        if (Disabled) rootClasses.Add("is-disabled");

        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses));
        output.Attributes.SetAttribute("data-island", "tree-select");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var effectiveNodes = Nodes ?? Options ?? Departments ?? new List<TreeNode>();
        var effectiveValue = Value ?? SelectedValue;

        var props = new
        {
            nodes = effectiveNodes,
            value = effectiveValue,
            selectedValue = effectiveValue,
            selectionMode = SelectionMode,
            display = Display,
            placeholder = Placeholder,
            filter = Filter,
            showClear = ShowClear || Clearable,
            clearable = ShowClear || Clearable,
            variant = Variant == InputVariant.Filled ? "filled" : "outlined",
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            invalid = Invalid,
            inputId = InputId,
            name = Name,
            targetInputName = TargetInput,
            header = Header,
            footer = Footer
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-rendered HTML
        var sb = new System.Text.StringBuilder();
        sb.Append($"<div class=\"p-treeselect-label-container\" tabindex=\"{(Disabled ? "-1" : "0")}\" role=\"combobox\" aria-haspopup=\"tree\" aria-expanded=\"false\">");
        sb.Append($"<div class=\"p-treeselect-label p-placeholder\">{System.Net.WebUtility.HtmlEncode(Placeholder)}</div>");
        sb.Append("<div class=\"p-treeselect-actions\">");
        sb.Append("<span class=\"p-treeselect-dropdown-icon\">");
        sb.Append("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"/></svg>");
        sb.Append("</span>");
        sb.Append("</div>");
        sb.Append("</div>");

        output.Content.SetHtmlContent(sb.ToString());
    }
}

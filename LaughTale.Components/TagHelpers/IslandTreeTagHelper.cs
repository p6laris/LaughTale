using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Models;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise Tree TagHelper for Hierarchical Data Structures (Aura Design System compliant).
/// </summary>
[HtmlTargetElement("island-tree", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTreeTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public object? Value { get; set; }

    [HtmlAttributeName("nodes")]
    public object? Nodes { get; set; }

    [HtmlAttributeName("selection-mode")]
    public string? SelectionMode { get; set; }

    [HtmlAttributeName("selection-keys")]
    public object? SelectionKeys { get; set; }

    [HtmlAttributeName("expanded-keys")]
    public object? ExpandedKeys { get; set; }

    [HtmlAttributeName("filter")]
    public bool Filter { get; set; } = false;

    [HtmlAttributeName("filter-placeholder")]
    public string FilterPlaceholder { get; set; } = "Search";

    [HtmlAttributeName("filter-mode")]
    public string FilterMode { get; set; } = "lenient";

    [HtmlAttributeName("meta-key-selection")]
    public bool MetaKeySelection { get; set; } = false;

    [HtmlAttributeName("loading")]
    public bool Loading { get; set; } = false;

    [HtmlAttributeName("loading-mode")]
    public string LoadingMode { get; set; } = "mask";

    [HtmlAttributeName("draggable-nodes")]
    public bool DraggableNodes { get; set; } = false;

    [HtmlAttributeName("droppable-nodes")]
    public bool DroppableNodes { get; set; } = false;

    [HtmlAttributeName("draggable-scope")]
    public string? DraggableScope { get; set; }

    [HtmlAttributeName("droppable-scope")]
    public object? DroppableScope { get; set; }

    [HtmlAttributeName("toggle-icon")]
    public string ToggleIcon { get; set; } = "chevron";

    [HtmlAttributeName("show-select-all")]
    public bool ShowSelectAll { get; set; } = false;

    [HtmlAttributeName("show-controls")]
    public bool ShowControls { get; set; } = false;

    [HtmlAttributeName("keyboard-info")]
    public bool KeyboardInfo { get; set; } = false;

    [HtmlAttributeName("lazy")]
    public bool Lazy { get; set; } = false;

    [HtmlAttributeName("skeleton")]
    public bool Skeleton { get; set; } = false;

    [HtmlAttributeName("empty-message")]
    public string? EmptyMessage { get; set; }

    [HtmlAttributeName("events")]
    public bool Events { get; set; } = false;

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Visible;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Attribute fallbacks for camelCase / kebab-case
        if (context.AllAttributes.TryGetAttribute("selectionMode", out var smAttr)) SelectionMode = smAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("selectionKeys", out var skAttr)) SelectionKeys = skAttr.Value;
        if (context.AllAttributes.TryGetAttribute("expandedKeys", out var ekAttr)) ExpandedKeys = ekAttr.Value;
        if (context.AllAttributes.TryGetAttribute("filterPlaceholder", out var fpAttr)) FilterPlaceholder = fpAttr.Value?.ToString() ?? "Search";
        if (context.AllAttributes.TryGetAttribute("metaKeySelection", out var mkAttr))
        {
            if (bool.TryParse(mkAttr.Value?.ToString(), out var b)) MetaKeySelection = b;
            else if (mkAttr.Value != null) MetaKeySelection = true;
        }
        if (context.AllAttributes.TryGetAttribute("loadingMode", out var lmAttr)) LoadingMode = lmAttr.Value?.ToString() ?? "mask";
        if (context.AllAttributes.TryGetAttribute("draggableNodes", out var dnAttr))
        {
            if (bool.TryParse(dnAttr.Value?.ToString(), out var b)) DraggableNodes = b;
            else if (dnAttr.Value != null) DraggableNodes = true;
        }
        if (context.AllAttributes.TryGetAttribute("droppableNodes", out var donAttr))
        {
            if (bool.TryParse(donAttr.Value?.ToString(), out var b)) DroppableNodes = b;
            else if (donAttr.Value != null) DroppableNodes = true;
        }
        if (context.AllAttributes.TryGetAttribute("draggableScope", out var dscAttr)) DraggableScope = dscAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("droppableScope", out var doscAttr)) DroppableScope = doscAttr.Value;
        if (context.AllAttributes.TryGetAttribute("toggleIcon", out var tiAttr)) ToggleIcon = tiAttr.Value?.ToString() ?? "chevron";
        if (context.AllAttributes.TryGetAttribute("showSelectAll", out var ssaAttr))
        {
            if (bool.TryParse(ssaAttr.Value?.ToString(), out var b)) ShowSelectAll = b;
            else if (ssaAttr.Value != null) ShowSelectAll = true;
        }
        if (context.AllAttributes.TryGetAttribute("showControls", out var scAttr))
        {
            if (bool.TryParse(scAttr.Value?.ToString(), out var b)) ShowControls = b;
            else if (scAttr.Value != null) ShowControls = true;
        }
        if (context.AllAttributes.TryGetAttribute("keyboardInfo", out var kiAttr))
        {
            if (bool.TryParse(kiAttr.Value?.ToString(), out var b)) KeyboardInfo = b;
            else if (kiAttr.Value != null) KeyboardInfo = true;
        }
        if (context.AllAttributes.TryGetAttribute("emptyMessage", out var emAttr)) EmptyMessage = emAttr.Value?.ToString();

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var data = Value ?? Nodes ?? new object[0];

        var props = new
        {
            value = data,
            nodes = data,
            selectionMode = SelectionMode,
            selectionKeys = SelectionKeys,
            expandedKeys = ExpandedKeys,
            filter = Filter,
            filterPlaceholder = FilterPlaceholder,
            filterMode = FilterMode,
            metaKeySelection = MetaKeySelection,
            loading = Loading,
            loadingMode = LoadingMode,
            draggableNodes = DraggableNodes,
            droppableNodes = DroppableNodes,
            draggableScope = DraggableScope,
            droppableScope = DroppableScope,
            toggleIcon = ToggleIcon,
            showSelectAll = ShowSelectAll,
            showControls = ShowControls,
            keyboardInfo = KeyboardInfo,
            lazy = Lazy,
            skeleton = Skeleton,
            emptyMessage = EmptyMessage,
            events = Events
        };

        output.Attributes.SetAttribute("data-island", "tree");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}

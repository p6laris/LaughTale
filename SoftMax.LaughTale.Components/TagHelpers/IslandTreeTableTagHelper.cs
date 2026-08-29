using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise TreeTable TagHelper for Hierarchical Tabular Data (Aura Design System compliant).
/// </summary>
[HtmlTargetElement("island-treetable", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-treetable", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-tree-table", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTreeTableTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public object? Value { get; set; }

    [HtmlAttributeName("nodes")]
    public object? Nodes { get; set; }

    [HtmlAttributeName("columns")]
    public object? Columns { get; set; }

    [HtmlAttributeName("size")]
    public string? Size { get; set; } = "normal";

    [HtmlAttributeName("show-gridlines")]
    public bool ShowGridlines { get; set; } = false;

    [HtmlAttributeName("selection-mode")]
    public string? SelectionMode { get; set; }

    [HtmlAttributeName("selection-keys")]
    public object? SelectionKeys { get; set; }

    [HtmlAttributeName("expanded-keys")]
    public object? ExpandedKeys { get; set; }

    [HtmlAttributeName("meta-key-selection")]
    public bool MetaKeySelection { get; set; } = true;

    [HtmlAttributeName("sort-mode")]
    public string SortMode { get; set; } = "single";

    [HtmlAttributeName("sort-field")]
    public string? SortField { get; set; }

    [HtmlAttributeName("sort-order")]
    public int SortOrder { get; set; } = 1;

    [HtmlAttributeName("multi-sort-meta")]
    public object? MultiSortMeta { get; set; }

    [HtmlAttributeName("removable-sort")]
    public bool RemovableSort { get; set; } = false;

    [HtmlAttributeName("paginator")]
    public bool Paginator { get; set; } = false;

    [HtmlAttributeName("rows")]
    public int Rows { get; set; } = 5;

    [HtmlAttributeName("rows-per-page-options")]
    public object? RowsPerPageOptions { get; set; }

    [HtmlAttributeName("paginator-template")]
    public string? PaginatorTemplate { get; set; }

    [HtmlAttributeName("current-page-report-template")]
    public string? CurrentPageReportTemplate { get; set; }

    [HtmlAttributeName("headless-paginator")]
    public bool HeadlessPaginator { get; set; } = false;

    [HtmlAttributeName("scrollable")]
    public bool Scrollable { get; set; } = false;

    [HtmlAttributeName("scroll-height")]
    public string? ScrollHeight { get; set; }

    [HtmlAttributeName("resizable-columns")]
    public bool ResizableColumns { get; set; } = false;

    [HtmlAttributeName("column-resize-mode")]
    public string ColumnResizeMode { get; set; } = "fit";

    [HtmlAttributeName("column-toggle")]
    public bool ColumnToggle { get; set; } = false;

    [HtmlAttributeName("filter")]
    public bool Filter { get; set; } = false;

    [HtmlAttributeName("filter-mode")]
    public string FilterMode { get; set; } = "lenient";

    [HtmlAttributeName("lazy")]
    public bool Lazy { get; set; } = false;

    [HtmlAttributeName("loading")]
    public bool Loading { get; set; } = false;

    [HtmlAttributeName("skeleton")]
    public bool Skeleton { get; set; } = false;

    [HtmlAttributeName("empty-message")]
    public string? EmptyMessage { get; set; }

    [HtmlAttributeName("header-title")]
    public string? HeaderTitle { get; set; }

    [HtmlAttributeName("footer-text")]
    public string? FooterText { get; set; }

    [HtmlAttributeName("context-menu")]
    public bool ContextMenu { get; set; } = false;

    [HtmlAttributeName("events")]
    public bool Events { get; set; } = false;

    [HtmlAttributeName("show-actions")]
    public bool ShowActions { get; set; } = false;

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("use-tags")]
    public bool UseTags { get; set; } = false;

    [HtmlAttributeName("use-node-icons")]
    public bool UseNodeIcons { get; set; } = false;

    [HtmlAttributeName("top-controls")]
    public string? TopControls { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Attribute fallbacks for camelCase / kebab-case
        if (context.AllAttributes.TryGetAttribute("showGridlines", out var sgAttr))
        {
            if (bool.TryParse(sgAttr.Value?.ToString(), out var b)) ShowGridlines = b;
            else if (sgAttr.Value != null) ShowGridlines = true;
        }
        if (context.AllAttributes.TryGetAttribute("selectionMode", out var smAttr)) SelectionMode = smAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("selectionKeys", out var skAttr)) SelectionKeys = skAttr.Value;
        if (context.AllAttributes.TryGetAttribute("expandedKeys", out var ekAttr)) ExpandedKeys = ekAttr.Value;
        if (context.AllAttributes.TryGetAttribute("metaKeySelection", out var mkAttr))
        {
            if (bool.TryParse(mkAttr.Value?.ToString(), out var b)) MetaKeySelection = b;
            else if (mkAttr.Value != null) MetaKeySelection = true;
        }
        if (context.AllAttributes.TryGetAttribute("sortMode", out var sortModeAttr)) SortMode = sortModeAttr.Value?.ToString() ?? "single";
        if (context.AllAttributes.TryGetAttribute("sortField", out var sortFieldAttr)) SortField = sortFieldAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("sortOrder", out var sortOrderAttr))
        {
            if (int.TryParse(sortOrderAttr.Value?.ToString(), out var o)) SortOrder = o;
        }
        if (context.AllAttributes.TryGetAttribute("multiSortMeta", out var msmAttr)) MultiSortMeta = msmAttr.Value;
        if (context.AllAttributes.TryGetAttribute("removableSort", out var rsAttr))
        {
            if (bool.TryParse(rsAttr.Value?.ToString(), out var b)) RemovableSort = b;
            else if (rsAttr.Value != null) RemovableSort = true;
        }
        if (context.AllAttributes.TryGetAttribute("rowsPerPageOptions", out var rppoAttr)) RowsPerPageOptions = rppoAttr.Value;
        if (context.AllAttributes.TryGetAttribute("paginatorTemplate", out var ptAttr)) PaginatorTemplate = ptAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("currentPageReportTemplate", out var cprtAttr)) CurrentPageReportTemplate = cprtAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("headlessPaginator", out var hpAttr))
        {
            if (bool.TryParse(hpAttr.Value?.ToString(), out var b)) HeadlessPaginator = b;
            else if (hpAttr.Value != null) HeadlessPaginator = true;
        }
        if (context.AllAttributes.TryGetAttribute("scrollHeight", out var shAttr)) ScrollHeight = shAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("resizableColumns", out var rcAttr))
        {
            if (bool.TryParse(rcAttr.Value?.ToString(), out var b)) ResizableColumns = b;
            else if (rcAttr.Value != null) ResizableColumns = true;
        }
        if (context.AllAttributes.TryGetAttribute("columnResizeMode", out var crmAttr)) ColumnResizeMode = crmAttr.Value?.ToString() ?? "fit";
        if (context.AllAttributes.TryGetAttribute("columnToggle", out var ctAttr))
        {
            if (bool.TryParse(ctAttr.Value?.ToString(), out var b)) ColumnToggle = b;
            else if (ctAttr.Value != null) ColumnToggle = true;
        }
        if (context.AllAttributes.TryGetAttribute("filterMode", out var fmAttr)) FilterMode = fmAttr.Value?.ToString() ?? "lenient";
        if (context.AllAttributes.TryGetAttribute("emptyMessage", out var emAttr)) EmptyMessage = emAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("headerTitle", out var htAttr)) HeaderTitle = htAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("footerText", out var ftAttr)) FooterText = ftAttr.Value?.ToString();
        if (context.AllAttributes.TryGetAttribute("contextMenu", out var cmAttr))
        {
            if (bool.TryParse(cmAttr.Value?.ToString(), out var b)) ContextMenu = b;
            else if (cmAttr.Value != null) ContextMenu = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var data = Value ?? Nodes ?? new object[0];

        var props = new
        {
            value = data,
            nodes = data,
            columns = Columns,
            size = Size ?? "normal",
            showGridlines = ShowGridlines,
            selectionMode = SelectionMode,
            selectionKeys = SelectionKeys,
            expandedKeys = ExpandedKeys,
            metaKeySelection = MetaKeySelection,
            sortMode = SortMode,
            sortField = SortField,
            sortOrder = SortOrder,
            multiSortMeta = MultiSortMeta,
            removableSort = RemovableSort,
            paginator = Paginator,
            rows = Rows,
            rowsPerPageOptions = RowsPerPageOptions,
            paginatorTemplate = PaginatorTemplate,
            currentPageReportTemplate = CurrentPageReportTemplate,
            headlessPaginator = HeadlessPaginator,
            scrollable = Scrollable,
            scrollHeight = ScrollHeight,
            resizableColumns = ResizableColumns,
            columnResizeMode = ColumnResizeMode,
            columnToggle = ColumnToggle,
            filter = Filter,
            filterMode = FilterMode,
            lazy = Lazy,
            loading = Loading,
            skeleton = Skeleton,
            emptyMessage = EmptyMessage,
            headerTitle = HeaderTitle,
            footerText = FooterText,
            contextMenu = ContextMenu,
            events = Events,
            showActions = ShowActions,
            customTemplate = CustomTemplate,
            useTags = UseTags,
            useNodeIcons = UseNodeIcons,
            topControls = TopControls
        };

        output.Attributes.SetAttribute("data-island", "treetable");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}

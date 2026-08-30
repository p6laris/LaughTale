// ----------------------------------------------------------------------
//   Modularized Aura TagHelpers
// ----------------------------------------------------------------------

using SoftMax.LaughTale.Core.Serialization;
using SoftMax.LaughTale.Core.Enums;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Enums;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Components.Icons;
using System.Text.Json;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// TagHelper for <island-datatable /> / <island-table /> (Aura DataTable Component)
/// </summary>
[HtmlTargetElement("island-datatable")]
[HtmlTargetElement("island-table")]
public class IslandDataTableTagHelper : TagHelper
{
    public object? Value { get; set; }
    public object? Data { get; set; }
    public List<DataTableColumn>? Columns { get; set; }
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool ShowGridlines { get; set; } = false;
    public bool StripedRows { get; set; } = false;
    public string? SelectionMode { get; set; }
    public bool MetaKeySelection { get; set; } = true;
    public string KeyField { get; set; } = "id";
    public string RowKey { get; set; } = "id";
    public bool Paginator { get; set; } = false;
    public int Rows { get; set; } = 10;
    public int First { get; set; } = 0;
    public List<int>? RowsPerPageOptions { get; set; }
    public string? CurrentPageReportTemplate { get; set; }
    public string SortMode { get; set; } = "single";
    public bool RemovableSort { get; set; } = false;
    public string? SortField { get; set; }
    public int SortOrder { get; set; } = 1;
    public string? FilterDisplay { get; set; }
    public List<string>? GlobalFilterFields { get; set; }
    public bool Scrollable { get; set; } = false;
    public string? ScrollHeight { get; set; }
    public string? EditMode { get; set; }
    public bool Loading { get; set; } = false;
    public string LoadingMode { get; set; } = "overlay";
    public string? ExportFilename { get; set; }
    public string EmptyMessage { get; set; } = "No records found.";
    public string? TableStyle { get; set; }
    public string? Title { get; set; }
    public bool InteractiveSize { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "datatable");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var tableData = Value ?? Data ?? new object[0];
        var resolvedKey = !string.IsNullOrEmpty(KeyField) && KeyField != "id" ? KeyField : RowKey;

        var props = new
        {
            value = tableData,
            columns = Columns ?? new List<DataTableColumn>(),
            size = Size.ToString().ToLowerInvariant(),
            showGridlines = ShowGridlines,
            stripedRows = StripedRows,
            selectionMode = SelectionMode,
            metaKeySelection = MetaKeySelection,
            dataKey = resolvedKey,
            paginator = Paginator,
            rows = Rows,
            first = First,
            rowsPerPageOptions = RowsPerPageOptions,
            currentPageReportTemplate = CurrentPageReportTemplate,
            sortMode = SortMode,
            removableSort = RemovableSort,
            sortField = SortField,
            sortOrder = SortOrder,
            filterDisplay = FilterDisplay,
            globalFilterFields = GlobalFilterFields,
            scrollable = Scrollable,
            scrollHeight = ScrollHeight,
            editMode = EditMode,
            loading = Loading,
            loadingMode = LoadingMode,
            exportFilename = ExportFilename,
            emptyMessage = EmptyMessage,
            tableStyle = TableStyle,
            title = Title,
            interactiveSize = InteractiveSize
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-dataview /> (Aura DataView Component)
/// </summary>
[HtmlTargetElement("island-dataview")]
public class IslandDataViewTagHelper : TagHelper
{
    public object? Value { get; set; }
    public object? Items { get; set; }
    public string Layout { get; set; } = "list";
    public bool Paginator { get; set; } = false;
    public int Rows { get; set; } = 5;
    public string? SortField { get; set; }
    public int SortOrder { get; set; } = 1;
    public bool ShowLayoutSwitcher { get; set; } = false;
    public bool ShowSort { get; set; } = false;
    public bool Loading { get; set; } = false;
    public string? Title { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "dataview");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var data = Value ?? Items ?? new object[0];

        var props = new
        {
            value = data,
            items = data,
            layout = Layout.ToLowerInvariant(),
            paginator = Paginator,
            rows = Rows,
            sortField = SortField,
            sortOrder = SortOrder,
            showLayoutSwitcher = ShowLayoutSwitcher,
            showSort = ShowSort,
            loading = Loading,
            title = Title
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-paginator /> — Aura Paginator Component
/// </summary>
[HtmlTargetElement("island-paginator")]
public class IslandPaginatorTagHelper : TagHelper
{
    public int TotalRecords { get; set; } = 0;
    public int Rows { get; set; } = 10;
    public int First { get; set; } = 0;
    public int PageLinkSize { get; set; } = 5;
    public List<int>? RowsPerPageOptions { get; set; }
    public string? Template { get; set; }
    public string? CurrentPageReportTemplate { get; set; }
    public bool ShowFirstLast { get; set; } = true;
    public bool ShowJumpToPageDropdown { get; set; } = false;
    public bool ShowJumpToPageInput { get; set; } = false;
    public bool ShowSlider { get; set; } = false;
    public bool Compact { get; set; } = false;
    public string? TargetInput { get; set; }
    public string? TargetSelector { get; set; }
    public List<string>? Images { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Attribute fallbacks
        if (context.AllAttributes.TryGetAttribute("totalRecords", out var trAttr) || context.AllAttributes.TryGetAttribute("total-records", out trAttr))
        {
            if (int.TryParse(trAttr.Value?.ToString(), out var tr)) TotalRecords = tr;
        }
        if (context.AllAttributes.TryGetAttribute("pageLinkSize", out var plsAttr) || context.AllAttributes.TryGetAttribute("page-link-size", out plsAttr))
        {
            if (int.TryParse(plsAttr.Value?.ToString(), out var pls)) PageLinkSize = pls;
        }
        if (context.AllAttributes.TryGetAttribute("currentPageReportTemplate", out var cprtAttr) || context.AllAttributes.TryGetAttribute("current-page-report-template", out cprtAttr))
        {
            CurrentPageReportTemplate = cprtAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("showJumpToPageDropdown", out var sjdAttr) || context.AllAttributes.TryGetAttribute("show-jump-to-page-dropdown", out sjdAttr))
        {
            if (bool.TryParse(sjdAttr.Value?.ToString(), out var b)) ShowJumpToPageDropdown = b;
            else if (sjdAttr.Value != null) ShowJumpToPageDropdown = true;
        }
        if (context.AllAttributes.TryGetAttribute("showJumpToPageInput", out var sjiAttr) || context.AllAttributes.TryGetAttribute("show-jump-to-page-input", out sjiAttr))
        {
            if (bool.TryParse(sjiAttr.Value?.ToString(), out var b)) ShowJumpToPageInput = b;
            else if (sjiAttr.Value != null) ShowJumpToPageInput = true;
        }
        if (context.AllAttributes.TryGetAttribute("showSlider", out var ssAttr) || context.AllAttributes.TryGetAttribute("show-slider", out ssAttr))
        {
            if (bool.TryParse(ssAttr.Value?.ToString(), out var b)) ShowSlider = b;
            else if (ssAttr.Value != null) ShowSlider = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "paginator");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            totalRecords = TotalRecords,
            rows = Rows,
            first = First,
            pageLinkSize = PageLinkSize,
            rowsPerPageOptions = RowsPerPageOptions,
            template = Template,
            currentPageReportTemplate = CurrentPageReportTemplate,
            showFirstLast = ShowFirstLast,
            showJumpToPageDropdown = ShowJumpToPageDropdown,
            showJumpToPageInput = ShowJumpToPageInput,
            showSlider = ShowSlider,
            compact = Compact,
            targetInputName = TargetInput,
            targetSelector = TargetSelector,
            images = Images
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-orgchart />
/// </summary>
[HtmlTargetElement("island-orgchart")]
public class IslandOrgChartTagHelper : TagHelper
{
    public OrgChartNode? Value { get; set; }
    public OrgChartNode? Root { get; set; }
    public bool Collapsible { get; set; }
    public string? SelectionMode { get; set; } = "none";
    public List<string>? SelectionKeys { get; set; }
    public List<string>? CollapsedKeys { get; set; }
    public string? ToggleIcon { get; set; } = "chevron";
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Attribute fallbacks
        if (context.AllAttributes.TryGetAttribute("collapsible", out var colAttr))
        {
            if (bool.TryParse(colAttr.Value?.ToString(), out var b)) Collapsible = b;
            else if (colAttr.Value != null) Collapsible = true;
        }
        if (context.AllAttributes.TryGetAttribute("selectionMode", out var smAttr) || context.AllAttributes.TryGetAttribute("selection-mode", out smAttr))
        {
            SelectionMode = smAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("toggleIcon", out var tiAttr) || context.AllAttributes.TryGetAttribute("toggle-icon", out tiAttr))
        {
            ToggleIcon = tiAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "orgchart");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var nodeData = Value ?? Root;
        var props = new
        {
            value = nodeData,
            collapsible = Collapsible,
            selectionMode = SelectionMode ?? "none",
            selectionKeys = SelectionKeys,
            collapsedKeys = CollapsedKeys,
            toggleIcon = ToggleIcon ?? "chevron",
            targetInputName = TargetInput
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// Enterprise Accordion TagHelper (Aura Design System compliant)
/// </summary>
[HtmlTargetElement("island-accordion")]
public class IslandAccordionTagHelper : TagHelper
{
    [HtmlAttributeName("tabs")]
    public object? Tabs { get; set; }

    [HtmlAttributeName("multiple")]
    public bool Multiple { get; set; } = false;

    [HtmlAttributeName("value")]
    public object? Value { get; set; }

    [HtmlAttributeName("active-index")]
    public object? ActiveIndex { get; set; }

    [HtmlAttributeName("controlled")]
    public bool Controlled { get; set; } = false;

    [HtmlAttributeName("with-radio")]
    public bool WithRadio { get; set; } = false;

    [HtmlAttributeName("custom-trigger")]
    public bool CustomTrigger { get; set; } = false;

    [HtmlAttributeName("custom-indicator")]
    public string? CustomIndicator { get; set; }

    [HtmlAttributeName("expand-icon")]
    public string? ExpandIcon { get; set; }

    [HtmlAttributeName("collapse-icon")]
    public string? CollapseIcon { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("activeIndex", out var aiAttr))
        {
            ActiveIndex = aiAttr.Value;
        }
        if (context.AllAttributes.TryGetAttribute("customIndicator", out var ciAttr))
        {
            CustomIndicator = ciAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("withRadio", out var wrAttr))
        {
            if (bool.TryParse(wrAttr.Value?.ToString(), out var b)) WithRadio = b;
            else if (wrAttr.Value != null) WithRadio = true;
        }
        if (context.AllAttributes.TryGetAttribute("customTrigger", out var ctAttr))
        {
            if (bool.TryParse(ctAttr.Value?.ToString(), out var b)) CustomTrigger = b;
            else if (ctAttr.Value != null) CustomTrigger = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "accordion");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        var props = new
        {
            tabs = Tabs ?? new object[0],
            multiple = Multiple,
            value = Value ?? ActiveIndex,
            activeIndex = ActiveIndex ?? Value,
            controlled = Controlled,
            withRadio = WithRadio,
            customTrigger = CustomTrigger,
            customIndicator = CustomIndicator,
            expandIcon = ExpandIcon,
            collapseIcon = CollapseIcon
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}

// IslandTabsTagHelper moved to IslandTabsTagHelper.cs

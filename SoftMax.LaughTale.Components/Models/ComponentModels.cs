using SoftMax.LaughTale.Components.Enums;

namespace SoftMax.LaughTale.Components.Models;

public record StepperStep(
    string Id,
    string Title,
    string? Description = null,
    string? Icon = null,
    bool Disabled = false
);

public record TimelineItem(
    string Id,
    string Title,
    string Description,
    DateTimeOffset Timestamp,
    TimelineStatus Status = TimelineStatus.Completed,
    string? Actor = null,
    string? Icon = null
);

public record DataGridCol<TItem>(
    string Field,
    string Header,
    bool Sortable = true,
    bool Filterable = true,
    string? Width = null,
    string Align = "left"
);

public record DataGridCol(
    string Field,
    string Header,
    bool Sortable = true
);

public record DataTableColumn(
    string Field,
    string Header,
    bool Sortable = false,
    bool Filterable = false,
    string? FilterPlaceholder = null,
    string? Width = null,
    string? MinWidth = null,
    string Align = "left",
    bool Frozen = false,
    string AlignFrozen = "left",
    string? SelectionMode = null,
    bool Expander = false,
    string? EditorType = null,
    object? EditorOptions = null,
    string? BodyTemplate = null,
    string? HeaderClass = null,
    string? BodyClass = null
);

public record TreeNode<TData>(
    string Id,
    string Name,
    string? Code = null,
    TData? Data = default,
    List<TreeNode<TData>>? Children = null,
    string? Icon = null,
    bool Expanded = false,
    bool Selected = false
);

public record TreeNode(
    string Id,
    string Name,
    string? Code = null,
    List<TreeNode>? Children = null
);

public record SelectButtonItem<TValue>(
    string Label,
    TValue Value,
    string? Icon = null,
    bool Disabled = false
);

public record SelectButtonItem(
    string Label,
    string Value,
    string? Icon = null
);

public record ListboxOptionItem(
    string Label,
    object Value,
    string? Code = null,
    string? Name = null,
    string? Icon = null,
    string? Flag = null,
    string? Badge = null,
    string? Description = null,
    string? Avatar = null,
    string? StatusClass = null,
    bool Disabled = false,
    List<ListboxOptionItem>? Items = null
);

public record RadioButtonOption(
    string Label,
    string Value,
    string? Description = null,
    string? Badge = null,
    string? Flag = null,
    string? Icon = null,
    string? Price = null,
    bool Disabled = false
);

public record MeterValue(
    string Label,
    double Value,
    string Color,
    string? Icon = null
);

public record AvatarItem(
    string? Label = null,
    string? Image = null,
    string? Name = null,
    string? Bg = null,
    ComponentSize Size = ComponentSize.Medium
);

public record SpeedDialAction(
    string? Label = null,
    string? Icon = null,
    string? Action = null,
    string? Url = null,
    string? Target = null,
    bool Disabled = false,
    string? Tooltip = null,
    string? Severity = null,
    string? StyleClass = null
);

public record SpeedDialButtonProps(
    string? Severity = "primary",
    bool Rounded = true,
    bool IconOnly = true,
    string? StyleClass = null
);

public record SpeedDialTooltipOptions(
    string? Position = "left",
    string? Event = "hover"
);

public record AccordionTab(
    string Id,
    string Header,
    string? Content = null,
    string? Icon = null,
    bool Disabled = false
);

public record TabItem(
    string Id,
    string Header,
    string? Content = null,
    string? Icon = null,
    bool Disabled = false
);

public record AutoCompleteItem<TValue>(
    string Label,
    TValue Value,
    string? Category = null,
    string? Icon = null,
    string? Shortcut = null,
    string? Avatar = null,
    string? Status = null,
    string? Subtitle = null,
    string? Group = null,
    object? Count = null,
    bool Disabled = false
);

public record AutoCompleteItem(
    string Label,
    string Value,
    string? Category = null,
    string? Icon = null,
    string? Shortcut = null,
    string? Avatar = null,
    string? Status = null,
    string? Subtitle = null,
    string? Group = null,
    object? Count = null,
    bool Disabled = false
);

public record BreadcrumbItem(
    string Label,
    string? Url = null,
    string? Icon = null,
    bool IsCurrent = false
);

public record CommandPaletteItem(
    string Id,
    string Label,
    string? Group = null,
    string? Icon = null,
    string? Shortcut = null,
    string? Url = null,
    string? Action = null,
    bool Disabled = false
);

public record ThemeStudioPreset(
    string Id,
    string Name,
    string PrimaryHex,
    string BorderRadius,
    string NeutralFamily = "slate"
);

public record SplitterPanel(
    string Id,
    double Size = 50,
    double MinSize = 10,
    string? Content = null
);

public record CascadeSelectNode<TValue>(
    string Name,
    TValue Value,
    string? Code = null,
    string? Icon = null,
    string? Image = null,
    bool Disabled = false,
    List<CascadeSelectNode<TValue>>? Children = null
);

public record CascadeSelectNode(
    string Name,
    string Code,
    string? Icon = null,
    string? Image = null,
    bool Disabled = false,
    List<CascadeSelectNode>? Children = null
);

public record PickListItem<TData>(
    string Id,
    string Name,
    string? Category = null,
    string? Code = null,
    string? Image = null,
    decimal? Price = null,
    string? Subtitle = null,
    string? Avatar = null,
    string? Role = null,
    TData? Data = default
);

public record PickListItem(
    string Id,
    string Name,
    string? Category = null,
    string? Code = null,
    string? Image = null,
    decimal? Price = null,
    string? Subtitle = null,
    string? Avatar = null,
    string? Role = null
);

public record OrderListItem<TData>(
    string? Id = null,
    string? Title = null,
    string? Name = null,
    int Order = 0,
    string? Category = null,
    decimal? Price = null,
    string? Image = null,
    TData? Data = default
);

public record OrderListItem(
    string? Id = null,
    string? Title = null,
    string? Name = null,
    int Order = 0,
    string? Category = null,
    decimal? Price = null,
    string? Image = null
);

public record OrgChartNode<TData>(
    string Key,
    string Label,
    string? Title = null,
    string? Description = null,
    string? Icon = null,
    string? Accent = null,
    string? Avatar = null,
    string? Type = null,
    bool Selectable = true,
    bool Collapsed = false,
    TData? Data = default,
    List<OrgChartNode<TData>>? Children = null
);

public record OrgChartNode(
    string Key,
    string Label,
    string? Title = null,
    string? Description = null,
    string? Icon = null,
    string? Accent = null,
    string? Avatar = null,
    string? Type = null,
    bool Selectable = true,
    bool Collapsed = false,
    List<OrgChartNode>? Children = null
);

public record TerminalCommand(
    string Command,
    string Response
);

public record DockItem(
    string Label,
    string Icon,
    string? Url = null,
    string? Action = null,
    DockPosition Position = DockPosition.Bottom
);

public record GalleriaItem(
    string ItemImageSrc,
    string ThumbnailImageSrc,
    string Alt,
    string? Title = null
);

public record SplitButtonItem(
    string? Label = null,
    string? Icon = null,
    string? Action = null,
    string? Url = null,
    string? Route = null,
    string? Target = null,
    string? Command = null,
    ButtonSeverity Severity = ButtonSeverity.Primary,
    bool Disabled = false,
    bool Separator = false,
    List<SplitButtonItem>? Items = null
);

// ─── Aura v2: New Component Models ─────────────────────────────────────

public record MenuItem(
    string Label,
    string? Icon = null,
    bool Separator = false,
    bool Disabled = false,
    string? Url = null,
    string? Action = null,
    List<MenuItem>? Items = null
);

public record CarouselItem(
    string? Image = null,
    string? Title = null,
    string? Description = null,
    string? Url = null
);

public record SidebarItem(
    string Label,
    string? Icon = null,
    string? Url = null,
    bool Active = false,
    List<SidebarItem>? Items = null,
    string? Badge = null,
    bool Expanded = true
);


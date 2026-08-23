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
    string Label,
    string? Icon = null,
    string? Action = null,
    ButtonSeverity Severity = ButtonSeverity.Primary
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
    List<CascadeSelectNode<TValue>>? Children = null
);

public record CascadeSelectNode(
    string Name,
    string Code,
    List<CascadeSelectNode>? Children = null
);

public record PickListItem<TData>(
    string Id,
    string Name,
    string? Category = null,
    string? Code = null,
    TData? Data = default
);

public record PickListItem(
    string Id,
    string Name,
    string? Category = null,
    string? Code = null
);

public record OrderListItem<TData>(
    string Id,
    string Name,
    int Order,
    string? Category = null,
    TData? Data = default
);

public record OrderListItem(
    string Id,
    string Name,
    string? Category = null,
    int Order = 0
);

public record OrgChartNode<TData>(
    string Key,
    string Label,
    string? Title = null,
    string? Avatar = null,
    TData? Data = default,
    List<OrgChartNode<TData>>? Children = null,
    bool Expanded = true
);

public record OrgChartNode(
    string Key,
    string Label,
    string? Title = null,
    string? Avatar = null,
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
    string Label,
    string? Icon = null,
    string? Action = null,
    string? Url = null,
    ButtonSeverity Severity = ButtonSeverity.Primary,
    bool Disabled = false
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


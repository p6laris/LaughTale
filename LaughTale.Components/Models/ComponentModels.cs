using LaughTale.Components.Enums;

namespace LaughTale.Components.Models;

public record StepperStep(
    string Id,
    string Title,
    string? Description = null,
    string? Icon = null,
    bool Disabled = false
);

public record TimelineItem(
    string? Id = null,
    string? Title = null,
    string? Label = null,
    string? Status = null,
    string? Description = null,
    string? Date = null,
    string? Time = null,
    DateTimeOffset? Timestamp = null,
    string? Opposite = null,
    string? Icon = null,
    string? Color = null,
    string? User = null,
    List<string>? Details = null,
    string? Tracking = null,
    string? Action = null,
    string? Target = null,
    string? Repo = null,
    string? Actor = null
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
    string Key,
    string Label,
    string? Data = null,
    string? Icon = null,
    string? ExpandedIcon = null,
    string? CollapsedIcon = null,
    List<TreeNode>? Children = null,
    bool Leaf = false,
    bool Expanded = false,
    bool Selectable = true,
    bool Loading = false,
    string? StyleClass = null
)
{
    public string Id => Key;
    public string Name => Label;
    public string? Code => Data;

    public TreeNode(string id, string name, string? code, List<TreeNode>? children)
        : this(Key: id, Label: name, Data: code, Children: children, Leaf: children == null || children.Count == 0)
    {
    }
}

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
    bool Disabled = false,
    string? Badge = null,
    string? Subtitle = null,
    string? Price = null,
    string? ToggleIcon = null
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
    bool IsCurrent = false,
    string? Badge = null,
    string? BadgeSeverity = null,
    bool IsEllipsis = false,
    bool Disabled = false
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

public record CommandMenuItem(
    string Label,
    string? Icon = null,
    string? Category = null,
    string? Color = null,
    List<string>? Keywords = null,
    string? Shortcut = null,
    string? Url = null,
    string? Action = null,
    bool Disabled = false
);

public record CommandMenuGroup(
    string Label,
    List<CommandMenuItem> Items
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
    string? Label = null,
    string? Icon = null,
    bool Separator = false,
    bool Disabled = false,
    string? Url = null,
    string? Action = null,
    List<MenuItem>? Items = null,
    string? Key = null,
    string? Shortcut = null,
    string? Badge = null,
    string? Route = null,
    string? Target = null,
    bool? Toggleable = null,
    string? LinkClass = null,
    string? Command = null,
    bool? Checked = null,
    string? RadioGroup = null,
    bool? RadioSelected = null
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

public record TreeTableColumn(
    string Field,
    string Header,
    bool Expander = false,
    bool Sortable = false,
    bool Frozen = false,
    string? AlignFrozen = null,
    string? Width = null,
    string? MinWidth = null,
    string? FilterMatchMode = null
);

public record TreeTableNode(
    string Key,
    object Data,
    List<TreeTableNode>? Children = null,
    bool Leaf = false,
    bool Expanded = false,
    bool Selectable = true,
    bool Loading = false,
    string? Icon = null
);

public record SidebarSubItem(
    string Label,
    bool IsActive = false,
    string? Url = null,
    List<SidebarSubItem>? SubItems = null
);

public record SidebarItemModel(
    string Label,
    string? Icon = null,
    string? Badge = null,
    bool IsActive = false,
    string? Url = null,
    List<SidebarSubItem>? SubItems = null,
    bool DefaultOpen = false
);

public record SidebarGroupModel(
    string Label,
    List<SidebarItemModel> Items
);

public interface IComponentStateProps
{
    bool? Loading { get; set; }
    string? Error { get; set; }
    string? EmptyMessage { get; set; }
    bool? Disabled { get; set; }
}

public record ComponentStateProps(
    bool? Loading = null,
    string? Error = null,
    string? EmptyMessage = null,
    bool? Disabled = null
) : IComponentStateProps
{
    public bool? Loading { get; set; } = Loading;
    public string? Error { get; set; } = Error;
    public string? EmptyMessage { get; set; } = EmptyMessage;
    public bool? Disabled { get; set; } = Disabled;
}

// ============================================================================
//   Aura Island Component Props Records (Emitted by LaughTale.Generators)
// ============================================================================

[LaughTale.Core.Attributes.Island("input-number")]
public record InputNumberProps(
    double? Value = null, string? Name = null, InputNumberMode Mode = InputNumberMode.Decimal, string? Currency = "USD", string? Locale = null,
    bool UseGrouping = true, int? MinFractionDigits = null, int? MaxFractionDigits = null,
    string? Prefix = null, string? Suffix = null, double? Min = null, double? Max = null, double Step = 1,
    bool ShowButtons = false, ButtonLayout ButtonLayout = ButtonLayout.Stacked, InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal,
    bool Fluid = false, bool Invalid = false, bool ShowClear = false, string? Placeholder = null,
    string? TargetInput = null, bool Disabled = false, ButtonSeverity? ButtonSeverity = null, string? ButtonClass = null
);

[LaughTale.Core.Attributes.Island("number")]
public record NumberProps(
    double? Value = null, object? Mode = null, string? Currency = "USD", string? TargetInput = null
);

[LaughTale.Core.Attributes.Island("datepicker")]
public record DatePickerProps(
    string? Value = null, DatePickerSelectionMode SelectionMode = DatePickerSelectionMode.Single, string? DateFormat = "mm/dd/yy",
    bool Inline = false, bool ShowIcon = true, bool ShowButtonBar = false, bool ShowTime = false,
    bool TimeOnly = false, bool HourFormat24 = false, int StepMinute = 1, string? MinDate = null,
    string? MaxDate = null, object? DisabledDates = null, object? DisabledDays = null,
    bool Invalid = false, bool Fluid = false, InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal,
    string? Placeholder = null, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("select")]
public record SelectProps(
    object? Value = null, object? Options = null, string? OptionLabel = "label", string? OptionValue = "value",
    string? Placeholder = "Select an option", bool Filter = false, string? FilterPlaceholder = "Search...",
    bool ShowClear = false, bool Checkmark = false, bool Invalid = false, bool Fluid = false,
    InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("autocomplete")]
public record AutoCompleteProps(
    string? Value = null, object? Suggestions = null, string? Placeholder = "Search...",
    bool Multiple = false, bool Dropdown = false, int MinLength = 1, int Delay = 300,
    bool CompleteOnFocus = false, bool Invalid = false, bool Fluid = false,
    InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("cascade-select")]
public record CascadeSelectProps(
    object? Value = null, object? Options = null, string? OptionLabel = "label", string? OptionValue = "value",
    string? OptionGroupLabel = "label", string? OptionGroupChildren = "children",
    string? Placeholder = "Select a category", bool ShowClear = false, bool Invalid = false,
    bool Fluid = false, InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("checkbox")]
public record CheckboxProps(
    bool Checked = false, bool Binary = true, string? Value = null, string? Label = null,
    bool Indeterminate = false, bool Invalid = false, InputVariant Variant = InputVariant.Outlined,
    ComponentSize Size = ComponentSize.Normal, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("color-picker")]
public record ColorPickerProps(
    string? Value = "#10b981", string? Format = "hex", bool Inline = false,
    string? Placeholder = null, string? TargetInput = null, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("input-mask")]
public record InputMaskProps(
    string? Value = null, string? Mask = "99/99/9999", string? SlotChar = "_",
    bool AutoClear = true, bool Unmask = false, bool Invalid = false, bool Fluid = false,
    InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal, string? Placeholder = null, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("input-otp")]
public record InputOtpProps(
    string? Value = null, int Length = 4, bool IntegerOnly = false, bool Mask = false,
    InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal, bool Invalid = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("input-password")]
public record InputPasswordProps(
    string? Value = null, bool ToggleMask = true, bool Feedback = false,
    string? PromptLabel = "Please enter a password", string? WeakLabel = "Too simple",
    string? MediumLabel = "Average complexity", string? StrongLabel = "Complex password",
    bool Invalid = false, bool Fluid = false, InputVariant Variant = InputVariant.Outlined,
    ComponentSize Size = ComponentSize.Normal, string? Placeholder = null, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("input-tags")]
public record InputTagsProps(
    object? Value = null, object? Values = null, string? Placeholder = "Add a tag...",
    int? Max = null, bool AllowDuplicates = false, bool AllowDuplicate = false,
    string? Separator = ",", bool AddOnBlur = true, bool AddOnPaste = true,
    bool Typeahead = false, object? Suggestions = null, string? InputId = null,
    bool Invalid = false, bool Fluid = false, InputVariant Variant = InputVariant.Outlined,
    ComponentSize Size = ComponentSize.Normal, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("input-text")]
public record InputTextProps(
    string? Value = null, string? Placeholder = null, InputVariant Variant = InputVariant.Outlined,
    ComponentSize Size = ComponentSize.Normal, bool Fluid = false, bool Invalid = false,
    bool ShowClear = false, bool Disabled = false, string? InputId = null,
    string? IconLeft = null, string? IconRight = null, string? HelpText = null
);

[LaughTale.Core.Attributes.Island("knob")]
public record KnobProps(
    double Value = 0, double Min = 0, double Max = 100, double Step = 1,
    int Size = 100, int StrokeWidth = 14, string? Color = null,
    string? ValueColor = "var(--p-primary-500)", string? RangeColor = "var(--p-surface-200)",
    string? ValueTemplate = "{value}", bool ShowValue = true, bool ReadOnly = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("listbox")]
public record ListboxProps(
    object? Value = null, object? Options = null, string? OptionLabel = "label",
    string? OptionValue = "value", bool Multiple = false, bool Checkmark = false,
    bool Filter = false, string? FilterPlaceholder = "Filter items...",
    int? ListHeight = 250, bool Striped = false, bool Invalid = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("multiselect")]
public record MultiSelectProps(
    object? Value = null, object? Options = null, string? OptionLabel = "label",
    string? OptionValue = "value", string? Placeholder = "Select items",
    string? Display = "comma", int MaxSelectedLabels = 3,
    string? SelectedItemsLabel = "{0} items selected", bool Filter = false,
    string? FilterPlaceholder = "Search...", bool ShowClear = false,
    bool ShowSelectAll = true, bool Invalid = false, bool Fluid = false,
    InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("radio-button")]
public record RadioButtonProps(
    string? Value = null, string? GroupValue = null, string? Name = null,
    string? Label = null, InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal,
    bool Invalid = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("radio-group")]
public record RadioGroupProps(
    string? Name = null, object? Options = null, string? Value = null, string? SelectedValue = null,
    string? Layout = "vertical", bool Card = false, InputVariant Variant = InputVariant.Outlined,
    ComponentSize Size = ComponentSize.Normal, bool Invalid = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("split-button")]
public record SplitButtonProps(
    string? Label = null, string? Icon = null, string? DropdownIcon = null,
    object? Model = null, ButtonSeverity Severity = ButtonSeverity.Primary,
    bool Raised = false, bool Rounded = false, bool Text = false, bool Outlined = false,
    ComponentSize Size = ComponentSize.Normal, bool Disabled = false, bool Fluid = false,
    string? Action = null, string? AppendTo = "body"
);

[LaughTale.Core.Attributes.Island("rating")]
public record RatingProps(
    double? Value = null, int Stars = 5, bool Cancel = true, bool ReadOnly = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("select-button")]
public record SelectButtonProps(
    string? Value = null, object? Options = null, string? OptionLabel = "label",
    string? OptionValue = "value", bool Multiple = false, bool AllowEmpty = true,
    ComponentSize Size = ComponentSize.Normal, bool Fluid = false, bool Invalid = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("slider")]
public record SliderProps(
    object? Value = null, double Min = 0, double Max = 100, double Step = 1,
    bool Range = false, string? Orientation = "horizontal", bool Disabled = false
);

[LaughTale.Core.Attributes.Island("textarea")]
public record TextareaProps(
    string? Value = null, int? Rows = 3, int? Cols = 20, bool AutoResize = false,
    InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal, bool Fluid = false,
    bool Invalid = false, string? Placeholder = null, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("toggle-button")]
public record ToggleButtonProps(
    bool Checked = false, string? OnLabel = "Yes", string? OffLabel = "No",
    string? OnIcon = null, string? OffIcon = null, ComponentSize Size = ComponentSize.Normal,
    bool Invalid = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("toggle-switch")]
public record ToggleSwitchProps(
    bool Checked = false, ComponentSize Size = ComponentSize.Normal, bool Invalid = false, bool Disabled = false
);

[LaughTale.Core.Attributes.Island("tree-select")]
public record TreeSelectProps(
    object? Value = null, object? Options = null, object? Nodes = null, object? Departments = null,
    string? Placeholder = "Select Item", string? SelectionMode = "single", string? Display = "comma",
    bool Filter = false, string? FilterPlaceholder = "Filter...", bool ShowClear = false, bool Fluid = false,
    InputVariant Variant = InputVariant.Outlined, ComponentSize Size = ComponentSize.Normal,
    bool Invalid = false, bool Disabled = false, string? Header = null, string? Footer = null
);

[LaughTale.Core.Attributes.Island("datatable")]
public record DataTableProps(
    object? Value = null, object? Columns = null, bool Paginator = false, int Rows = 10,
    object? RowsPerPageOptions = null, bool Sortable = true, bool Filterable = false,
    string? SelectionMode = null, bool ResizableColumns = false, bool ReorderableColumns = false,
    bool Scrollable = false, string? ScrollHeight = null, bool StripedRows = false,
    bool ShowGridlines = false, ComponentSize Size = ComponentSize.Normal, bool Loading = false
);

[LaughTale.Core.Attributes.Island("dataview")]
public record DataViewProps(
    object? Value = null, string? Layout = "list", bool Paginator = false,
    int Rows = 6, object? RowsPerPageOptions = null, bool Sortable = false,
    string? EmptyMessage = "No records found."
);

[LaughTale.Core.Attributes.Island("orderlist")]
public record OrderListProps(
    object? Value = null, string? Header = null, string? KeyField = "id",
    int? ListHeight = 300, bool Filter = false, string? FilterPlaceholder = "Filter items...", bool Striped = false
);

[LaughTale.Core.Attributes.Island("picklist")]
public record PickListProps(
    object? Source = null, object? Target = null, string? SourceHeader = "Available",
    string? TargetHeader = "Selected", string? KeyField = "id", int? ListHeight = 300,
    bool Filter = false, bool Striped = false, bool ShowSourceControls = true, bool ShowTargetControls = true
);

[LaughTale.Core.Attributes.Island("treetable")]
public record TreeTableProps(
    object? Value = null, object? Columns = null, bool Paginator = false, int Rows = 10,
    bool Sortable = true, bool Filterable = false, string? SelectionMode = null,
    bool ResizableColumns = false, bool StripedRows = false, bool ShowGridlines = false
);

[LaughTale.Core.Attributes.Island("tree")]
public record TreeProps(
    object? Value = null, string? SelectionMode = "single", bool Filter = false,
    string? FilterPlaceholder = "Filter tree nodes...", bool Checkboxes = false, bool Loading = false
);

[LaughTale.Core.Attributes.Island("orgchart")]
public record OrgChartProps(
    object? Value = null, string? SelectionMode = "single", bool Collapsible = true
);

[LaughTale.Core.Attributes.Island("paginator")]
public record PaginatorProps(
    int TotalRecords = 0, int Rows = 10, int First = 0, int PageLinkSize = 5,
    object? RowsPerPageOptions = null, bool ShowCurrentPageReport = true,
    string? CurrentPageReportTemplate = "({currentPage} of {totalPages})",
    bool ShowFirstLastIcon = true, bool ShowJumpToPageDropdown = false
);

[LaughTale.Core.Attributes.Island("timeline")]
public record TimelineProps(
    object? Value = null, string? Align = "left", string? Layout = "vertical"
);

[LaughTale.Core.Attributes.Island("menu")]
public record MenuProps(
    object? Model = null, bool Popup = false, string? TargetSelector = null
);

[LaughTale.Core.Attributes.Island("menubar")]
public record MenubarProps(
    object? Model = null
);

[LaughTale.Core.Attributes.Island("breadcrumb")]
public record BreadcrumbProps(
    object? Model = null, object? Items = null, string? HomeUrl = null, object? Home = null
);

[LaughTale.Core.Attributes.Island("context-menu")]
public record ContextMenuProps(
    object? Model = null, string? TargetSelector = null
);

[LaughTale.Core.Attributes.Island("tieredmenu")]
public record TieredMenuProps(
    object? Model = null, bool Popup = false, string? TargetSelector = null
);

[LaughTale.Core.Attributes.Island("galleria")]
public record GalleriaProps(
    object? Value = null, int? ActiveIndex = 0, bool FullScreen = false, bool Visible = false,
    int? NumVisible = 5, bool ShowThumbnails = true, bool ShowIndicators = false,
    bool AutoPlay = false, int? TransitionInterval = 4000, bool Circular = false
);

[LaughTale.Core.Attributes.Island("carousel")]
public record CarouselProps(
    object? Value = null, int? Page = 0, int? NumVisible = 3, int? NumScroll = 1,
    bool Circular = false, bool AutoPlay = false, int? AutoPlayInterval = 3000, string? Orientation = "horizontal"
);

[LaughTale.Core.Attributes.Island("image-compare")]
public record ImageCompareProps(
    string LeftImage = "", string RightImage = "", double Position = 50,
    string? LeftAlt = null, string? RightAlt = null
);

[LaughTale.Core.Attributes.Island("popover")]
public record PopoverProps(
    string? TargetSelector = null, bool Dismissable = true, bool CloseOnEscape = true
);

[LaughTale.Core.Attributes.Island("dialog")]
public record DialogProps(
    string? Header = null, bool Visible = false, bool Modal = true,
    bool CloseOnEscape = true, bool DismissableMask = false, bool Draggable = false,
    bool Resizable = false, bool Maximizable = false, string? Position = "center", string? Width = "50vw"
);

[LaughTale.Core.Attributes.Island("confirm-dialog")]
public record ConfirmDialogProps(
    string? Group = null, string? Position = "center", string? AriaLabel = null,
    bool DismissableMask = false, bool CloseOnEscape = true
);

[LaughTale.Core.Attributes.Island("confirm-popup")]
public record ConfirmPopupProps(
    string? Group = null, string? TargetSelector = null, string? Message = null,
    string? AcceptText = "Yes", string? RejectText = "No", string? ActionName = null
);

[LaughTale.Core.Attributes.Island("drawer")]
public record DrawerProps(
    bool Visible = false, string? Position = "left", bool Modal = true,
    bool DismissableMask = true, bool CloseOnEscape = true, bool FullScreen = false, string? Header = null
);

[LaughTale.Core.Attributes.Island("sidebar")]
public record SidebarProps(
    List<SidebarItem>? Items = null,
    string? Title = null,
    bool Collapsed = false,
    string? DemoType = null,
    List<SidebarGroupModel>? Groups = null,
    string? Variant = "sidebar",
    string? Collapsible = "icon",
    string? Side = "left",
    bool Overlay = false,
    bool OpenOnHover = false,
    bool Backdrop = false,
    bool Open = true,
    string? Width = null,
    string? IconWidth = null,
    string? HeaderTitle = null,
    string? HeaderLogo = null,
    string? HeaderColor = null,
    bool ShowControls = false,
    bool Visible = true,
    string? Position = "left",
    bool Modal = false,
    bool DismissableMask = true,
    bool CloseOnEscape = true,
    bool FullScreen = false,
    string? Header = null
);

[LaughTale.Core.Attributes.Island("toast")]
public record ToastProps(
    string? Group = "default", string? Position = "top-right", int? Limit = null,
    int? Gap = 8, bool AutoZIndex = true, int? BaseZIndex = 1100
);

[LaughTale.Core.Attributes.Island("tooltip")]
public record TooltipProps(
    string? Value = null, string? Text = null, string? Target = null,
    string? Position = "top", int? ShowDelay = null, int? HideDelay = null,
    string? Event = "hover", bool AutoHide = true, bool Escape = true
);

[LaughTale.Core.Attributes.Island("tag")]
public record TagProps(
    string? Value = null, string? Severity = "info", bool Rounded = false, string? Icon = null
);

[LaughTale.Core.Attributes.Island("progress-bar")]
public record ProgressBarProps(
    double? Value = 0, string? Mode = "determinate", bool ShowValue = true, string? Unit = "%",
    string? Height = null, string? Color = null
);

[LaughTale.Core.Attributes.Island("meter-group")]
public record MeterGroupProps(
    object? Values = null, object? Value = null, object? Meters = null,
    double Max = 100, double Min = 0,
    string? Orientation = "horizontal", string? LabelPosition = "end", string? LabelOrientation = "horizontal"
);

[LaughTale.Core.Attributes.Island("skeleton")]
public record SkeletonProps(
    string? Shape = "rectangle", string? Size = null, string? Width = "100%",
    string? Height = "1.25rem", string? BorderRadius = null, string? Animation = "wave"
);

[LaughTale.Core.Attributes.Island("blockui")]
public record BlockUIProps(
    bool Blocked = false, bool FullScreen = false, bool AutoZIndex = true, int? BaseZIndex = 1100
);

[LaughTale.Core.Attributes.Island("speed-dial")]
public record SpeedDialProps(
    object? Model = null, string? Direction = "up", string? Type = "linear",
    double Radius = 0, string? Mask = "none", bool Visible = false, bool RotateAnimation = true,
    string? ButtonSeverity = null, object? ButtonProps = null, int? TransitionDelay = null,
    string? Template = null, object? TooltipOptions = null
);

[LaughTale.Core.Attributes.Island("scroll-top")]
public record ScrollTopProps(
    string? Target = "window", int Threshold = 400, string? Icon = null, string? Behavior = "smooth"
);

[LaughTale.Core.Attributes.Island("stepper")]
public record StepperProps(
    int? ActiveStep = 0, bool Linear = false, string? Orientation = "horizontal", object? Steps = null
);

[LaughTale.Core.Attributes.Island("tabs")]
public record TabsProps(
    string? Value = null, bool Scrollable = false, object? Items = null
);

[LaughTale.Core.Attributes.Island("accordion")]
public record AccordionProps(
    bool Multiple = false, int? ActiveIndex = null, object? Tabs = null
);

[LaughTale.Core.Attributes.Island("toolbar")]
public record ToolbarProps(
    string? AriaLabel = null
);

[LaughTale.Core.Attributes.Island("splitter")]
public record SplitterProps(
    string? Layout = "horizontal", int GutterSize = 4, object? PanelSizes = null, object? MinSizes = null
);

[LaughTale.Core.Attributes.Island("fieldset")]
public record FieldsetProps(
    string? Legend = null, bool Toggleable = false, bool Collapsed = false,
    bool Controlled = false, string? ToggleIcon = "plusMinus"
);

[LaughTale.Core.Attributes.Island("panel")]
public record PanelProps(
    string? Header = null, bool Toggleable = false, bool Collapsed = false,
    bool Controlled = false, string? ToggleIcon = "chevron"
);

[LaughTale.Core.Attributes.Island("scrollarea")]
public record ScrollAreaProps(
    string? Type = "hover", string? Scrollbars = "auto"
);

[LaughTale.Core.Attributes.Island("divider")]
public record DividerProps(
    string? Layout = "horizontal", string? Type = "solid", string? Align = "left"
);

[LaughTale.Core.Attributes.Island("input-group")]
public record InputGroupProps(
    ComponentSize Size = ComponentSize.Normal, bool Fluid = false
);

[LaughTale.Core.Attributes.Island("input-group-addon")]
public record InputGroupAddonProps(
    string? Text = null, string? Icon = null
);

[LaughTale.Core.Attributes.Island("float-label")]
public record FloatLabelProps(
    string? Label = null, FloatLabelVariant Variant = FloatLabelVariant.Over, bool Invalid = false
);

[LaughTale.Core.Attributes.Island("ifta-label")]
public record IftaLabelProps(
    string? Label = null, bool Invalid = false
);

[LaughTale.Core.Attributes.Island("icon-field")]
public record IconFieldProps(
    string? Position = "left"
);

[LaughTale.Core.Attributes.Island("badge")]
public record BadgeProps(
    string? Value = null, string? Severity = null, ComponentSize Size = ComponentSize.Normal
);

[LaughTale.Core.Attributes.Island("avatar")]
public record AvatarProps(
    string? Label = null, string? Icon = null, string? Image = null,
    string? Size = null, string? Shape = "circle", string? Bg = null, string? Badge = null, string? BadgeSeverity = null
);

[LaughTale.Core.Attributes.Island("avatar-group")]
public record AvatarGroupProps(
    object? Avatars = null, object? Items = null,
    int? Max = 4, string? Size = "md", string? Shape = "circle"
);

[LaughTale.Core.Attributes.Island("fileupload")]
public record FileUploadProps(
    string? Mode = "basic", string? Name = "file", string? Url = null, bool Multiple = false,
    string? Accept = null, int? MaxFileSize = null, bool Auto = false,
    string? ChooseLabel = "Choose", string? UploadLabel = "Upload", string? CancelLabel = "Cancel"
);

[LaughTale.Core.Attributes.Island("dropzone")]
public record DropzoneProps(
    string? Url = null, string? Name = "file", bool Multiple = true,
    string? Accept = null, int? MaxFileSize = null, string? Message = "Drag & Drop files here or browse"
);

[LaughTale.Core.Attributes.Island("theme-studio")]
public record ThemeStudioProps(
    bool Visible = false,
    string? Position = "right"
);

[LaughTale.Core.Attributes.Island("command")]
public record CommandProps(
    string? Placeholder = "Type a command or search...",
    bool Visible = false,
    object? Model = null
);


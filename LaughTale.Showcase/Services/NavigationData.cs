using LaughTale.Components.Models;

namespace LaughTale.Showcase.Services;

public static class NavigationData
{
    public static List<SidebarItem> GetGlobalSidebarItems(string currentPath)
    {
        return new List<SidebarItem>
        {
            new("Overview", "compass", null, false, new List<SidebarItem>
            {
                new("Showcase Home", "home", "/", currentPath == "/"),
                new("i18n & Kurdish RTL", "globe", "/localization", currentPath.StartsWith("/localization"), null, "New"),
                new("Polyglot Live Lab", "globe", "/polyglot", currentPath.StartsWith("/polyglot"), null, "Live"),
                new("Island Compiler", "terminal", "/IslandCompiler", currentPath.StartsWith("/IslandCompiler"), null, "New"),
                new("Components Catalog", "layers", "/components", currentPath.StartsWith("/components")),
                new("Dashboard", "activity", "/dashboard", currentPath.StartsWith("/dashboard")),
                new("Architecture", "fileText", "/About", currentPath.StartsWith("/About"))
            }),
            new("Form Controls (25)", "edit3", null, false, new List<SidebarItem>
            {
                new("InputText", "edit", "/components#sec-input-text"),
                new("Textarea", "fileText", "/components#sec-textarea"),
                new("InputNumber", "sliders", "/components#sec-input-number"),
                new("InputOtp", "shieldAlert", "/components#sec-input-otp"),
                new("InputPassword", "lock", "/components#sec-input-password"),
                new("InputMask", "edit", "/components#sec-input-mask"),
                new("InputTags", "tag", "/components#sec-inputtags", false, null, "Tags"),
                new("AutoComplete", "search", "/components#sec-autocomplete"),
                new("Select", "listFilter", "/components#sec-select"),
                new("MultiSelect", "listFilter", "/components#sec-multiselect"),
                new("CascadeSelect", "folderTree", "/components#sec-cascadeselect"),
                new("TreeSelect", "folderTree", "/components#sec-treeselect"),
                new("Checkbox", "checkCircle", "/components#sec-checkbox"),
                new("RadioButton", "check", "/components#sec-radio"),
                new("ToggleButton", "zap", "/components#sec-toggle-button"),
                new("ToggleSwitch", "sliders", "/components#sec-toggle-switch"),
                new("Slider", "sliders", "/components#sec-slider"),
                new("Rating", "star", "/components#sec-rating"),
                new("SelectButton", "layoutGrid", "/components#sec-select-button"),
                new("ColorPicker", "palette", "/components#sec-color-picker"),
                new("Knob", "gauge", "/components#sec-knob"),
                new("DatePicker", "calendar", "/components#sec-datepicker"),
                new("FloatLabel", "edit", "/components#sec-floatlabel"),
                new("IftaLabel", "edit", "/components#sec-iftalabel"),
                new("InputGroup", "layers", "/components#sec-inputgroup")
            }),
            new("Buttons (3)", "zap", null, false, new List<SidebarItem>
            {
                new("Button", "zap", "/components#sec-button"),
                new("SplitButton", "zap", "/components#sec-split-button"),
                new("SpeedDial", "zap", "/components#sec-speed-dial")
            }),
            new("Data & Panels (19)", "database", null, false, new List<SidebarItem>
            {
                new("DataTable", "table2", "/components#sec-datagrid", false, null, "Live"),
                new("DataView", "layoutGrid", "/components#sec-dataview"),
                new("Tree", "folderTree", "/components#sec-tree"),
                new("TreeTable", "table2", "/components#sec-treetable", false, null, "New"),
                new("Paginator", "grid", "/components#sec-paginator"),
                new("Splitter", "columns3", "/components#sec-splitter", false, null, "New"),
                new("Listbox", "listFilter", "/components#sec-listbox"),
                new("PickList", "arrowLeftRight", "/components#sec-picklist"),
                new("OrderList", "arrowLeftRight", "/components#sec-orderlist"),
                new("OrganizationChart", "folderTree", "/components#sec-orgchart"),
                new("Card", "layers", "/components#sec-card", false, null, "New"),
                new("Divider", "columns3", "/components#sec-divider", false, null, "New"),
                new("Fieldset", "layoutGrid", "/components#sec-fieldset", false, null, "New"),
                new("Panel", "square", "/components#sec-panel", false, null, "New"),
                new("ScrollArea", "chevronsUpDown", "/components#sec-scrollarea", false, null, "New"),
                new("Accordion", "folderTree", "/components#sec-accordion"),
                new("Tabs", "columns3", "/components#sec-tabs", false, null, "New"),
                new("Toolbar", "columns3", "/components#sec-toolbar", false, null, "New"),
                new("Timeline", "activity", "/components#sec-timeline")
            }),
            new("Navigation & Menus (9)", "compass", null, false, new List<SidebarItem>
            {
                new("Menu", "menu", "/components#sec-menu", false, null, "New"),
                new("TieredMenu", "menu", "/components#sec-tieredmenu", false, null, "New"),
                new("Menubar", "compass", "/components#sec-menubar", false, null, "New"),
                new("ContextMenu", "moreHorizontal", "/components#sec-context-menu", false, null, "New"),
                new("Breadcrumb", "compass", "/components#sec-breadcrumb", false, null, "New"),
                new("Sidebar", "folderTree", "/components#sec-sidebar", false, null, "New"),
                new("Stepper", "listOrdered", "/components#sec-stepper", false, null, "New"),
                new("ScrollTop", "arrowUp", "/components#sec-scroll-top"),
                new("CommandMenu", "terminal", "/components#sec-command-palette", false, null, "New")
            }),
            new("Overlays & Dialogs (8)", "layers", null, false, new List<SidebarItem>
            {
                new("Dialog", "layers", "/components#sec-dialog", false, null, "New"),
                new("Drawer", "sidebar", "/components#sec-drawer", false, null, "New"),
                new("Popover", "messageSquare", "/components#sec-popover", false, null, "New"),
                new("Tooltip", "info", "/components#sec-tooltip", false, null, "New"),
                new("ConfirmDialog", "alertTriangle", "/components#sec-confirm-dialog", false, null, "New"),
                new("ConfirmPopup", "alertTriangle", "/components#sec-confirm-popup"),
                new("Toast", "bell", "/components#sec-toast", false, null, "New"),
                new("BlockUI", "lock", "/components#sec-blockui")
            }),
            new("Feedback & Status (7)", "activity", null, false, new List<SidebarItem>
            {
                new("Message", "info", "/components#sec-message", false, null, "New"),
                new("ProgressBar", "loader2", "/components#sec-progress-bar"),
                new("Skeleton", "loader2", "/components#sec-skeleton"),
                new("MeterGroup", "gauge", "/components#sec-meter-group"),
                new("AvatarGroup", "compass", "/components#sec-avatar-group"),
                new("Tag", "check", "/components#sec-tag"),
                new("Inplace", "edit3", "/components#sec-inplace")
            }),
            new("Media & Files (4)", "image", null, false, new List<SidebarItem>
            {
                new("Galleria", "galleryThumbnails", "/components#sec-galleria"),
                new("Carousel", "image", "/components#sec-carousel", false, null, "New"),
                new("FileUpload", "uploadCloud", "/components#sec-fileupload", false, null, "New"),
                new("Compare", "columns3", "/components#sec-image-compare", false, null, "New")
            })
        };
    }
}

using SoftMax.LaughTale.Components.Models;

namespace SoftMax.LaughTale.Showcase.Services;

public static class NavigationData
{
    public static List<SidebarItem> GetGlobalSidebarItems(string currentPath)
    {
        return new List<SidebarItem>
        {
            new("Overview", "compass", null, false, new List<SidebarItem>
            {
                new("Showcase Home", "home", "/", currentPath == "/"),
                new("Dashboard", "activity", "/dashboard", currentPath.StartsWith("/dashboard")),
                new("Architecture", "fileText", "/About", currentPath.StartsWith("/About"))
            }),
            new("Form Controls (27)", "edit3", null, false, new List<SidebarItem>
            {
                new("Dynamic Form", "fileSpreadsheet", "/enterprise#sec-dynamic-form", false, null, "Reflect"),
                new("InputText", "edit", "/enterprise#sec-input-text"),
                new("Textarea", "fileText", "/enterprise#sec-textarea"),
                new("InputNumber", "sliders", "/enterprise#sec-input-number"),
                new("InputOtp", "shieldAlert", "/enterprise#sec-input-otp"),
                new("InputPassword", "lock", "/enterprise#sec-input-password"),
                new("InputMask", "edit", "/enterprise#sec-input-mask"),
                new("InputTags", "tag", "/enterprise#sec-inputtags", false, null, "Tags"),
                new("AutoComplete", "search", "/enterprise#sec-autocomplete"),
                new("Select", "listFilter", "/enterprise#sec-select"),
                new("MultiSelect", "listFilter", "/enterprise#sec-multiselect"),
                new("CascadeSelect", "folderTree", "/enterprise#sec-cascadeselect"),
                new("TreeSelect", "folderTree", "/enterprise#sec-treeselect"),
                new("Checkbox", "checkCircle", "/enterprise#sec-checkbox"),
                new("RadioButton", "check", "/enterprise#sec-radio"),
                new("ToggleButton", "zap", "/enterprise#sec-toggle-button"),
                new("ToggleSwitch", "sliders", "/enterprise#sec-toggle-switch"),
                new("Slider", "sliders", "/enterprise#sec-slider"),
                new("Rating", "star", "/enterprise#sec-rating"),
                new("SelectButton", "layoutGrid", "/enterprise#sec-select-button"),
                new("ColorPicker", "palette", "/enterprise#sec-color-picker"),
                new("Knob", "gauge", "/enterprise#sec-knob"),
                new("DatePicker", "calendar", "/enterprise#sec-datepicker"),
                new("FloatLabel", "edit", "/enterprise#sec-floatlabel"),
                new("IftaLabel", "edit", "/enterprise#sec-iftalabel"),
                new("Label", "tag", "/enterprise#sec-label"),
                new("InputGroup", "layers", "/enterprise#sec-inputgroup")
            }),
            new("Buttons (3)", "zap", null, false, new List<SidebarItem>
            {
                new("Button", "zap", "/enterprise#sec-button"),
                new("SplitButton", "zap", "/enterprise#sec-split-button"),
                new("SpeedDial FAB", "zap", "/enterprise#sec-speed-dial")
            }),
            new("Data & Tables (14)", "database", null, false, new List<SidebarItem>
            {
                new("DataTable", "table2", "/enterprise#sec-datagrid", false, null, "Live"),
                new("DataView", "layoutGrid", "/enterprise#sec-dataview"),
                new("Tree", "folderTree", "/enterprise#sec-tree"),
                new("TreeTable", "table2", "/enterprise#sec-treetable", false, null, "New"),
                new("Paginator", "grid", "/enterprise#sec-paginator"),
                new("Splitter", "columns3", "/enterprise#sec-splitter", false, null, "New"),
                new("Listbox", "listFilter", "/enterprise#sec-listbox"),
                new("PickList", "arrowLeftRight", "/enterprise#sec-picklist"),
                new("OrderList", "arrowLeftRight", "/enterprise#sec-orderlist"),
                new("OrgChart Hierarchy", "folderTree", "/enterprise#sec-orgchart"),
                new("Card", "layers", "/enterprise#sec-card", false, null, "New"),
                new("Divider", "columns3", "/enterprise#sec-divider", false, null, "New"),
                new("Fieldset", "layoutGrid", "/enterprise#sec-fieldset", false, null, "New"),
                new("Panel", "square", "/enterprise#sec-panel", false, null, "New"),
                new("ScrollArea", "chevronsUpDown", "/enterprise#sec-scrollarea", false, null, "New"),
                new("Accordion", "folderTree", "/enterprise#sec-accordion"),
                new("Tabs", "columns3", "/enterprise#sec-tabs", false, null, "New"),
                new("Toolbar", "columns3", "/enterprise#sec-toolbar", false, null, "New"),
                new("Timeline", "activity", "/enterprise#sec-timeline")
            }),
            new("Navigation & Menus (10)", "compass", null, false, new List<SidebarItem>
            {
                new("Menu", "menu", "/enterprise#sec-menu", false, null, "New"),
                new("TieredMenu", "menu", "/enterprise#sec-tieredmenu", false, null, "New"),
                new("Menubar", "compass", "/enterprise#sec-menubar", false, null, "New"),
                new("ContextMenu", "moreHorizontal", "/enterprise#sec-context-menu"),
                new("Breadcrumb", "compass", "/enterprise#sec-breadcrumb", false, null, "New"),
                new("macOS Dock", "layoutGrid", "/enterprise#sec-dock"),
                new("Sidebar", "folderTree", "/enterprise#sec-sidebar", false, null, "New"),
                new("Stepper", "listOrdered", "/enterprise#sec-stepper", false, null, "New"),
                new("ScrollTop", "arrowUp", "/enterprise#sec-scroll-top"),
                new("CommandMenu", "terminal", "/enterprise#sec-command-palette", false, null, "New")
            }),
            new("Overlays & Dialogs (9)", "layers", null, false, new List<SidebarItem>
            {
                new("Dialog", "layers", "/enterprise#sec-dialog", false, null, "New"),
                new("Modal Dialog", "layers", "/enterprise#sec-modal"),
                new("Drawer", "sidebar", "/enterprise#sec-drawer", false, null, "New"),
                new("Popover", "messageSquare", "/enterprise#sec-popover", false, null, "New"),
                new("Tooltip", "info", "/enterprise#sec-tooltip", false, null, "New"),
                new("ConfirmDialog", "alertTriangle", "/enterprise#sec-confirm-dialog", false, null, "New"),
                new("ConfirmPopup", "alertTriangle", "/enterprise#sec-confirm-popup"),
                new("Toast", "bell", "/enterprise#sec-toast", false, null, "New"),
                new("BlockUI Locker", "lock", "/enterprise#sec-blockui")
            }),
            new("Feedback & Status (8)", "activity", null, false, new List<SidebarItem>
            {
                new("Message", "info", "/enterprise#sec-message", false, null, "New"),
                new("ProgressBar", "loader2", "/enterprise#sec-progress-bar"),
                new("Skeleton Placeholder", "loader2", "/enterprise#sec-skeleton"),
                new("MeterGroup Gauge", "gauge", "/enterprise#sec-meter-group"),
                new("AvatarGroup", "compass", "/enterprise#sec-avatar-group"),
                new("Tag & Badges", "check", "/enterprise#sec-tag"),
                new("Inplace Editor", "edit3", "/enterprise#sec-inplace"),
                new("Terminal CLI", "terminal", "/enterprise#sec-terminal")
            }),
            new("Media & Files (5)", "image", null, false, new List<SidebarItem>
            {
                new("Galleria Stage", "galleryThumbnails", "/enterprise#sec-galleria"),
                new("Carousel Slider", "image", "/enterprise#sec-carousel"),
                new("FileUpload", "uploadCloud", "/enterprise#sec-fileupload", false, null, "New"),
                new("Image Compare", "columns3", "/enterprise#sec-image-compare"),
                new("Camera Snapshot", "camera", "/enterprise#sec-camera")
            })
        };
    }
}

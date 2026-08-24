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
            new("Data & Tables (11)", "database", null, false, new List<SidebarItem>
            {
                new("Security DataGrid", "table2", "/enterprise#sec-datagrid", false, null, "Live"),
                new("DataView", "layoutGrid", "/enterprise#sec-dataview"),
                new("Paginator", "grid", "/enterprise#sec-paginator"),
                new("Splitter Panels", "columns3", "/enterprise#sec-splitter"),
                new("Listbox", "listFilter", "/enterprise#sec-listbox"),
                new("PickList Transfer", "arrowLeftRight", "/enterprise#sec-picklist"),
                new("OrderList", "arrowLeftRight", "/enterprise#sec-orderlist"),
                new("OrgChart Hierarchy", "folderTree", "/enterprise#sec-orgchart"),
                new("Accordion", "folderTree", "/enterprise#sec-accordion"),
                new("Sliding Tabs", "columns3", "/enterprise#sec-tabs"),
                new("Timeline", "activity", "/enterprise#sec-timeline")
            }),
            new("Navigation & Menus (9)", "compass", null, false, new List<SidebarItem>
            {
                new("Header Menu", "menu", "/enterprise#sec-menu"),
                new("ContextMenu", "moreHorizontal", "/enterprise#sec-context-menu"),
                new("Breadcrumb", "compass", "/enterprise#sec-breadcrumb"),
                new("macOS Dock", "layoutGrid", "/enterprise#sec-dock"),
                new("Sidebar Tree", "folderTree", "/enterprise#sec-sidebar"),
                new("Stepper Flow", "arrowRight", "/enterprise#sec-stepper"),
                new("SpeedDial FAB", "zap", "/enterprise#sec-speed-dial"),
                new("ScrollTop", "arrowUp", "/enterprise#sec-scroll-top"),
                new("Command Palette", "terminal", "/enterprise#sec-command-palette")
            }),
            new("Overlays & Dialogs (7)", "layers", null, false, new List<SidebarItem>
            {
                new("Modal Dialog", "layers", "/enterprise#sec-modal"),
                new("Drawer Offcanvas", "sidebar", "/enterprise#sec-drawer"),
                new("Popover", "messageSquare", "/enterprise#sec-popover"),
                new("Tooltip", "info", "/enterprise#sec-tooltip"),
                new("ConfirmPopup", "alertTriangle", "/enterprise#sec-confirm-popup"),
                new("Toast Container", "bell", "/enterprise#sec-toast"),
                new("BlockUI Locker", "lock", "/enterprise#sec-blockui")
            }),
            new("Feedback & Status (7)", "activity", null, false, new List<SidebarItem>
            {
                new("ProgressBar", "loader2", "/enterprise#sec-progress-bar"),
                new("Skeleton Placeholder", "loader2", "/enterprise#sec-skeleton"),
                new("MeterGroup Gauge", "gauge", "/enterprise#sec-meter-group"),
                new("AvatarGroup", "compass", "/enterprise#sec-avatar-group"),
                new("Tag & Badges", "check", "/enterprise#sec-tag"),
                new("Inplace Editor", "edit3", "/enterprise#sec-inplace"),
                new("Terminal CLI", "terminal", "/enterprise#sec-terminal")
            }),
            new("Media & Files (6)", "image", null, false, new List<SidebarItem>
            {
                new("Galleria Stage", "galleryThumbnails", "/enterprise#sec-galleria"),
                new("Carousel Slider", "image", "/enterprise#sec-carousel"),
                new("File Dropzone", "uploadCloud", "/enterprise#sec-dropzone"),
                new("Image Compare", "columns3", "/enterprise#sec-image-compare"),
                new("Camera Snapshot", "camera", "/enterprise#sec-camera"),
                new("SplitButton Trigger", "zap", "/enterprise#sec-split-button")
            })
        };
    }
}

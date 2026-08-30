using LaughTale.Components.Models;

namespace LaughTale.Docs.Services;

public static class DocsNavigationData
{
    public static List<SidebarItem> GetDocsSidebarItems(string currentPath)
    {
        currentPath = (currentPath ?? "").ToLowerInvariant();
        if (currentPath == "/" || string.IsNullOrEmpty(currentPath))
        {
            currentPath = "/doc/01-getting-started";
        }

        return new List<SidebarItem>
        {
            new SidebarItem("Getting Started", "zap", null, true, new List<SidebarItem>
            {
                new("Quickstart & Setup", "zap", "/doc/01-getting-started", currentPath.Contains("01-getting-started")),
                new("Hydration Strategies", "layers", "/doc/02-hydration-strategies", currentPath.Contains("02-hydration-strategies")),
                new("Declarative Directives", "terminal", "/doc/06-declarative-directives", currentPath.Contains("06-declarative-directives"))
            }),

            new SidebarItem("Form & Input Controls", "edit3", null, true, new List<SidebarItem>
            {
                new("InputNumber & Currency", "hash", "/doc/07-input-number", currentPath.Contains("07-input-number")),
                new("InputOtp Verification", "shieldAlert", "/doc/08-input-otp", currentPath.Contains("08-input-otp")),
                new("InputPassword & Meter", "key", "/doc/09-input-password", currentPath.Contains("09-input-password")),
                new("Select & MultiSelect", "listFilter", "/doc/59-select", currentPath.Contains("59-select"), null, "Suite"),
                new("AutoComplete Combobox", "search", "/doc/32-autocomplete", currentPath.Contains("32-autocomplete")),
                new("ColorPicker Palette", "palette", "/doc/33-color-picker", currentPath.Contains("33-color-picker")),
                new("Inplace Click-to-Edit", "edit3", "/doc/38-inplace", currentPath.Contains("38-inplace")),
                new("ToggleSwitch", "toggleRight", "/doc/10-toggle-switch", currentPath.Contains("10-toggle-switch")),
                new("Slider Range", "sliders", "/doc/11-slider", currentPath.Contains("11-slider")),
                new("Rating Stars", "star", "/doc/12-rating", currentPath.Contains("12-rating")),
                new("SelectButton Segmented", "checkSquare", "/doc/13-select-button", currentPath.Contains("13-select-button")),
                new("InputTags & Chips", "tag", "/doc/14-chips", currentPath.Contains("14-chips")),
                new("DatePicker Calendar", "calendar", "/doc/15-datepicker", currentPath.Contains("15-datepicker"))
            }),

            new SidebarItem("Buttons & Actions", "zap", null, true, new List<SidebarItem>
            {
                new("Button & SplitButton", "zap", "/doc/60-button", currentPath.Contains("60-button"), null, "New"),
                new("SpeedDial FAB", "plus", "/doc/27-speed-dial", currentPath.Contains("27-speed-dial"))
            }),

            new SidebarItem("Data & Tables", "table2", null, true, new List<SidebarItem>
            {
                new("DataTable Suite", "table2", "/doc/19-datatable", currentPath.Contains("19-datatable"), null, "Live"),
                new("TreeTable Hierarchy", "table2", "/doc/20-treetable", currentPath.Contains("20-treetable"), null, "New"),
                new("DataView Grid/List", "layoutGrid", "/doc/48-dataview", currentPath.Contains("48-dataview"), null, "New"),
                new("TreeSelect", "folderTree", "/doc/21-tree-select", currentPath.Contains("21-tree-select")),
                new("Listbox Selector", "listFilter", "/doc/54-listbox", currentPath.Contains("54-listbox"), null, "New"),
                new("PickList Dual Transfer", "arrowLeftRight", "/doc/55-picklist", currentPath.Contains("55-picklist"), null, "New"),
                new("OrderList Reorder", "arrowUpDown", "/doc/56-orderlist", currentPath.Contains("56-orderlist"), null, "New"),
                new("OrganizationChart", "folderTree", "/doc/57-orgchart", currentPath.Contains("57-orgchart"), null, "New"),
                new("Paginator Bar", "grid", "/doc/58-paginator", currentPath.Contains("58-paginator"), null, "New"),
                new("Stepper Multi-Step", "gitCommit", "/doc/16-stepper", currentPath.Contains("16-stepper")),
                new("Timeline Audit Log", "clock", "/doc/17-timeline", currentPath.Contains("17-timeline"))
            }),

            new SidebarItem("Panels & Navigation", "columns3", null, true, new List<SidebarItem>
            {
                new("Sidebar Nav System", "folderTree", "/doc/62-sidebar", currentPath.Contains("62-sidebar"), null, "New"),
                new("Menubar Global Bar", "compass", "/doc/49-menubar", currentPath.Contains("49-menubar"), null, "New"),
                new("Menu & TieredMenu", "menu", "/doc/50-menu", currentPath.Contains("50-menu"), null, "New"),
                new("ContextMenu Overlay", "moreHorizontal", "/doc/47-contextmenu", currentPath.Contains("47-contextmenu")),
                new("Command Palette", "command", "/doc/41-command-palette", currentPath.Contains("41-command-palette")),
                new("Splitter Multi-Pane", "columns3", "/doc/53-splitter", currentPath.Contains("53-splitter"), null, "New"),
                new("Accordion Panels", "list", "/doc/30-accordion", currentPath.Contains("30-accordion")),
                new("Tabs & TabView", "columns3", "/doc/31-tabs", currentPath.Contains("31-tabs")),
                new("Breadcrumb Nav", "navigation", "/doc/36-breadcrumb", currentPath.Contains("36-breadcrumb")),
                new("ScrollTop Button", "arrowUp", "/doc/37-scroll-top", currentPath.Contains("37-scroll-top")),
                new("Theme Studio", "palette", "/doc/42-theme-studio", currentPath.Contains("42-theme-studio"))
            }),

            new SidebarItem("Overlays & Dialogs", "layers", null, true, new List<SidebarItem>
            {
                new("Dialog Modal Window", "messageSquare", "/doc/29-dialog", currentPath.Contains("29-dialog"), null, "New"),
                new("Offcanvas Drawer", "sidebar", "/doc/26-drawer", currentPath.Contains("26-drawer")),
                new("Popover Floating Panel", "messageSquare", "/doc/51-popover", currentPath.Contains("51-popover"), null, "New"),
                new("Tooltip Directives", "info", "/doc/52-tooltip", currentPath.Contains("52-tooltip"), null, "New"),
                new("ConfirmPopup Alert", "alertTriangle", "/doc/28-confirm-popup", currentPath.Contains("28-confirm-popup")),
                new("Toast Notifications", "bell", "/doc/45-toast", currentPath.Contains("45-toast")),
                new("BlockUI Locker", "lock", "/doc/61-blockui", currentPath.Contains("61-blockui"), null, "New")
            }),

            new SidebarItem("Metrics & Visual Media", "barChart3", null, true, new List<SidebarItem>
            {
                new("Message Alerts", "info", "/doc/44-message", currentPath.Contains("44-message")),
                new("Knob Radial Dial", "gauge", "/doc/34-knob", currentPath.Contains("34-knob")),
                new("Tag & Badges", "tag", "/doc/35-tag", currentPath.Contains("35-tag")),
                new("MeterGroup Gauge", "barChart3", "/doc/22-meter-group", currentPath.Contains("22-meter-group")),
                new("Avatar & AvatarGroup", "users", "/doc/23-avatar-group", currentPath.Contains("23-avatar-group")),
                new("Compare Slider", "columns3", "/doc/24-image-compare", currentPath.Contains("24-image-compare")),
                new("Progress & Skeleton", "loader2", "/doc/25-progress-skeleton", currentPath.Contains("25-progress-skeleton")),
                new("Carousel Slider", "image", "/doc/46-carousel", currentPath.Contains("46-carousel")),
                new("FileUpload Manager", "uploadCloud", "/doc/18-fileupload", currentPath.Contains("18-fileupload"), null, "New")
            }),

            new SidebarItem("Composables & Architecture", "code", null, true, new List<SidebarItem>
            {
                new("Headless Composables", "code", "/doc/39-composables", currentPath.Contains("39-composables")),
                new("Theming & Tokens", "droplet", "/doc/40-theming-and-tokens", currentPath.Contains("40-theming-and-tokens")),
                new("View Transitions", "play", "/doc/03-view-transitions", currentPath.Contains("03-view-transitions")),
                new("Server Slot Projection", "box", "/doc/04-slots-and-projection", currentPath.Contains("04-slots-and-projection")),
                new("Content Collections", "database", "/doc/05-content-collections", currentPath.Contains("05-content-collections")),
                new("Security & CSP", "shieldAlert", "/doc/63-security-and-csp", currentPath.Contains("63-security-and-csp"), null, "New"),
                new("OKLCH Design Tokens", "palette", "/doc/64-theming-and-design-tokens", currentPath.Contains("64-theming-and-design-tokens"), null, "New"),
                new("Islands vs Blazor Guide", "layers", "/doc/65-architecture-decision-guide", currentPath.Contains("65-architecture-decision-guide"), null, "New"),
                new("Migration to v3.0.0", "gitCommit", "/doc/66-migration-and-upgrade-guide", currentPath.Contains("66-migration-and-upgrade-guide"), null, "v3.0"),
                new("Browser Support Matrix", "globe", "/doc/67-browser-support-and-compatibility", currentPath.Contains("67-browser-support-and-compatibility"), null, "v3.0")
            })
        };
    }
}

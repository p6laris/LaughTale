using SoftMax.LaughTale.Components.Models;

namespace SoftMax.LaughTale.Docs.Services;

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
                new("Hydration Strategies", "layers", "/doc/02-hydration-strategies", currentPath.Contains("02-hydration-strategies"))
            }),

            new SidebarItem("Zero-JS Architecture", "terminal", null, true, new List<SidebarItem>
            {
                new("Declarative Directives", "terminal", "/doc/06-declarative-directives", currentPath.Contains("06-declarative-directives"))
            }),

            new SidebarItem("Form & Input Controls", "edit3", null, true, new List<SidebarItem>
            {
                new("Number & Currency", "hash", "/doc/07-input-number", currentPath.Contains("07-input-number")),
                new("OTP Verification", "shieldAlert", "/doc/08-input-otp", currentPath.Contains("08-input-otp")),
                new("Password & Meter", "key", "/doc/09-input-password", currentPath.Contains("09-input-password")),
                new("AutoComplete Combobox", "search", "/doc/32-autocomplete", currentPath.Contains("32-autocomplete")),
                new("ColorPicker Palette", "palette", "/doc/33-color-picker", currentPath.Contains("33-color-picker")),
                new("Inplace Click-to-Edit", "edit3", "/doc/38-inplace", currentPath.Contains("38-inplace")),
                new("Aura Spring Switch", "toggleRight", "/doc/10-toggle-switch", currentPath.Contains("10-toggle-switch")),
                new("Range Slider", "sliders", "/doc/11-slider", currentPath.Contains("11-slider")),
                new("Star Rating", "star", "/doc/12-rating", currentPath.Contains("12-rating")),
                new("Segmented SelectButton", "checkSquare", "/doc/13-select-button", currentPath.Contains("13-select-button")),
                new("InputTags & Chips", "tag", "/doc/14-chips", currentPath.Contains("14-chips")),
                new("Calendar DatePicker", "calendar", "/doc/15-datepicker", currentPath.Contains("15-datepicker"))
            }),

            new SidebarItem("Data & Structure", "table2", null, true, new List<SidebarItem>
            {
                new("Multi-Step Stepper", "gitCommit", "/doc/16-stepper", currentPath.Contains("16-stepper")),
                new("Audit Log Timeline", "clock", "/doc/17-timeline", currentPath.Contains("17-timeline")),
                new("Live WebRTC Camera", "camera", "/doc/18-camera", currentPath.Contains("18-camera")),
                new("Filterable DataGrid", "table2", "/doc/19-datagrid", currentPath.Contains("19-datagrid")),
                new("Document Dropzone", "uploadCloud", "/doc/20-dropzone", currentPath.Contains("20-dropzone")),
                new("Hierarchical TreeSelect", "folderTree", "/doc/21-tree-select", currentPath.Contains("21-tree-select"))
            }),

            new SidebarItem("Panels & Navigation", "columns3", null, true, new List<SidebarItem>
            {
                new("Sidebar Compound Nav", "folderTree", "/enterprise#sec-sidebar", false, null, "New"),
                new("TieredMenu Flyout", "menu", "/enterprise#sec-tieredmenu", false, null, "New"),
                new("ContextMenu Overlay", "moreHorizontal", "/doc/47-contextmenu", currentPath.Contains("47-contextmenu")),
                new("Spotlight Command", "command", "/doc/41-command-palette", currentPath.Contains("41-command-palette")),
                new("TweakAura Studio", "palette", "/doc/42-theme-studio", currentPath.Contains("42-theme-studio")),
                new("Accordion Panels", "list", "/doc/30-accordion", currentPath.Contains("30-accordion")),
                new("Tabs & TabView", "columns3", "/doc/31-tabs", currentPath.Contains("31-tabs")),
                new("Breadcrumb Navigation", "navigation", "/doc/36-breadcrumb", currentPath.Contains("36-breadcrumb")),
                new("ScrollTop Button", "arrowUp", "/doc/37-scroll-top", currentPath.Contains("37-scroll-top")),
                new("Offcanvas Drawer", "sidebar", "/doc/26-drawer", currentPath.Contains("26-drawer")),
                new("SpeedDial FAB", "plus", "/doc/27-speed-dial", currentPath.Contains("27-speed-dial")),
                new("ConfirmPopup", "alertTriangle", "/doc/28-confirm-popup", currentPath.Contains("28-confirm-popup")),
                new("Modal Dialog", "messageSquare", "/doc/29-modal-toast", currentPath.Contains("29-modal-toast")),
                new("Toast Overlays", "bell", "/doc/45-toast", currentPath.Contains("45-toast"))
            }),

            new SidebarItem("Metrics & Visual Media", "barChart3", null, true, new List<SidebarItem>
            {
                new("Message Alerts", "info", "/doc/44-message", currentPath.Contains("44-message")),
                new("Radial Dial Knob", "gauge", "/doc/34-knob", currentPath.Contains("34-knob")),
                new("Status Tag & Badge", "tag", "/doc/35-tag", currentPath.Contains("35-tag")),
                new("MeterGroup Gauge", "barChart3", "/doc/22-meter-group", currentPath.Contains("22-meter-group")),
                new("Avatar & AvatarGroup", "users", "/doc/23-avatar-group", currentPath.Contains("23-avatar-group")),
                new("Compare Slider", "columns3", "/doc/24-image-compare", currentPath.Contains("24-image-compare")),
                new("Progress & Skeleton", "loader2", "/doc/25-progress-skeleton", currentPath.Contains("25-progress-skeleton")),
                new("Carousel Slider", "image", "/doc/46-carousel", currentPath.Contains("46-carousel"))
            }),

            new SidebarItem("Composables & Architecture", "code", null, true, new List<SidebarItem>
            {
                new("Headless Composables", "code", "/doc/39-composables", currentPath.Contains("39-composables")),
                new("Theming & Tokens", "droplet", "/doc/40-theming-and-tokens", currentPath.Contains("40-theming-and-tokens")),
                new("View Transitions", "play", "/doc/03-view-transitions", currentPath.Contains("03-view-transitions")),
                new("Server Slot Projection", "box", "/doc/04-slots-and-projection", currentPath.Contains("04-slots-and-projection")),
                new("Content Collections", "database", "/doc/05-content-collections", currentPath.Contains("05-content-collections"))
            })
        };
    }
}

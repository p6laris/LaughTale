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
                new("Enterprise UI", "grid", "/enterprise", currentPath.StartsWith("/enterprise"), null, "64"),
                new("Dashboard", "activity", "/dashboard", currentPath.StartsWith("/dashboard")),
                new("Architecture", "fileText", "/About", currentPath.StartsWith("/About"))
            }),
            new("Form Controls", "edit3", null, false, new List<SidebarItem>
            {
                new("Dynamic Forms", "fileSpreadsheet", "/enterprise#sec-dynamic-form", false, null, "Reflect"),
                new("Form Inputs & OTP", "shieldAlert", "/enterprise#sec-inputs-otp"),
                new("Enhanced Inputs & Masks", "edit", "/enterprise#sec-enhanced-inputs")
            }),
            new("Data & Tables", "database", null, false, new List<SidebarItem>
            {
                new("Splitter Panels", "columns3", "/enterprise#sec-splitter"),
                new("Advanced Selects", "listFilter", "/enterprise#sec-advanced-selects"),
                new("PickList & Transfer", "arrowLeftRight", "/enterprise#sec-transfer-lists"),
                new("Hierarchy & Terminal", "terminal", "/enterprise#sec-hierarchy-terminal"),
                new("Security DataGrid", "table2", "/enterprise#sec-datagrid", false, null, "Live"),
                new("DataView & Paginator", "layoutGrid", "/enterprise#sec-dataview-paginator"),
                new("Panels & Tabs", "folderTree", "/enterprise#sec-panels-tabs")
            }),
            new("Overlays & Feedback", "layers", null, false, new List<SidebarItem>
            {
                new("Overlays & Dialogs", "messageSquare", "/enterprise#sec-overlays-popovers"),
                new("TreeSelect & Meters", "gauge", "/enterprise#sec-treeselect-meters"),
                new("Progress & Skeleton", "loader2", "/enterprise#sec-progress-skeleton")
            }),
            new("Media & Files", "image", null, false, new List<SidebarItem>
            {
                new("Galleria & Dock", "galleryThumbnails", "/enterprise#sec-galleria-dock"),
                new("Carousel & Dropzone", "uploadCloud", "/enterprise#sec-carousel-dropzone")
            })
        };
    }
}

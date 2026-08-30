using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Models;

namespace LaughTale.Showcase.Pages.Components;

public class ComponentCategoryCard
{
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = "";
    public int Count { get; set; }
    public List<string> FeaturedComponents { get; set; } = new();
    public string Link { get; set; } = "";
}

public class IndexModel : PageModel
{
    public List<ComponentCategoryCard> Categories { get; set; } = new()
    {
        new()
        {
            Title = "Form & Input Controls",
            Description = "Aura enterprise text inputs, numeric formatters, OTP verifiers, calendar pickers, and multi-select comboboxes.",
            Icon = "edit3",
            Count = 25,
            FeaturedComponents = new() { "InputText", "InputNumber", "InputOtp", "AutoComplete", "DatePicker", "Select", "ToggleSwitch" },
            Link = "/enterprise#sec-input-text"
        },
        new()
        {
            Title = "Data & Tables",
            Description = "High-performance tabular presentation, hierarchical tree tables, dual transfer picklists, and multi-step wizards.",
            Icon = "table2",
            Count = 19,
            FeaturedComponents = new() { "DataTable", "TreeTable", "DataView", "PickList", "Stepper", "Timeline", "OrgChart" },
            Link = "/enterprise#sec-datagrid"
        },
        new()
        {
            Title = "Overlays & Dialogs",
            Description = "Zero-layout-shift modal windows, slide-out offcanvas drawers, popover contextual panels, and toast alerts.",
            Icon = "layers",
            Count = 8,
            FeaturedComponents = new() { "Dialog", "Drawer", "ConfirmDialog", "Popover", "Tooltip", "Toast", "BlockUI" },
            Link = "/enterprise#sec-dialog"
        },
        new()
        {
            Title = "Navigation & Menus",
            Description = "Global command palettes (Ctrl+K), multi-tiered contextual menus, breadcrumb bars, and responsive sidebars.",
            Icon = "compass",
            Count = 9,
            FeaturedComponents = new() { "CommandMenu", "Sidebar", "Menubar", "ContextMenu", "Tabs", "Accordion" },
            Link = "/enterprise#sec-sidebar"
        },
        new()
        {
            Title = "Media, Camera & Files",
            Description = "WebRTC live webcam captures, drag-and-drop secure file dropzones, radial gauges, and image comparison sliders.",
            Icon = "image",
            Count = 8,
            FeaturedComponents = new() { "Camera", "FileUpload", "Dropzone", "Knob", "MeterGroup", "Carousel", "Compare" },
            Link = "/enterprise#sec-fileupload"
        },
        new()
        {
            Title = "Feedback & Status Indicators",
            Description = "Inline alert messages, animated progress loaders, skeleton loaders, avatar badges, and status tags.",
            Icon = "activity",
            Count = 7,
            FeaturedComponents = new() { "Message", "ProgressBar", "Skeleton", "AvatarGroup", "Tag", "Inplace" },
            Link = "/enterprise#sec-message"
        }
    };

    public void OnGet()
    {
    }
}

using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Models;
using System.Text.Json;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// TagHelper for <island-number /> / <island-currency />
/// </summary>
[HtmlTargetElement("island-number")]
[HtmlTargetElement("island-currency")]
public class IslandNumberTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public double? Value { get; set; }
    public string Mode { get; set; } = "decimal";
    public string? Currency { get; set; } = "USD";
    public string? Prefix { get; set; }
    public string? Suffix { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public double Step { get; set; } = 1;
    public int? Decimals { get; set; }
    public bool ShowButtons { get; set; } = true;
    public string? Placeholder { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "input-number");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            mode = Mode,
            currency = Currency,
            prefix = Prefix,
            suffix = Suffix,
            min = Min,
            max = Max,
            step = Step,
            decimals = Decimals,
            showButtons = ShowButtons,
            placeholder = Placeholder,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-otp />
/// </summary>
[HtmlTargetElement("island-otp")]
public class IslandOtpTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public int Length { get; set; } = 6;
    public bool Mask { get; set; } = false;
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "input-otp");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            length = Length,
            mask = Mask,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-password />
/// </summary>
[HtmlTargetElement("island-password")]
public class IslandPasswordTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? Placeholder { get; set; }
    public bool ToggleMask { get; set; } = true;
    public bool ShowMeter { get; set; } = true;
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "input-password");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            placeholder = Placeholder,
            toggleMask = ToggleMask,
            showMeter = ShowMeter,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-switch />
/// </summary>
[HtmlTargetElement("island-switch")]
public class IslandSwitchTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public bool Checked { get; set; } = false;
    public string? Label { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "toggle-switch");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            @checked = Checked,
            label = Label,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-slider />
/// </summary>
[HtmlTargetElement("island-slider")]
public class IslandSliderTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public double Value { get; set; } = 0;
    public double Min { get; set; } = 0;
    public double Max { get; set; } = 100;
    public double Step { get; set; } = 1;
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "slider");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            min = Min,
            max = Max,
            step = Step,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-rating />
/// </summary>
[HtmlTargetElement("island-rating")]
public class IslandRatingTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public int Value { get; set; } = 0;
    public int Stars { get; set; } = 5;
    public bool AllowCancel { get; set; } = true;
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "rating");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            stars = Stars,
            allowCancel = AllowCancel,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-select-button />
/// </summary>
[HtmlTargetElement("island-select-button")]
public class IslandSelectButtonTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public List<SelectButtonItem> Items { get; set; } = new();
    public string? Value { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "select-button");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            items = Items,
            value = Value,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-chips />
/// </summary>
[HtmlTargetElement("island-chips")]
public class IslandChipsTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public IEnumerable<string>? Values { get; set; }
    public string? Placeholder { get; set; }
    public int? Max { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "chips");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            values = Values,
            placeholder = Placeholder,
            max = Max,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-datepicker />
/// </summary>
[HtmlTargetElement("island-datepicker")]
public class IslandDatePickerTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? Value { get; set; }
    public string? Placeholder { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "datepicker");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            placeholder = Placeholder,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-meter-group />
/// </summary>
[HtmlTargetElement("island-meter-group")]
public class IslandMeterGroupTagHelper : TagHelper
{
    public List<MeterValue> Values { get; set; } = new();
    public string? Title { get; set; }
    public bool ShowLabels { get; set; } = true;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "meter-group");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            values = Values,
            title = Title,
            showLabels = ShowLabels
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-avatar-group />
/// </summary>
[HtmlTargetElement("island-avatar-group")]
public class IslandAvatarGroupTagHelper : TagHelper
{
    public List<AvatarItem> Avatars { get; set; } = new();
    public int Max { get; set; } = 4;
    public string Size { get; set; } = "md";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "avatar-group");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            avatars = Avatars,
            max = Max,
            size = Size
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-progress-bar />
/// </summary>
[HtmlTargetElement("island-progress-bar")]
public class IslandProgressBarTagHelper : TagHelper
{
    public double? Value { get; set; }
    public string Mode { get; set; } = "determinate";
    public bool ShowValue { get; set; } = true;
    public string Height { get; set; } = "0.75rem";
    public string? Color { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "progress-bar");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            value = Value,
            mode = Mode,
            showValue = ShowValue,
            height = Height,
            color = Color
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-skeleton />
/// </summary>
[HtmlTargetElement("island-skeleton")]
public class IslandSkeletonTagHelper : TagHelper
{
    public string Shape { get; set; } = "rectangle";
    public string Width { get; set; } = "100%";
    public string Height { get; set; } = "1.25rem";
    public string? BorderRadius { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "skeleton");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            shape = Shape,
            width = Width,
            height = Height,
            borderRadius = BorderRadius
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-drawer />
/// </summary>
[HtmlTargetElement("island-drawer")]
public class IslandDrawerTagHelper : TagHelper
{
    public string Position { get; set; } = "right";
    public string? Title { get; set; }
    public string? TriggerText { get; set; }
    public string Width { get; set; } = "380px";

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "drawer");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            position = Position,
            title = Title,
            triggerText = TriggerText,
            width = Width
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent($"<div data-slot=\"default\">{childContent.GetContent()}</div>");
    }
}

/// <summary>
/// TagHelper for <island-speed-dial />
/// </summary>
[HtmlTargetElement("island-speed-dial")]
public class IslandSpeedDialTagHelper : TagHelper
{
    public List<SpeedDialAction> Actions { get; set; } = new();
    public string Direction { get; set; } = "up";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "speed-dial");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            actions = Actions,
            direction = Direction
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-image-compare />
/// </summary>
[HtmlTargetElement("island-image-compare")]
public class IslandImageCompareTagHelper : TagHelper
{
    public string BeforeImage { get; set; } = string.Empty;
    public string AfterImage { get; set; } = string.Empty;
    public string? BeforeLabel { get; set; } = "Before";
    public string? AfterLabel { get; set; } = "After";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "image-compare");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            beforeImage = BeforeImage,
            afterImage = AfterImage,
            beforeLabel = BeforeLabel,
            afterLabel = AfterLabel
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-confirm-popup />
/// </summary>
[HtmlTargetElement("island-confirm-popup")]
public class IslandConfirmPopupTagHelper : TagHelper
{
    public string TargetSelector { get; set; } = string.Empty;
    public string Message { get; set; } = "Are you sure you want to proceed?";
    public string AcceptText { get; set; } = "Confirm";
    public string RejectText { get; set; } = "Cancel";
    public string? ActionName { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "confirm-popup");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            targetSelector = TargetSelector,
            message = Message,
            acceptText = AcceptText,
            rejectText = RejectText,
            actionName = ActionName
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-accordion />
/// </summary>
[HtmlTargetElement("island-accordion")]
public class IslandAccordionTagHelper : TagHelper
{
    public List<AccordionTab>? Tabs { get; set; }
    public bool Multiple { get; set; } = false;
    public int ActiveIndex { get; set; } = 0;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "accordion");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            tabs = Tabs ?? new(),
            multiple = Multiple,
            activeIndex = ActiveIndex
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-tabs />
/// </summary>
[HtmlTargetElement("island-tabs")]
public class IslandTabsTagHelper : TagHelper
{
    public List<TabItem>? Tabs { get; set; }
    public int ActiveIndex { get; set; } = 0;
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "tabs");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            tabs = Tabs ?? new(),
            activeIndex = ActiveIndex,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-autocomplete />
/// </summary>
[HtmlTargetElement("island-autocomplete")]
public class IslandAutoCompleteTagHelper : TagHelper
{
    public List<AutoCompleteItem>? Items { get; set; }
    public string? Placeholder { get; set; }
    public string? TargetInput { get; set; }
    public string? Value { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "autocomplete");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            items = Items ?? new(),
            placeholder = Placeholder,
            targetInputName = TargetInput,
            value = Value,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-color-picker />
/// </summary>
[HtmlTargetElement("island-color-picker")]
public class IslandColorPickerTagHelper : TagHelper
{
    public string Value { get; set; } = "#10b981";
    public string? TargetInput { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "color-picker");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            value = Value,
            targetInputName = TargetInput,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-knob />
/// </summary>
[HtmlTargetElement("island-knob")]
public class IslandKnobTagHelper : TagHelper
{
    public double Value { get; set; } = 50;
    public double Min { get; set; } = 0;
    public double Max { get; set; } = 100;
    public double Step { get; set; } = 1;
    public int Size { get; set; } = 96;
    public string? Color { get; set; }
    public string ValueTemplate { get; set; } = "{value}%";
    public string? TargetInput { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "knob");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            value = Value,
            min = Min,
            max = Max,
            step = Step,
            size = Size,
            color = Color,
            valueTemplate = ValueTemplate,
            targetInputName = TargetInput,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-tag />
/// </summary>
[HtmlTargetElement("island-tag")]
public class IslandTagTagHelper : TagHelper
{
    public string Value { get; set; } = string.Empty;
    public string Severity { get; set; } = "info";
    public bool Rounded { get; set; } = false;
    public string? Icon { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "tag");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            value = Value,
            severity = Severity,
            rounded = Rounded,
            icon = Icon
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-breadcrumb />
/// </summary>
[HtmlTargetElement("island-breadcrumb")]
public class IslandBreadcrumbTagHelper : TagHelper
{
    public List<BreadcrumbItem>? Items { get; set; }
    public string HomeUrl { get; set; } = "/";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "breadcrumb");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            items = Items ?? new(),
            homeUrl = HomeUrl
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-scroll-top />
/// </summary>
[HtmlTargetElement("island-scroll-top")]
public class IslandScrollTopTagHelper : TagHelper
{
    public int Threshold { get; set; } = 200;
    public string Behavior { get; set; } = "smooth";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "scroll-top");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            threshold = Threshold,
            behavior = Behavior
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-inplace />
/// </summary>
[HtmlTargetElement("island-inplace")]
public class IslandInplaceTagHelper : TagHelper
{
    public string? Value { get; set; }
    public string? TargetInput { get; set; }
    public string? Placeholder { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "inplace");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            value = Value,
            targetInputName = TargetInput,
            placeholder = Placeholder,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-command /> (Spotlight Ctrl+K Command Palette)
/// </summary>
[HtmlTargetElement("island-command")]
public class IslandCommandTagHelper : TagHelper
{
    public string? Placeholder { get; set; } = "Type a command or search...";
    public List<CommandPaletteItem>? Items { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "command");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            placeholder = Placeholder,
            items = Items ?? new()
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

/// <summary>
/// TagHelper for <island-theme-studio /> (TweakAura Live Theme Editor)
/// </summary>
[HtmlTargetElement("island-theme-studio")]
public class IslandThemeStudioTagHelper : TagHelper
{
    public bool DefaultOpen { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "island";
        output.Attributes.SetAttribute("name", "theme-studio");
        output.Attributes.SetAttribute("hydrate", "Load");

        var props = new
        {
            defaultOpen = DefaultOpen
        };

        output.Attributes.SetAttribute("props-json", JsonSerializer.Serialize(props));
    }
}

using SoftMax.LaughTale.Core.Serialization;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Enums;
using SoftMax.LaughTale.Components.Models;
using System.Text.Json;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// <summary>
/// TagHelper for <island-input-number /> / <island-inputnumber /> / <island-number /> / <island-currency /> — Aura InputNumber
/// </summary>
[HtmlTargetElement("island-input-number")]
[HtmlTargetElement("island-inputnumber")]
[HtmlTargetElement("island-number")]
[HtmlTargetElement("island-currency")]
public class IslandNumberTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? InputId { get; set; }
    public double? Value { get; set; }
    public InputNumberMode Mode { get; set; } = InputNumberMode.Decimal;
    public string? Currency { get; set; } = "USD";
    public CurrencyDisplay CurrencyDisplay { get; set; } = CurrencyDisplay.Symbol;
    public string? Locale { get; set; }
    public bool UseGrouping { get; set; } = true;
    public int? MinFractionDigits { get; set; }
    public int? MaxFractionDigits { get; set; }
    public string? Prefix { get; set; }
    public string? Suffix { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public double Step { get; set; } = 1;
    public bool ShowButtons { get; set; } = false;
    public ButtonLayout ButtonLayout { get; set; } = ButtonLayout.Stacked;
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Fluid { get; set; } = false;
    public bool Invalid { get; set; } = false;
    public bool ShowClear { get; set; } = false;
    public string? Placeholder { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var cssClass = "laughtale-inputnumber p-inputnumber";
        if (Fluid) cssClass += " p-inputnumber-fluid";
        if (Variant == InputVariant.Filled) cssClass += " variant-filled";
        if (Size != ComponentSize.Normal) cssClass += $" size-{Size.ToString().ToLowerInvariant()}";
        if (Invalid) cssClass += " is-invalid";
        if (ShowButtons) cssClass += $" p-inputnumber-{ButtonLayout.ToString().ToLowerInvariant()}";

        output.Attributes.SetAttribute("class", cssClass);
        output.Attributes.SetAttribute("data-island", "input-number");
        output.Attributes.SetAttribute("data-hydrate", "load");

        // Format initial value server-side
        string displayVal = "";
        if (Value.HasValue)
        {
            if (Mode == InputNumberMode.Currency)
            {
                var cult = !string.IsNullOrEmpty(Locale) ? System.Globalization.CultureInfo.GetCultureInfo(Locale) : System.Globalization.CultureInfo.GetCultureInfo("en-US");
                displayVal = Currency == "JPY" ? Value.Value.ToString("C0", cult) : Value.Value.ToString("C2", cult);
            }
            else
            {
                var cult = !string.IsNullOrEmpty(Locale) ? System.Globalization.CultureInfo.GetCultureInfo(Locale) : System.Globalization.CultureInfo.InvariantCulture;
                displayVal = UseGrouping ? Value.Value.ToString("N" + (MinFractionDigits ?? 0), cult) : Value.Value.ToString("F" + (MinFractionDigits ?? 0), cult);
            }
            if (!string.IsNullOrEmpty(Prefix) && !displayVal.StartsWith(Prefix)) displayVal = Prefix + displayVal;
            if (!string.IsNullOrEmpty(Suffix) && !displayVal.EndsWith(Suffix)) displayVal = displayVal + Suffix;
        }

        var inputIdAttr = !string.IsNullOrEmpty(InputId) ? $"id=\"{InputId}\"" : "";
        var placeholderAttr = !string.IsNullOrEmpty(Placeholder) ? $"placeholder=\"{Placeholder}\"" : "";
        var disabledAttr = Disabled ? "disabled" : "";

        var sb = new System.Text.StringBuilder();

        if (ShowButtons && ButtonLayout == ButtonLayout.Horizontal)
        {
            sb.Append($"<button type=\"button\" class=\"p-inputnumber-button p-inputnumber-button-down\" tabindex=\"-1\" {disabledAttr} aria-label=\"Decrement\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("minus", 14));
            sb.Append("</button>");
        }
        else if (ShowButtons && ButtonLayout == ButtonLayout.Vertical)
        {
            sb.Append($"<button type=\"button\" class=\"p-inputnumber-button p-inputnumber-button-up\" tabindex=\"-1\" {disabledAttr} aria-label=\"Increment\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("plus", 14));
            sb.Append("</button>");
        }

        sb.Append($"<input type=\"text\" class=\"p-inputnumber-input\" {inputIdAttr} {placeholderAttr} {disabledAttr} value=\"{displayVal}\" role=\"spinbutton\" autocomplete=\"off\" />");

        if (ShowClear && Value.HasValue && !Disabled)
        {
            sb.Append("<button type=\"button\" class=\"p-inputnumber-clear-icon\" aria-label=\"Clear value\" tabindex=\"-1\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("x", 14));
            sb.Append("</button>");
        }

        if (ShowButtons)
        {
            if (ButtonLayout == ButtonLayout.Stacked)
            {
                sb.Append("<div class=\"p-inputnumber-button-group\">");
                sb.Append($"<button type=\"button\" class=\"p-inputnumber-button p-inputnumber-button-up\" tabindex=\"-1\" {disabledAttr} aria-label=\"Increment\">");
                sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("chevron-up", 14));
                sb.Append("</button>");
                sb.Append($"<button type=\"button\" class=\"p-inputnumber-button p-inputnumber-button-down\" tabindex=\"-1\" {disabledAttr} aria-label=\"Decrement\">");
                sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("chevron-down", 14));
                sb.Append("</button>");
                sb.Append("</div>");
            }
            else if (ButtonLayout == ButtonLayout.Horizontal)
            {
                sb.Append($"<button type=\"button\" class=\"p-inputnumber-button p-inputnumber-button-up\" tabindex=\"-1\" {disabledAttr} aria-label=\"Increment\">");
                sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("plus", 14));
                sb.Append("</button>");
            }
            else if (ButtonLayout == ButtonLayout.Vertical)
            {
                sb.Append($"<button type=\"button\" class=\"p-inputnumber-button p-inputnumber-button-down\" tabindex=\"-1\" {disabledAttr} aria-label=\"Decrement\">");
                sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("minus", 14));
                sb.Append("</button>");
            }
        }

        output.Content.SetHtmlContent(sb.ToString());

        var props = new
        {
            targetInputName = TargetInput,
            inputId = InputId,
            value = Value,
            mode = Mode.ToString().ToLowerInvariant(),
            currency = Currency,
            currencyDisplay = CurrencyDisplay.ToString().ToLowerInvariant(),
            locale = Locale,
            useGrouping = UseGrouping,
            minFractionDigits = MinFractionDigits,
            maxFractionDigits = MaxFractionDigits,
            prefix = Prefix,
            suffix = Suffix,
            min = Min,
            max = Max,
            step = Step,
            showButtons = ShowButtons,
            buttonLayout = ButtonLayout.ToString().ToLowerInvariant(),
            variant = Variant.ToString().ToLowerInvariant(),
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            invalid = Invalid,
            showClear = ShowClear,
            placeholder = Placeholder,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-otp /> / <island-input-otp />
/// </summary>
[HtmlTargetElement("island-otp")]
[HtmlTargetElement("island-input-otp")]
public class IslandOtpTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public int Length { get; set; } = 6;
    public bool Mask { get; set; } = false;
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "input-otp");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            length = Length,
            mask = Mask,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-password /> / <island-input-password />
/// </summary>
[HtmlTargetElement("island-password")]
[HtmlTargetElement("island-input-password")]
public class IslandPasswordTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? Placeholder { get; set; }
    public bool ToggleMask { get; set; } = true;
    public bool ShowMeter { get; set; } = true;
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "input-password");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            placeholder = Placeholder,
            toggleMask = ToggleMask,
            showMeter = ShowMeter,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-switch /> / <island-toggle-switch />
/// </summary>
[HtmlTargetElement("island-switch")]
[HtmlTargetElement("island-toggle-switch")]
public class IslandSwitchTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public bool Checked { get; set; } = false;
    public string? Label { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "toggle-switch");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            @checked = Checked,
            label = Label,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "slider");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            min = Min,
            max = Max,
            step = Step,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "rating");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            stars = Stars,
            allowCancel = AllowCancel,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "select-button");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            items = Items,
            value = Value,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "chips");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            values = Values,
            placeholder = Placeholder,
            max = Max,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-datepicker /> (Aura DatePicker)
/// </summary>
[HtmlTargetElement("island-datepicker")]
public class IslandDatePickerTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? Value { get; set; }
    public string? Placeholder { get; set; } = "Select Date...";
    public string DateFormat { get; set; } = "yy-mm-dd";
    public DatePickerSelectionMode SelectionMode { get; set; } = DatePickerSelectionMode.Single;
    public DatePickerView View { get; set; } = DatePickerView.Date;
    public string? MinDate { get; set; }
    public string? MaxDate { get; set; }
    public bool ShowButtonBar { get; set; } = false;
    public bool ShowTime { get; set; } = false;
    public bool TimeOnly { get; set; } = false;
    public string HourFormat { get; set; } = "24";
    public bool Inline { get; set; } = false;
    public bool ShowIcon { get; set; } = true;
    public bool Disabled { get; set; } = false;
    public bool Invalid { get; set; } = false;
    public bool Fluid { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public InputVariant Variant { get; set; } = InputVariant.Outlined;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "datepicker");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            placeholder = Placeholder,
            dateFormat = DateFormat,
            selectionMode = SelectionMode.ToString().ToLowerInvariant(),
            view = View.ToString().ToLowerInvariant(),
            minDate = MinDate,
            maxDate = MaxDate,
            showButtonBar = ShowButtonBar,
            showTime = ShowTime,
            timeOnly = TimeOnly,
            hourFormat = HourFormat,
            inline = Inline,
            showIcon = ShowIcon,
            disabled = Disabled,
            invalid = Invalid,
            fluid = Fluid,
            size = Size.ToString().ToLowerInvariant(),
            variant = Variant.ToString().ToLowerInvariant()
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "meter-group");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            values = Values,
            title = Title,
            showLabels = ShowLabels
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "avatar-group");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            avatars = Avatars,
            max = Max,
            size = Size
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "progress-bar");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value,
            mode = Mode,
            showValue = ShowValue,
            height = Height,
            color = Color
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "skeleton");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            shape = Shape,
            width = Width,
            height = Height,
            borderRadius = BorderRadius
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "drawer");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            position = Position,
            title = Title,
            triggerText = TriggerText,
            width = Width
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "speed-dial");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            actions = Actions,
            direction = Direction
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "image-compare");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            beforeImage = BeforeImage,
            afterImage = AfterImage,
            beforeLabel = BeforeLabel,
            afterLabel = AfterLabel
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "confirm-popup");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            targetSelector = TargetSelector,
            message = Message,
            acceptText = AcceptText,
            rejectText = RejectText,
            actionName = ActionName
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "accordion");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            tabs = Tabs ?? new(),
            multiple = Multiple,
            activeIndex = ActiveIndex
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "tabs");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            tabs = Tabs ?? new(),
            activeIndex = ActiveIndex,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-autocomplete /> (Aura AutoComplete)
/// </summary>
[HtmlTargetElement("island-autocomplete")]
public class IslandAutoCompleteTagHelper : TagHelper
{
    public List<AutoCompleteItem>? Items { get; set; }
    public List<AutoCompleteItem>? Suggestions { get; set; }
    public string? Placeholder { get; set; }
    public string? TargetInput { get; set; }
    public string? Value { get; set; }
    public bool Disabled { get; set; } = false;
    public bool Dropdown { get; set; } = false;
    public bool ShowClear { get; set; } = true;
    public bool ForceSelection { get; set; } = false;
    public bool Multiple { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public bool Invalid { get; set; } = false;
    public bool Fluid { get; set; } = false;
    public bool Loading { get; set; } = false;
    public string ScrollHeight { get; set; } = "14rem";
    public string? OptionGroupLabel { get; set; }
    public string? OptionGroupChildren { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "autocomplete");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            items = Suggestions ?? Items ?? new(),
            placeholder = Placeholder,
            targetInputName = TargetInput,
            value = Value,
            disabled = Disabled,
            dropdown = Dropdown,
            showClear = ShowClear,
            forceSelection = ForceSelection,
            multiple = Multiple,
            size = Size.ToString().ToLowerInvariant(),
            variant = Variant.ToString().ToLowerInvariant(),
            invalid = Invalid,
            fluid = Fluid,
            loading = Loading,
            scrollHeight = ScrollHeight,
            optionGroupLabel = OptionGroupLabel,
            optionGroupChildren = OptionGroupChildren
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "color-picker");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value,
            targetInputName = TargetInput,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "knob");
        output.Attributes.SetAttribute("data-hydrate", "load");

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

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "tag");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value,
            severity = Severity,
            rounded = Rounded,
            icon = Icon
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "breadcrumb");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            items = Items ?? new(),
            homeUrl = HomeUrl
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "scroll-top");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            threshold = Threshold,
            behavior = Behavior
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "inplace");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value,
            targetInputName = TargetInput,
            placeholder = Placeholder,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "command");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            placeholder = Placeholder,
            items = Items ?? new()
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "theme-studio");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            defaultOpen = DefaultOpen
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-form /> / <island-dynamic-form /> (Auto-Generated Dynamic Forms from C# Objects)
/// </summary>
[HtmlTargetElement("island-form")]
[HtmlTargetElement("island-dynamic-form")]
public class IslandDynamicFormTagHelper : TagHelper
{
    public object? For { get; set; }
    public object? Schema { get; set; }
    public string? Title { get; set; }
    public string? SubmitUrl { get; set; }
    public string SubmitLabel { get; set; } = "Submit";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "dynamic-form");
        output.Attributes.SetAttribute("data-hydrate", "load");

        object? resolvedSchema = Schema;
        if (resolvedSchema == null && For != null)
        {
            resolvedSchema = Forms.DynamicFormSchemaGenerator.FromType(For.GetType(), For, Title, SubmitUrl);
        }

        var props = new
        {
            schema = resolvedSchema,
            targetAction = SubmitUrl
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-splitter />
/// </summary>
[HtmlTargetElement("island-splitter")]
public class IslandSplitterTagHelper : TagHelper
{
    public string Layout { get; set; } = "horizontal";
    public List<SplitterPanel>? Panels { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "splitter");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            layout = Layout,
            panels = Panels ?? new()
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-multiselect />
/// </summary>
[HtmlTargetElement("island-multiselect")]
public class IslandMultiSelectTagHelper : TagHelper
{
    public List<SelectButtonItem>? Options { get; set; }
    public List<string>? SelectedValues { get; set; }
    public string? Placeholder { get; set; } = "Select items...";
    public string? TargetInput { get; set; }
    public string Display { get; set; } = "chip";
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "multiselect");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            options = Options ?? new(),
            selectedValues = SelectedValues ?? new(),
            placeholder = Placeholder,
            targetInputName = TargetInput,
            display = Display,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-cascadeselect /> (Aura CascadeSelect)
/// </summary>
[HtmlTargetElement("island-cascadeselect")]
public class IslandCascadeSelectTagHelper : TagHelper
{
    public List<CascadeSelectNode>? Options { get; set; }
    public string? Placeholder { get; set; } = "Select a City";
    public string? TargetInput { get; set; }
    public string? Value { get; set; }
    public bool Disabled { get; set; } = false;
    public bool ShowClear { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public bool Invalid { get; set; } = false;
    public bool Fluid { get; set; } = false;
    public bool Loading { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "cascadeselect");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            options = Options ?? new(),
            placeholder = Placeholder,
            targetInputName = TargetInput,
            value = Value,
            disabled = Disabled,
            showClear = ShowClear,
            size = Size.ToString().ToLowerInvariant(),
            variant = Variant.ToString().ToLowerInvariant(),
            invalid = Invalid,
            fluid = Fluid,
            loading = Loading
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-listbox />
/// </summary>
[HtmlTargetElement("island-listbox")]
public class IslandListboxTagHelper : TagHelper
{
    public List<SelectButtonItem>? Options { get; set; }
    public string? SelectedValue { get; set; }
    public bool Multiple { get; set; } = false;
    public bool Filter { get; set; } = true;
    public string? TargetInput { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "listbox");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            options = Options ?? new(),
            selectedValue = SelectedValue,
            multiple = Multiple,
            filter = Filter,
            targetInputName = TargetInput,
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-picklist />
/// </summary>
[HtmlTargetElement("island-picklist")]
public class IslandPickListTagHelper : TagHelper
{
    public List<PickListItem>? Source { get; set; }
    public List<PickListItem>? Target { get; set; }
    public string SourceHeader { get; set; } = "Available";
    public string TargetHeader { get; set; } = "Selected";
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "picklist");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            source = Source ?? new(),
            target = Target ?? new(),
            sourceHeader = SourceHeader,
            targetHeader = TargetHeader,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-orderlist />
/// </summary>
[HtmlTargetElement("island-orderlist")]
public class IslandOrderListTagHelper : TagHelper
{
    public List<OrderListItem>? Items { get; set; }
    public string? Header { get; set; }
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "orderlist");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            items = Items ?? new(),
            header = Header,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-orgchart />
/// </summary>
[HtmlTargetElement("island-orgchart")]
public class IslandOrgChartTagHelper : TagHelper
{
    public OrgChartNode? Value { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "orgchart");
        output.Attributes.SetAttribute("data-hydrate", "load");

        if (Value != null)
        {
            var props = new { value = Value };
            output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        }
    }
}

/// <summary>
/// TagHelper for <island-terminal />
/// </summary>
[HtmlTargetElement("island-terminal")]
public class IslandTerminalTagHelper : TagHelper
{
    public string? WelcomeMessage { get; set; }
    public string Prompt { get; set; } = "admin@softmax:~$";
    public Dictionary<string, string>? Commands { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "terminal");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            welcomeMessage = WelcomeMessage,
            prompt = Prompt,
            commands = Commands ?? new()
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-dock />
/// </summary>
[HtmlTargetElement("island-dock")]
public class IslandDockTagHelper : TagHelper
{
    public List<DockItem>? Items { get; set; }
    public string Position { get; set; } = "bottom";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "dock");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            items = Items ?? new(),
            position = Position
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-galleria />
/// </summary>
[HtmlTargetElement("island-galleria")]
public class IslandGalleriaTagHelper : TagHelper
{
    public List<GalleriaItem>? Value { get; set; }
    public bool AutoPlay { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "galleria");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            value = Value ?? new(),
            autoPlay = AutoPlay
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-blockui />
/// </summary>
[HtmlTargetElement("island-blockui")]
public class IslandBlockUITagHelper : TagHelper
{
    public bool Blocked { get; set; } = true;
    public string? Message { get; set; } = "Processing...";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "blockui");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            blocked = Blocked,
            message = Message
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-split-button />
/// </summary>
[HtmlTargetElement("island-split-button")]
public class IslandSplitButtonTagHelper : TagHelper
{
    public string Label { get; set; } = "Save";
    public string? Icon { get; set; }
    public List<SplitButtonItem>? Model { get; set; }
    public bool Disabled { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "split-button");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            label = Label,
            icon = Icon,
            model = Model ?? new(),
            disabled = Disabled
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

// ─── Aura v2: New Components ────────────────────────────────────────────────

/// <summary>
/// TagHelper for <island-select /> — Single-value dropdown selector
/// </summary>
[HtmlTargetElement("island-select")]
public class IslandSelectTagHelper : TagHelper
{
    public List<SelectButtonItem>? Options { get; set; }
    public string? SelectedValue { get; set; }
    public string? Placeholder { get; set; } = "Select an option...";
    public bool Filter { get; set; } = false;
    public bool ShowClear { get; set; } = false;
    public bool Disabled { get; set; } = false;
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "select");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new
        {
            options = Options ?? new(),
            selectedValue = SelectedValue,
            placeholder = Placeholder,
            filter = Filter,
            showClear = ShowClear,
            disabled = Disabled,
            targetInputName = TargetInput
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-checkbox /> — Aura Styled Checkbox
/// </summary>
[HtmlTargetElement("island-checkbox")]
public class IslandCheckboxTagHelper : TagHelper
{
    public bool Checked { get; set; } = false;
    public bool Indeterminate { get; set; } = false;
    public bool Binary { get; set; } = true;
    public string? Label { get; set; }
    public string? Value { get; set; }
    public string? Name { get; set; }
    public string? InputId { get; set; }
    public bool Disabled { get; set; } = false;
    public bool Invalid { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "checkbox");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            @checked = Checked,
            indeterminate = Indeterminate,
            binary = Binary,
            label = Label,
            value = Value,
            name = Name,
            inputId = InputId,
            disabled = Disabled,
            invalid = Invalid,
            size = Size.ToString().ToLowerInvariant(),
            variant = Variant.ToString().ToLowerInvariant(),
            targetInputName = TargetInput ?? Name
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-checkbox-group /> — Aura Checkbox Group Wrapper
/// </summary>
[HtmlTargetElement("island-checkbox-group")]
public class IslandCheckboxGroupTagHelper : TagHelper
{
    public string? Name { get; set; }
    public List<string>? Values { get; set; }
    public bool Disabled { get; set; } = false;
    public Orientation Orientation { get; set; } = Orientation.Horizontal;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("class", $"aura-checkbox-group flex gap-4 {(Orientation == Orientation.Vertical ? "flex-col" : "flex-wrap")}");
        if (Disabled)
        {
            output.Attributes.SetAttribute("data-disabled", "true");
        }
    }
}

/// <summary>
/// TagHelper for <island-radio /> / <island-radio-button /> — Styled radio button
/// </summary>
[HtmlTargetElement("island-radio")]
[HtmlTargetElement("island-radio-button")]
public class IslandRadioTagHelper : TagHelper
{
    public bool Checked { get; set; } = false;
    public string? Label { get; set; }
    public string? Name { get; set; }
    public string? Value { get; set; }
    public bool Disabled { get; set; } = false;
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "radio-button");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { @checked = Checked, label = Label, name = Name, value = Value, disabled = Disabled, targetInputName = TargetInput };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-textarea /> — Auto-resizing textarea
/// </summary>
[HtmlTargetElement("island-textarea")]
public class IslandTextareaTagHelper : TagHelper
{
    public string? Value { get; set; }
    public string? Placeholder { get; set; }
    public int Rows { get; set; } = 3;
    public int? MaxLength { get; set; }
    public bool AutoResize { get; set; } = true;
    public bool Disabled { get; set; } = false;
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "textarea");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { value = Value, placeholder = Placeholder, rows = Rows, maxLength = MaxLength, autoResize = AutoResize, disabled = Disabled, targetInputName = TargetInput };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-input-mask /> — Pattern-masked input
/// </summary>
[HtmlTargetElement("island-input-mask")]
public class IslandInputMaskTagHelper : TagHelper
{
    public string Mask { get; set; } = "(999) 999-9999";
    public string? Value { get; set; }
    public string? Placeholder { get; set; }
    public string SlotChar { get; set; } = "_";
    public bool Disabled { get; set; } = false;
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "input-mask");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { mask = Mask, value = Value, placeholder = Placeholder, slotChar = SlotChar, disabled = Disabled, targetInputName = TargetInput };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-float-label /> — Aura Floating Label Wrapper
/// </summary>
[HtmlTargetElement("island-float-label")]
public class IslandFloatLabelTagHelper : TagHelper
{
    public string? Label { get; set; }
    public string? For { get; set; }
    public FloatLabelVariant Variant { get; set; } = FloatLabelVariant.Over;
    public bool Invalid { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "float-label");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new
        {
            label = Label,
            @for = For,
            variant = Variant.ToString().ToLowerInvariant(),
            invalid = Invalid
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-ifta-label /> — Aura Infield Top Aligned Label
/// </summary>
[HtmlTargetElement("island-ifta-label")]
public class IslandIftaLabelTagHelper : TagHelper
{
    public string? Label { get; set; }
    public string? For { get; set; }
    public bool Invalid { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "ifta-label");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new
        {
            label = Label,
            @for = For,
            invalid = Invalid
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-input-group /> / <island-inputgroup /> — Aura InputGroup
/// </summary>
[HtmlTargetElement("island-input-group")]
[HtmlTargetElement("island-inputgroup")]
public class IslandInputGroupTagHelper : TagHelper
{
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Fluid { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("class", "laughtale-inputgroup p-inputgroup");
        output.Attributes.SetAttribute("data-island", "input-group");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new
        {
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-input-group-addon /> / <island-inputgroup-addon /> — Aura InputGroupAddon
/// </summary>
[HtmlTargetElement("island-input-group-addon")]
[HtmlTargetElement("island-inputgroup-addon")]
public class IslandInputGroupAddonTagHelper : TagHelper
{
    public string? Icon { get; set; }
    public string? Text { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("class", "laughtale-inputgroup-addon p-inputgroup-addon");
        output.Attributes.SetAttribute("data-island", "input-group-addon");
        output.Attributes.SetAttribute("data-hydrate", "load");

        if (!string.IsNullOrEmpty(Icon))
        {
            output.Content.AppendHtml(SoftMax.LaughTale.Components.Icons.LucideIcons.Get(Icon, 16));
        }

        if (!string.IsNullOrEmpty(Text))
        {
            output.Content.AppendHtml($"<span>{Text}</span>");
        }

        var props = new
        {
            icon = Icon,
            text = Text
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-enhanced-input /> / <island-input-text /> — Enhanced text input with icons, clear, sizes
/// </summary>
[HtmlTargetElement("island-enhanced-input")]
[HtmlTargetElement("island-input-text")]
public class IslandEnhancedInputTextTagHelper : TagHelper
{
    public string? Value { get; set; }
    public string? Placeholder { get; set; }
    public string Type { get; set; } = "text";
    public string? IconLeft { get; set; }
    public string? IconRight { get; set; }
    public bool ShowClear { get; set; } = false;
    public bool Invalid { get; set; } = false;
    public bool Disabled { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Medium;
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "input-text");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { value = Value, placeholder = Placeholder, type = Type, iconLeft = IconLeft, iconRight = IconRight, showClear = ShowClear, invalid = Invalid, disabled = Disabled, size = Size.ToString().ToLowerInvariant(), targetInputName = TargetInput };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-carousel /> — Touch-enabled content slider
/// </summary>
[HtmlTargetElement("island-carousel")]
public class IslandCarouselTagHelper : TagHelper
{
    public List<CarouselItem>? Items { get; set; }
    public int NumVisible { get; set; } = 1;
    public int NumScroll { get; set; } = 1;
    public bool Autoplay { get; set; } = false;
    public int AutoplayInterval { get; set; } = 5000;
    public bool Circular { get; set; } = false;
    public bool ShowIndicators { get; set; } = true;
    public bool ShowNavigators { get; set; } = true;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "carousel");
        output.Attributes.SetAttribute("hydrate", "Visible");
        var props = new { items = Items ?? new(), numVisible = NumVisible, numScroll = NumScroll, autoplay = Autoplay, autoplayInterval = AutoplayInterval, circular = Circular, showIndicators = ShowIndicators, showNavigators = ShowNavigators };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-paginator /> — Page navigation
/// </summary>
[HtmlTargetElement("island-paginator")]
public class IslandPaginatorTagHelper : TagHelper
{
    public int TotalRecords { get; set; } = 0;
    public int Rows { get; set; } = 10;
    public int First { get; set; } = 0;
    public List<int>? RowsPerPageOptions { get; set; }
    public bool Compact { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "paginator");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { totalRecords = TotalRecords, rows = Rows, first = First, rowsPerPageOptions = RowsPerPageOptions ?? new List<int> { 5, 10, 25, 50 }, compact = Compact };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-dataview /> — Grid/list layout toggle
/// </summary>
[HtmlTargetElement("island-dataview")]
public class IslandDataViewTagHelper : TagHelper
{
    public string Layout { get; set; } = "grid";
    public bool ShowPaginator { get; set; } = false;
    public int Rows { get; set; } = 12;
    public string? SortField { get; set; }
    public string SortOrder { get; set; } = "asc";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "dataview");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { layout = Layout, paginator = ShowPaginator, rows = Rows, sortField = SortField, sortOrder = SortOrder };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-menu /> — Popup/inline menu
/// </summary>
[HtmlTargetElement("island-menu")]
public class IslandMenuTagHelper : TagHelper
{
    public List<MenuItem>? Items { get; set; }
    public bool Popup { get; set; } = true;
    public string? TriggerId { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "menu");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { items = Items ?? new(), popup = Popup, triggerId = TriggerId };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-context-menu /> — Right-click menu
/// </summary>
[HtmlTargetElement("island-context-menu")]
public class IslandContextMenuTagHelper : TagHelper
{
    public List<MenuItem>? Items { get; set; }
    public string? TargetSelector { get; set; }
    public bool Global { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "context-menu");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { items = Items ?? new(), targetSelector = TargetSelector, global = Global };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-popover /> — Anchored floating panel
/// </summary>
[HtmlTargetElement("island-popover")]
public class IslandPopoverTagHelper : TagHelper
{
    public string? TriggerId { get; set; }
    public string Placement { get; set; } = "bottom";
    public bool ShowArrow { get; set; } = true;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "popover");
        output.Attributes.SetAttribute("hydrate", "Interaction");
        var props = new { triggerId = TriggerId, placement = Placement, showArrow = ShowArrow };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-tooltip /> — Rich tooltip component
/// </summary>
[HtmlTargetElement("island-tooltip")]
public class IslandTooltipTagHelper : TagHelper
{
    public string? Target { get; set; }
    public string Position { get; set; } = "top";
    public int ShowDelay { get; set; } = 300;
    public int HideDelay { get; set; } = 100;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "tooltip-component");
        output.Attributes.SetAttribute("hydrate", "Interaction");
        var props = new { target = Target, position = Position, showDelay = ShowDelay, hideDelay = HideDelay };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-sidebar /> — Collapsible navigation panel
/// </summary>
[HtmlTargetElement("island-sidebar")]
public class IslandSidebarTagHelper : TagHelper
{
    public List<SidebarItem>? Items { get; set; }
    public bool Collapsed { get; set; } = false;
    public string Position { get; set; } = "left";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "sidebar");
        output.Attributes.SetAttribute("data-hydrate", "load");
        var props = new { items = Items ?? new(), collapsed = Collapsed, position = Position };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

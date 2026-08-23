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
        // Fallback attribute resolution for camelCase & kebab-case
        if (context.AllAttributes.TryGetAttribute("showButtons", out var sbAttr) || context.AllAttributes.TryGetAttribute("show-buttons", out sbAttr))
        {
            if (bool.TryParse(sbAttr.Value?.ToString(), out var b)) ShowButtons = b;
            else if (sbAttr.Value != null) ShowButtons = true;
        }
        if (context.AllAttributes.TryGetAttribute("buttonLayout", out var blAttr) || context.AllAttributes.TryGetAttribute("button-layout", out blAttr))
        {
            if (Enum.TryParse<ButtonLayout>(blAttr.Value?.ToString(), true, out var bl)) ButtonLayout = bl;
        }
        if (context.AllAttributes.TryGetAttribute("currencyDisplay", out var cdAttr) || context.AllAttributes.TryGetAttribute("currency-display", out cdAttr))
        {
            if (Enum.TryParse<CurrencyDisplay>(cdAttr.Value?.ToString(), true, out var cd)) CurrencyDisplay = cd;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("useGrouping", out var ugAttr) || context.AllAttributes.TryGetAttribute("use-grouping", out ugAttr))
        {
            if (bool.TryParse(ugAttr.Value?.ToString(), out var ug)) UseGrouping = ug;
        }
        if (context.AllAttributes.TryGetAttribute("showClear", out var scAttr) || context.AllAttributes.TryGetAttribute("show-clear", out scAttr))
        {
            if (bool.TryParse(scAttr.Value?.ToString(), out var sc)) ShowClear = sc;
            else if (scAttr.Value != null) ShowClear = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }

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
/// TagHelper for <island-otp /> / <island-input-otp /> / <island-inputotp /> — Aura InputOtp
/// </summary>
[HtmlTargetElement("island-otp")]
[HtmlTargetElement("island-input-otp")]
[HtmlTargetElement("island-inputotp")]
public class IslandOtpTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? InputId { get; set; }
    public string? Value { get; set; }
    public int Length { get; set; } = 4;
    public bool Mask { get; set; } = false;
    public bool IntegerOnly { get; set; } = true;
    public bool Grouped { get; set; } = false;
    public string? Separator { get; set; }
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Disabled { get; set; } = false;
    public bool ReadOnly { get; set; } = false;
    public bool Invalid { get; set; } = false;
    public bool Autofocus { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Fallback attribute resolution for camelCase & kebab-case
        if (context.AllAttributes.TryGetAttribute("integerOnly", out var ioAttr) || context.AllAttributes.TryGetAttribute("integer-only", out ioAttr))
        {
            if (bool.TryParse(ioAttr.Value?.ToString(), out var io)) IntegerOnly = io;
            else if (ioAttr.Value != null) IntegerOnly = true;
        }
        if (context.AllAttributes.TryGetAttribute("grouped", out var grpAttr))
        {
            if (bool.TryParse(grpAttr.Value?.ToString(), out var grp)) Grouped = grp;
            else if (grpAttr.Value != null) Grouped = true;
        }
        if (context.AllAttributes.TryGetAttribute("mask", out var mskAttr))
        {
            if (bool.TryParse(mskAttr.Value?.ToString(), out var msk)) Mask = msk;
            else if (mskAttr.Value != null) Mask = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("readonly", out var roAttr))
        {
            if (bool.TryParse(roAttr.Value?.ToString(), out var ro)) ReadOnly = ro;
            else if (roAttr.Value != null) ReadOnly = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var cssClass = "laughtale-input-otp p-inputotp";
        if (Variant == InputVariant.Filled) cssClass += " variant-filled";
        if (Size != ComponentSize.Normal) cssClass += $" size-{Size.ToString().ToLowerInvariant()}";
        if (Invalid) cssClass += " is-invalid";
        if (Disabled) cssClass += " is-disabled";
        if (Grouped) cssClass += " p-inputotp-grouped";

        output.Attributes.SetAttribute("class", cssClass);
        output.Attributes.SetAttribute("data-island", "input-otp");
        output.Attributes.SetAttribute("data-hydrate", "load");

        // SSR Render initial boxes
        var valChars = (Value ?? "").PadRight(Length).ToCharArray();
        var disabledAttr = Disabled ? "disabled" : "";
        var roAttrStr = ReadOnly ? "readonly" : "";
        var inputType = Mask ? "password" : "text";
        var inputMode = IntegerOnly ? "numeric" : "text";
        var pattern = IntegerOnly ? "[0-9]*" : null;

        var sb = new System.Text.StringBuilder();

        if (Grouped && Length % 2 == 0)
        {
            int mid = Length / 2;
            sb.Append("<div class=\"p-inputotp-group\">");
            for (int i = 0; i < mid; i++)
            {
                var c = valChars[i] != ' ' ? valChars[i].ToString() : "";
                sb.Append($"<input type=\"{inputType}\" class=\"p-inputotp-input\" data-index=\"{i}\" maxlength=\"1\" inputmode=\"{inputMode}\" {(pattern != null ? $"pattern=\"{pattern}\"" : "")} {disabledAttr} {roAttrStr} value=\"{c}\" autocomplete=\"off\" aria-label=\"Character {i+1}\" />");
            }
            sb.Append("</div>");

            sb.Append($"<span class=\"p-inputotp-separator\">{(string.IsNullOrEmpty(Separator) ? "-" : Separator)}</span>");

            sb.Append("<div class=\"p-inputotp-group\">");
            for (int i = mid; i < Length; i++)
            {
                var c = valChars[i] != ' ' ? valChars[i].ToString() : "";
                sb.Append($"<input type=\"{inputType}\" class=\"p-inputotp-input\" data-index=\"{i}\" maxlength=\"1\" inputmode=\"{inputMode}\" {(pattern != null ? $"pattern=\"{pattern}\"" : "")} {disabledAttr} {roAttrStr} value=\"{c}\" autocomplete=\"off\" aria-label=\"Character {i+1}\" />");
            }
            sb.Append("</div>");
        }
        else
        {
            for (int i = 0; i < Length; i++)
            {
                var c = valChars[i] != ' ' ? valChars[i].ToString() : "";
                sb.Append($"<input type=\"{inputType}\" class=\"p-inputotp-input\" data-index=\"{i}\" maxlength=\"1\" inputmode=\"{inputMode}\" {(pattern != null ? $"pattern=\"{pattern}\"" : "")} {disabledAttr} {roAttrStr} value=\"{c}\" autocomplete=\"off\" aria-label=\"Character {i+1}\" />");
            }
        }

        output.Content.SetHtmlContent(sb.ToString());

        var props = new
        {
            targetInputName = TargetInput,
            inputId = InputId,
            value = Value,
            length = Length,
            mask = Mask,
            integerOnly = IntegerOnly,
            grouped = Grouped,
            separator = Separator,
            variant = Variant.ToString().ToLowerInvariant(),
            size = Size.ToString().ToLowerInvariant(),
            disabled = Disabled,
            readonlyMode = ReadOnly,
            invalid = Invalid,
            autofocus = Autofocus
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-password /> / <island-input-password /> — Aura InputPassword
/// </summary>
[HtmlTargetElement("island-password")]
[HtmlTargetElement("island-input-password")]
public class IslandPasswordTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? InputId { get; set; }
    public string? Value { get; set; }
    public string? Placeholder { get; set; }
    public bool ToggleMask { get; set; } = true;
    public bool ShowMeter { get; set; } = false;
    public bool ShowRequirements { get; set; } = false;
    public string RequirementsMode { get; set; } = "chips"; // chips, list, popover
    public bool Feedback { get; set; } = false; // Popover mode
    public int MinLength { get; set; } = 8;
    public string? Icon { get; set; }
    public bool ShowClear { get; set; } = false;
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Fluid { get; set; } = false;
    public bool Disabled { get; set; } = false;
    public bool ReadOnly { get; set; } = false;
    public bool Invalid { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Fallback attribute resolution for camelCase & kebab-case
        if (context.AllAttributes.TryGetAttribute("toggleMask", out var tmAttr) || context.AllAttributes.TryGetAttribute("toggle-mask", out tmAttr))
        {
            if (bool.TryParse(tmAttr.Value?.ToString(), out var tm)) ToggleMask = tm;
            else if (tmAttr.Value != null) ToggleMask = true;
        }
        if (context.AllAttributes.TryGetAttribute("showMeter", out var smAttr) || context.AllAttributes.TryGetAttribute("show-meter", out smAttr))
        {
            if (bool.TryParse(smAttr.Value?.ToString(), out var sm)) ShowMeter = sm;
            else if (smAttr.Value != null) ShowMeter = true;
        }
        if (context.AllAttributes.TryGetAttribute("showRequirements", out var srAttr) || context.AllAttributes.TryGetAttribute("show-requirements", out srAttr))
        {
            if (bool.TryParse(srAttr.Value?.ToString(), out var sr)) ShowRequirements = sr;
            else if (srAttr.Value != null) ShowRequirements = true;
        }
        if (context.AllAttributes.TryGetAttribute("requirementsMode", out var rmAttr) || context.AllAttributes.TryGetAttribute("requirements-mode", out rmAttr))
        {
            RequirementsMode = rmAttr.Value?.ToString() ?? "chips";
        }
        if (context.AllAttributes.TryGetAttribute("feedback", out var fbAttr))
        {
            if (bool.TryParse(fbAttr.Value?.ToString(), out var fb)) Feedback = fb;
            else if (fbAttr.Value != null) Feedback = true;
        }
        if (context.AllAttributes.TryGetAttribute("minLength", out var mlAttr) || context.AllAttributes.TryGetAttribute("min-length", out mlAttr))
        {
            if (int.TryParse(mlAttr.Value?.ToString(), out var ml)) MinLength = ml;
        }
        if (context.AllAttributes.TryGetAttribute("showClear", out var scAttr) || context.AllAttributes.TryGetAttribute("show-clear", out scAttr))
        {
            if (bool.TryParse(scAttr.Value?.ToString(), out var sc)) ShowClear = sc;
            else if (scAttr.Value != null) ShowClear = true;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("readonly", out var roAttr))
        {
            if (bool.TryParse(roAttr.Value?.ToString(), out var ro)) ReadOnly = ro;
            else if (roAttr.Value != null) ReadOnly = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var cssClass = "laughtale-password p-password";
        if (Fluid) cssClass += " p-password-fluid";
        if (Variant == InputVariant.Filled) cssClass += " variant-filled";
        if (Size != ComponentSize.Normal) cssClass += $" size-{Size.ToString().ToLowerInvariant()}";
        if (Invalid) cssClass += " is-invalid";
        if (Disabled) cssClass += " is-disabled";

        output.Attributes.SetAttribute("class", cssClass);
        output.Attributes.SetAttribute("data-island", "input-password");
        output.Attributes.SetAttribute("data-hydrate", "load");

        // SSR Render initial DOM
        var inputIdAttr = !string.IsNullOrEmpty(InputId) ? $"id=\"{InputId}\"" : "";
        var placeholderAttr = !string.IsNullOrEmpty(Placeholder) ? $"placeholder=\"{Placeholder}\"" : "";
        var disabledAttr = Disabled ? "disabled" : "";
        var roAttrStr = ReadOnly ? "readonly" : "";

        var sb = new System.Text.StringBuilder();
        sb.Append("<div class=\"p-password-container\">");

        if (!string.IsNullOrEmpty(Icon))
        {
            sb.Append("<span class=\"p-password-left-icon\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get(Icon, 16));
            sb.Append("</span>");
        }

        sb.Append($"<input type=\"password\" class=\"p-password-input\" {inputIdAttr} {placeholderAttr} {disabledAttr} {roAttrStr} value=\"{Value ?? ""}\" autocomplete=\"off\" />");

        if (ShowClear && !string.IsNullOrEmpty(Value) && !Disabled)
        {
            sb.Append("<button type=\"button\" class=\"p-password-action-btn p-password-clear-btn\" aria-label=\"Clear password\" tabindex=\"-1\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("x", 14));
            sb.Append("</button>");
        }

        if (ToggleMask)
        {
            sb.Append("<button type=\"button\" class=\"p-password-action-btn p-password-toggle-btn\" aria-label=\"Toggle password visibility\" tabindex=\"-1\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("eye", 16));
            sb.Append("</button>");
        }

        sb.Append("</div>");

        output.Content.SetHtmlContent(sb.ToString());

        var props = new
        {
            targetInputName = TargetInput,
            inputId = InputId,
            value = Value,
            placeholder = Placeholder,
            toggleMask = ToggleMask,
            showMeter = ShowMeter,
            showRequirements = ShowRequirements,
            requirementsMode = RequirementsMode,
            feedback = Feedback,
            minLength = MinLength,
            icon = Icon,
            showClear = ShowClear,
            variant = Variant.ToString().ToLowerInvariant(),
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            readonlyMode = ReadOnly,
            invalid = Invalid
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
/// TagHelper for <island-rating /> — Aura Star & Emoji Rating
/// </summary>
[HtmlTargetElement("island-rating")]
public class IslandRatingTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public double Value { get; set; } = 0;
    public int Stars { get; set; } = 5;
    public bool AllowHalf { get; set; } = false;
    public bool Cancel { get; set; } = true;
    public bool AllowCancel { get; set; } = true;
    public Orientation Orientation { get; set; } = Orientation.Horizontal;
    public bool Readonly { get; set; } = false;
    public bool Disabled { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public string Mode { get; set; } = "stars";
    public string? Emojis { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Fallback attribute resolution
        if (context.AllAttributes.TryGetAttribute("allowHalf", out var ahAttr) || context.AllAttributes.TryGetAttribute("allow-half", out ahAttr))
        {
            if (bool.TryParse(ahAttr.Value?.ToString(), out var ah)) AllowHalf = ah;
            else if (ahAttr.Value != null) AllowHalf = true;
        }
        if (context.AllAttributes.TryGetAttribute("allowCancel", out var acAttr) || context.AllAttributes.TryGetAttribute("allow-cancel", out acAttr))
        {
            if (bool.TryParse(acAttr.Value?.ToString(), out var ac)) AllowCancel = ac;
            else if (acAttr.Value != null) AllowCancel = true;
        }
        if (context.AllAttributes.TryGetAttribute("cancel", out var cAttr))
        {
            if (bool.TryParse(cAttr.Value?.ToString(), out var c)) Cancel = c;
            else if (cAttr.Value != null) Cancel = true;
        }
        if (context.AllAttributes.TryGetAttribute("orientation", out var orAttr))
        {
            if (Enum.TryParse<Orientation>(orAttr.Value?.ToString(), true, out var orVal)) Orientation = orVal;
        }
        if (context.AllAttributes.TryGetAttribute("readonly", out var roAttr) || context.AllAttributes.TryGetAttribute("readOnly", out roAttr))
        {
            if (bool.TryParse(roAttr.Value?.ToString(), out var ro)) Readonly = ro;
            else if (roAttr.Value != null) Readonly = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var isVertical = Orientation == Orientation.Vertical;
        var isCancelAllowed = Cancel && AllowCancel && !Readonly && !Disabled;

        var rootClasses = new List<string> { "laughtale-rating", "p-rating" };
        if (isVertical) rootClasses.Add("p-rating-vertical");
        if (Size != ComponentSize.Normal) rootClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Readonly) rootClasses.Add("p-readonly");
        if (Disabled) rootClasses.Add("p-disabled");

        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses));
        output.Attributes.SetAttribute("data-island", "rating");
        output.Attributes.SetAttribute("data-hydrate", "load");
        output.Attributes.SetAttribute("role", "radiogroup");
        output.Attributes.SetAttribute("aria-label", $"{Value} of {Stars} stars");

        var props = new
        {
            targetInputName = TargetInput,
            value = Value,
            stars = Stars,
            allowHalf = AllowHalf,
            cancel = isCancelAllowed,
            allowCancel = isCancelAllowed,
            orientation = isVertical ? "vertical" : "horizontal",
            readonlyMode = Readonly,
            disabled = Disabled,
            size = Size.ToString().ToLowerInvariant(),
            mode = Mode,
            emojis = Emojis
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-render
        var sb = new System.Text.StringBuilder();

        if (isCancelAllowed)
        {
            sb.Append("<button type=\"button\" class=\"p-rating-cancel-item\" aria-label=\"Clear rating\" tabindex=\"0\">");
            sb.Append("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"/></svg>");
            sb.Append("</button>");
        }

        sb.Append($"<div class=\"p-rating-items\" style=\"display: flex; {(isVertical ? "flex-direction: column;" : "align-items: center;")} gap: 0.375rem;\">");

        var starFilledSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"none\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg>";
        var starEmptySvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg>";

        var emojisList = new string[] { "😡", "🙁", "😐", "😊", "🤩" };
        if (!string.IsNullOrEmpty(Emojis))
        {
            emojisList = Emojis.Split(',').Select(e => e.Trim()).ToArray();
        }

        for (int i = 1; i <= Stars; i++)
        {
            var isFull = Value >= i;
            var isHalf = AllowHalf && Value >= (i - 0.5) && Value < i;

            if (Mode == "emoji")
            {
                var emoji = emojisList[(i - 1) % emojisList.Length];
                var activeClass = isFull ? " p-rating-item-active" : "";
                sb.Append($"<span class=\"p-rating-item p-rating-emoji-item{activeClass}\" data-value=\"{i}\" role=\"radio\" aria-checked=\"{(isFull ? "true" : "false")}\" aria-label=\"{i} Star\" tabindex=\"{(Readonly || Disabled ? "-1" : "0")}\">{emoji}</span>");
            }
            else if (Mode == "template")
            {
                var activeClass = isFull ? " p-rating-item-active" : "";
                sb.Append($"<span class=\"p-rating-item p-rating-text-item{activeClass}\" data-value=\"{i}\" role=\"radio\" aria-checked=\"{(isFull ? "true" : "false")}\" aria-label=\"{i} Star\" tabindex=\"{(Readonly || Disabled ? "-1" : "0")}\">A</span>");
            }
            else
            {
                var activeClass = isFull ? " p-rating-item-active" : "";
                var iconSvg = isFull ? starFilledSvg : starEmptySvg;
                var halfDisplay = isHalf ? "display: block;" : "display: none;";

                sb.Append($"<span class=\"p-rating-item p-rating-star-item{activeClass}\" data-value=\"{i}\" role=\"radio\" aria-checked=\"{(isFull || isHalf ? "true" : "false")}\" aria-label=\"{i} Stars\" tabindex=\"{(Readonly || Disabled ? "-1" : "0")}\">");
                sb.Append("<div class=\"p-rating-half-wrapper\">");
                sb.Append($"<span class=\"p-rating-icon p-rating-icon-off\">{iconSvg}</span>");
                sb.Append($"<span class=\"p-rating-half-overlay\" style=\"{halfDisplay}\">");
                sb.Append($"<span class=\"p-rating-icon p-rating-icon-half\">{starFilledSvg}</span>");
                sb.Append("</span>");
                sb.Append("</div>");
                sb.Append("</span>");
            }
        }

        sb.Append("</div>");
        output.Content.SetHtmlContent(sb.ToString());
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
/// TagHelper for <island-input-tags /> / <island-inputtags /> / <island-tags /> / <island-chips /> — Aura InputTags
/// </summary>
[HtmlTargetElement("island-input-tags")]
[HtmlTargetElement("island-inputtags")]
[HtmlTargetElement("island-tags")]
[HtmlTargetElement("island-chips")]
public class IslandInputTagsTagHelper : TagHelper
{
    public string? TargetInput { get; set; }
    public string? InputId { get; set; }
    public IEnumerable<string>? Values { get; set; }
    public string? Value { get; set; }
    public string? Placeholder { get; set; }
    public string? Separator { get; set; }
    public string? Delimiter { get; set; }
    public bool AddOnPaste { get; set; } = true;
    public bool AllowDuplicate { get; set; } = false;
    public int? Max { get; set; }
    public bool Typeahead { get; set; } = false;
    public IEnumerable<string>? Suggestions { get; set; }
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Fluid { get; set; } = false;
    public bool Disabled { get; set; } = false;
    public bool ReadOnly { get; set; } = false;
    public bool Invalid { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Fallback attribute resolution for camelCase & kebab-case
        if (context.AllAttributes.TryGetAttribute("addOnPaste", out var aopAttr) || context.AllAttributes.TryGetAttribute("add-on-paste", out aopAttr))
        {
            if (bool.TryParse(aopAttr.Value?.ToString(), out var aop)) AddOnPaste = aop;
            else if (aopAttr.Value != null) AddOnPaste = true;
        }
        if (context.AllAttributes.TryGetAttribute("allowDuplicate", out var adAttr) || context.AllAttributes.TryGetAttribute("allow-duplicate", out adAttr))
        {
            if (bool.TryParse(adAttr.Value?.ToString(), out var ad)) AllowDuplicate = ad;
            else if (adAttr.Value != null) AllowDuplicate = true;
        }
        if (context.AllAttributes.TryGetAttribute("typeahead", out var thAttr))
        {
            if (bool.TryParse(thAttr.Value?.ToString(), out var th)) Typeahead = th;
            else if (thAttr.Value != null) Typeahead = true;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("readonly", out var roAttr))
        {
            if (bool.TryParse(roAttr.Value?.ToString(), out var ro)) ReadOnly = ro;
            else if (roAttr.Value != null) ReadOnly = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var cssClass = "laughtale-inputtags p-inputtags";
        if (Fluid) cssClass += " p-inputtags-fluid";
        if (Variant == InputVariant.Filled) cssClass += " variant-filled";
        if (Size != ComponentSize.Normal) cssClass += $" size-{Size.ToString().ToLowerInvariant()}";
        if (Invalid) cssClass += " is-invalid";
        if (Disabled) cssClass += " is-disabled";

        output.Attributes.SetAttribute("class", cssClass);
        output.Attributes.SetAttribute("data-island", "input-tags");
        output.Attributes.SetAttribute("data-hydrate", "load");
        output.Attributes.SetAttribute("role", "listbox");
        output.Attributes.SetAttribute("aria-orientation", "horizontal");

        // Parse initial list of tags for SSR
        var tagList = new List<string>();
        if (Values != null)
        {
            tagList.AddRange(Values);
        }
        else if (!string.IsNullOrWhiteSpace(Value))
        {
            tagList.AddRange(Value.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()));
        }

        var sb = new System.Text.StringBuilder();
        var xCircleIcon = SoftMax.LaughTale.Components.Icons.LucideIcons.Get("x", 14);

        for (int i = 0; i < tagList.Count; i++)
        {
            var tag = System.Net.WebUtility.HtmlEncode(tagList[i]);
            sb.Append($"<span class=\"p-inputtags-tag\" data-index=\"{i}\" tabindex=\"0\" role=\"option\" aria-selected=\"true\">");
            sb.Append($"<span class=\"p-inputtags-tag-label\">{tag}</span>");
            if (!Disabled && !ReadOnly)
            {
                sb.Append($"<button type=\"button\" class=\"p-inputtags-tag-remove\" data-index=\"{i}\" aria-label=\"Remove {tag}\" tabindex=\"-1\" style=\"border: none; background: transparent; padding: 0; display: inline-flex; align-items: center; cursor: pointer;\">");
                sb.Append(xCircleIcon);
                sb.Append("</button>");
            }
            sb.Append("</span>");
        }

        var inputIdAttr = !string.IsNullOrEmpty(InputId) ? $"id=\"{InputId}\"" : "";
        var placeholderAttr = tagList.Count == 0 && !string.IsNullOrEmpty(Placeholder) ? $"placeholder=\"{Placeholder}\"" : "";
        var disabledAttr = Disabled ? "disabled" : "";
        var roAttrStr = ReadOnly ? "readonly" : "";

        if (Max == null || tagList.Count < Max)
        {
            sb.Append($"<input type=\"text\" class=\"p-inputtags-input\" {inputIdAttr} {placeholderAttr} {disabledAttr} {roAttrStr} autocomplete=\"off\" style=\"border: none !important; outline: none !important; background: transparent !important; box-shadow: none !important; flex: 1 1 60px; min-width: 60px; font-family: inherit; font-size: 0.875rem; color: var(--p-text-color);\" />");
        }

        output.Content.SetHtmlContent(sb.ToString());

        var props = new
        {
            targetInputName = TargetInput,
            inputId = InputId,
            values = tagList,
            placeholder = Placeholder,
            separator = Separator,
            delimiter = Delimiter ?? Separator,
            addOnPaste = AddOnPaste,
            allowDuplicate = AllowDuplicate,
            max = Max,
            typeahead = Typeahead,
            suggestions = Suggestions,
            variant = Variant.ToString().ToLowerInvariant(),
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            readonlyMode = ReadOnly,
            invalid = Invalid
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
/// TagHelper for <island-listbox /> — Aura Listbox Component
/// </summary>
[HtmlTargetElement("island-listbox")]
public class IslandListboxTagHelper : TagHelper
{
    [HtmlAttributeName("options")]
    public object? Options { get; set; }

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("selected-value")]
    public string? SelectedValue { get; set; }

    [HtmlAttributeName("values")]
    public List<string>? Values { get; set; }

    [HtmlAttributeName("selected-values")]
    public List<string>? SelectedValues { get; set; }

    [HtmlAttributeName("multiple")]
    public bool Multiple { get; set; } = false;

    [HtmlAttributeName("meta-key-selection")]
    public bool MetaKeySelection { get; set; } = true;

    [HtmlAttributeName("checkbox")]
    public bool Checkbox { get; set; } = false;

    [HtmlAttributeName("checkmark")]
    public bool Checkmark { get; set; } = false;

    [HtmlAttributeName("highlight-on-select")]
    public bool HighlightOnSelect { get; set; } = true;

    [HtmlAttributeName("filter")]
    public bool Filter { get; set; } = false;

    [HtmlAttributeName("filter-placeholder")]
    public string? FilterPlaceholder { get; set; }

    [HtmlAttributeName("filter-match-mode")]
    public string? FilterMatchMode { get; set; }

    [HtmlAttributeName("scroll-height")]
    public string? ScrollHeight { get; set; }

    [HtmlAttributeName("striped")]
    public bool Striped { get; set; } = false;

    [HtmlAttributeName("variant")]
    public InputVariant Variant { get; set; } = InputVariant.Outlined;

    [HtmlAttributeName("size")]
    public ComponentSize Size { get; set; } = ComponentSize.Normal;

    [HtmlAttributeName("fluid")]
    public bool Fluid { get; set; } = false;

    [HtmlAttributeName("invalid")]
    public bool Invalid { get; set; } = false;

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("input-id")]
    public string? InputId { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    [HtmlAttributeName("header")]
    public string? Header { get; set; }

    [HtmlAttributeName("header-count")]
    public string? HeaderCount { get; set; }

    [HtmlAttributeName("footer")]
    public string? Footer { get; set; }

    [HtmlAttributeName("auto-option-focus")]
    public bool AutoOptionFocus { get; set; } = true;

    [HtmlAttributeName("select-on-focus")]
    public bool SelectOnFocus { get; set; } = false;

    [HtmlAttributeName("focus-on-hover")]
    public bool FocusOnHover { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("multiple", out var mulAttr))
        {
            if (bool.TryParse(mulAttr.Value?.ToString(), out var m)) Multiple = m;
            else if (mulAttr.Value != null) Multiple = true;
        }
        if (context.AllAttributes.TryGetAttribute("metaKeySelection", out var metaAttr) || context.AllAttributes.TryGetAttribute("meta-key-selection", out metaAttr))
        {
            if (bool.TryParse(metaAttr.Value?.ToString(), out var mk)) MetaKeySelection = mk;
        }
        if (context.AllAttributes.TryGetAttribute("checkbox", out var cbAttr))
        {
            if (bool.TryParse(cbAttr.Value?.ToString(), out var cb)) Checkbox = cb;
            else if (cbAttr.Value != null) Checkbox = true;
        }
        if (context.AllAttributes.TryGetAttribute("checkmark", out var cmAttr))
        {
            if (bool.TryParse(cmAttr.Value?.ToString(), out var cm)) Checkmark = cm;
            else if (cmAttr.Value != null) Checkmark = true;
        }
        if (context.AllAttributes.TryGetAttribute("highlightOnSelect", out var hosAttr) || context.AllAttributes.TryGetAttribute("highlight-on-select", out hosAttr))
        {
            if (bool.TryParse(hosAttr.Value?.ToString(), out var hos)) HighlightOnSelect = hos;
        }
        if (context.AllAttributes.TryGetAttribute("filter", out var fAttr))
        {
            if (bool.TryParse(fAttr.Value?.ToString(), out var f)) Filter = f;
            else if (fAttr.Value != null) Filter = true;
        }
        if (context.AllAttributes.TryGetAttribute("striped", out var strAttr))
        {
            if (bool.TryParse(strAttr.Value?.ToString(), out var st)) Striped = st;
            else if (strAttr.Value != null) Striped = true;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("variant", out var varAttr))
        {
            if (System.Enum.TryParse<InputVariant>(varAttr.Value?.ToString(), true, out var vr)) Variant = vr;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (System.Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var rootClasses = new List<string> { "laughtale-listbox", "p-listbox" };
        if (Fluid) rootClasses.Add("p-listbox-fluid");
        if (Variant == InputVariant.Filled) rootClasses.Add("variant-filled");
        if (Striped) rootClasses.Add("p-listbox-striped");
        if (Size != ComponentSize.Normal) rootClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Invalid) rootClasses.Add("is-invalid");
        if (Disabled) rootClasses.Add("is-disabled");

        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses));
        output.Attributes.SetAttribute("data-island", "listbox");
        output.Attributes.SetAttribute("data-hydrate", "load");
        output.Attributes.SetAttribute("tabindex", Disabled ? "-1" : "0");
        output.Attributes.SetAttribute("role", "listbox");
        output.Attributes.SetAttribute("aria-multiselectable", Multiple ? "true" : "false");

        if (!string.IsNullOrEmpty(InputId)) output.Attributes.SetAttribute("id", InputId);

        var effectiveValue = (object?)Values ?? (object?)SelectedValues ?? (object?)Value ?? SelectedValue;

        var props = new
        {
            options = Options ?? new List<object>(),
            value = effectiveValue,
            selectedValue = effectiveValue,
            multiple = Multiple,
            metaKeySelection = MetaKeySelection,
            checkbox = Checkbox,
            checkmark = Checkmark,
            highlightOnSelect = HighlightOnSelect,
            filter = Filter,
            filterPlaceholder = FilterPlaceholder ?? "Filter...",
            filterMatchMode = FilterMatchMode ?? "contains",
            scrollHeight = ScrollHeight ?? "220px",
            striped = Striped,
            variant = Variant == InputVariant.Filled ? "filled" : "outlined",
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            invalid = Invalid,
            inputId = InputId,
            name = Name,
            targetInputName = TargetInput,
            header = Header,
            headerCount = HeaderCount,
            footer = Footer,
            autoOptionFocus = AutoOptionFocus,
            selectOnFocus = SelectOnFocus,
            focusOnHover = FocusOnHover
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
/// TagHelper for <island-radio /> / <island-radio-button /> / <island-radio-group /> — Aura RadioButton Component
/// </summary>
[HtmlTargetElement("island-radio")]
[HtmlTargetElement("island-radio-button")]
[HtmlTargetElement("island-radio-group")]
public class IslandRadioTagHelper : TagHelper
{
    [HtmlAttributeName("checked")]
    public bool Checked { get; set; } = false;

    [HtmlAttributeName("label")]
    public string? Label { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("description")]
    public string? Description { get; set; }

    [HtmlAttributeName("badge")]
    public string? Badge { get; set; }

    [HtmlAttributeName("flag")]
    public string? Flag { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

    [HtmlAttributeName("price")]
    public string? Price { get; set; }

    [HtmlAttributeName("card")]
    public bool Card { get; set; } = false;

    [HtmlAttributeName("variant")]
    public InputVariant Variant { get; set; } = InputVariant.Outlined;

    [HtmlAttributeName("size")]
    public ComponentSize Size { get; set; } = ComponentSize.Normal;

    [HtmlAttributeName("invalid")]
    public bool Invalid { get; set; } = false;

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("readonly")]
    public bool Readonly { get; set; } = false;

    [HtmlAttributeName("input-id")]
    public string? InputId { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    [HtmlAttributeName("options")]
    public object? Options { get; set; }

    [HtmlAttributeName("selected-value")]
    public string? SelectedValue { get; set; }

    [HtmlAttributeName("layout")]
    public string Layout { get; set; } = "vertical";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("checked", out var chkAttr))
        {
            if (bool.TryParse(chkAttr.Value?.ToString(), out var chk)) Checked = chk;
            else if (chkAttr.Value != null) Checked = true;
        }
        if (context.AllAttributes.TryGetAttribute("card", out var cardAttr))
        {
            if (bool.TryParse(cardAttr.Value?.ToString(), out var cd)) Card = cd;
            else if (cardAttr.Value != null) Card = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("readonly", out var roAttr))
        {
            if (bool.TryParse(roAttr.Value?.ToString(), out var ro)) Readonly = ro;
            else if (roAttr.Value != null) Readonly = true;
        }
        if (context.AllAttributes.TryGetAttribute("variant", out var varAttr))
        {
            if (System.Enum.TryParse<InputVariant>(varAttr.Value?.ToString(), true, out var vr)) Variant = vr;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (System.Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "radio-button");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var isEffectiveChecked = Checked || (!string.IsNullOrEmpty(SelectedValue) && SelectedValue == Value);

        var props = new
        {
            @checked = isEffectiveChecked,
            label = Label,
            name = Name ?? "radio_group",
            value = Value ?? Label ?? "val",
            description = Description,
            badge = Badge,
            flag = Flag,
            icon = Icon,
            price = Price,
            card = Card,
            variant = Variant == InputVariant.Filled ? "filled" : "outlined",
            size = Size.ToString().ToLowerInvariant(),
            invalid = Invalid,
            disabled = Disabled,
            @readonly = Readonly,
            inputId = InputId,
            targetInputName = TargetInput,
            options = Options,
            selectedValue = SelectedValue,
            layout = Layout
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-rendered markup
        if (Options == null)
        {
            var rootClasses = new List<string> { "laughtale-radio-root", "p-radiobutton-root" };
            if (Card) rootClasses.Add("p-radiobutton-card");
            if (isEffectiveChecked) rootClasses.Add("is-checked");
            if (Variant == InputVariant.Filled) rootClasses.Add("variant-filled");
            if (Size != ComponentSize.Normal) rootClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
            if (Invalid) rootClasses.Add("is-invalid");
            if (Disabled) rootClasses.Add("is-disabled");

            var chkAttrStr = isEffectiveChecked ? " checked" : "";
            var disAttrStr = Disabled ? " disabled" : "";
            var roAttrStr = Readonly ? " readonly" : "";
            var idAttrStr = !string.IsNullOrEmpty(InputId) ? $" id=\"{System.Net.WebUtility.HtmlEncode(InputId)}\"" : "";
            var valAttrStr = $" value=\"{System.Net.WebUtility.HtmlEncode(Value ?? Label ?? "val")}\"";
            var nameAttrStr = !string.IsNullOrEmpty(Name) ? $" name=\"{System.Net.WebUtility.HtmlEncode(Name)}\"" : "";

            if (Card)
            {
                var flagHtml = !string.IsNullOrEmpty(Flag) ? $"<span style=\"font-size: 1.25rem; line-height: 1;\">{System.Net.WebUtility.HtmlEncode(Flag)}</span>" : "";
                var descHtml = !string.IsNullOrEmpty(Description) ? $"<div class=\"p-radiobutton-card-desc\">{System.Net.WebUtility.HtmlEncode(Description)}</div>" : "";
                var badgeHtml = !string.IsNullOrEmpty(Badge) ? $"<span class=\"p-radiobutton-card-badge\">{System.Net.WebUtility.HtmlEncode(Badge)}</span>" : "";
                var priceHtml = !string.IsNullOrEmpty(Price) ? $"<span class=\"p-radiobutton-card-price\">{System.Net.WebUtility.HtmlEncode(Price)}</span>" : "";

                output.Content.SetHtmlContent($@"<label class=""{string.Join(" ", rootClasses)}"">
    <div class=""p-radiobutton-card-content"">
        {flagHtml}
        <div>
            <div class=""p-radiobutton-card-title"">
                <span>{System.Net.WebUtility.HtmlEncode(Label ?? Value ?? "")}</span>
                {badgeHtml}
            </div>
            {descHtml}
        </div>
    </div>
    <div style=""display: flex; align-items: center;"">
        {priceHtml}
        <div class=""p-radiobutton{(isEffectiveChecked ? " p-radiobutton-checked" : "")}"">
            <input type=""radio"" class=""p-radiobutton-input""{nameAttrStr}{valAttrStr}{idAttrStr}{chkAttrStr}{disAttrStr}{roAttrStr} />
            <div class=""p-radiobutton-box""><div class=""p-radiobutton-icon""></div></div>
        </div>
    </div>
</label>");
            }
            else
            {
                var labelHtml = !string.IsNullOrEmpty(Label) ? $"<span class=\"p-radiobutton-label\">{System.Net.WebUtility.HtmlEncode(Label)}</span>" : "";
                output.Content.SetHtmlContent($@"<label class=""{string.Join(" ", rootClasses)}"">
    <div class=""p-radiobutton{(isEffectiveChecked ? " p-radiobutton-checked" : "")}"">
        <input type=""radio"" class=""p-radiobutton-input""{nameAttrStr}{valAttrStr}{idAttrStr}{chkAttrStr}{disAttrStr}{roAttrStr} />
        <div class=""p-radiobutton-box""><div class=""p-radiobutton-icon""></div></div>
    </div>
    {labelHtml}
</label>");
            }
        }
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
/// TagHelper for <island-input-mask /> / <island-mask /> — Aura Pattern-Masked Input
/// </summary>
[HtmlTargetElement("island-input-mask")]
[HtmlTargetElement("island-mask")]
public class IslandInputMaskTagHelper : TagHelper
{
    [HtmlAttributeName("mask")]
    public string Mask { get; set; } = "(999) 999-9999";

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("placeholder")]
    public string? Placeholder { get; set; }

    [HtmlAttributeName("slot-char")]
    public string SlotChar { get; set; } = "_";

    [HtmlAttributeName("auto-clear")]
    public bool AutoClear { get; set; } = true;

    [HtmlAttributeName("unmask")]
    public bool Unmask { get; set; } = false;

    [HtmlAttributeName("variant")]
    public InputVariant Variant { get; set; } = InputVariant.Outlined;

    [HtmlAttributeName("size")]
    public ComponentSize Size { get; set; } = ComponentSize.Normal;

    [HtmlAttributeName("fluid")]
    public bool Fluid { get; set; } = false;

    [HtmlAttributeName("invalid")]
    public bool Invalid { get; set; } = false;

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("readonly")]
    public bool Readonly { get; set; } = false;

    [HtmlAttributeName("input-id")]
    public string? InputId { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("slotChar", out var scAttr) || context.AllAttributes.TryGetAttribute("slot-char", out scAttr))
        {
            SlotChar = scAttr.Value?.ToString() ?? "_";
        }
        if (context.AllAttributes.TryGetAttribute("autoClear", out var acAttr) || context.AllAttributes.TryGetAttribute("auto-clear", out acAttr))
        {
            if (bool.TryParse(acAttr.Value?.ToString(), out var ac)) AutoClear = ac;
        }
        if (context.AllAttributes.TryGetAttribute("unmask", out var umAttr))
        {
            if (bool.TryParse(umAttr.Value?.ToString(), out var um)) Unmask = um;
            else if (umAttr.Value != null) Unmask = true;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("readonly", out var roAttr))
        {
            if (bool.TryParse(roAttr.Value?.ToString(), out var ro)) Readonly = ro;
            else if (roAttr.Value != null) Readonly = true;
        }
        if (context.AllAttributes.TryGetAttribute("variant", out var varAttr))
        {
            if (System.Enum.TryParse<InputVariant>(varAttr.Value?.ToString(), true, out var vr)) Variant = vr;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (System.Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "input-mask");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            mask = Mask,
            value = Value,
            placeholder = Placeholder,
            slotChar = SlotChar,
            autoClear = AutoClear,
            unmask = Unmask,
            variant = Variant == InputVariant.Filled ? "filled" : "outlined",
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            @readonly = Readonly,
            invalid = Invalid,
            inputId = InputId,
            name = Name,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-rendered input markup
        var rootClasses = new List<string> { "laughtale-input-mask", "p-inputmask", "p-inputtext" };
        if (Fluid) rootClasses.Add("p-inputmask-fluid");
        if (Variant == InputVariant.Filled) rootClasses.Add("variant-filled");
        if (Size != ComponentSize.Normal) rootClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Invalid) rootClasses.Add("is-invalid");
        if (Disabled) rootClasses.Add("is-disabled");

        var idAttr = !string.IsNullOrEmpty(InputId) ? $" id=\"{System.Net.WebUtility.HtmlEncode(InputId)}\"" : "";
        var disAttrStr = Disabled ? " disabled" : "";
        var roAttrStr = Readonly ? " readonly" : "";
        var plAttrStr = !string.IsNullOrEmpty(Placeholder) ? $" placeholder=\"{System.Net.WebUtility.HtmlEncode(Placeholder)}\"" : "";
        var valAttrStr = !string.IsNullOrEmpty(Value) ? $" value=\"{System.Net.WebUtility.HtmlEncode(Value)}\"" : "";

        output.Content.SetHtmlContent($"<input type=\"text\" class=\"{string.Join(" ", rootClasses)}\"{idAttr}{valAttrStr}{plAttrStr}{disAttrStr}{roAttrStr} />");
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
        if (context.AllAttributes.TryGetAttribute("variant", out var varAttr))
        {
            if (System.Enum.TryParse<FloatLabelVariant>(varAttr.Value?.ToString(), true, out var vr)) Variant = vr;
        }

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
/// TagHelper for <island-input-text /> / <island-inputtext /> / <island-text /> / <island-enhanced-input /> — Aura InputText
/// </summary>
[HtmlTargetElement("island-input-text")]
[HtmlTargetElement("island-inputtext")]
[HtmlTargetElement("island-text")]
[HtmlTargetElement("island-enhanced-input")]
public class IslandEnhancedInputTextTagHelper : TagHelper
{
    public string? Value { get; set; }
    public string? Placeholder { get; set; }
    public string Type { get; set; } = "text";
    public InputVariant Variant { get; set; } = InputVariant.Outlined;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Fluid { get; set; } = false;
    public bool Invalid { get; set; } = false;
    public bool Disabled { get; set; } = false;
    public bool Readonly { get; set; } = false;
    public bool ShowClear { get; set; } = false;
    public bool Clearable { get; set; } = false;
    public string? IconLeft { get; set; }
    public string? IconRight { get; set; }
    public string? Icon { get; set; }
    public string? InputId { get; set; }
    public string? Name { get; set; }
    public string? HelpText { get; set; }
    public string? AriaLabel { get; set; }
    public string? AriaLabelledBy { get; set; }
    public string? AriaDescribedBy { get; set; }
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Fallback attribute resolution
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("variant", out var varAttr))
        {
            if (Enum.TryParse<InputVariant>(varAttr.Value?.ToString(), true, out var vr)) Variant = vr;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("showClear", out var scAttr) || context.AllAttributes.TryGetAttribute("show-clear", out scAttr) || context.AllAttributes.TryGetAttribute("clearable", out scAttr))
        {
            if (bool.TryParse(scAttr.Value?.ToString(), out var sc)) ShowClear = sc;
            else if (scAttr.Value != null) ShowClear = true;
        }
        if (context.AllAttributes.TryGetAttribute("iconLeft", out var ilAttr) || context.AllAttributes.TryGetAttribute("icon-left", out ilAttr))
        {
            IconLeft = ilAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("iconRight", out var irAttr) || context.AllAttributes.TryGetAttribute("icon-right", out irAttr))
        {
            IconRight = irAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("icon", out var icAttr))
        {
            Icon = icAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("helpText", out var htAttr) || context.AllAttributes.TryGetAttribute("help-text", out htAttr))
        {
            HelpText = htAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var wrapClasses = new List<string> { "laughtale-inputtext-wrap", "p-inputtext-wrap" };
        if (Fluid) wrapClasses.Add("p-inputtext-fluid");
        if (!string.IsNullOrEmpty(IconLeft) || (!string.IsNullOrEmpty(Icon) && string.IsNullOrEmpty(IconRight))) wrapClasses.Add("has-icon-left");
        if (!string.IsNullOrEmpty(IconRight)) wrapClasses.Add("has-icon-right");
        if (ShowClear || Clearable) wrapClasses.Add("has-clear");

        output.Attributes.SetAttribute("class", string.Join(" ", wrapClasses));
        output.Attributes.SetAttribute("data-island", "input-text");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var effectiveLeftIcon = IconLeft ?? (string.IsNullOrEmpty(IconRight) ? Icon : null);
        var props = new
        {
            value = Value,
            placeholder = Placeholder,
            type = Type,
            variant = Variant == InputVariant.Filled ? "filled" : "outlined",
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            readonlyMode = Readonly,
            invalid = Invalid,
            showClear = ShowClear || Clearable,
            clearable = ShowClear || Clearable,
            iconLeft = effectiveLeftIcon,
            iconRight = IconRight,
            inputId = InputId,
            name = Name,
            helpText = HelpText,
            ariaLabel = AriaLabel,
            ariaLabelledBy = AriaLabelledBy,
            ariaDescribedBy = AriaDescribedBy,
            targetInputName = TargetInput
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // Server-Side Rendering
        var inputClasses = new List<string> { "p-inputtext" };
        if (Variant == InputVariant.Filled) inputClasses.Add("variant-filled");
        if (Size != ComponentSize.Normal) inputClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Invalid) inputClasses.Add("is-invalid");
        if (Fluid) inputClasses.Add("p-inputtext-fluid");
        var idAttr = !string.IsNullOrEmpty(InputId) ? $" id=\"{System.Net.WebUtility.HtmlEncode(InputId)}\"" : "";
        var nameAttr = !string.IsNullOrEmpty(Name) ? $" name=\"{System.Net.WebUtility.HtmlEncode(Name)}\"" : (!string.IsNullOrEmpty(TargetInput) ? $" name=\"{System.Net.WebUtility.HtmlEncode(TargetInput)}\"" : "");
        var placeholderAttr = !string.IsNullOrEmpty(Placeholder) ? $" placeholder=\"{System.Net.WebUtility.HtmlEncode(Placeholder)}\"" : "";
        var valueAttr = !string.IsNullOrEmpty(Value) ? $" value=\"{System.Net.WebUtility.HtmlEncode(Value)}\"" : "";
        var disabledAttr = Disabled ? " disabled" : "";
        var readonlyAttr = Readonly ? " readonly" : "";

        var sb = new System.Text.StringBuilder();

        if (!string.IsNullOrEmpty(effectiveLeftIcon))
        {
            sb.Append("<span class=\"p-inputtext-icon p-inputtext-icon-left\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get(effectiveLeftIcon, 16));
            sb.Append("</span>");
        }

        sb.Append($"<input type=\"{Type}\" class=\"{string.Join(" ", inputClasses)}\"{idAttr}{nameAttr}{placeholderAttr}{valueAttr}{disabledAttr}{readonlyAttr} autocomplete=\"off\" />");

        if ((ShowClear || Clearable) && !string.IsNullOrEmpty(Value) && !Disabled)
        {
            sb.Append("<button type=\"button\" class=\"p-inputtext-clear\" aria-label=\"Clear text\" tabindex=\"-1\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get("x", 14));
            sb.Append("</button>");
        }

        if (!string.IsNullOrEmpty(IconRight))
        {
            sb.Append("<span class=\"p-inputtext-icon p-inputtext-icon-right\">");
            sb.Append(SoftMax.LaughTale.Components.Icons.LucideIcons.Get(IconRight, 16));
            sb.Append("</span>");
        }

        if (!string.IsNullOrEmpty(HelpText))
        {
            var helpIdAttr = !string.IsNullOrEmpty(AriaDescribedBy) ? $" id=\"{System.Net.WebUtility.HtmlEncode(AriaDescribedBy)}\"" : "";
            sb.Append($"<small class=\"p-inputtext-help\"{helpIdAttr}>{System.Net.WebUtility.HtmlEncode(HelpText)}</small>");
        }

        output.Content.SetHtmlContent(sb.ToString());
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

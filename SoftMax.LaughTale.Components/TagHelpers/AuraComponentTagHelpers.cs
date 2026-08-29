using SoftMax.LaughTale.Core.Serialization;
using SoftMax.LaughTale.Core.Enums;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Enums;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Components.Icons;
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
/// TagHelper for <island-toggle-switch /> / <island-toggleswitch /> / <island-switch /> — Aura ToggleSwitch
/// </summary>
[HtmlTargetElement("island-toggle-switch")]
[HtmlTargetElement("island-toggleswitch")]
[HtmlTargetElement("island-switch")]
public class IslandSwitchTagHelper : TagHelper
{
    [HtmlAttributeName("checked")]
    public bool Checked { get; set; } = false;

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("label")]
    public string? Label { get; set; }

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("invalid")]
    public bool Invalid { get; set; } = false;

    [HtmlAttributeName("checked-icon")]
    public string? CheckedIcon { get; set; }

    [HtmlAttributeName("unchecked-icon")]
    public string? UncheckedIcon { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

    [HtmlAttributeName("input-id")]
    public string? InputId { get; set; }

    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; }

    [HtmlAttributeName("aria-labelledby")]
    public string? AriaLabelledBy { get; set; }

    [HtmlAttributeName("slider-class")]
    public string? SliderClass { get; set; }

    [HtmlAttributeName("handle-class")]
    public string? HandleClass { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("checked", out var chkAttr))
        {
            if (bool.TryParse(chkAttr.Value?.ToString(), out var chk)) Checked = chk;
            else if (chkAttr.Value != null) Checked = true;
        }
        if (context.AllAttributes.TryGetAttribute("value", out var valAttr))
        {
            if (bool.TryParse(valAttr.Value?.ToString(), out var chkVal)) Checked = chkVal;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("invalid", out var invAttr))
        {
            if (bool.TryParse(invAttr.Value?.ToString(), out var inv)) Invalid = inv;
            else if (invAttr.Value != null) Invalid = true;
        }
        if (context.AllAttributes.TryGetAttribute("checkedIcon", out var ciAttr) || context.AllAttributes.TryGetAttribute("checked-icon", out ciAttr))
        {
            CheckedIcon = ciAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("uncheckedIcon", out var uiAttr) || context.AllAttributes.TryGetAttribute("unchecked-icon", out uiAttr))
        {
            UncheckedIcon = uiAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("inputId", out var iiAttr) || context.AllAttributes.TryGetAttribute("input-id", out iiAttr))
        {
            InputId = iiAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("sliderClass", out var scAttr) || context.AllAttributes.TryGetAttribute("slider-class", out scAttr))
        {
            SliderClass = scAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("handleClass", out var hcAttr) || context.AllAttributes.TryGetAttribute("handle-class", out hcAttr))
        {
            HandleClass = hcAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "toggle-switch");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var effectiveId = InputId ?? Id;
        var inputName = Name ?? TargetInput ?? "switch_value";

        var props = new
        {
            @checked = Checked,
            value = Checked,
            label = Label,
            disabled = Disabled,
            invalid = Invalid,
            checkedIcon = CheckedIcon ?? Icon,
            uncheckedIcon = UncheckedIcon,
            icon = Icon,
            inputId = effectiveId,
            name = Name,
            targetInputName = TargetInput,
            ariaLabel = AriaLabel,
            ariaLabelledBy = AriaLabelledBy,
            sliderClass = SliderClass,
            handleClass = HandleClass
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-rendered markup
        var rootClasses = new List<string> { "laughtale-toggleswitch", "p-toggleswitch", "p-component" };
        if (Checked) rootClasses.Add("p-toggleswitch-checked");
        if (Invalid) rootClasses.Add("p-invalid is-invalid");
        if (Disabled) rootClasses.Add("p-disabled");

        if (output.Attributes.TryGetAttribute("class", out var existingClass))
        {
            rootClasses.Add(existingClass.Value.ToString()!);
        }
        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses.Distinct()));

        var activeIcon = Checked ? (CheckedIcon ?? Icon) : UncheckedIcon;
        var iconSvg = !string.IsNullOrEmpty(activeIcon) ? $@"<span class=""p-toggleswitch-handle-icon"">{LucideIcons.Get(activeIcon, 10)}</span>" : "";
        var idAttr = !string.IsNullOrEmpty(effectiveId) ? $@"id=""{effectiveId}""" : "";
        var checkedAttr = Checked ? "checked" : "";
        var disabledAttr = Disabled ? "disabled" : "";
        var labelHtml = !string.IsNullOrEmpty(Label) ? $@"<span class=""p-toggleswitch-label"">{Label}</span>" : "";

        output.Content.SetHtmlContent($@"
            <input type=""checkbox"" role=""switch"" class=""p-toggleswitch-input"" {idAttr} name=""{inputName}"" {checkedAttr} {disabledAttr} aria-checked=""{(Checked ? "true" : "false")}"" tabindex=""{(Disabled ? "-1" : "0")}"" />
            <div class=""p-toggleswitch-slider {SliderClass ?? ""}"">
                <div class=""p-toggleswitch-handle {HandleClass ?? ""}"">
                    {iconSvg}
                </div>
            </div>
            {labelHtml}
        ");
    }
}

/// <summary>
/// TagHelper for <island-toggle-button /> / <island-togglebutton /> — Aura ToggleButton
/// </summary>
[HtmlTargetElement("island-toggle-button")]
[HtmlTargetElement("island-togglebutton")]
public class IslandToggleButtonTagHelper : TagHelper
{
    [HtmlAttributeName("checked")]
    public bool Checked { get; set; } = false;

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("on-label")]
    public string OnLabel { get; set; } = "On";

    [HtmlAttributeName("off-label")]
    public string OffLabel { get; set; } = "Off";

    [HtmlAttributeName("on-icon")]
    public string? OnIcon { get; set; }

    [HtmlAttributeName("off-icon")]
    public string? OffIcon { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

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

    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; }

    [HtmlAttributeName("aria-labelledby")]
    public string? AriaLabelledBy { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("checked", out var chkAttr))
        {
            if (bool.TryParse(chkAttr.Value?.ToString(), out var chk)) Checked = chk;
            else if (chkAttr.Value != null) Checked = true;
        }
        if (context.AllAttributes.TryGetAttribute("value", out var valAttr))
        {
            if (bool.TryParse(valAttr.Value?.ToString(), out var chkVal)) Checked = chkVal;
        }
        if (context.AllAttributes.TryGetAttribute("onLabel", out var onLAttr) || context.AllAttributes.TryGetAttribute("on-label", out onLAttr))
        {
            OnLabel = onLAttr.Value?.ToString() ?? "On";
        }
        if (context.AllAttributes.TryGetAttribute("offLabel", out var offLAttr) || context.AllAttributes.TryGetAttribute("off-label", out offLAttr))
        {
            OffLabel = offLAttr.Value?.ToString() ?? "Off";
        }
        if (context.AllAttributes.TryGetAttribute("onIcon", out var onIAttr) || context.AllAttributes.TryGetAttribute("on-icon", out onIAttr))
        {
            OnIcon = onIAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("offIcon", out var offIAttr) || context.AllAttributes.TryGetAttribute("off-icon", out offIAttr))
        {
            OffIcon = offIAttr.Value?.ToString();
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
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (System.Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }

        output.TagName = "button";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("type", "button");
        output.Attributes.SetAttribute("role", "button");
        output.Attributes.SetAttribute("aria-pressed", Checked ? "true" : "false");
        output.Attributes.SetAttribute("tabindex", Disabled ? "-1" : "0");
        output.Attributes.SetAttribute("data-island", "toggle-button");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var effectiveId = InputId ?? Id;
        if (!string.IsNullOrEmpty(effectiveId)) output.Attributes.SetAttribute("id", effectiveId);
        if (!string.IsNullOrEmpty(AriaLabel)) output.Attributes.SetAttribute("aria-label", AriaLabel);
        if (!string.IsNullOrEmpty(AriaLabelledBy)) output.Attributes.SetAttribute("aria-labelledby", AriaLabelledBy);
        if (Disabled) output.Attributes.SetAttribute("disabled", "disabled");

        var props = new
        {
            @checked = Checked,
            value = Checked,
            onLabel = OnLabel,
            offLabel = OffLabel,
            onIcon = OnIcon ?? Icon,
            offIcon = OffIcon ?? Icon,
            icon = Icon,
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            invalid = Invalid,
            name = Name,
            targetInputName = TargetInput,
            inputId = effectiveId,
            ariaLabel = AriaLabel,
            ariaLabelledBy = AriaLabelledBy
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-rendered markup
        var rootClasses = new List<string> { "laughtale-togglebutton", "p-togglebutton", "p-component" };
        if (Checked) rootClasses.Add("p-togglebutton-checked is-checked");
        if (Fluid) rootClasses.Add("p-togglebutton-fluid");
        if (Size == ComponentSize.Small) rootClasses.Add("size-small p-togglebutton-sm");
        else if (Size == ComponentSize.Large) rootClasses.Add("size-large p-togglebutton-lg");
        if (Invalid) rootClasses.Add("p-invalid is-invalid");
        if (Disabled) rootClasses.Add("p-disabled");

        if (output.Attributes.TryGetAttribute("class", out var existingClass))
        {
            rootClasses.Add(existingClass.Value.ToString()!);
        }
        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses.Distinct()));

        var currentLabel = Checked ? OnLabel : OffLabel;
        var currentIcon = Checked ? (OnIcon ?? Icon) : (OffIcon ?? Icon);
        var iconSize = Size == ComponentSize.Small ? 14 : (Size == ComponentSize.Large ? 18 : 16);
        var iconSvg = !string.IsNullOrEmpty(currentIcon) ? LucideIcons.Get(currentIcon, iconSize) : "";
        var iconHtml = !string.IsNullOrEmpty(iconSvg) ? $@"<span class=""p-togglebutton-icon"">{iconSvg}</span>" : "";
        var labelHtml = !string.IsNullOrEmpty(currentLabel) ? $@"<span class=""p-togglebutton-label"">{currentLabel}</span>" : "";
        var hiddenName = Name ?? TargetInput ?? "togglebutton_value";

        output.Content.SetHtmlContent($@"
            {iconHtml}
            {labelHtml}
            <input type=""hidden"" name=""{hiddenName}"" value=""{(Checked ? "true" : "false")}"" />
        ");
    }
}

/// <summary>
/// TagHelper for <island-slider /> — Aura Range & Discrete Slider
/// </summary>
[HtmlTargetElement("island-slider")]
public class IslandSliderTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public object? Value { get; set; }

    [HtmlAttributeName("max-value")]
    public object? MaxValue { get; set; }

    [HtmlAttributeName("values")]
    public List<double>? Values { get; set; }

    [HtmlAttributeName("min")]
    public double Min { get; set; } = 0;

    [HtmlAttributeName("max")]
    public double Max { get; set; } = 100;

    [HtmlAttributeName("step")]
    public double Step { get; set; } = 1;

    [HtmlAttributeName("range")]
    public bool Range { get; set; } = false;

    [HtmlAttributeName("min-steps-between-handles")]
    public double? MinStepsBetweenHandles { get; set; }

    [HtmlAttributeName("orientation")]
    public string Orientation { get; set; } = "horizontal";

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("disabled-min-handle")]
    public bool DisabledMinHandle { get; set; } = false;

    [HtmlAttributeName("disabled-max-handle")]
    public bool DisabledMaxHandle { get; set; } = false;

    [HtmlAttributeName("input-id")]
    public string? InputId { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("range", out var rngAttr))
        {
            if (bool.TryParse(rngAttr.Value?.ToString(), out var r)) Range = r;
            else if (rngAttr.Value != null) Range = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var d)) Disabled = d;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabledMinHandle", out var dmAttr) || context.AllAttributes.TryGetAttribute("disabled-min-handle", out dmAttr))
        {
            if (bool.TryParse(dmAttr.Value?.ToString(), out var dm)) DisabledMinHandle = dm;
            else if (dmAttr.Value != null) DisabledMinHandle = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabledMaxHandle", out var dxAttr) || context.AllAttributes.TryGetAttribute("disabled-max-handle", out dxAttr))
        {
            if (bool.TryParse(dxAttr.Value?.ToString(), out var dx)) DisabledMaxHandle = dx;
            else if (dxAttr.Value != null) DisabledMaxHandle = true;
        }
        if (context.AllAttributes.TryGetAttribute("minStepsBetweenHandles", out var msbAttr) || context.AllAttributes.TryGetAttribute("min-steps-between-handles", out msbAttr))
        {
            if (double.TryParse(msbAttr.Value?.ToString(), out var msb)) MinStepsBetweenHandles = msb;
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "slider");
        output.Attributes.SetAttribute("data-hydrate", "load");

        if (!string.IsNullOrEmpty(InputId)) output.Attributes.SetAttribute("id", InputId);

        object effectiveValue = Value ?? 0;
        if (Range)
        {
            if (Values != null && Values.Count >= 2)
            {
                effectiveValue = Values;
            }
            else if (Value != null && MaxValue != null)
            {
                effectiveValue = new List<object> { Value, MaxValue };
            }
            else if (Value != null)
            {
                effectiveValue = new List<object> { Min, Value };
            }
            else
            {
                effectiveValue = new List<double> { Min + (Max - Min) * 0.2, Min + (Max - Min) * 0.8 };
            }
        }

        var props = new
        {
            value = effectiveValue,
            values = Values,
            min = Min,
            max = Max,
            step = Step,
            range = Range,
            minStepsBetweenHandles = MinStepsBetweenHandles,
            orientation = Orientation.ToLowerInvariant(),
            disabled = Disabled,
            disabledMinHandle = DisabledMinHandle,
            disabledMaxHandle = DisabledMaxHandle,
            name = Name,
            targetInputName = TargetInput,
            inputId = InputId
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-rendered markup
        var isVertical = Orientation.Equals("vertical", System.StringComparison.OrdinalIgnoreCase);
        var rootClasses = new List<string> { "laughtale-slider", "p-slider", isVertical ? "p-slider-vertical" : "p-slider-horizontal" };
        if (Disabled) rootClasses.Add("is-disabled");

        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses));

        double minD = Min, maxD = Max;
        if (maxD <= minD) maxD = minD + 100;

        if (Range)
        {
            double v1 = minD + (maxD - minD) * 0.2;
            double v2 = minD + (maxD - minD) * 0.8;
            if (effectiveValue is System.Collections.IEnumerable listObj && !(effectiveValue is string))
            {
                var nums = new List<double>();
                foreach (var item in listObj)
                {
                    if (item != null && double.TryParse(item.ToString(), out var parsedN)) nums.Add(parsedN);
                }
                if (nums.Count >= 2) { v1 = nums[0]; v2 = nums[1]; }
            }
            else if (effectiveValue != null && double.TryParse(effectiveValue.ToString(), out var singleN))
            {
                v1 = singleN;
            }

            double p1 = Math.Max(0, Math.Min(100, ((v1 - minD) / (maxD - minD)) * 100));
            double p2 = Math.Max(0, Math.Min(100, ((v2 - minD) / (maxD - minD)) * 100));
            double leftPct = Math.Min(p1, p2);
            double sizePct = Math.Abs(p2 - p1);

            string rangeStyle = isVertical ? $"bottom:{leftPct}%;height:{sizePct}%;" : $"left:{leftPct}%;width:{sizePct}%;";
            string h1Style = isVertical ? $"bottom:{p1}%;" : $"left:{p1}%;";
            string h2Style = isVertical ? $"bottom:{p2}%;" : $"left:{p2}%;";

            output.Content.SetHtmlContent($@"
                <span class=""p-slider-range"" style=""{rangeStyle}""></span>
                <span class=""p-slider-handle {(Disabled || DisabledMinHandle ? "is-disabled" : "")}"" data-handle=""0"" tabindex=""{(Disabled || DisabledMinHandle ? "-1" : "0")}"" role=""slider"" aria-orientation=""{(isVertical ? "vertical" : "horizontal")}"" aria-valuemin=""{Min}"" aria-valuemax=""{Max}"" aria-valuenow=""{v1}"" style=""{h1Style}""></span>
                <span class=""p-slider-handle {(Disabled || DisabledMaxHandle ? "is-disabled" : "")}"" data-handle=""1"" tabindex=""{(Disabled || DisabledMaxHandle ? "-1" : "0")}"" role=""slider"" aria-orientation=""{(isVertical ? "vertical" : "horizontal")}"" aria-valuemin=""{Min}"" aria-valuemax=""{Max}"" aria-valuenow=""{v2}"" style=""{h2Style}""></span>
            ");
        }
        else
        {
            double v = 0;
            if (effectiveValue != null) double.TryParse(effectiveValue.ToString(), out v);
            double p1 = Math.Max(0, Math.Min(100, ((v - minD) / (maxD - minD)) * 100));
            string rangeStyle = isVertical ? $"bottom:0;height:{p1}%;" : $"left:0;width:{p1}%;";
            string hStyle = isVertical ? $"bottom:{p1}%;" : $"left:{p1}%;";

            output.Content.SetHtmlContent($@"
                <span class=""p-slider-range"" style=""{rangeStyle}""></span>
                <span class=""p-slider-handle {(Disabled ? "is-disabled" : "")}"" data-handle=""0"" tabindex=""{(Disabled ? "-1" : "0")}"" role=""slider"" aria-orientation=""{(isVertical ? "vertical" : "horizontal")}"" aria-valuemin=""{Min}"" aria-valuemax=""{Max}"" aria-valuenow=""{v}"" style=""{hStyle}""></span>
            ");
        }
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
/// TagHelper for <island-select-button /> / <island-selectbutton /> — Aura Segmented SelectButton
/// </summary>
[HtmlTargetElement("island-select-button")]
[HtmlTargetElement("island-selectbutton")]
public class IslandSelectButtonTagHelper : TagHelper
{
    [HtmlAttributeName("options")]
    public object? Options { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

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

    [HtmlAttributeName("unselectable")]
    public bool Unselectable { get; set; } = true;

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

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("multiple", out var mulAttr))
        {
            if (bool.TryParse(mulAttr.Value?.ToString(), out var m)) Multiple = m;
            else if (mulAttr.Value != null) Multiple = true;
        }
        if (context.AllAttributes.TryGetAttribute("unselectable", out var unAttr))
        {
            if (bool.TryParse(unAttr.Value?.ToString(), out var u)) Unselectable = u;
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
        output.Attributes.SetAttribute("data-island", "select-button");
        output.Attributes.SetAttribute("data-hydrate", "load");
        output.Attributes.SetAttribute("role", Multiple ? "group" : "radiogroup");

        if (!string.IsNullOrEmpty(InputId)) output.Attributes.SetAttribute("id", InputId);

        var effectiveOptions = Options ?? Items ?? new List<object>();
        var effectiveValue = (object?)Values ?? (object?)SelectedValues ?? (object?)Value ?? SelectedValue;

        var props = new
        {
            options = effectiveOptions,
            value = effectiveValue,
            selectedValue = effectiveValue,
            multiple = Multiple,
            unselectable = Unselectable,
            size = Size.ToString().ToLowerInvariant(),
            fluid = Fluid,
            disabled = Disabled,
            invalid = Invalid,
            name = Name,
            targetInputName = TargetInput,
            inputId = InputId
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-rendered markup
        var rootClasses = new List<string> { "laughtale-selectbutton", "p-selectbutton" };
        if (Fluid) rootClasses.Add("p-selectbutton-fluid");
        if (Size != ComponentSize.Normal) rootClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Invalid) rootClasses.Add("is-invalid");
        if (Disabled) rootClasses.Add("is-disabled");

        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses));
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
    public bool InteractiveSize { get; set; } = false;
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
            interactiveSize = InteractiveSize,
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
/// TagHelper for <island-drawer /> and <p-drawer />
/// PrimeVue 4 Aura Design System compliant edge overlay drawer component.
/// </summary>
[HtmlTargetElement("island-drawer")]
[HtmlTargetElement("p-drawer")]
public class IslandDrawerTagHelper : TagHelper
{
    [HtmlAttributeName("id")]
    public string Id { get; set; } = $"drawer-{System.Guid.NewGuid():N}";

    [HtmlAttributeName("header")]
    public string? Header { get; set; }

    [HtmlAttributeName("title")]
    public string? Title { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "left";

    [HtmlAttributeName("visible")]
    public bool Visible { get; set; } = false;

    [HtmlAttributeName("modal")]
    public bool Modal { get; set; } = true;

    [HtmlAttributeName("dismissable-mask")]
    public bool DismissableMask { get; set; } = true;

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    [HtmlAttributeName("drawer-width")]
    public string? DrawerWidth { get; set; }

    [HtmlAttributeName("drawer-height")]
    public string? DrawerHeight { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("id", Id);
        output.Attributes.SetAttribute("data-island", "drawer");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
        output.Attributes.SetAttribute("style", "display: contents;");

        var displayHeader = Header ?? Title;
        var cleanPos = (Position ?? "left").ToLowerInvariant().Trim();
        if (cleanPos != "left" && cleanPos != "right" && cleanPos != "top" && cleanPos != "bottom" && cleanPos != "full")
        {
            cleanPos = "left";
        }

        var props = new
        {
            id = Id,
            header = displayHeader,
            position = cleanPos,
            visible = Visible,
            modal = Modal,
            dismissableMask = DismissableMask,
            closable = Closable,
            closeOnEscape = CloseOnEscape,
            width = DrawerWidth,
            height = DrawerHeight
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        var maskClasses = $"p-drawer-mask p-drawer-{cleanPos}";
        if (Modal) maskClasses += " p-drawer-mask-modal";
        if (Visible) maskClasses += " p-drawer-mask-active";

        var drawerStyle = "";
        if (!string.IsNullOrWhiteSpace(DrawerWidth)) drawerStyle += $"width: {DrawerWidth};";
        if (!string.IsNullOrWhiteSpace(DrawerHeight)) drawerStyle += $"height: {DrawerHeight};";
        if (!string.IsNullOrWhiteSpace(Style)) drawerStyle += $" {Style}";

        var childContent = await output.GetChildContentAsync();

        var headerCloseButton = Closable ? @"
            <button type=""button"" class=""p-drawer-close-button"" aria-label=""Close"">
                <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><line x1=""18"" y1=""6"" x2=""6"" y2=""18""/><line x1=""6"" y1=""6"" x2=""18"" y2=""18""/></svg>
            </button>" : "";

        var headerHtml = !string.IsNullOrWhiteSpace(displayHeader) ? $@"
            <div class=""p-drawer-header"">
                <h3 class=""p-drawer-title"">{displayHeader}</h3>
                <div class=""p-drawer-header-actions"">
                    {headerCloseButton}
                </div>
            </div>" : "";

        var drawerClasses = "p-drawer p-component";
        if (!string.IsNullOrWhiteSpace(Class)) drawerClasses += $" {Class}";

        output.Content.SetHtmlContent($@"
            <div class=""{maskClasses}"">
                <div class=""{drawerClasses}"" role=""complementary"" aria-modal=""{Modal.ToString().ToLowerInvariant()}"" style=""{drawerStyle}"">
                    {headerHtml}
                    {childContent.GetContent()}
                </div>
            </div>
        ");
    }
}

/// <summary>
/// TagHelper for <island-speed-dial />
/// Floating action button with popup action items, compliant with Aura Design System.
/// </summary>
[HtmlTargetElement("island-speed-dial")]
public class IslandSpeedDialTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<SpeedDialAction> Model { get; set; } = new();

    [HtmlAttributeName("actions")]
    public List<SpeedDialAction> Actions { get; set; } = new();

    [HtmlAttributeName("direction")]
    public string Direction { get; set; } = "up";

    [HtmlAttributeName("type")]
    public string Type { get; set; } = "linear";

    [HtmlAttributeName("radius")]
    public int? Radius { get; set; }

    [HtmlAttributeName("transition-delay")]
    public int TransitionDelay { get; set; } = 30;

    [HtmlAttributeName("mask")]
    public bool Mask { get; set; } = false;

    [HtmlAttributeName("show-icon")]
    public string ShowIcon { get; set; } = "plus";

    [HtmlAttributeName("hide-icon")]
    public string HideIcon { get; set; } = "times";

    [HtmlAttributeName("rotate-animation")]
    public bool RotateAnimation { get; set; } = true;

    [HtmlAttributeName("button-props")]
    public SpeedDialButtonProps? ButtonProps { get; set; }

    [HtmlAttributeName("button-severity")]
    public string? ButtonSeverity { get; set; }

    [HtmlAttributeName("tooltip-options")]
    public SpeedDialTooltipOptions? TooltipOptions { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; } = "Speed Dial Options";

    [HtmlAttributeName("template")]
    public string? Template { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "speed-dial");
        output.Attributes.SetAttribute("data-hydrate", "load");

        if (context.AllAttributes.TryGetAttribute("mask", out var mAttr))
        {
            if (bool.TryParse(mAttr.Value?.ToString(), out var m)) Mask = m;
            else if (mAttr.Value != null) Mask = true;
        }

        var items = (Model != null && Model.Count > 0) ? Model : Actions;
        var btnProps = ButtonProps ?? new SpeedDialButtonProps(
            Severity: ButtonSeverity ?? "primary",
            Rounded: true,
            IconOnly: true
        );

        if (!string.IsNullOrEmpty(ButtonSeverity) && btnProps.Severity != ButtonSeverity)
        {
            btnProps = btnProps with { Severity = ButtonSeverity };
        }

        var props = new
        {
            model = items,
            direction = Direction,
            type = Type,
            radius = Radius,
            transitionDelay = TransitionDelay,
            mask = Mask,
            showIcon = ShowIcon,
            hideIcon = HideIcon,
            rotateAnimation = RotateAnimation,
            buttonProps = btnProps,
            tooltipOptions = TooltipOptions,
            ariaLabel = AriaLabel,
            template = Template
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        // SSR Pre-render
        var sev = (btnProps.Severity ?? "primary").ToLowerInvariant();
        var sevClass = sev != "primary" ? $"p-button-{sev}" : "p-button-primary";
        var roundedClass = btnProps.Rounded ? "p-button-rounded" : "";
        var iconOnlyClass = btnProps.IconOnly ? "p-button-icon-only" : "";
        var customClass = btnProps.StyleClass ?? "";

        var preRenderHtml = $@"
            <div class=""p-speeddial p-component p-speeddial-direction-{Direction} p-speeddial-{Type}"" style=""position: absolute;"">
                <button type=""button"" class=""p-speeddial-button p-button {sevClass} {roundedClass} {iconOnlyClass} {customClass}"" aria-haspopup=""true"" aria-expanded=""false"" aria-label=""{AriaLabel}"">
                    <span class=""p-speeddial-icon"">{LucideIcons.Get(ShowIcon ?? "plus", 20)}</span>
                </button>
            </div>";

        output.Content.SetHtmlContent(preRenderHtml);
    }
}

/// <summary>
/// TagHelper for <island-compare />, <p-compare />, and <island-image-compare />
/// PrimeVue 4 Aura Design System compliant side-by-side comparison slider.
/// </summary>
[HtmlTargetElement("island-compare")]
[HtmlTargetElement("p-compare")]
[HtmlTargetElement("island-image-compare")]
public class IslandImageCompareTagHelper : TagHelper
{
    [HtmlAttributeName("model-value")]
    public double? ModelValue { get; set; }

    [HtmlAttributeName("value")]
    public double? Value { get; set; }

    [HtmlAttributeName("min")]
    public double Min { get; set; } = 0;

    [HtmlAttributeName("max")]
    public double Max { get; set; } = 100;

    [HtmlAttributeName("step")]
    public double Step { get; set; } = 1;

    [HtmlAttributeName("orientation")]
    public string Orientation { get; set; } = "horizontal";

    [HtmlAttributeName("slide-on-hover")]
    public bool SlideOnHover { get; set; } = false;

    [HtmlAttributeName("custom-handle")]
    public bool CustomHandle { get; set; } = false;

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("readonly")]
    public bool Readonly { get; set; } = false;

    [HtmlAttributeName("before-image")]
    public string? BeforeImage { get; set; }

    [HtmlAttributeName("after-image")]
    public string? AfterImage { get; set; }

    [HtmlAttributeName("before-label")]
    public string? BeforeLabel { get; set; }

    [HtmlAttributeName("after-label")]
    public string? AfterLabel { get; set; }

    [HtmlAttributeName("demo-type")]
    public string? DemoType { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "compare");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            modelValue = ModelValue ?? Value ?? 50,
            value = Value ?? ModelValue ?? 50,
            min = Min,
            max = Max,
            step = Step,
            orientation = Orientation,
            slideOnHover = SlideOnHover,
            customHandle = CustomHandle,
            disabled = Disabled,
            @readonly = Readonly,
            beforeImage = BeforeImage,
            afterImage = AfterImage,
            beforeLabel = BeforeLabel,
            afterLabel = AfterLabel,
            demoType = DemoType,
            ariaLabel = AriaLabel,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
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
/// Enterprise Accordion TagHelper (Aura Design System compliant)
/// </summary>
[HtmlTargetElement("island-accordion")]
public class IslandAccordionTagHelper : TagHelper
{
    [HtmlAttributeName("tabs")]
    public object? Tabs { get; set; }

    [HtmlAttributeName("multiple")]
    public bool Multiple { get; set; } = false;

    [HtmlAttributeName("value")]
    public object? Value { get; set; }

    [HtmlAttributeName("active-index")]
    public object? ActiveIndex { get; set; }

    [HtmlAttributeName("controlled")]
    public bool Controlled { get; set; } = false;

    [HtmlAttributeName("with-radio")]
    public bool WithRadio { get; set; } = false;

    [HtmlAttributeName("custom-trigger")]
    public bool CustomTrigger { get; set; } = false;

    [HtmlAttributeName("custom-indicator")]
    public string? CustomIndicator { get; set; }

    [HtmlAttributeName("expand-icon")]
    public string? ExpandIcon { get; set; }

    [HtmlAttributeName("collapse-icon")]
    public string? CollapseIcon { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("activeIndex", out var aiAttr))
        {
            ActiveIndex = aiAttr.Value;
        }
        if (context.AllAttributes.TryGetAttribute("customIndicator", out var ciAttr))
        {
            CustomIndicator = ciAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("withRadio", out var wrAttr))
        {
            if (bool.TryParse(wrAttr.Value?.ToString(), out var b)) WithRadio = b;
            else if (wrAttr.Value != null) WithRadio = true;
        }
        if (context.AllAttributes.TryGetAttribute("customTrigger", out var ctAttr))
        {
            if (bool.TryParse(ctAttr.Value?.ToString(), out var b)) CustomTrigger = b;
            else if (ctAttr.Value != null) CustomTrigger = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "accordion");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        var props = new
        {
            tabs = Tabs ?? new object[0],
            multiple = Multiple,
            value = Value ?? ActiveIndex,
            activeIndex = ActiveIndex ?? Value,
            controlled = Controlled,
            withRadio = WithRadio,
            customTrigger = CustomTrigger,
            customIndicator = CustomIndicator,
            expandIcon = ExpandIcon,
            collapseIcon = CollapseIcon
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}

// IslandTabsTagHelper moved to IslandTabsTagHelper.cs

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
/// TagHelper for <island-breadcrumb /> and <p-breadcrumb />
/// PrimeVue 4 Aura Design System compliant hierarchical navigation component.
/// </summary>
[HtmlTargetElement("island-breadcrumb")]
[HtmlTargetElement("p-breadcrumb")]
public class IslandBreadcrumbTagHelper : TagHelper
{
    [HtmlAttributeName("items")]
    public List<BreadcrumbItem>? Items { get; set; }

    [HtmlAttributeName("home-url")]
    public string HomeUrl { get; set; } = "/";

    [HtmlAttributeName("home-icon")]
    public string? HomeIcon { get; set; }

    [HtmlAttributeName("home-label")]
    public string? HomeLabel { get; set; }

    [HtmlAttributeName("separator")]
    public string Separator { get; set; } = "chevron";

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "breadcrumb");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            items = Items ?? new(),
            homeUrl = HomeUrl,
            homeIcon = HomeIcon,
            homeLabel = HomeLabel,
            separator = Separator
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
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
/// TagHelper for <island-commandmenu />, <p-commandmenu />, and <island-command />
/// PrimeVue 4 Aura Design System compliant search-driven CommandMenu component.
/// </summary>
[HtmlTargetElement("island-commandmenu")]
[HtmlTargetElement("island-command-menu")]
[HtmlTargetElement("p-commandmenu")]
[HtmlTargetElement("island-command")]
[HtmlTargetElement("island-command-palette")]
public class IslandCommandTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<CommandMenuGroup>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<CommandPaletteItem>? Items { get; set; }

    [HtmlAttributeName("placeholder")]
    public string? Placeholder { get; set; } = "Search for commands...";

    [HtmlAttributeName("search")]
    public string? Search { get; set; }

    [HtmlAttributeName("filter")]
    public string? Filter { get; set; } = "default";

    [HtmlAttributeName("with-dialog")]
    public bool WithDialog { get; set; } = false;

    [HtmlAttributeName("hotkey")]
    public string? Hotkey { get; set; } = "ctrl+l, meta+l";

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("empty-message")]
    public string? EmptyMessage { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "commandmenu");
        output.Attributes.SetAttribute("data-hydrate", "load");

        // Convert flat legacy items if model not provided
        var groups = Model;
        if (groups == null && Items != null && Items.Count > 0)
        {
            var dict = new Dictionary<string, List<CommandMenuItem>>();
            foreach (var it in Items)
            {
                var g = it.Group ?? "General";
                if (!dict.ContainsKey(g)) dict[g] = new();
                dict[g].Add(new CommandMenuItem(it.Label, it.Icon, null, null, null, it.Shortcut, it.Url, it.Action, it.Disabled));
            }

            groups = new();
            foreach (var kv in dict)
            {
                groups.Add(new CommandMenuGroup(kv.Key, kv.Value));
            }
        }

        var props = new
        {
            model = groups ?? new(),
            placeholder = Placeholder,
            search = Search,
            filter = Filter,
            withDialog = WithDialog,
            hotkey = Hotkey,
            customTemplate = CustomTemplate,
            emptyMessage = EmptyMessage
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
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
    public bool InteractiveSize { get; set; } = false;
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
/// TagHelper for <island-picklist /> (Aura PickList Component)
/// </summary>
[HtmlTargetElement("island-picklist")]
public class IslandPickListTagHelper : TagHelper
{
    public List<PickListItem>? Source { get; set; }
    public List<PickListItem>? Target { get; set; }
    public object? Value { get; set; }
    public string SourceHeader { get; set; } = "Available";
    public string TargetHeader { get; set; } = "Selected";
    public string KeyField { get; set; } = "id";
    public bool Filter { get; set; } = false;
    public string FilterBy { get; set; } = "name";
    public string SourceFilterPlaceholder { get; set; } = "Search...";
    public string TargetFilterPlaceholder { get; set; } = "Search...";
    public bool Checkbox { get; set; } = false;
    public bool ShowSourceControls { get; set; } = false;
    public bool ShowTargetControls { get; set; } = false;
    public string ScrollHeight { get; set; } = "18rem";
    public bool Responsive { get; set; } = true;
    public string Breakpoint { get; set; } = "1400px";
    public bool StripedRows { get; set; } = false;
    public bool Disabled { get; set; } = false;
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
            value = Value,
            sourceHeader = SourceHeader,
            targetHeader = TargetHeader,
            dataKey = KeyField,
            filter = Filter,
            filterBy = FilterBy,
            sourceFilterPlaceholder = SourceFilterPlaceholder,
            targetFilterPlaceholder = TargetFilterPlaceholder,
            checkbox = Checkbox,
            showSourceControls = ShowSourceControls,
            showTargetControls = ShowTargetControls,
            scrollHeight = ScrollHeight,
            responsive = Responsive,
            breakpoint = Breakpoint,
            stripedRows = StripedRows,
            disabled = Disabled,
            targetInputName = TargetInput
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-orderlist /> (Aura OrderList Component)
/// </summary>
[HtmlTargetElement("island-orderlist")]
public class IslandOrderListTagHelper : TagHelper
{
    public object? Value { get; set; }
    public object? Items { get; set; }
    public string? Header { get; set; }
    public bool Checkbox { get; set; } = false;
    public bool Filter { get; set; } = false;
    public string? FilterPlaceholder { get; set; } = "Filter by name";
    public string? FilterBy { get; set; } = "name";
    public string ScrollHeight { get; set; } = "20rem";
    public bool Responsive { get; set; } = true;
    public string Breakpoint { get; set; } = "575px";
    public string? KeyField { get; set; }
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "orderlist");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var data = Value ?? Items ?? new object[0];

        var props = new
        {
            value = data,
            items = data,
            header = Header,
            checkbox = Checkbox,
            filter = Filter,
            filterPlaceholder = FilterPlaceholder,
            filterBy = FilterBy,
            scrollHeight = ScrollHeight,
            responsive = Responsive,
            breakpoint = Breakpoint,
            dataKey = KeyField,
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
    public OrgChartNode? Root { get; set; }
    public bool Collapsible { get; set; }
    public string? SelectionMode { get; set; } = "none";
    public List<string>? SelectionKeys { get; set; }
    public List<string>? CollapsedKeys { get; set; }
    public string? ToggleIcon { get; set; } = "chevron";
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Attribute fallbacks
        if (context.AllAttributes.TryGetAttribute("collapsible", out var colAttr))
        {
            if (bool.TryParse(colAttr.Value?.ToString(), out var b)) Collapsible = b;
            else if (colAttr.Value != null) Collapsible = true;
        }
        if (context.AllAttributes.TryGetAttribute("selectionMode", out var smAttr) || context.AllAttributes.TryGetAttribute("selection-mode", out smAttr))
        {
            SelectionMode = smAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("toggleIcon", out var tiAttr) || context.AllAttributes.TryGetAttribute("toggle-icon", out tiAttr))
        {
            ToggleIcon = tiAttr.Value?.ToString();
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "orgchart");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var nodeData = Value ?? Root;
        var props = new
        {
            value = nodeData,
            collapsible = Collapsible,
            selectionMode = SelectionMode ?? "none",
            selectionKeys = SelectionKeys,
            collapsedKeys = CollapsedKeys,
            toggleIcon = ToggleIcon ?? "chevron",
            targetInputName = TargetInput
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
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
/// TagHelper for <island-split-button /> / <island-splitbutton /> (Aura SplitButton)
/// </summary>
[HtmlTargetElement("island-split-button")]
[HtmlTargetElement("island-splitbutton")]
public class IslandSplitButtonTagHelper : TagHelper
{
    public string Label { get; set; } = "Save";
    public string? Icon { get; set; }
    public string? DropdownIcon { get; set; }
    public List<SplitButtonItem>? Model { get; set; }
    public ButtonSeverity Severity { get; set; } = ButtonSeverity.Primary;
    public bool Raised { get; set; } = false;
    public bool Rounded { get; set; } = false;
    public bool Text { get; set; } = false;
    public bool Outlined { get; set; } = false;
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool Disabled { get; set; } = false;
    public bool Fluid { get; set; } = false;
    public object? ButtonProps { get; set; }
    public object? MenuButtonProps { get; set; }
    public string? AppendTo { get; set; }
    public string? Action { get; set; }

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
            dropdownIcon = DropdownIcon,
            model = Model ?? new(),
            severity = Severity.ToString().ToLowerInvariant(),
            raised = Raised,
            rounded = Rounded,
            text = Text,
            outlined = Outlined,
            size = Size.ToString().ToLowerInvariant(),
            disabled = Disabled,
            fluid = Fluid,
            buttonProps = ButtonProps,
            menuButtonProps = MenuButtonProps,
            appendTo = AppendTo,
            action = Action
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

// ─── Aura v2: New Components ────────────────────────────────────────────────

/// <summary>
/// TagHelper for <island-select /> / <island-dropdown /> — Aura Select Component
/// </summary>
[HtmlTargetElement("island-select")]
[HtmlTargetElement("island-dropdown")]
public class IslandSelectTagHelper : TagHelper
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

    [HtmlAttributeName("placeholder")]
    public string? Placeholder { get; set; } = "Select an option...";

    [HtmlAttributeName("multiple")]
    public bool Multiple { get; set; } = false;

    [HtmlAttributeName("checkmark")]
    public bool Checkmark { get; set; } = false;

    [HtmlAttributeName("checkbox")]
    public bool Checkbox { get; set; } = false;

    [HtmlAttributeName("display")]
    public string Display { get; set; } = "comma";

    [HtmlAttributeName("filter")]
    public bool Filter { get; set; } = false;

    [HtmlAttributeName("filter-placeholder")]
    public string? FilterPlaceholder { get; set; } = "Search...";

    [HtmlAttributeName("show-clear")]
    public bool ShowClear { get; set; } = false;

    [HtmlAttributeName("editable")]
    public bool Editable { get; set; } = false;

    [HtmlAttributeName("loading")]
    public bool Loading { get; set; } = false;

    [HtmlAttributeName("scroll-height")]
    public string? ScrollHeight { get; set; } = "220px";

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
        if (context.AllAttributes.TryGetAttribute("multiple", out var mulAttr))
        {
            if (bool.TryParse(mulAttr.Value?.ToString(), out var m)) Multiple = m;
            else if (mulAttr.Value != null) Multiple = true;
        }
        if (context.AllAttributes.TryGetAttribute("checkmark", out var cmAttr))
        {
            if (bool.TryParse(cmAttr.Value?.ToString(), out var cm)) Checkmark = cm;
            else if (cmAttr.Value != null) Checkmark = true;
        }
        if (context.AllAttributes.TryGetAttribute("checkbox", out var cbAttr))
        {
            if (bool.TryParse(cbAttr.Value?.ToString(), out var cb)) Checkbox = cb;
            else if (cbAttr.Value != null) Checkbox = true;
        }
        if (context.AllAttributes.TryGetAttribute("showClear", out var scAttr) || context.AllAttributes.TryGetAttribute("show-clear", out scAttr))
        {
            if (bool.TryParse(scAttr.Value?.ToString(), out var sc)) ShowClear = sc;
            else if (scAttr.Value != null) ShowClear = true;
        }
        if (context.AllAttributes.TryGetAttribute("editable", out var edAttr))
        {
            if (bool.TryParse(edAttr.Value?.ToString(), out var ed)) Editable = ed;
            else if (edAttr.Value != null) Editable = true;
        }
        if (context.AllAttributes.TryGetAttribute("loading", out var ldAttr))
        {
            if (bool.TryParse(ldAttr.Value?.ToString(), out var ld)) Loading = ld;
            else if (ldAttr.Value != null) Loading = true;
        }
        if (context.AllAttributes.TryGetAttribute("filter", out var fAttr))
        {
            if (bool.TryParse(fAttr.Value?.ToString(), out var f)) Filter = f;
            else if (fAttr.Value != null) Filter = true;
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
        output.Attributes.SetAttribute("data-island", "select");
        output.Attributes.SetAttribute("data-hydrate", "load");
        output.Attributes.SetAttribute("tabindex", Disabled ? "-1" : "0");
        output.Attributes.SetAttribute("role", "combobox");

        if (!string.IsNullOrEmpty(InputId)) output.Attributes.SetAttribute("id", InputId);

        var effectiveValue = (object?)Values ?? (object?)SelectedValues ?? (object?)Value ?? SelectedValue;

        var props = new
        {
            options = Options ?? new List<object>(),
            value = effectiveValue,
            selectedValue = effectiveValue,
            placeholder = Placeholder,
            multiple = Multiple,
            checkmark = Checkmark,
            checkbox = Checkbox,
            display = Display,
            filter = Filter,
            filterPlaceholder = FilterPlaceholder,
            showClear = ShowClear,
            editable = Editable,
            loading = Loading,
            scrollHeight = ScrollHeight,
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

        // SSR Pre-rendered markup
        var rootClasses = new List<string> { "laughtale-select", "p-select" };
        if (Fluid) rootClasses.Add("p-select-fluid");
        if (Variant == InputVariant.Filled) rootClasses.Add("variant-filled");
        if (Size != ComponentSize.Normal) rootClasses.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Invalid) rootClasses.Add("is-invalid");
        if (Disabled) rootClasses.Add("is-disabled");

        output.Attributes.SetAttribute("class", string.Join(" ", rootClasses));
        var labelText = !string.IsNullOrEmpty(Value ?? SelectedValue) ? (Value ?? SelectedValue) : Placeholder;
        var isPlaceholder = string.IsNullOrEmpty(Value ?? SelectedValue);

        output.Content.SetHtmlContent($@"<span class=""p-select-label{(isPlaceholder ? " p-placeholder" : "")}"">{System.Net.WebUtility.HtmlEncode(labelText)}</span>
<div class=""p-select-actions"">
    <span class=""p-select-dropdown""><svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""m6 9 6 6 6-6""/></svg></span>
</div>");
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
/// TagHelper for <island-textarea /> / <textarea island-textarea /> — Aura Multi-line Textarea
/// </summary>
[HtmlTargetElement("island-textarea")]
[HtmlTargetElement("textarea", Attributes = "island-textarea")]
public class IslandTextareaTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("placeholder")]
    public string? Placeholder { get; set; }

    [HtmlAttributeName("rows")]
    public int Rows { get; set; } = 5;

    [HtmlAttributeName("cols")]
    public int Cols { get; set; } = 30;

    [HtmlAttributeName("max-length")]
    public int? MaxLength { get; set; }

    [HtmlAttributeName("autoresize")]
    public bool AutoResize { get; set; } = false;

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

    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("autoResize", out var arAttr) || context.AllAttributes.TryGetAttribute("autoresize", out arAttr))
        {
            if (bool.TryParse(arAttr.Value?.ToString(), out var ar)) AutoResize = ar;
            else if (arAttr.Value != null) AutoResize = true;
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
            if (System.Enum.TryParse<InputVariant>(varAttr.Value?.ToString(), true, out var v)) Variant = v;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (System.Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("target-input-name", out var tinAttr) || context.AllAttributes.TryGetAttribute("targetInputName", out tinAttr))
        {
            TargetInput = tinAttr.Value?.ToString();
        }

        output.TagName = "textarea";
        output.TagMode = TagMode.StartTagAndEndTag;

        var effectiveId = InputId ?? Id;
        if (!string.IsNullOrEmpty(effectiveId)) output.Attributes.SetAttribute("id", effectiveId);
        if (!string.IsNullOrEmpty(Name) || !string.IsNullOrEmpty(TargetInput)) output.Attributes.SetAttribute("name", Name ?? TargetInput);
        if (!string.IsNullOrEmpty(Placeholder)) output.Attributes.SetAttribute("placeholder", Placeholder);
        if (Rows > 0) output.Attributes.SetAttribute("rows", Rows);
        if (Cols > 0) output.Attributes.SetAttribute("cols", Cols);
        if (MaxLength.HasValue) output.Attributes.SetAttribute("maxlength", MaxLength.Value);
        if (Disabled) output.Attributes.SetAttribute("disabled", "disabled");

        var classList = new List<string> { "p-textarea" };
        if (Fluid) classList.Add("p-textarea-fluid");
        if (Size == ComponentSize.Small) classList.Add("p-textarea-sm");
        else if (Size == ComponentSize.Large) classList.Add("p-textarea-lg");
        if (Variant == InputVariant.Filled) classList.Add("p-textarea-filled");
        if (Invalid) classList.Add("p-invalid");
        if (Disabled) classList.Add("p-disabled");

        if (output.Attributes.TryGetAttribute("class", out var existingClass))
        {
            classList.Add(existingClass.Value.ToString()!);
        }
        output.Attributes.SetAttribute("class", string.Join(" ", classList.Distinct()));

        if (AutoResize)
        {
            output.Attributes.SetAttribute("data-island", "textarea");
            output.Attributes.SetAttribute("data-hydrate", "load");
            var props = new
            {
                value = Value,
                placeholder = Placeholder,
                rows = Rows,
                cols = Cols,
                maxLength = MaxLength,
                autoResize = true,
                disabled = Disabled,
                invalid = Invalid,
                fluid = Fluid,
                size = Size.ToString().ToLowerInvariant(),
                variant = Variant.ToString().ToLowerInvariant(),
                name = Name,
                targetInputName = TargetInput,
                inputId = effectiveId
            };
            output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        }

        if (!string.IsNullOrEmpty(Value))
        {
            output.Content.SetContent(Value);
        }
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
/// TagHelper for <island-carousel /> and <p-carousel /> — PrimeVue 4 Aura Content Slider
/// </summary>
[HtmlTargetElement("island-carousel")]
[HtmlTargetElement("p-carousel")]
public class IslandCarouselTagHelper : TagHelper
{
    public List<CarouselItem>? Items { get; set; }

    [HtmlAttributeName("align")]
    public string Align { get; set; } = "center";

    [HtmlAttributeName("orientation")]
    public string Orientation { get; set; } = "horizontal";

    [HtmlAttributeName("slides-per-page")]
    public double? SlidesPerPage { get; set; }

    [HtmlAttributeName("loop")]
    public bool Loop { get; set; } = false;

    [HtmlAttributeName("auto-size")]
    public bool AutoSize { get; set; } = false;

    [HtmlAttributeName("spacing")]
    public int Spacing { get; set; } = 16;

    [HtmlAttributeName("slide")]
    public int? Slide { get; set; }

    [HtmlAttributeName("num-visible")]
    public int NumVisible { get; set; } = 1;

    [HtmlAttributeName("num-scroll")]
    public int NumScroll { get; set; } = 1;

    [HtmlAttributeName("autoplay")]
    public bool Autoplay { get; set; } = false;

    [HtmlAttributeName("autoplay-interval")]
    public int AutoplayInterval { get; set; } = 5000;

    [HtmlAttributeName("circular")]
    public bool Circular { get; set; } = false;

    [HtmlAttributeName("show-indicators")]
    public bool ShowIndicators { get; set; } = true;

    [HtmlAttributeName("show-navigators")]
    public bool ShowNavigators { get; set; } = true;

    [HtmlAttributeName("demo-type")]
    public string? DemoType { get; set; }

    [HtmlAttributeName("gallery-images")]
    public List<string>? GalleryImages { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "carousel");
        output.Attributes.SetAttribute("data-hydrate", "visible");

        var props = new
        {
            items = Items,
            align = Align,
            orientation = Orientation,
            slidesPerPage = SlidesPerPage,
            loop = Loop,
            autoSize = AutoSize,
            spacing = Spacing,
            slide = Slide,
            numVisible = NumVisible,
            numScroll = NumScroll,
            autoplay = Autoplay,
            autoplayInterval = AutoplayInterval,
            circular = Circular,
            showIndicators = ShowIndicators,
            showNavigators = ShowNavigators,
            demoType = DemoType,
            galleryImages = GalleryImages,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}

/// <summary>
/// TagHelper for <island-paginator /> — Aura Paginator Component
/// </summary>
[HtmlTargetElement("island-paginator")]
public class IslandPaginatorTagHelper : TagHelper
{
    public int TotalRecords { get; set; } = 0;
    public int Rows { get; set; } = 10;
    public int First { get; set; } = 0;
    public int PageLinkSize { get; set; } = 5;
    public List<int>? RowsPerPageOptions { get; set; }
    public string? Template { get; set; }
    public string? CurrentPageReportTemplate { get; set; }
    public bool ShowFirstLast { get; set; } = true;
    public bool ShowJumpToPageDropdown { get; set; } = false;
    public bool ShowJumpToPageInput { get; set; } = false;
    public bool ShowSlider { get; set; } = false;
    public bool Compact { get; set; } = false;
    public string? TargetInput { get; set; }
    public string? TargetSelector { get; set; }
    public List<string>? Images { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Attribute fallbacks
        if (context.AllAttributes.TryGetAttribute("totalRecords", out var trAttr) || context.AllAttributes.TryGetAttribute("total-records", out trAttr))
        {
            if (int.TryParse(trAttr.Value?.ToString(), out var tr)) TotalRecords = tr;
        }
        if (context.AllAttributes.TryGetAttribute("pageLinkSize", out var plsAttr) || context.AllAttributes.TryGetAttribute("page-link-size", out plsAttr))
        {
            if (int.TryParse(plsAttr.Value?.ToString(), out var pls)) PageLinkSize = pls;
        }
        if (context.AllAttributes.TryGetAttribute("currentPageReportTemplate", out var cprtAttr) || context.AllAttributes.TryGetAttribute("current-page-report-template", out cprtAttr))
        {
            CurrentPageReportTemplate = cprtAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("showJumpToPageDropdown", out var sjdAttr) || context.AllAttributes.TryGetAttribute("show-jump-to-page-dropdown", out sjdAttr))
        {
            if (bool.TryParse(sjdAttr.Value?.ToString(), out var b)) ShowJumpToPageDropdown = b;
            else if (sjdAttr.Value != null) ShowJumpToPageDropdown = true;
        }
        if (context.AllAttributes.TryGetAttribute("showJumpToPageInput", out var sjiAttr) || context.AllAttributes.TryGetAttribute("show-jump-to-page-input", out sjiAttr))
        {
            if (bool.TryParse(sjiAttr.Value?.ToString(), out var b)) ShowJumpToPageInput = b;
            else if (sjiAttr.Value != null) ShowJumpToPageInput = true;
        }
        if (context.AllAttributes.TryGetAttribute("showSlider", out var ssAttr) || context.AllAttributes.TryGetAttribute("show-slider", out ssAttr))
        {
            if (bool.TryParse(ssAttr.Value?.ToString(), out var b)) ShowSlider = b;
            else if (ssAttr.Value != null) ShowSlider = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "paginator");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            totalRecords = TotalRecords,
            rows = Rows,
            first = First,
            pageLinkSize = PageLinkSize,
            rowsPerPageOptions = RowsPerPageOptions,
            template = Template,
            currentPageReportTemplate = CurrentPageReportTemplate,
            showFirstLast = ShowFirstLast,
            showJumpToPageDropdown = ShowJumpToPageDropdown,
            showJumpToPageInput = ShowJumpToPageInput,
            showSlider = ShowSlider,
            compact = Compact,
            targetInputName = TargetInput,
            targetSelector = TargetSelector,
            images = Images
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-dataview /> (Aura DataView Component)
/// </summary>
[HtmlTargetElement("island-dataview")]
public class IslandDataViewTagHelper : TagHelper
{
    public object? Value { get; set; }
    public object? Items { get; set; }
    public string Layout { get; set; } = "list";
    public bool Paginator { get; set; } = false;
    public int Rows { get; set; } = 5;
    public string? SortField { get; set; }
    public int SortOrder { get; set; } = 1;
    public bool ShowLayoutSwitcher { get; set; } = false;
    public bool ShowSort { get; set; } = false;
    public bool Loading { get; set; } = false;
    public string? Title { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "dataview");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var data = Value ?? Items ?? new object[0];

        var props = new
        {
            value = data,
            items = data,
            layout = Layout.ToLowerInvariant(),
            paginator = Paginator,
            rows = Rows,
            sortField = SortField,
            sortOrder = SortOrder,
            showLayoutSwitcher = ShowLayoutSwitcher,
            showSort = ShowSort,
            loading = Loading,
            title = Title
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

/// <summary>
/// TagHelper for <island-menubar />, <p-menubar />, and <island-menu-bar />
/// PrimeVue 4 Aura Design System compliant horizontal navigation menubar.
/// </summary>
[HtmlTargetElement("island-menubar")]
[HtmlTargetElement("p-menubar")]
[HtmlTargetElement("island-menu-bar")]
public class IslandMenubarTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<MenuItem>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<MenuItem>? Items { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "menubar");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            model = Model ?? Items ?? new(),
            customTemplate = CustomTemplate,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}

/// <summary>
/// TagHelper for <island-menu />, <p-menu />, and <island-navigation-menu />
/// PrimeVue 4 Aura Design System compliant navigation and command menu.
/// </summary>
[HtmlTargetElement("island-menu")]
[HtmlTargetElement("p-menu")]
[HtmlTargetElement("island-navigation-menu")]
public class IslandMenuTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<MenuItem>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<MenuItem>? Items { get; set; }

    [HtmlAttributeName("popup")]
    public bool Popup { get; set; } = false;

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("trigger-text")]
    public string? TriggerText { get; set; }

    [HtmlAttributeName("trigger-icon")]
    public string? TriggerIcon { get; set; }

    [HtmlAttributeName("trigger-variant")]
    public string? TriggerVariant { get; set; } = "outlined";

    [HtmlAttributeName("trigger-severity")]
    public string? TriggerSeverity { get; set; } = "secondary";

    [HtmlAttributeName("trigger-icon-only")]
    public bool TriggerIconOnly { get; set; } = false;

    [HtmlAttributeName("expanded-keys")]
    public Dictionary<string, bool>? ExpandedKeys { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "menu");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            model = Model ?? Items ?? new(),
            popup = Popup,
            triggerId = TriggerId,
            triggerText = TriggerText,
            triggerIcon = TriggerIcon,
            triggerVariant = TriggerVariant,
            triggerSeverity = TriggerSeverity,
            triggerIconOnly = TriggerIconOnly,
            expandedKeys = ExpandedKeys ?? new(),
            customTemplate = CustomTemplate,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
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
/// TagHelper for <island-tieredmenu />, <p-tieredmenu />, and <island-tiered-menu />
/// PrimeVue 4 Aura Design System compliant hierarchical tiered menu with flyout submenus.
/// </summary>
[HtmlTargetElement("island-tieredmenu")]
[HtmlTargetElement("p-tieredmenu")]
[HtmlTargetElement("island-tiered-menu")]
public class IslandTieredMenuTagHelper : TagHelper
{
    [HtmlAttributeName("model")]
    public List<MenuItem>? Model { get; set; }

    [HtmlAttributeName("items")]
    public List<MenuItem>? Items { get; set; }

    [HtmlAttributeName("popup")]
    public bool Popup { get; set; } = false;

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("trigger-text")]
    public string? TriggerText { get; set; }

    [HtmlAttributeName("trigger-icon")]
    public string? TriggerIcon { get; set; }

    [HtmlAttributeName("trigger-variant")]
    public string? TriggerVariant { get; set; } = "outlined";

    [HtmlAttributeName("trigger-severity")]
    public string? TriggerSeverity { get; set; } = "primary";

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; } = false;

    [HtmlAttributeName("breakpoint")]
    public string? Breakpoint { get; set; } = "960px";

    [HtmlAttributeName("auto-z-index")]
    public bool AutoZIndex { get; set; } = true;

    [HtmlAttributeName("base-z-index")]
    public int BaseZIndex { get; set; } = 0;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "tieredmenu");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            model = Model ?? Items ?? new(),
            popup = Popup,
            triggerId = TriggerId,
            triggerText = TriggerText,
            triggerIcon = TriggerIcon,
            triggerVariant = TriggerVariant,
            triggerSeverity = TriggerSeverity,
            customTemplate = CustomTemplate,
            breakpoint = Breakpoint,
            autoZIndex = AutoZIndex,
            baseZIndex = BaseZIndex,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}

/// <summary>
/// TagHelper for <island-popover />, <p-popover />, and <p-overlay-panel />
/// PrimeVue 4 Aura Design System compliant anchored floating popover container.
/// </summary>
[HtmlTargetElement("island-popover")]
[HtmlTargetElement("p-popover")]
[HtmlTargetElement("p-overlay-panel")]
public class IslandPopoverTagHelper : TagHelper
{
    [HtmlAttributeName("id")]
    public string Id { get; set; } = $"popover-{System.Guid.NewGuid():N}";

    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("placement")]
    public string Placement { get; set; } = "bottom";

    [HtmlAttributeName("show-arrow")]
    public bool ShowArrow { get; set; } = true;

    [HtmlAttributeName("dismissable")]
    public bool Dismissable { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("id", Id);
        output.Attributes.SetAttribute("data-island", "popover");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
        output.Attributes.SetAttribute("style", "display: contents;");

        var effectiveTarget = Target ?? TriggerId;
        var cleanPlacement = (Placement ?? "bottom").ToLowerInvariant().Trim();

        var props = new
        {
            id = Id,
            target = effectiveTarget,
            placement = cleanPlacement,
            showArrow = ShowArrow,
            dismissable = Dismissable,
            closeOnEscape = CloseOnEscape
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        var popoverClasses = "p-popover p-component";
        if (!string.IsNullOrWhiteSpace(Class)) popoverClasses += $" {Class}";

        var arrowHtml = ShowArrow ? @"<div class=""p-popover-arrow p-popover-arrow-top""></div>" : "";
        var childContent = await output.GetChildContentAsync();

        var popoverStyle = !string.IsNullOrWhiteSpace(Style) ? $" style=\"{Style}\"" : "";

        output.Content.SetHtmlContent($@"
            <div class=""{popoverClasses}"" role=""dialog"" aria-modal=""false""{popoverStyle}>
                {arrowHtml}
                <div class=""p-popover-content"">
                    {childContent.GetContent()}
                </div>
            </div>
        ");
    }
}

/// <summary>
/// TagHelper for <island-tooltip /> and <p-tooltip />
/// PrimeVue 4 Aura Design System compliant advisory tooltip component.
/// </summary>
[HtmlTargetElement("island-tooltip")]
[HtmlTargetElement("p-tooltip")]
public class IslandTooltipTagHelper : TagHelper
{
    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    [HtmlAttributeName("text")]
    public string? Text { get; set; }

    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "top";

    [HtmlAttributeName("show-delay")]
    public int ShowDelay { get; set; } = 0;

    [HtmlAttributeName("hide-delay")]
    public int HideDelay { get; set; } = 0;

    [HtmlAttributeName("event")]
    public string Event { get; set; } = "hover";

    [HtmlAttributeName("auto-hide")]
    public bool AutoHide { get; set; } = true;

    [HtmlAttributeName("escape")]
    public bool Escape { get; set; } = true;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var childContent = await output.GetChildContentAsync();
        var content = childContent.GetContent();
        var effectiveText = Value ?? Text;

        if (!string.IsNullOrWhiteSpace(Target))
        {
            output.TagName = "div";
            output.TagMode = TagMode.StartTagAndEndTag;
            output.Attributes.SetAttribute("data-island", "tooltip-component");
            output.Attributes.SetAttribute("data-hydrate", "load");
            output.Attributes.SetAttribute("style", "display: none;");

            var props = new
            {
                target = Target,
                value = effectiveText ?? content,
                position = Position,
                showDelay = ShowDelay,
                hideDelay = HideDelay,
                @event = Event,
                autoHide = AutoHide,
                escape = Escape
            };
            output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
            output.Content.SetHtmlContent(content);
        }
        else
        {
            output.TagName = null;
            output.Content.SetHtmlContent(content);
        }
    }
}

/// <summary>
/// TagHelper for <island-sidebar />, <p-sidebar />, and <island-sidebar-layout />
/// PrimeVue 4 Aura Design System compound navigation panel system.
/// </summary>
[HtmlTargetElement("island-sidebar")]
[HtmlTargetElement("p-sidebar")]
[HtmlTargetElement("island-sidebar-layout")]
public class IslandSidebarTagHelper : TagHelper
{
    [HtmlAttributeName("variant")]
    public string Variant { get; set; } = "sidebar";

    [HtmlAttributeName("collapsible")]
    public string Collapsible { get; set; } = "icon";

    [HtmlAttributeName("side")]
    public string Side { get; set; } = "left";

    [HtmlAttributeName("overlay")]
    public bool Overlay { get; set; } = false;

    [HtmlAttributeName("open-on-hover")]
    public bool OpenOnHover { get; set; } = false;

    [HtmlAttributeName("backdrop")]
    public bool Backdrop { get; set; } = false;

    [HtmlAttributeName("open")]
    public bool Open { get; set; } = true;

    [HtmlAttributeName("width")]
    public string Width { get; set; } = "16rem";

    [HtmlAttributeName("icon-width")]
    public string IconWidth { get; set; } = "3.5rem";

    [HtmlAttributeName("demo-type")]
    public string DemoType { get; set; } = "variants";

    [HtmlAttributeName("groups")]
    public List<SidebarGroupModel>? Groups { get; set; }

    [HtmlAttributeName("items")]
    public List<SidebarItem>? Items { get; set; }

    [HtmlAttributeName("header-title")]
    public string? HeaderTitle { get; set; }

    [HtmlAttributeName("header-logo")]
    public string? HeaderLogo { get; set; }

    [HtmlAttributeName("header-color")]
    public string? HeaderColor { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "sidebar");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var props = new
        {
            variant = Variant,
            collapsible = Collapsible,
            side = Side,
            overlay = Overlay,
            openOnHover = OpenOnHover,
            backdrop = Backdrop,
            open = Open,
            width = Width,
            iconWidth = IconWidth,
            demoType = DemoType,
            groups = Groups,
            items = Items,
            headerTitle = HeaderTitle,
            headerLogo = HeaderLogo,
            headerColor = HeaderColor,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}

/// <summary>
/// TagHelper for <island-message />, <p-message />, and <island-inline-message />
/// PrimeVue 4 Aura Design System compliant inline and contextual message notification.
/// </summary>
[HtmlTargetElement("island-message")]
[HtmlTargetElement("p-message")]
[HtmlTargetElement("island-inline-message")]
[HtmlTargetElement("p-inlinemessage")]
public class IslandMessageTagHelper : TagHelper
{
    [HtmlAttributeName("severity")]
    public string Severity { get; set; } = "info";

    [HtmlAttributeName("variant")]
    public string? Variant { get; set; }

    [HtmlAttributeName("size")]
    public string? Size { get; set; }

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; } = false;

    [HtmlAttributeName("life")]
    public int? Life { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

    [HtmlAttributeName("avatar")]
    public string? Avatar { get; set; }

    [HtmlAttributeName("spin")]
    public bool Spin { get; set; } = false;

    [HtmlAttributeName("text")]
    public string? Text { get; set; }

    [HtmlAttributeName("content")]
    public string? Content { get; set; }

    [HtmlAttributeName("dynamic")]
    public bool Dynamic { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "message");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        var props = new
        {
            severity = Severity,
            variant = Variant,
            size = Size,
            closable = Closable,
            life = Life,
            icon = Icon,
            avatar = Avatar,
            spin = Spin,
            text = Text ?? Content ?? (string.IsNullOrWhiteSpace(innerHtml) ? null : innerHtml.Trim()),
            dynamic = Dynamic,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Content.SetHtmlContent(innerHtml);

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}

/// <summary>
/// TagHelper for <island-datatable /> / <island-table /> (Aura DataTable Component)
/// </summary>
[HtmlTargetElement("island-datatable")]
[HtmlTargetElement("island-table")]
public class IslandDataTableTagHelper : TagHelper
{
    public object? Value { get; set; }
    public object? Data { get; set; }
    public List<DataTableColumn>? Columns { get; set; }
    public ComponentSize Size { get; set; } = ComponentSize.Normal;
    public bool ShowGridlines { get; set; } = false;
    public bool StripedRows { get; set; } = false;
    public string? SelectionMode { get; set; }
    public bool MetaKeySelection { get; set; } = true;
    public string KeyField { get; set; } = "id";
    public string RowKey { get; set; } = "id";
    public bool Paginator { get; set; } = false;
    public int Rows { get; set; } = 10;
    public int First { get; set; } = 0;
    public List<int>? RowsPerPageOptions { get; set; }
    public string? CurrentPageReportTemplate { get; set; }
    public string SortMode { get; set; } = "single";
    public bool RemovableSort { get; set; } = false;
    public string? SortField { get; set; }
    public int SortOrder { get; set; } = 1;
    public string? FilterDisplay { get; set; }
    public List<string>? GlobalFilterFields { get; set; }
    public bool Scrollable { get; set; } = false;
    public string? ScrollHeight { get; set; }
    public string? EditMode { get; set; }
    public bool Loading { get; set; } = false;
    public string LoadingMode { get; set; } = "overlay";
    public string ExportFilename { get; set; } = "export";
    public string EmptyMessage { get; set; } = "No records found.";
    public string? TableStyle { get; set; }
    public string? Title { get; set; }
    public bool InteractiveSize { get; set; } = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "datatable");
        output.Attributes.SetAttribute("data-hydrate", "load");

        var tableData = Value ?? Data ?? new object[0];
        var resolvedKey = !string.IsNullOrEmpty(KeyField) && KeyField != "id" ? KeyField : RowKey;

        var props = new
        {
            value = tableData,
            columns = Columns ?? new List<DataTableColumn>(),
            size = Size.ToString().ToLowerInvariant(),
            showGridlines = ShowGridlines,
            stripedRows = StripedRows,
            selectionMode = SelectionMode,
            metaKeySelection = MetaKeySelection,
            dataKey = resolvedKey,
            paginator = Paginator,
            rows = Rows,
            first = First,
            rowsPerPageOptions = RowsPerPageOptions,
            currentPageReportTemplate = CurrentPageReportTemplate,
            sortMode = SortMode,
            removableSort = RemovableSort,
            sortField = SortField,
            sortOrder = SortOrder,
            filterDisplay = FilterDisplay,
            globalFilterFields = GlobalFilterFields,
            scrollable = Scrollable,
            scrollHeight = ScrollHeight,
            editMode = EditMode,
            loading = Loading,
            loadingMode = LoadingMode,
            exportFilename = ExportFilename,
            emptyMessage = EmptyMessage,
            tableStyle = TableStyle,
            title = Title,
            interactiveSize = InteractiveSize
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
    }
}

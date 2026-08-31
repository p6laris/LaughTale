using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Enums;
using LaughTale.Components.Icons;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;

namespace LaughTale.Components.TagHelpers;

#region 1. Form & Field Primitives

/// <summary>
/// Container wrapper for form field, label, inputs, and helper messages.
/// </summary>
[HtmlTargetElement("island-field")]
public class IslandFieldTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "laughtale-field flex flex-col gap-1.5 w-full";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// Accessible, customizable label element supporting required indicators, wrappers, and Aura tokens.
/// </summary>
[HtmlTargetElement("island-label")]
[HtmlTargetElement("island-form-label")]
public class IslandLabelTagHelper : TagHelper
{
    [HtmlAttributeName("for")]
    public string? For { get; set; }

    [HtmlAttributeName("asp-for")]
    public ModelExpression? AspFor { get; set; }

    [HtmlAttributeName("text")]
    public string? Text { get; set; }

    [HtmlAttributeName("required")]
    public bool Required { get; set; } = false;

    [HtmlAttributeName("required-indicator")]
    public string RequiredIndicator { get; set; } = "*";

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("size")]
    public ComponentSize Size { get; set; } = ComponentSize.Normal;

    [HtmlAttributeName("description")]
    public string? Description { get; set; }

    [HtmlAttributeName("badge")]
    public string? Badge { get; set; }

    [HtmlAttributeName("badge-severity")]
    public string? BadgeSeverity { get; set; }

    [HtmlAttributeName("wrapper")]
    public bool Wrapper { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("required", out var reqAttr))
        {
            if (bool.TryParse(reqAttr.Value?.ToString(), out var rq)) Required = rq;
            else if (reqAttr.Value != null) Required = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var ds)) Disabled = ds;
            else if (disAttr.Value != null) Disabled = true;
        }
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            if (Enum.TryParse<ComponentSize>(szAttr.Value?.ToString(), true, out var sz)) Size = sz;
        }
        if (context.AllAttributes.TryGetAttribute("wrapper", out var wrAttr))
        {
            if (bool.TryParse(wrAttr.Value?.ToString(), out var wr)) Wrapper = wr;
            else if (wrAttr.Value != null) Wrapper = true;
        }

        output.TagName = "label";

        var targetId = For ?? AspFor?.Name;
        if (!string.IsNullOrWhiteSpace(targetId))
        {
            output.Attributes.SetAttribute("for", targetId);
        }

        var classes = new List<string> { "laughtale-label", "p-label" };
        if (Wrapper) classes.Add("p-label-wrapper");
        if (Size != ComponentSize.Normal) classes.Add($"size-{Size.ToString().ToLowerInvariant()}");
        if (Disabled) classes.Add("p-disabled is-disabled");
        if (!string.IsNullOrWhiteSpace(Class)) classes.Add(Class);

        output.Attributes.SetAttribute("class", string.Join(" ", classes));

        var childContent = await output.GetChildContentAsync();
        var labelText = !string.IsNullOrEmpty(Text) 
            ? Text 
            : (!childContent.IsEmptyOrWhiteSpace 
                ? childContent.GetContent() 
                : (AspFor?.Metadata.DisplayName ?? AspFor?.Name ?? ""));

        var sb = new System.Text.StringBuilder();

        if (Wrapper)
        {
            sb.Append(childContent.GetContent());
            if (!string.IsNullOrEmpty(Text) || !string.IsNullOrEmpty(Description))
            {
                sb.Append("<div>");
                if (!string.IsNullOrEmpty(labelText))
                {
                    sb.Append($"<span class=\"p-label-text\">{labelText}</span>");
                }
                if (Required)
                {
                    sb.Append($" <span class=\"p-label-required\" aria-hidden=\"true\">{System.Net.WebUtility.HtmlEncode(RequiredIndicator)}</span>");
                }
                if (!string.IsNullOrEmpty(Badge))
                {
                    sb.Append($" <span class=\"p-label-badge\">{System.Net.WebUtility.HtmlEncode(Badge)}</span>");
                }
                if (!string.IsNullOrEmpty(Description))
                {
                    sb.Append($"<span class=\"p-label-description\">{System.Net.WebUtility.HtmlEncode(Description)}</span>");
                }
                sb.Append("</div>");
            }
        }
        else
        {
            sb.Append($"<span class=\"p-label-text\">{labelText}</span>");
            if (Required)
            {
                sb.Append($" <span class=\"p-label-required\" aria-hidden=\"true\">{System.Net.WebUtility.HtmlEncode(RequiredIndicator)}</span>");
            }
            if (!string.IsNullOrEmpty(Badge))
            {
                sb.Append($" <span class=\"p-label-badge\">{System.Net.WebUtility.HtmlEncode(Badge)}</span>");
            }
            if (!string.IsNullOrEmpty(Description))
            {
                sb.Append($"<span class=\"p-label-description\">{System.Net.WebUtility.HtmlEncode(Description)}</span>");
            }
        }

        output.Content.SetHtmlContent(sb.ToString());
    }
}

/// <summary>
/// Icon addon inside an input group.
/// </summary>
[HtmlTargetElement("island-input-icon")]
public class IslandInputIconTagHelper : TagHelper
{
    public string Icon { get; set; } = "search";
    public int Size { get; set; } = 16;
    public string Position { get; set; } = "left";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "span";
        var baseClass = "flex items-center justify-center px-3 text-surface-400 dark:text-surface-500 pointer-events-none";
        output.Attributes.SetAttribute("class", baseClass);

        var svg = LucideIcons.Get(Icon, Size);
        output.Content.SetHtmlContent(svg);
    }
}

/// <summary>
/// Standalone input text element with clean styles and Tailwind v4 support.
/// </summary>
[HtmlTargetElement("island-field-input")]
[HtmlTargetElement("island-primitive-input")]
public class IslandPrimitiveInputTagHelper : TagHelper
{
    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    [HtmlAttributeName("name")]
    public string? Name { get; set; }

    [HtmlAttributeName("asp-for")]
    public ModelExpression? AspFor { get; set; }

    public string Type { get; set; } = "text";
    public string? Placeholder { get; set; }
    public string? Value { get; set; }
    public bool Disabled { get; set; } = false;
    public bool ReadOnly { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "input";
        output.TagMode = TagMode.SelfClosing;

        var inputId = Id ?? AspFor?.Name;
        var inputName = Name ?? AspFor?.Name;
        var inputValue = Value ?? AspFor?.Model?.ToString();

        if (!string.IsNullOrWhiteSpace(inputId)) output.Attributes.SetAttribute("id", inputId);
        if (!string.IsNullOrWhiteSpace(inputName)) output.Attributes.SetAttribute("name", inputName);
        if (!string.IsNullOrWhiteSpace(inputValue)) output.Attributes.SetAttribute("value", inputValue);
        if (!string.IsNullOrWhiteSpace(Placeholder)) output.Attributes.SetAttribute("placeholder", Placeholder);
        output.Attributes.SetAttribute("type", Type);

        if (Disabled) output.Attributes.SetAttribute("disabled", "disabled");
        if (ReadOnly) output.Attributes.SetAttribute("readonly", "readonly");

        var baseClass = "w-full px-3 py-2 text-sm bg-transparent border-0 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
    }
}

/// <summary>
/// Helper / Description text under a field.
/// </summary>
[HtmlTargetElement("island-helper-text")]
public class IslandHelperTextTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "p";
        var baseClass = "text-[0.8rem] text-surface-500 dark:text-surface-400";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// Error validation message under a field.
/// </summary>
[HtmlTargetElement("island-error-message")]
public class IslandErrorMessageTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "p";
        var baseClass = "text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent($"{LucideIcons.Get("alert-circle", 14)} <span>{childContent.GetContent()}</span>");
    }
}

#endregion

#region 2. Card Compound Primitives

/// <summary>
/// Compound Card Container (Aura Design System compliant).
/// </summary>
[HtmlTargetElement("island-card")]
[HtmlTargetElement("island-card-root")]
public class IslandCardTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("role")]
    public string? Role { get; set; }

    [HtmlAttributeName("title")]
    public string? Title { get; set; }

    [HtmlAttributeName("subtitle")]
    public string? Subtitle { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card laughtale-card rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm transition-all overflow-hidden flex flex-col";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        if (!string.IsNullOrWhiteSpace(Role))
        {
            output.Attributes.SetAttribute("role", Role);
        }

        var childContent = await output.GetChildContentAsync();
        
        if (!string.IsNullOrWhiteSpace(Title) || !string.IsNullOrWhiteSpace(Subtitle))
        {
            var headerHtml = "<div class=\"p-card-body p-6 flex flex-col gap-3\"><div class=\"p-card-caption flex flex-col gap-1\">";
            if (!string.IsNullOrWhiteSpace(Title))
            {
                headerHtml += $"<div class=\"p-card-title font-bold text-xl text-surface-900 dark:text-surface-50\">{Title}</div>";
            }
            if (!string.IsNullOrWhiteSpace(Subtitle))
            {
                headerHtml += $"<div class=\"p-card-subtitle text-sm text-surface-500 dark:text-surface-400\">{Subtitle}</div>";
            }
            headerHtml += $"</div><div class=\"p-card-content text-sm text-surface-600 dark:text-surface-300 leading-relaxed\">{childContent.GetContent()}</div></div>";
            output.Content.SetHtmlContent(headerHtml);
        }
        else
        {
            output.Content.SetHtmlContent(childContent);
        }
    }
}

[HtmlTargetElement("island-card-header")]
public class IslandCardHeaderTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-header overflow-hidden";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-body")]
public class IslandCardBodyTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-body p-6 flex flex-col gap-3";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-caption")]
public class IslandCardCaptionTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-caption flex flex-col gap-1";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-title")]
public class IslandCardTitleTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-title font-bold text-xl text-surface-900 dark:text-surface-50 m-0";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-subtitle")]
[HtmlTargetElement("island-card-description")]
public class IslandCardSubtitleTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-subtitle text-sm text-surface-500 dark:text-surface-400 m-0";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-content")]
public class IslandCardContentTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-content text-sm text-surface-600 dark:text-surface-300 leading-relaxed";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-footer")]
public class IslandCardFooterTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-footer mt-4 pt-0 flex items-center gap-2";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

#endregion

#region 3. Button Primitive

/// <summary>
/// Universal Aura button supporting severities, variants, sizes, icons, badges, loading, and button-groups.
/// </summary>
[HtmlTargetElement("island-button")]
public class IslandButtonTagHelper : TagHelper
{
    [HtmlAttributeName("label")]
    public string? Label { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

    [HtmlAttributeName("icon-pos")]
    public string IconPos { get; set; } = "left";

    [HtmlAttributeName("icon-only")]
    public bool IconOnly { get; set; } = false;

    [HtmlAttributeName("severity")]
    public string? Severity { get; set; } = "primary";

    [HtmlAttributeName("variant")]
    public string? Variant { get; set; }

    [HtmlAttributeName("size")]
    public string? Size { get; set; } = "normal";

    [HtmlAttributeName("raised")]
    public bool Raised { get; set; } = false;

    [HtmlAttributeName("rounded")]
    public bool Rounded { get; set; } = false;

    [HtmlAttributeName("text")]
    public bool Text { get; set; } = false;

    [HtmlAttributeName("outlined")]
    public bool Outlined { get; set; } = false;

    [HtmlAttributeName("link")]
    public bool Link { get; set; } = false;

    [HtmlAttributeName("fluid")]
    public bool Fluid { get; set; } = false;

    [HtmlAttributeName("loading")]
    public bool Loading { get; set; } = false;

    [HtmlAttributeName("loading-icon")]
    public string? LoadingIcon { get; set; }

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("badge")]
    public string? Badge { get; set; }

    [HtmlAttributeName("badge-severity")]
    public string? BadgeSeverity { get; set; }

    [HtmlAttributeName("type")]
    public string? Type { get; set; } = "button";

    [HtmlAttributeName("as")]
    public string? As { get; set; }

    [HtmlAttributeName("href")]
    public string? Href { get; set; }

    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    [HtmlAttributeName("rel")]
    public string? Rel { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("raised", out var rAttr))
        {
            if (bool.TryParse(rAttr.Value?.ToString(), out var r)) Raised = r;
            else if (rAttr.Value != null) Raised = true;
        }
        if (context.AllAttributes.TryGetAttribute("rounded", out var rndAttr))
        {
            if (bool.TryParse(rndAttr.Value?.ToString(), out var rnd)) Rounded = rnd;
            else if (rndAttr.Value != null) Rounded = true;
        }
        if (context.AllAttributes.TryGetAttribute("text", out var txtAttr))
        {
            if (bool.TryParse(txtAttr.Value?.ToString(), out var t)) Text = t;
            else if (txtAttr.Value != null) Text = true;
        }
        if (context.AllAttributes.TryGetAttribute("outlined", out var outAttr))
        {
            if (bool.TryParse(outAttr.Value?.ToString(), out var o)) Outlined = o;
            else if (outAttr.Value != null) Outlined = true;
        }
        if (context.AllAttributes.TryGetAttribute("link", out var lnkAttr))
        {
            if (bool.TryParse(lnkAttr.Value?.ToString(), out var l)) Link = l;
            else if (lnkAttr.Value != null) Link = true;
        }
        if (context.AllAttributes.TryGetAttribute("iconOnly", out var ioAttr) || context.AllAttributes.TryGetAttribute("icon-only", out ioAttr))
        {
            if (bool.TryParse(ioAttr.Value?.ToString(), out var io)) IconOnly = io;
            else if (ioAttr.Value != null) IconOnly = true;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("loading", out var ldAttr))
        {
            if (bool.TryParse(ldAttr.Value?.ToString(), out var ld)) Loading = ld;
            else if (ldAttr.Value != null) Loading = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        var sevLower = Severity?.ToLowerInvariant() ?? "primary";
        if (context.AllAttributes.TryGetAttribute("severity", out var sevAttr))
        {
            sevLower = sevAttr.Value?.ToString()?.ToLowerInvariant() ?? sevLower;
        }
        var szLower = Size?.ToLowerInvariant() ?? "normal";
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            szLower = szAttr.Value?.ToString()?.ToLowerInvariant() ?? szLower;
        }

        var isAnchor = As?.Equals("a", StringComparison.OrdinalIgnoreCase) == true || !string.IsNullOrEmpty(Href);
        output.TagName = isAnchor ? "a" : "button";
        output.TagMode = TagMode.StartTagAndEndTag;

        if (isAnchor)
        {
            if (!string.IsNullOrEmpty(Href)) output.Attributes.SetAttribute("href", Href);
            if (!string.IsNullOrEmpty(Target)) output.Attributes.SetAttribute("target", Target);
            if (!string.IsNullOrEmpty(Rel)) output.Attributes.SetAttribute("rel", Rel);
        }
        else
        {
            output.Attributes.SetAttribute("type", Type ?? "button");
        }

        if (Disabled)
        {
            output.Attributes.SetAttribute("disabled", "disabled");
            output.Attributes.SetAttribute("aria-disabled", "true");
        }

        if (!string.IsNullOrEmpty(AriaLabel))
        {
            output.Attributes.SetAttribute("aria-label", AriaLabel);
        }

        var classes = new List<string> { "p-button", "p-component" };

        if (sevLower != "primary")
        {
            classes.Add($"p-button-{sevLower}");
        }
        else
        {
            classes.Add("p-button-primary");
        }

        var vLower = Variant?.ToLowerInvariant();
        if (Outlined || vLower == "outlined" || vLower == "outline") classes.Add("p-button-outlined");
        else if (Text || vLower == "text") classes.Add("p-button-text");
        else if (Link || vLower == "link") classes.Add("p-button-link");

        if (Raised) classes.Add("p-button-raised");
        if (Rounded) classes.Add("p-button-rounded");
        if (Fluid) classes.Add("p-button-fluid");
        if (IconOnly) classes.Add("p-button-icon-only");
        if (Loading) classes.Add("p-button-loading");
        if (Disabled) classes.Add("p-disabled");

        if (szLower == "small" || szLower == "sm") classes.Add("p-button-sm");
        else if (szLower == "large" || szLower == "lg") classes.Add("p-button-lg");

        if (IconPos?.ToLowerInvariant() == "top" || IconPos?.ToLowerInvariant() == "bottom")
        {
            classes.Add("flex-col");
        }

        if (!string.IsNullOrWhiteSpace(Class))
        {
            classes.Add(Class);
        }

        output.Attributes.SetAttribute("class", string.Join(" ", classes.Distinct()));

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        if (string.IsNullOrWhiteSpace(innerHtml) && !string.IsNullOrWhiteSpace(Label))
        {
            innerHtml = HtmlEncoder.Default.Encode(Label);
        }

        var iconSize = (szLower == "small" || szLower == "sm") ? 14 : ((szLower == "large" || szLower == "lg") ? 18 : 16);
        var iconHtml = !string.IsNullOrWhiteSpace(Icon) ? LucideIcons.Get(Icon, iconSize) : "";
        var loadingHtml = Loading ? $"<span class=\"p-button-loading-icon p-button-icon\">{LucideIcons.Get(LoadingIcon ?? "spinner", iconSize)}</span>" : "";

        var badgeHtml = "";
        if (!string.IsNullOrWhiteSpace(Badge))
        {
            var badgeSev = !string.IsNullOrWhiteSpace(BadgeSeverity) ? $"p-badge-{BadgeSeverity.ToLowerInvariant()}" : "";
            badgeHtml = $"<span class=\"p-badge p-component {badgeSev}\">{Badge}</span>";
        }

        if (IconOnly)
        {
            output.Content.SetHtmlContent($"{loadingHtml}{iconHtml}{innerHtml}{badgeHtml}");
        }
        else if (IconPos?.ToLowerInvariant() == "right" || IconPos?.ToLowerInvariant() == "bottom")
        {
            output.Content.SetHtmlContent($"{loadingHtml}{innerHtml} {iconHtml}{badgeHtml}".Trim());
        }
        else
        {
            output.Content.SetHtmlContent($"{loadingHtml}{iconHtml} {innerHtml}{badgeHtml}".Trim());
        }
    }
}

/// <summary>
/// Group container for connected Aura buttons.
/// </summary>
[HtmlTargetElement("island-button-group")]
[HtmlTargetElement("island-buttongroup")]
public class IslandButtonGroupTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "group");
        var baseClass = "p-buttongroup";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

#endregion

#region 4. Dialog / Modal Compound Primitives

[HtmlTargetElement("island-compound-dialog")]
[HtmlTargetElement("island-dialog-root")]
public class IslandCompoundDialogTagHelper : TagHelper
{
    public string Id { get; set; } = $"dialog-{Guid.NewGuid():N}";

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        context.Items["CurrentDialogId"] = Id;

        var baseClass = "laughtale-compound-dialog relative inline-block";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        output.Attributes.SetAttribute("data-dialog-id", Id);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-trigger")]
public class IslandDialogTriggerTagHelper : TagHelper
{
    [HtmlAttributeName("as-child")]
    public bool AsChild { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var dialogId = context.Items["CurrentDialogId"]?.ToString();
        output.Attributes.SetAttribute("data-dialog-trigger", dialogId ?? "");

        if (!AsChild)
        {
            output.TagName = "button";
            output.Attributes.SetAttribute("type", "button");
            var baseClass = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
            output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        }

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-content")]
public class IslandDialogContentTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var dialogId = context.Items["CurrentDialogId"]?.ToString();

        output.TagName = "div";
        output.Attributes.SetAttribute("id", dialogId ?? "");
        output.Attributes.SetAttribute("role", "dialog");
        output.Attributes.SetAttribute("aria-modal", "true");
        output.Attributes.SetAttribute("data-state", "closed");

        var baseClass = "laughtale-dialog-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4 transition-all duration-200";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();

        var innerContainer = $@"
            <div class=""laughtale-dialog-panel relative w-full max-w-lg rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 p-6 shadow-xl transition-all duration-200 text-surface-900 dark:text-surface-100"">
                {childContent.GetContent()}
            </div>
        ";

        output.Content.SetHtmlContent(innerContainer);
    }
}

[HtmlTargetElement("island-dialog-header")]
public class IslandDialogHeaderTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "flex flex-col space-y-1.5 text-center sm:text-left mb-4";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-title")]
public class IslandDialogTitleTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "h2";
        var baseClass = "text-lg font-semibold leading-none tracking-tight text-surface-900 dark:text-surface-50";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-footer")]
public class IslandDialogFooterTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-close")]
public class IslandDialogCloseTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "button";
        output.Attributes.SetAttribute("type", "button");
        output.Attributes.SetAttribute("data-dialog-close", "true");

        var baseClass = "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        if (childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent(LucideIcons.Get("x", 16));
        }
        else
        {
            output.Content.SetHtmlContent(childContent);
        }
    }
}

#endregion

#region 5. Accordion Compound Primitives

[HtmlTargetElement("island-accordion-root")]
public class IslandAccordionRootTagHelper : TagHelper
{
    public string Type { get; set; } = "single";
    public bool Collapsible { get; set; } = true;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("data-accordion-root", "true");
        output.Attributes.SetAttribute("data-accordion-type", Type);
        output.Attributes.SetAttribute("data-collapsible", Collapsible.ToString().ToLowerInvariant());

        var baseClass = "w-full divide-y divide-surface-200 dark:divide-surface-800 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-accordion-item")]
public class IslandAccordionItemTagHelper : TagHelper
{
    public string Value { get; set; } = Guid.NewGuid().ToString("N");
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("data-accordion-item", Value);
        output.Attributes.SetAttribute("data-state", "closed");

        if (Disabled)
        {
            output.Attributes.SetAttribute("data-disabled", "true");
        }

        var baseClass = "overflow-hidden";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-accordion-trigger")]
public class IslandAccordionTriggerTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "button";
        output.Attributes.SetAttribute("type", "button");
        output.Attributes.SetAttribute("data-accordion-trigger", "true");
        output.Attributes.SetAttribute("aria-expanded", "false");

        var baseClass = "flex flex-1 items-center justify-between py-4 px-5 font-medium transition-all hover:bg-surface-50 dark:hover:bg-surface-800/50 [&[data-state=open]>svg]:rotate-180 w-full text-surface-900 dark:text-surface-100";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();

        var contentHtml = $@"
            <span>{childContent.GetContent()}</span>
            {LucideIcons.Get("chevron-down", 16)}
        ";

        output.Content.SetHtmlContent(contentHtml);
    }
}

[HtmlTargetElement("island-accordion-content")]
public class IslandAccordionContentTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("data-accordion-content", "true");
        output.Attributes.SetAttribute("data-state", "closed");

        var baseClass = "hidden px-5 pb-4 pt-0 text-sm text-surface-600 dark:text-surface-400 transition-all";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

#endregion

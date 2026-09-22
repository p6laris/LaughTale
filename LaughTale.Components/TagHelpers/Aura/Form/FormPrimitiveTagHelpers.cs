using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Enums;
using LaughTale.Components.Icons;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Container wrapper for form field, label, inputs, and helper messages.
/// </summary>
[HtmlTargetElement("island-field")]
public class IslandFieldTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "laughtale-field flex flex-col gap-1.5 w-full";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// Accessible, customizable label element supporting required indicators, wrappers, and Aura tokens.
/// </summary>
[HtmlTargetElement("island-label")]
[HtmlTargetElement("island-form-label")]
public class IslandLabelTagHelper : AuraTagHelperBase
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
public class IslandPrimitiveInputTagHelper : AuraTagHelperBase
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
        output.Attributes.SetAttribute("class", MergeClass(baseClass));
    }
}

/// <summary>
/// Helper / Description text under a field.
/// </summary>
[HtmlTargetElement("island-helper-text")]
public class IslandHelperTextTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "p";
        var baseClass = "text-[0.8rem] text-surface-500 dark:text-surface-400";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// Error validation message under a field.
/// </summary>
[HtmlTargetElement("island-error-message")]
public class IslandErrorMessageTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "p";
        var baseClass = "text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent($"{LucideIcons.Get("alert-circle", 14)} <span>{childContent.GetContent()}</span>");
    }
}

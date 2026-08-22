using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Enums;
using SoftMax.LaughTale.Components.Icons;

namespace SoftMax.LaughTale.Components.TagHelpers;

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
/// Accessible, customizable label element. Can be placed standalone anywhere.
/// </summary>
[HtmlTargetElement("island-label")]
public class IslandLabelTagHelper : TagHelper
{
    [HtmlAttributeName("for")]
    public string? For { get; set; }

    [HtmlAttributeName("asp-for")]
    public ModelExpression? AspFor { get; set; }

    public bool Required { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "label";
        var targetId = For ?? AspFor?.Name;
        if (!string.IsNullOrWhiteSpace(targetId))
        {
            output.Attributes.SetAttribute("for", targetId);
        }

        var baseClass = "text-xs font-semibold tracking-wide text-surface-700 dark:text-surface-300 flex items-center gap-1 select-none";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        var labelText = childContent.IsEmptyOrWhiteSpace && AspFor?.Metadata.DisplayName != null 
            ? AspFor.Metadata.DisplayName 
            : childContent.GetContent();

        if (Required)
        {
            output.Content.SetHtmlContent($"{labelText} <span class=\"text-red-500 font-bold ml-0.5\" aria-hidden=\"true\">*</span>");
        }
        else
        {
            output.Content.SetHtmlContent(labelText);
        }
    }
}

/// <summary>
/// Group container for attaching leading/trailing icons, buttons, or addons next to an input.
/// </summary>
[HtmlTargetElement("island-input-group")]
public class IslandInputGroupTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "laughtale-input-group relative flex items-center w-full rounded-md shadow-sm border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-600 transition-all overflow-hidden";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
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
[HtmlTargetElement("island-input-text")]
public class IslandInputTextTagHelper : TagHelper
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
/// Compound Card Container.
/// </summary>
[HtmlTargetElement("island-card")]
public class IslandCardTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "laughtale-card rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm transition-all";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
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
        var baseClass = "flex flex-col space-y-1.5 p-6 border-b border-surface-100 dark:border-surface-800";
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
        output.TagName = "h3";
        var baseClass = "font-bold text-lg leading-none tracking-tight text-surface-900 dark:text-surface-50";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-description")]
public class IslandCardDescriptionTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "p";
        var baseClass = "text-xs text-surface-500 dark:text-surface-400";
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
        var baseClass = "p-6";
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
        var baseClass = "flex items-center p-6 pt-0 border-t border-surface-100 dark:border-surface-800 mt-4";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

#endregion

#region 3. Button Primitive

/// <summary>
/// Universal atomic button supporting variants, sizes, and icons.
/// </summary>
[HtmlTargetElement("island-button")]
public class IslandButtonTagHelper : TagHelper
{
    public ComponentVariant Variant { get; set; } = ComponentVariant.Solid;
    public ComponentSize Size { get; set; } = ComponentSize.Medium;
    public ButtonSeverity Severity { get; set; } = ButtonSeverity.Primary;
    public string? Icon { get; set; }
    public string? Type { get; set; } = "button";
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "button";
        output.Attributes.SetAttribute("type", Type);
        if (Disabled) output.Attributes.SetAttribute("disabled", "disabled");

        var sizeClass = Size switch
        {
            ComponentSize.Small => "px-2.5 py-1 text-xs gap-1.5",
            ComponentSize.Large => "px-5 py-2.5 text-base gap-2.5",
            ComponentSize.ExtraLarge => "px-6 py-3 text-lg gap-3",
            _ => "px-4 py-2 text-sm gap-2"
        };

        var variantClass = Variant switch
        {
            ComponentVariant.Outline => "border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800",
            ComponentVariant.Ghost => "bg-transparent text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800",
            ComponentVariant.Subtle => "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 hover:bg-primary-100",
            ComponentVariant.Destructive => "bg-red-600 hover:bg-red-700 text-white shadow-sm",
            ComponentVariant.Secondary => "bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-900 dark:text-surface-100",
            _ => "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow"
        };

        var baseClass = $"inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none {sizeClass} {variantClass}";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        var iconHtml = !string.IsNullOrWhiteSpace(Icon) ? LucideIcons.Get(Icon, 16) : "";

        output.Content.SetHtmlContent($"{iconHtml} {childContent.GetContent()}");
    }
}

#endregion

#region 4. Dialog / Modal Compound Primitives

[HtmlTargetElement("island-dialog")]
public class IslandDialogTagHelper : TagHelper
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
    public string? AsChild { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var dialogId = context.Items["CurrentDialogId"] as string;

        output.Attributes.SetAttribute("class", "dialog-trigger inline-block cursor-pointer");
        output.Attributes.SetAttribute("onclick", $"const c = document.getElementById('{dialogId}-content'); if (c) c.classList.remove('hidden');");

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
        output.TagName = "div";
        var dialogId = context.Items["CurrentDialogId"] as string;

        var baseClass = "dialog-content-wrapper hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4";
        output.Attributes.SetAttribute("class", baseClass);
        output.Attributes.SetAttribute("id", $"{dialogId}-content");

        var innerClass = "dialog-card relative w-full max-w-lg rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 shadow-2xl p-6 transition-all duration-200";
        var userClass = string.IsNullOrWhiteSpace(Class) ? innerClass : $"{innerClass} {Class}";

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent($@"
            <div class=""{userClass}"" onclick=""event.stopPropagation()"">
                {childContent.GetContent()}
            </div>
        ");

        output.Attributes.SetAttribute("onclick", $"document.getElementById('{dialogId}-content').classList.add('hidden')");
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
        var baseClass = "text-lg font-bold leading-none tracking-tight text-surface-900 dark:text-surface-50";
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
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var dialogId = context.Items["CurrentDialogId"] as string;

        output.Attributes.SetAttribute("class", "inline-block cursor-pointer");
        output.Attributes.SetAttribute("onclick", $"const c = document.getElementById('{dialogId}-content'); if (c) c.classList.add('hidden');");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

#endregion

#region 5. Accordion Compound Primitives

[HtmlTargetElement("island-accordion-root")]
public class IslandAccordionRootTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "laughtale-compound-accordion w-full divide-y divide-surface-200 dark:divide-surface-800 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden bg-surface-0 dark:bg-surface-900";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-accordion-item")]
public class IslandAccordionItemTagHelper : TagHelper
{
    public string Id { get; set; } = $"acc-item-{Guid.NewGuid():N}";

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        context.Items["CurrentAccordionItemId"] = Id;

        var baseClass = "accordion-item";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        output.Attributes.SetAttribute("data-acc-id", Id);

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

        var itemId = context.Items["CurrentAccordionItemId"] as string;
        output.Attributes.SetAttribute("onclick", $"const c = document.getElementById('{itemId}-content'); const ch = this.querySelector('.acc-chevron'); if (c) c.classList.toggle('hidden'); if (ch) ch.classList.toggle('rotate-180');");

        var baseClass = "flex flex-1 items-center justify-between py-4 px-6 font-semibold text-sm text-surface-900 dark:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all text-left w-full select-none";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        var chevronSvg = $@"<span class=""acc-chevron flex transition-transform duration-200 text-surface-400"">{LucideIcons.Get("chevron-down", 16)}</span>";

        output.Content.SetHtmlContent($"{childContent.GetContent()} {chevronSvg}");
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
        var itemId = context.Items["CurrentAccordionItemId"] as string;

        output.Attributes.SetAttribute("id", $"{itemId}-content");
        var baseClass = "hidden px-6 pb-4 pt-1 text-sm text-surface-600 dark:text-surface-400 bg-surface-50/50 dark:bg-surface-900/50";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

#endregion

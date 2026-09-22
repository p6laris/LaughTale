using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Compound Card Container (Aura Design System compliant).
/// </summary>
[HtmlTargetElement("island-card")]
[HtmlTargetElement("island-card-root")]
public class IslandCardTagHelper : AuraTagHelperBase
{
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
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

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
public class IslandCardHeaderTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-header overflow-hidden";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-body")]
public class IslandCardBodyTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-body p-6 flex flex-col gap-3";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-caption")]
public class IslandCardCaptionTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-caption flex flex-col gap-1";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-title")]
public class IslandCardTitleTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-title font-bold text-xl text-surface-900 dark:text-surface-50 m-0";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-subtitle")]
[HtmlTargetElement("island-card-description")]
public class IslandCardSubtitleTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-subtitle text-sm text-surface-500 dark:text-surface-400 m-0";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-content")]
public class IslandCardContentTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-content text-sm text-surface-600 dark:text-surface-300 leading-relaxed";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-card-footer")]
public class IslandCardFooterTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "p-card-footer mt-4 pt-0 flex items-center gap-2";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

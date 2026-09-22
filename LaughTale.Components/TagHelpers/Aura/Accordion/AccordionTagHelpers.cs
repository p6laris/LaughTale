using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Icons;

namespace LaughTale.Components.TagHelpers;

[HtmlTargetElement("island-accordion-root")]
public class IslandAccordionRootTagHelper : AuraTagHelperBase
{
    public string Type { get; set; } = "single";
    public bool Collapsible { get; set; } = true;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("data-accordion-root", "true");
        output.Attributes.SetAttribute("data-accordion-type", Type);
        output.Attributes.SetAttribute("data-collapsible", Collapsible.ToString().ToLowerInvariant());

        var baseClass = "w-full divide-y divide-surface-200 dark:divide-surface-800 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-accordion-item")]
public class IslandAccordionItemTagHelper : AuraTagHelperBase
{
    public string Value { get; set; } = Guid.NewGuid().ToString("N");
    public bool Disabled { get; set; } = false;

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
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-accordion-trigger")]
public class IslandAccordionTriggerTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "button";
        output.Attributes.SetAttribute("type", "button");
        output.Attributes.SetAttribute("data-accordion-trigger", "true");
        output.Attributes.SetAttribute("aria-expanded", "false");

        var baseClass = "flex flex-1 items-center justify-between py-4 px-5 font-medium transition-all hover:bg-surface-50 dark:hover:bg-surface-800/50 [&[data-state=open]>svg]:rotate-180 w-full text-surface-900 dark:text-surface-100";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();

        var contentHtml = $@"
            <span>{childContent.GetContent()}</span>
            {LucideIcons.Get("chevron-down", 16)}
        ";

        output.Content.SetHtmlContent(contentHtml);
    }
}

[HtmlTargetElement("island-accordion-content")]
public class IslandAccordionContentTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("data-accordion-content", "true");
        output.Attributes.SetAttribute("data-state", "closed");

        var baseClass = "hidden px-5 pb-4 pt-0 text-sm text-surface-600 dark:text-surface-400 transition-all";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

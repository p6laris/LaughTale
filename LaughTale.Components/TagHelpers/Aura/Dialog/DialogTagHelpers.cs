using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Icons;

namespace LaughTale.Components.TagHelpers;

[HtmlTargetElement("island-compound-dialog")]
[HtmlTargetElement("island-dialog-root")]
public class IslandCompoundDialogTagHelper : AuraTagHelperBase
{
    public string Id { get; set; } = $"dialog-{Guid.NewGuid():N}";

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        context.Items["CurrentDialogId"] = Id;

        var baseClass = "laughtale-compound-dialog relative inline-block";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));
        output.Attributes.SetAttribute("data-dialog-id", Id);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-trigger")]
public class IslandDialogTriggerTagHelper : AuraTagHelperBase
{
    [HtmlAttributeName("as-child")]
    public bool AsChild { get; set; } = false;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var dialogId = context.Items["CurrentDialogId"]?.ToString();
        output.Attributes.SetAttribute("data-dialog-trigger", dialogId ?? "");

        if (!AsChild)
        {
            output.TagName = "button";
            output.Attributes.SetAttribute("type", "button");
            var baseClass = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
            output.Attributes.SetAttribute("class", MergeClass(baseClass));
        }

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-content")]
public class IslandDialogContentTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var dialogId = context.Items["CurrentDialogId"]?.ToString();

        output.TagName = "div";
        output.Attributes.SetAttribute("id", dialogId ?? "");
        output.Attributes.SetAttribute("role", "dialog");
        output.Attributes.SetAttribute("aria-modal", "true");
        output.Attributes.SetAttribute("data-state", "closed");

        var baseClass = "laughtale-dialog-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4 transition-all duration-200";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

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
public class IslandDialogHeaderTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "flex flex-col space-y-1.5 text-center sm:text-left mb-4";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-title")]
public class IslandDialogTitleTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "h2";
        var baseClass = "text-lg font-semibold leading-none tracking-tight text-surface-900 dark:text-surface-50";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-footer")]
public class IslandDialogFooterTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var baseClass = "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

[HtmlTargetElement("island-dialog-close")]
public class IslandDialogCloseTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "button";
        output.Attributes.SetAttribute("type", "button");
        output.Attributes.SetAttribute("data-dialog-close", "true");

        var baseClass = "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

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

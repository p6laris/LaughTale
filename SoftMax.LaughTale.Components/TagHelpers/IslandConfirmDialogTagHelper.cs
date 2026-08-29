using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise PrimeVue 4 Aura ConfirmDialog modal confirmation component.
/// </summary>
[HtmlTargetElement("island-confirm-dialog")]
[HtmlTargetElement("island-confirmdialog")]
[HtmlTargetElement("p-confirmdialog")]
public class IslandConfirmDialogTagHelper : TagHelper
{
    [HtmlAttributeName("group")]
    public string? Group { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "center";

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; } = "Confirmation";

    [HtmlAttributeName("dismissable-mask")]
    public bool DismissableMask { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Visible;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var baseClass = "p-confirmdialog-container";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        output.Attributes.SetAttribute("data-island", "confirm-dialog");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        var props = new
        {
            group = Group,
            position = Position,
            ariaLabel = AriaLabel,
            dismissableMask = DismissableMask,
            closeOnEscape = CloseOnEscape
        };
        output.Attributes.SetAttribute("data-props", JsonSerializer.Serialize(props));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}

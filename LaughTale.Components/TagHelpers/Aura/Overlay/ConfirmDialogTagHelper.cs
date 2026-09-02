using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Overlay;

/// <summary>
/// LaughTale: Aura ConfirmDialog TagHelper (<island-confirm-dialog> and <p-confirmdialog>).
/// </summary>
[HtmlTargetElement("island-confirm-dialog")]
[HtmlTargetElement("p-confirmdialog")]
public class ConfirmDialogTagHelper : IslandTagHelperBase
{
    public override string IslandName => "confirm-dialog";

    [HtmlAttributeName("group")]
    public string? Group { get; set; }

    [HtmlAttributeName("position")]
    public string? Position { get; set; }

    [HtmlAttributeName("dismissable-mask")]
    public bool DismissableMask { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    protected override object? BuildProps()
    {
        return new
        {
            group = Group,
            position = Position,
            dismissableMask = DismissableMask,
            closeOnEscape = CloseOnEscape,
            @class = Class,
            style = Style,
            id = Id
        };
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        await base.ProcessAsync(context, output);
        output.Attributes.RemoveAll("style");
        output.Attributes.SetAttribute("style", "display: contents;");
    }
}

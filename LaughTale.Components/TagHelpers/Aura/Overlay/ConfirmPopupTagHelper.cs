using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Localization;

namespace LaughTale.Components.TagHelpers.Aura.Overlay;

/// <summary>
/// LaughTale: Aura ConfirmPopup TagHelper (<island-confirm-popup> and <p-confirmpopup>).
/// </summary>
[HtmlTargetElement("island-confirm-popup")]
[HtmlTargetElement("p-confirmpopup")]
public class ConfirmPopupTagHelper : IslandTagHelperBase
{
    public override string IslandName => "confirm-popup";

    [HtmlAttributeName("group")]
    public string? Group { get; set; }

    [HtmlAttributeName("message")]
    public string? Message { get; set; }

    [HtmlAttributeName("accept-text")]
    public string? AcceptText { get; set; }

    [HtmlAttributeName("reject-text")]
    public string? RejectText { get; set; }

    protected override object? BuildProps()
    {
        var localizer = ViewContext?.HttpContext?.RequestServices?.GetService<ILaughTaleLocalizer>();
        return new
        {
            group = Group,
            message = Message,
            acceptText = AcceptText ?? localizer?["accept"],
            rejectText = RejectText ?? localizer?["reject"],
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

using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Overlay;

/// <summary>
/// LaughTale: Aura Dialog TagHelper (<island-aura-dialog>, <p-dialog>, and <island-dialog>).
/// </summary>
[HtmlTargetElement("island-aura-dialog")]
[HtmlTargetElement("p-dialog")]
[HtmlTargetElement("island-dialog")]
public class DialogTagHelper : IslandTagHelperBase
{
    public override string IslandName => "dialog";

    [HtmlAttributeName("header")]
    public string? Header { get; set; }

    [HtmlAttributeName("visible")]
    public bool Visible { get; set; }

    [HtmlAttributeName("modal")]
    public bool Modal { get; set; } = true;

    [HtmlAttributeName("dismissable-mask")]
    public bool DismissableMask { get; set; } = true;

    [HtmlAttributeName("draggable")]
    public bool Draggable { get; set; }

    [HtmlAttributeName("maximizable")]
    public bool Maximizable { get; set; }

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; } = true;

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "center";

    [HtmlAttributeName("dialog-width")]
    public string? DialogWidth { get; set; }

    [HtmlAttributeName("width")]
    public string? Width { get; set; }

    [HtmlAttributeName("responsive")]
    public bool Responsive { get; set; }

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    protected override object? BuildProps()
    {
        return new
        {
            header = Header,
            visible = Visible,
            modal = Modal,
            dismissableMask = DismissableMask,
            draggable = Draggable,
            maximizable = Maximizable,
            closable = Closable,
            position = Position,
            width = DialogWidth ?? Width,
            responsive = Responsive,
            closeOnEscape = CloseOnEscape,
            @class = Class,
            style = Style,
            id = Id
        };
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        await base.ProcessAsync(context, output);

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        var resolvedWidth = DialogWidth ?? Width;
        var styleAttr = !string.IsNullOrWhiteSpace(resolvedWidth) ? $"width: {resolvedWidth};" : "";
        if (!string.IsNullOrWhiteSpace(Style))
        {
            styleAttr = $"{styleAttr} {Style}".Trim();
        }

        var modalClass = Modal ? "p-dialog-mask-modal" : "";
        var posClass = $"p-dialog-pos-{Position.ToLowerInvariant().Replace("-", "")}";
        var dragClass = Draggable ? "p-dialog-draggable" : "";
        var customClass = Class ?? "";

        var hasCustomHeader = innerHtml.Contains("p-dialog-header");
        var headerHtml = "";

        if (!string.IsNullOrWhiteSpace(Header) && !hasCustomHeader)
        {
            var maxBtn = Maximizable
                ? @"<button type=""button"" class=""p-dialog-header-action p-dialog-maximize-button"" aria-label=""Maximize"">
                        <svg xmlns=""http://www.w3.org/2000/svg"" width=""15"" height=""15"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><polyline points=""15 3 21 3 21 9""/><polyline points=""9 21 3 21 3 15""/><line x1=""21"" x2=""14"" y1=""3"" y2=""10""/><line x1=""3"" x2=""10"" y1=""21"" y2=""14""/></svg>
                    </button>"
                : "";

            var closeBtn = Closable
                ? @"<button type=""button"" class=""p-dialog-header-action p-dialog-close-button"" aria-label=""Close"" data-dialog-close>
                        <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><line x1=""18"" x2=""6"" y1=""6"" y2=""18""/><line x1=""6"" x2=""18"" y1=""6"" y2=""18""/></svg>
                    </button>"
                : "";

            headerHtml = $@"
                <div class=""p-dialog-header"">
                    <span class=""p-dialog-title"">{Header}</span>
                    <div class=""p-dialog-header-actions"">
                        {maxBtn}
                        {closeBtn}
                    </div>
                </div>
            ";
        }

        output.Content.SetHtmlContent($@"
            <div class=""p-dialog-mask {modalClass} {posClass}"" style=""display: none;"">
                <div class=""p-dialog p-component {dragClass} {customClass}"" style=""{styleAttr}"" role=""dialog"" aria-modal=""{(Modal ? "true" : "false")}"">
                    {headerHtml}
                    {innerHtml}
                </div>
            </div>
        ");
    }
}

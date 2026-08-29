using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise PrimeVue 4 Aura Dialog overlay container.
/// </summary>
[HtmlTargetElement("island-aura-dialog")]
[HtmlTargetElement("p-dialog")]
public class IslandAuraDialogTagHelper : TagHelper
{
    [HtmlAttributeName("id")]
    public string Id { get; set; } = $"dialog-{System.Guid.NewGuid():N}";

    [HtmlAttributeName("header")]
    public string? Header { get; set; }

    [HtmlAttributeName("visible")]
    public bool Visible { get; set; } = false;

    [HtmlAttributeName("modal")]
    public bool Modal { get; set; } = true;

    [HtmlAttributeName("dismissable-mask")]
    public bool DismissableMask { get; set; } = false;

    [HtmlAttributeName("draggable")]
    public bool Draggable { get; set; } = false;

    [HtmlAttributeName("maximizable")]
    public bool Maximizable { get; set; } = false;

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "center";

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    [HtmlAttributeName("dialog-width")]
    public string? DialogWidth { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("id", Id);
        output.Attributes.SetAttribute("data-island", "dialog");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
        output.Attributes.SetAttribute("style", "display: contents;");

        var props = new
        {
            header = Header,
            visible = Visible,
            modal = Modal,
            dismissableMask = DismissableMask,
            draggable = Draggable,
            maximizable = Maximizable,
            position = Position,
            closable = Closable,
            closeOnEscape = CloseOnEscape,
            width = DialogWidth
        };
        output.Attributes.SetAttribute("data-props", JsonSerializer.Serialize(props));

        var cleanPos = (Position ?? "center").ToLowerInvariant().Replace("-", "").Replace(" ", "");
        var maskClasses = $"p-dialog-mask p-dialog-pos-{cleanPos}";
        if (Modal) maskClasses += " p-dialog-mask-modal";
        if (Visible) maskClasses += " p-dialog-mask-active";

        var maskStyle = Visible ? "display: flex !important;" : "display: none !important;";

        var dialogStyle = !string.IsNullOrWhiteSpace(DialogWidth) ? $"width: {DialogWidth};" : "";
        if (!string.IsNullOrWhiteSpace(Style)) dialogStyle += $" {Style}";

        var childContent = await output.GetChildContentAsync();

        var headerCloseButton = Closable ? @"
            <button type=""button"" class=""p-dialog-header-action p-dialog-close-button"" aria-label=""Close"">
                <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><line x1=""18"" y1=""6"" x2=""6"" y2=""18""/><line x1=""6"" y1=""6"" x2=""18"" y2=""18""/></svg>
            </button>" : "";

        var headerMaximizeButton = Maximizable ? @"
            <button type=""button"" class=""p-dialog-header-action p-dialog-maximize-button"" aria-label=""Maximize"">
                <svg xmlns=""http://www.w3.org/2000/svg"" width=""15"" height=""15"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><polyline points=""15 3 21 3 21 9""/><polyline points=""9 21 3 21 3 15""/><line x1=""21"" y1=""14"" x2=""14"" y2=""21""/><line x1=""3"" y1=""10"" x2=""10"" y2=""3""/></svg>
            </button>" : "";

        var headerHtml = !string.IsNullOrWhiteSpace(Header) ? $@"
            <div class=""p-dialog-header"">
                <h3 class=""p-dialog-title"">{Header}</h3>
                <div class=""p-dialog-header-actions"">
                    {headerMaximizeButton}
                    {headerCloseButton}
                </div>
            </div>" : "";

        var dialogClasses = "p-dialog p-component";
        if (Draggable) dialogClasses += " p-dialog-draggable";
        if (!string.IsNullOrWhiteSpace(Class)) dialogClasses += $" {Class}";

        output.Content.SetHtmlContent($@"
            <div class=""{maskClasses}"" style=""{maskStyle}"">
                <div class=""{dialogClasses}"" role=""dialog"" aria-modal=""{Modal.ToString().ToLowerInvariant()}"" style=""{dialogStyle}"">
                    {headerHtml}
                    {childContent.GetContent()}
                </div>
            </div>
        ");
    }
}

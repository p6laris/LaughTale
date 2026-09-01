using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Overlay;

/// <summary>
/// LaughTale: Aura Drawer TagHelper (<island-drawer> and <p-drawer>).
/// </summary>
[HtmlTargetElement("island-drawer")]
[HtmlTargetElement("p-drawer")]
public class DrawerTagHelper : IslandTagHelperBase
{
    public override string IslandName => "drawer";

    [HtmlAttributeName("header")]
    public string? Header { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "left";

    [HtmlAttributeName("visible")]
    public bool Visible { get; set; }

    [HtmlAttributeName("modal")]
    public bool Modal { get; set; } = true;

    [HtmlAttributeName("dismissable-mask")]
    public bool DismissableMask { get; set; } = true;

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; } = true;

    [HtmlAttributeName("close-on-escape")]
    public bool CloseOnEscape { get; set; } = true;

    [HtmlAttributeName("drawer-width")]
    public string? DrawerWidth { get; set; }

    [HtmlAttributeName("width")]
    public string? Width { get; set; }

    [HtmlAttributeName("height")]
    public string? Height { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            header = Header,
            position = Position,
            visible = Visible,
            modal = Modal,
            dismissableMask = DismissableMask,
            closable = Closable,
            closeOnEscape = CloseOnEscape,
            width = DrawerWidth ?? Width,
            height = Height,
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

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        var resolvedWidth = DrawerWidth ?? Width;
        var styleParts = new System.Collections.Generic.List<string>();
        if (!string.IsNullOrWhiteSpace(resolvedWidth)) styleParts.Add($"width: {resolvedWidth};");
        if (!string.IsNullOrWhiteSpace(Height)) styleParts.Add($"height: {Height};");
        if (!string.IsNullOrWhiteSpace(Style)) styleParts.Add(Style);
        var styleAttr = string.Join(" ", styleParts);

        var modalClass = Modal ? "p-drawer-mask-modal" : "";
        var posClass = $"p-drawer-{Position.ToLowerInvariant().Replace("-", "")}";
        var customClass = Class ?? "";

        var hasCustomHeader = innerHtml.Contains("p-drawer-header");
        var headerHtml = "";

        if (!string.IsNullOrWhiteSpace(Header) && !hasCustomHeader)
        {
            var closeBtn = Closable
                ? @"<button type=""button"" class=""p-drawer-close-button"" aria-label=""Close"" data-drawer-close>
                        <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><line x1=""18"" x2=""6"" y1=""6"" y2=""18""/><line x1=""6"" x2=""18"" y1=""6"" y2=""18""/></svg>
                    </button>"
                : "";

            headerHtml = $@"
                <div class=""p-drawer-header"">
                    <span class=""p-drawer-title"">{Header}</span>
                    <div class=""p-drawer-header-actions"">
                        {closeBtn}
                    </div>
                </div>
            ";
        }

        output.Content.SetHtmlContent($@"
            <div class=""p-drawer-mask {modalClass} {posClass}"">
                <div class=""p-drawer p-component {customClass}"" style=""{styleAttr}"" role=""complementary"" aria-modal=""{(Modal ? "true" : "false")}"">
                    {headerHtml}
                    {innerHtml}
                </div>
            </div>
        ");
    }
}

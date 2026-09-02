using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Messages;

/// <summary>
/// LaughTale: Aura Message TagHelper (<island-message> and <p-message>).
/// </summary>
[HtmlTargetElement("island-message")]
[HtmlTargetElement("p-message")]
public class MessageTagHelper : IslandTagHelperBase
{
    public override string IslandName => "message";

    [HtmlAttributeName("severity")]
    public string Severity { get; set; } = "info";

    [HtmlAttributeName("variant")]
    public string? Variant { get; set; }

    [HtmlAttributeName("size")]
    public string? Size { get; set; }

    [HtmlAttributeName("closable")]
    public bool Closable { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

    [HtmlAttributeName("avatar")]
    public string? Avatar { get; set; }

    [HtmlAttributeName("text")]
    public string? Text { get; set; }

    [HtmlAttributeName("content")]
    public string? Content { get; set; }

    [HtmlAttributeName("life")]
    public int? Life { get; set; }

    [HtmlAttributeName("spin")]
    public bool Spin { get; set; }

    [HtmlAttributeName("dynamic")]
    public bool Dynamic { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            severity = Severity,
            variant = Variant,
            size = Size,
            closable = Closable,
            icon = Icon,
            avatar = Avatar,
            text = Text ?? Content,
            content = Content ?? Text,
            life = Life,
            spin = Spin,
            dynamic = Dynamic,
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

        var messageText = !string.IsNullOrEmpty(Text) ? Text : (!string.IsNullOrEmpty(Content) ? Content : innerHtml);

        if (Dynamic)
        {
            output.Content.SetHtmlContent(@"
                <div class=""p-message-dynamic-wrapper"" style=""display: flex; flex-direction: column; gap: 0.75rem; width: 100%;"">
                    <div style=""display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem;"">
                        <button type=""button"" class=""p-button p-button-primary"" data-add-messages>Add Messages</button>
                        <button type=""button"" class=""p-button p-button-secondary"" data-clear-messages>Clear Messages</button>
                    </div>
                    <div class=""p-message-dynamic-list"" style=""display: flex; flex-direction: column; gap: 0.75rem;""></div>
                </div>
            ");
            return;
        }

        var variantClass = Variant switch
        {
            "outlined" => "p-message-outlined",
            "simple" => "p-message-simple",
            _ => ""
        };

        var sizeClass = Size switch
        {
            "small" => "p-message-sm",
            "large" => "p-message-lg",
            _ => ""
        };

        var iconHtml = "";
        if (!string.IsNullOrEmpty(Avatar))
        {
            iconHtml = $@"<img src=""{Avatar}"" alt=""Avatar"" style=""width: 1.75rem; height: 1.75rem; border-radius: 9999px; object-fit: cover;"" />";
        }
        else if (!string.IsNullOrEmpty(Icon))
        {
            iconHtml = GetIconSvg(Icon, Spin);
        }
        else
        {
            iconHtml = GetDefaultIconSvg(Severity, Spin);
        }

        var closeButtonHtml = Closable
            ? @"<button type=""button"" class=""p-message-close-button"" aria-label=""Close"" title=""Close message"" data-message-close>
                    <svg xmlns=""http://www.w3.org/2000/svg"" width=""14"" height=""14"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2.5"" stroke-linecap=""round"" stroke-linejoin=""round""><line x1=""18"" y1=""6"" x2=""6"" y2=""18""/><line x1=""6"" y1=""6"" x2=""18"" y2=""18""/></svg>
               </button>"
            : "";

        var lifeAttr = Life.HasValue ? $@"data-life=""{Life.Value}""" : "";

        output.Content.SetHtmlContent($@"
            <div class=""p-message p-message-{Severity} {variantClass} {sizeClass} p-message-enter {Class}"" role=""alert"" aria-live=""assertive"" aria-atomic=""true"" data-message-item {lifeAttr}>
                <div class=""p-message-content"">
                    {(string.IsNullOrEmpty(iconHtml) ? "" : $@"<span class=""p-message-icon"">{iconHtml}</span>")}
                    <div class=""p-message-text"">{messageText}</div>
                    {closeButtonHtml}
                </div>
            </div>
        ");
    }

    private static string GetIconSvg(string iconName, bool spin)
    {
        var spinClass = spin ? " p-message-spin" : "";
        var name = iconName.ToLowerInvariant();
        if (name.Contains("sparkle"))
            return $@"<svg class=""{spinClass}"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z""/></svg>";
        if (name.Contains("receipt"))
            return $@"<svg class=""{spinClass}"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z""/><path d=""M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8""/><path d=""M12 17.5v-11""/></svg>";
        if (name.Contains("alerttriangle") || name.Contains("triangle") || name.Contains("warning"))
            return $@"<svg class=""{spinClass}"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z""/><line x1=""12"" y1=""9"" x2=""12"" y2=""13""/><line x1=""12"" y1=""17"" x2=""12.01"" y2=""17""/></svg>";
        if (name.Contains("alertcircle") || name.Contains("circle"))
            return $@"<svg class=""{spinClass}"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><circle cx=""12"" cy=""12"" r=""10""/><line x1=""12"" y1=""8"" x2=""12"" y2=""12""/><line x1=""12"" y1=""16"" x2=""12.01"" y2=""16""/></svg>";
        if (name.Contains("check"))
            return $@"<svg class=""{spinClass}"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2.5"" stroke-linecap=""round"" stroke-linejoin=""round""><polyline points=""20 6 9 17 4 12""/></svg>";
        if (name.Contains("loader") || name.Contains("spin"))
            return $@"<svg class=""p-message-spin"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><line x1=""12"" y1=""2"" x2=""12"" y2=""6""/><line x1=""12"" y1=""18"" x2=""12"" y2=""22""/><line x1=""4.93"" y1=""4.93"" x2=""7.76"" y2=""7.76""/><line x1=""16.24"" y1=""16.24"" x2=""19.07"" y2=""19.07""/><line x1=""2"" y1=""12"" x2=""6"" y2=""12""/><line x1=""18"" y1=""12"" x2=""22"" y2=""12""/><line x1=""4.93"" y1=""19.07"" x2=""7.76"" y2=""16.24""/><line x1=""16.24"" y1=""7.76"" x2=""19.07"" y2=""4.93""/></svg>";
        if (name.Contains("wifi"))
            return $@"<svg class=""{spinClass}"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><path d=""M5 13a10 10 0 0 1 14 0""/><path d=""M8.5 16.5a5 5 0 0 1 7 0""/><path d=""M2 8.82a15 15 0 0 1 20 0""/><line x1=""12"" y1=""20"" x2=""12.01"" y2=""20""/></svg>";

        return $@"<svg class=""{spinClass}"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""currentColor"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""><circle cx=""12"" cy=""12"" r=""10""/><line x1=""12"" y1=""16"" x2=""12"" y2=""12""/><line x1=""12"" y1=""8"" x2=""12.01"" y2=""8""/></svg>";
    }

    private static string GetDefaultIconSvg(string severity, bool spin)
    {
        return severity.ToLowerInvariant() switch
        {
            "success" => GetIconSvg("check", spin),
            "warn" or "warning" => GetIconSvg("alerttriangle", spin),
            "error" or "danger" => GetIconSvg("alertcircle", spin),
            "secondary" => GetIconSvg("loader2", spin: true),
            "contrast" => GetIconSvg("wifi", spin),
            _ => GetIconSvg("sparkles", spin)
        };
    }
}

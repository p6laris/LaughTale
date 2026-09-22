using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Icons;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Universal Aura button supporting severities, variants, sizes, icons, badges, loading, and button-groups.
/// </summary>
[HtmlTargetElement("island-button")]
public class IslandButtonTagHelper : AuraTagHelperBase
{
    [HtmlAttributeName("label")]
    public string? Label { get; set; }

    [HtmlAttributeName("icon")]
    public string? Icon { get; set; }

    [HtmlAttributeName("icon-pos")]
    public string IconPos { get; set; } = "left";

    [HtmlAttributeName("icon-only")]
    public bool IconOnly { get; set; } = false;

    [HtmlAttributeName("severity")]
    public string? Severity { get; set; } = "primary";

    [HtmlAttributeName("variant")]
    public string? Variant { get; set; }

    [HtmlAttributeName("size")]
    public string? Size { get; set; } = "normal";

    [HtmlAttributeName("raised")]
    public bool Raised { get; set; } = false;

    [HtmlAttributeName("rounded")]
    public bool Rounded { get; set; } = false;

    [HtmlAttributeName("text")]
    public bool Text { get; set; } = false;

    [HtmlAttributeName("outlined")]
    public bool Outlined { get; set; } = false;

    [HtmlAttributeName("link")]
    public bool Link { get; set; } = false;

    [HtmlAttributeName("fluid")]
    public bool Fluid { get; set; } = false;

    [HtmlAttributeName("loading")]
    public bool Loading { get; set; } = false;

    [HtmlAttributeName("loading-icon")]
    public string? LoadingIcon { get; set; }

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("badge")]
    public string? Badge { get; set; }

    [HtmlAttributeName("badge-severity")]
    public string? BadgeSeverity { get; set; }

    [HtmlAttributeName("type")]
    public string? Type { get; set; } = "button";

    [HtmlAttributeName("as")]
    public string? As { get; set; }

    [HtmlAttributeName("href")]
    public string? Href { get; set; }

    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    [HtmlAttributeName("rel")]
    public string? Rel { get; set; }

    [HtmlAttributeName("aria-label")]
    public string? AriaLabel { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        if (context.AllAttributes.TryGetAttribute("raised", out var rAttr))
        {
            if (bool.TryParse(rAttr.Value?.ToString(), out var r)) Raised = r;
            else if (rAttr.Value != null) Raised = true;
        }
        if (context.AllAttributes.TryGetAttribute("rounded", out var rndAttr))
        {
            if (bool.TryParse(rndAttr.Value?.ToString(), out var rnd)) Rounded = rnd;
            else if (rndAttr.Value != null) Rounded = true;
        }
        if (context.AllAttributes.TryGetAttribute("text", out var txtAttr))
        {
            if (bool.TryParse(txtAttr.Value?.ToString(), out var t)) Text = t;
            else if (txtAttr.Value != null) Text = true;
        }
        if (context.AllAttributes.TryGetAttribute("outlined", out var outAttr))
        {
            if (bool.TryParse(outAttr.Value?.ToString(), out var o)) Outlined = o;
            else if (outAttr.Value != null) Outlined = true;
        }
        if (context.AllAttributes.TryGetAttribute("link", out var lnkAttr))
        {
            if (bool.TryParse(lnkAttr.Value?.ToString(), out var l)) Link = l;
            else if (lnkAttr.Value != null) Link = true;
        }
        if (context.AllAttributes.TryGetAttribute("iconOnly", out var ioAttr) || context.AllAttributes.TryGetAttribute("icon-only", out ioAttr))
        {
            if (bool.TryParse(ioAttr.Value?.ToString(), out var io)) IconOnly = io;
            else if (ioAttr.Value != null) IconOnly = true;
        }
        if (context.AllAttributes.TryGetAttribute("fluid", out var flAttr))
        {
            if (bool.TryParse(flAttr.Value?.ToString(), out var fl)) Fluid = fl;
            else if (flAttr.Value != null) Fluid = true;
        }
        if (context.AllAttributes.TryGetAttribute("loading", out var ldAttr))
        {
            if (bool.TryParse(ldAttr.Value?.ToString(), out var ld)) Loading = ld;
            else if (ldAttr.Value != null) Loading = true;
        }
        if (context.AllAttributes.TryGetAttribute("disabled", out var disAttr))
        {
            if (bool.TryParse(disAttr.Value?.ToString(), out var dis)) Disabled = dis;
            else if (disAttr.Value != null) Disabled = true;
        }
        var sevLower = Severity?.ToLowerInvariant() ?? "primary";
        if (context.AllAttributes.TryGetAttribute("severity", out var sevAttr))
        {
            sevLower = sevAttr.Value?.ToString()?.ToLowerInvariant() ?? sevLower;
        }
        var szLower = Size?.ToLowerInvariant() ?? "normal";
        if (context.AllAttributes.TryGetAttribute("size", out var szAttr))
        {
            szLower = szAttr.Value?.ToString()?.ToLowerInvariant() ?? szLower;
        }

        var isAnchor = As?.Equals("a", StringComparison.OrdinalIgnoreCase) == true || !string.IsNullOrEmpty(Href);
        output.TagName = isAnchor ? "a" : "button";
        output.TagMode = TagMode.StartTagAndEndTag;

        if (isAnchor)
        {
            if (!string.IsNullOrEmpty(Href)) output.Attributes.SetAttribute("href", Href);
            if (!string.IsNullOrEmpty(Target)) output.Attributes.SetAttribute("target", Target);
            if (!string.IsNullOrEmpty(Rel)) output.Attributes.SetAttribute("rel", Rel);
        }
        else
        {
            output.Attributes.SetAttribute("type", Type ?? "button");
        }

        if (Disabled)
        {
            output.Attributes.SetAttribute("disabled", "disabled");
            output.Attributes.SetAttribute("aria-disabled", "true");
        }

        if (!string.IsNullOrEmpty(AriaLabel))
        {
            output.Attributes.SetAttribute("aria-label", AriaLabel);
        }

        var classes = new List<string> { "p-button", "p-component" };

        if (sevLower != "primary")
        {
            classes.Add($"p-button-{sevLower}");
        }
        else
        {
            classes.Add("p-button-primary");
        }

        var vLower = Variant?.ToLowerInvariant();
        if (Outlined || vLower == "outlined" || vLower == "outline") classes.Add("p-button-outlined");
        else if (Text || vLower == "text") classes.Add("p-button-text");
        else if (Link || vLower == "link") classes.Add("p-button-link");

        if (Raised) classes.Add("p-button-raised");
        if (Rounded) classes.Add("p-button-rounded");
        if (Fluid) classes.Add("p-button-fluid");
        if (IconOnly) classes.Add("p-button-icon-only");
        if (Loading) classes.Add("p-button-loading");
        if (Disabled) classes.Add("p-disabled");

        if (szLower == "small" || szLower == "sm") classes.Add("p-button-sm");
        else if (szLower == "large" || szLower == "lg") classes.Add("p-button-lg");

        if (IconPos?.ToLowerInvariant() == "top" || IconPos?.ToLowerInvariant() == "bottom")
        {
            classes.Add("flex-col");
        }

        if (!string.IsNullOrWhiteSpace(Class))
        {
            classes.Add(Class);
        }

        output.Attributes.SetAttribute("class", string.Join(" ", classes.Distinct()));

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        if (string.IsNullOrWhiteSpace(innerHtml) && !string.IsNullOrWhiteSpace(Label))
        {
            innerHtml = HtmlEncoder.Default.Encode(Label);
        }

        var iconSize = (szLower == "small" || szLower == "sm") ? 14 : ((szLower == "large" || szLower == "lg") ? 18 : 16);
        var iconHtml = !string.IsNullOrWhiteSpace(Icon) ? LucideIcons.Get(Icon, iconSize) : "";
        var loadingHtml = Loading ? $"<span class=\"p-button-loading-icon p-button-icon\">{LucideIcons.Get(LoadingIcon ?? "spinner", iconSize)}</span>" : "";

        var badgeHtml = "";
        if (!string.IsNullOrWhiteSpace(Badge))
        {
            var badgeSev = !string.IsNullOrWhiteSpace(BadgeSeverity) ? $"p-badge-{BadgeSeverity.ToLowerInvariant()}" : "";
            badgeHtml = $"<span class=\"p-badge p-component {badgeSev}\">{Badge}</span>";
        }

        if (IconOnly)
        {
            output.Content.SetHtmlContent($"{loadingHtml}{iconHtml}{innerHtml}{badgeHtml}");
        }
        else if (IconPos?.ToLowerInvariant() == "right" || IconPos?.ToLowerInvariant() == "bottom")
        {
            output.Content.SetHtmlContent($"{loadingHtml}{innerHtml} {iconHtml}{badgeHtml}".Trim());
        }
        else
        {
            output.Content.SetHtmlContent($"{loadingHtml}{iconHtml} {innerHtml}{badgeHtml}".Trim());
        }
    }
}

/// <summary>
/// Group container for connected Aura buttons.
/// </summary>
[HtmlTargetElement("island-button-group")]
[HtmlTargetElement("island-buttongroup")]
public class IslandButtonGroupTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "group");
        var baseClass = "p-buttongroup";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

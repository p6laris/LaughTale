using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Forms;

/// <summary>
/// LaughTale: Server Actions Layer 1 (ROADMAP.v5.md Part G/L). Renders a &lt;form&gt; wired to the
/// already-shipped l-post/l-target/l-swap server fragment action engine
/// (<c>LaughTale.Client/src/directives/htmx.ts</c>'s <c>bindServerAction()</c>) - not an island
/// container, so this derives from plain <see cref="TagHelper"/> rather than
/// <see cref="IslandTagHelperBase"/>.
/// </summary>
[HtmlTargetElement("island-form")]
public class IslandFormTagHelper : TagHelper
{
    private readonly IAntiforgery _antiforgery;

    public IslandFormTagHelper(IAntiforgery antiforgery)
    {
        _antiforgery = antiforgery;
    }

    /// <summary>
    /// The Razor Pages handler name this form posts to (rendered as <c>?handler={Action}</c>).
    /// </summary>
    [HtmlAttributeName("action")]
    public string Action { get; set; } = "";

    /// <summary>
    /// CSS id selector of the element to swap with the response fragment. Defaults to the form's
    /// own generated id when not given.
    /// </summary>
    [HtmlAttributeName("target")]
    public string? Target { get; set; }

    /// <summary>
    /// l-swap mode applied to the response fragment. Defaults to "outerHTML".
    /// </summary>
    [HtmlAttributeName("swap")]
    public string Swap { get; set; } = "outerHTML";

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var id = Target?.TrimStart('#') ?? $"lt-form-{context.UniqueId}";

        output.TagName = "form";
        output.Attributes.SetAttribute("method", "post");
        output.Attributes.SetAttribute("id", id);
        output.Attributes.SetAttribute("l-post", $"?handler={Action}");
        output.Attributes.SetAttribute("l-target", $"#{id}");
        output.Attributes.SetAttribute("l-swap", Swap);

        // REQUIRED, not optional: setting l-post/asp-page-handler-shaped output attributes here does
        // NOT cause ASP.NET Core's own FormTagHelper to also run and inject the antiforgery hidden
        // field - Razor's TagHelper matching is a compile-time decision based on the literal source
        // tag/attributes an author wrote (<island-form>, no asp-page-handler literally present), not
        // something that reacts to another TagHelper's runtime output. Since AddRazorPages() enables
        // global antiforgery validation on all POSTs by default, every submission would 400 without
        // this. Inject the field explicitly - the same thing FormTagHelper does internally.
        var tokens = _antiforgery.GetAndStoreTokens(ViewContext!.HttpContext);
        var fieldName = System.Net.WebUtility.HtmlEncode(tokens.FormFieldName);
        var fieldValue = System.Net.WebUtility.HtmlEncode(tokens.RequestToken);
        output.PostContent.AppendHtml($"<input type=\"hidden\" name=\"{fieldName}\" value=\"{fieldValue}\" />");
    }
}

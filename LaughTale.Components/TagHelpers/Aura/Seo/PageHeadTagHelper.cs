using System.Net;
using System.Text;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Rendering;

namespace LaughTale.Components.TagHelpers.Aura.Seo;

/// <summary>
/// LaughTale: Typed Head Rendering (ROADMAP.v5.md Part E "Middleware &amp; typed head"). Reads the
/// current page's <see cref="PageHead"/> (see <see cref="PageHeadViewDataExtensions.GetHead"/>) and
/// renders &lt;title&gt;/&lt;meta&gt;/&lt;link&gt; tags into the layout's &lt;head&gt;, replacing a
/// bare <c>&lt;title&gt;@ViewData["Title"]&lt;/title&gt;</c> line. Renders no wrapping element -
/// <c>output.TagName = null</c> - since this is a content-generating helper, not a real element.
/// </summary>
[HtmlTargetElement("page-head")]
public class PageHeadTagHelper : TagHelper
{
    /// <summary>
    /// Appended after the page's title, e.g. <c>&lt;page-head suffix=" - LaughTale" /&gt;</c> - lets
    /// each site's layout keep its own existing title-suffix convention.
    /// </summary>
    [HtmlAttributeName("suffix")]
    public string Suffix { get; set; } = "";

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = null;

        var head = ViewContext!.ViewData.GetHead();
        var sb = new StringBuilder();

        var title = head.Title;
        if (!string.IsNullOrWhiteSpace(title))
        {
            sb.Append("<title>").Append(Encode(title)).Append(Encode(Suffix)).Append("</title>\n");
        }

        if (!string.IsNullOrWhiteSpace(head.Description))
        {
            AppendMetaName(sb, "description", head.Description!);
        }

        var ogTitle = head.OgTitle ?? title;
        if (!string.IsNullOrWhiteSpace(ogTitle))
        {
            AppendMetaProperty(sb, "og:title", ogTitle);
        }

        var ogDescription = head.OgDescription ?? head.Description;
        if (!string.IsNullOrWhiteSpace(ogDescription))
        {
            AppendMetaProperty(sb, "og:description", ogDescription!);
        }

        if (!string.IsNullOrWhiteSpace(head.OgImage))
        {
            AppendMetaProperty(sb, "og:image", head.OgImage!);
        }

        if (!string.IsNullOrWhiteSpace(head.OgType))
        {
            AppendMetaProperty(sb, "og:type", head.OgType);
        }

        if (!string.IsNullOrWhiteSpace(head.CanonicalUrl))
        {
            sb.Append("<link rel=\"canonical\" href=\"").Append(Encode(head.CanonicalUrl!)).Append("\" />\n");
        }

        if (head.CustomMeta != null)
        {
            foreach (var (name, content) in head.CustomMeta)
            {
                AppendMetaName(sb, name, content);
            }
        }

        output.Content.SetHtmlContent(sb.ToString());
    }

    private static void AppendMetaName(StringBuilder sb, string name, string content)
    {
        sb.Append("<meta name=\"").Append(Encode(name)).Append("\" content=\"").Append(Encode(content)).Append("\" />\n");
    }

    private static void AppendMetaProperty(StringBuilder sb, string property, string content)
    {
        sb.Append("<meta property=\"").Append(Encode(property)).Append("\" content=\"").Append(Encode(content)).Append("\" />\n");
    }

    private static string Encode(string value) => WebUtility.HtmlEncode(value);
}

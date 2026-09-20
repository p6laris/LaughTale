using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace LaughTale.Components.Rendering;

/// <summary>
/// LaughTale: typed page-metadata storage on <see cref="ViewDataDictionary"/> (ROADMAP.v5.md Part E
/// "Middleware &amp; typed head"). A layout's <c>&lt;page-head /&gt;</c> tag helper reads whatever a
/// page stored via <see cref="SetHead"/> - falling back to the pre-existing untyped
/// <c>ViewData["Title"]</c> convention when a page never calls <see cref="SetHead"/> at all, so every
/// existing page keeps working unmodified.
/// </summary>
public static class PageHeadViewDataExtensions
{
    private const string ViewDataKey = "LaughTale.PageHead";

    /// <summary>
    /// Stores a typed <see cref="PageHead"/> for the current page, read back by
    /// <c>PageHeadTagHelper</c> when rendering the layout's <c>&lt;head&gt;</c>.
    /// </summary>
    public static void SetHead(this ViewDataDictionary viewData, PageHead head)
    {
        viewData[ViewDataKey] = head;
    }

    /// <summary>
    /// Returns the <see cref="PageHead"/> a page set via <see cref="SetHead"/>, or - when no page has
    /// called it - a <see cref="PageHead"/> whose <see cref="PageHead.Title"/> falls back to the
    /// existing untyped <c>ViewData["Title"]</c> string, so pages that never adopt the typed API keep
    /// rendering exactly as before.
    /// </summary>
    public static PageHead GetHead(this ViewDataDictionary viewData)
    {
        if (viewData[ViewDataKey] is PageHead head)
        {
            return head;
        }

        return new PageHead(Title: viewData["Title"]?.ToString());
    }
}

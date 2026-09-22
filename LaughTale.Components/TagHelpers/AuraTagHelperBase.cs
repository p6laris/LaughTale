using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Minimal base for LaughTale's plain structural/compositional TagHelpers (card, dialog, accordion,
/// form-field wrappers, icon, stepper sub-parts) that only need a CSS class passthrough - NOT
/// IslandTagHelperBase, which is reserved for real hydrating islands (auth, hydration attributes,
/// props serialization). See ROADMAP.v5.md Part M.
/// </summary>
public abstract class AuraTagHelperBase : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    /// <summary>Appends the caller-supplied Class to a component's own base class list, if present.</summary>
    protected string MergeClass(string baseClass) =>
        string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}";
}

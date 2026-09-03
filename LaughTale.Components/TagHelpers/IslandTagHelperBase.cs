using System.Globalization;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Attributes;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.Enums;
using LaughTale.Core.Localization;
using LaughTale.Core.Serialization;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Foundation base class for all LaughTale Aura island TagHelpers.
/// Automatically handles core island metadata (data-island, data-hydrate, data-framework, data-persist, data-media),
/// standard HTML passthrough attributes (class, style, id), and props JSON serialization.
/// </summary>
public abstract class IslandTagHelperBase : TagHelper
{
    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    /// <summary>
    /// The unique client-side island registration name (e.g. "datatable", "datepicker").
    /// </summary>
    public abstract string IslandName { get; }

    /// <summary>
    /// Authorization policy required to render or refresh this island.
    /// </summary>
    [HtmlAttributeName("policy")]
    public string? Policy { get; set; }

    /// <summary>
    /// Hydration lifecycle strategy (Load, Idle, Visible, Media, Interaction, Never). Default is Load.
    /// </summary>
    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    /// <summary>
    /// Client-side framework adapter (Vanilla, Preact, React, Vue, Svelte, Lit). Default is Vanilla.
    /// </summary>
    [HtmlAttributeName("framework")]
    public IslandFramework Framework { get; set; } = IslandFramework.Vanilla;

    /// <summary>
    /// Whether the island DOM subtree persists across client-side SPA navigations.
    /// </summary>
    [HtmlAttributeName("persist")]
    public bool Persist { get; set; } = false;

    /// <summary>
    /// Media query condition used when HydrateStrategy is Media (e.g. "(min-width: 768px)").
    /// </summary>
    [HtmlAttributeName("media")]
    public string? Media { get; set; }

    /// <summary>
    /// CSS class string passed through to the island wrapper container.
    /// </summary>
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    /// <summary>
    /// Inline style string passed through to the island wrapper container.
    /// </summary>
    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    /// <summary>
    /// DOM element id passed through to the island wrapper container.
    /// </summary>
    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    /// <summary>
    /// Builds the component-specific props payload to be serialized into data-props.
    /// Return an anonymous object, record, dictionary, or custom props model.
    /// </summary>
    protected virtual object? BuildProps() => null;

    /// <summary>
    /// Builds optional server-rendered HTML markup or skeleton placeholder.
    /// When non-null and no child content is provided, output is stamped with data-lt-ssr="true".
    /// </summary>
    protected virtual string? BuildSsrHtml() => null;

    /// <summary>
    /// Override to customize the wrapper HTML element tag. Default is "div".
    /// </summary>
    protected virtual string WrapperTagName => "div";

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        // LT-2203 / LT-2204: Initial Island Render Authorization Check
        var httpContext = ViewContext?.HttpContext;
        var requestServices = httpContext?.RequestServices;
        if (httpContext is null || requestServices is null)
        {
            output.SuppressOutput();
            return;
        }

        var evaluator = requestServices.GetService<LaughTale.Core.Security.IIslandAccessEvaluator>();
        if (evaluator is null)
        {
            output.SuppressOutput();
            return;
        }

        string? explicitPolicy = Policy;
        if (string.IsNullOrWhiteSpace(explicitPolicy))
        {
            var componentType = this.GetType();
            var authAttr = componentType.GetCustomAttribute<IslandAuthorizeAttribute>();
            var anonAttr = componentType.GetCustomAttribute<IslandAllowAnonymousAttribute>();
            if (authAttr != null && anonAttr != null)
            {
                throw new InvalidOperationException($"Component type '{componentType.FullName}' cannot have both [IslandAuthorize] and [IslandAllowAnonymous].");
            }
            if (anonAttr != null)
            {
                var reg = requestServices.GetService<LaughTale.Core.Security.IIslandAuthorizationRegistry>();
                reg?.RegisterPublic(IslandName);
            }
            else if (authAttr != null)
            {
                explicitPolicy = authAttr.Policy;
            }
        }

        var decision = await evaluator.EvaluateAsync(
            IslandName,
            httpContext.User,
            requestServices,
            new LaughTale.Core.Security.IslandAccessContext(ExplicitPolicy: explicitPolicy, LocalOptions: null));

        if (!decision.IsAllowed)
        {
            output.SuppressOutput();
            return;
        }

        output.TagName = WrapperTagName;
        output.TagMode = TagMode.StartTagAndEndTag;

        // Culture & Direction Flow
        var currentCulture = CultureInfo.CurrentUICulture;
        if (!output.Attributes.ContainsName("lang"))
        {
            output.Attributes.SetAttribute("lang", currentCulture.Name);
        }
        if (!output.Attributes.ContainsName("dir"))
        {
            var localizer = ViewContext?.HttpContext?.RequestServices?.GetService<ILaughTaleLocalizer>();
            var isRtl = localizer?.IsRightToLeft(currentCulture) ?? currentCulture.TextInfo.IsRightToLeft;
            output.Attributes.SetAttribute("dir", isRtl ? "rtl" : "ltr");
        }

        output.Attributes.SetAttribute("data-island", IslandName);
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (Framework != IslandFramework.Vanilla)
        {
            output.Attributes.SetAttribute("data-framework", Framework.ToString().ToLowerInvariant());
        }

        if (Persist)
        {
            output.Attributes.SetAttribute("data-persist", "true");
        }

        if (!string.IsNullOrWhiteSpace(Media))
        {
            output.Attributes.SetAttribute("data-media", Media);
        }

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        if (!string.IsNullOrWhiteSpace(Id))
        {
            output.Attributes.SetAttribute("id", Id);
        }

        var props = BuildProps();
        if (props != null)
        {
            output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        }

        var childContent = await output.GetChildContentAsync();
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent(childContent);
        }
        else
        {
            var ssrHtml = BuildSsrHtml();
            if (!string.IsNullOrWhiteSpace(ssrHtml))
            {
                output.Attributes.SetAttribute("data-lt-ssr", "true");
                output.Content.SetHtmlContent(ssrHtml);
            }
        }

        IslandDiagnostics.ValidateIsland(
            IslandName,
            Hydrate,
            Media,
            Persist,
            output);
    }
}

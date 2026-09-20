using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;
using LaughTale.Core.Security;
using LaughTale.Core.Streaming;

namespace LaughTale.Core.TagHelpers;

/// <summary>
/// LaughTale: Out-Of-Order Streaming (ROADMAP.v5.md Part E). Wraps a PageModel property of type
/// <c>Task&lt;TProps&gt;</c> - started, never awaited, in <c>OnGet</c>/<c>OnGetAsync</c> - and renders
/// a skeleton placeholder immediately, registering the task with
/// <see cref="DeferredIslandRegistry"/> so <c>OutOfOrderStreamingMiddleware</c> can deliver the real
/// island markup as a late fragment the moment the task resolves, in COMPLETION order relative to any
/// other deferred island on the page - not the order they were declared in.
///
/// <c>[IslandPrivate]</c>/authorization are evaluated HERE, at shell-render time - not when the task
/// resolves - because by then the response has already started and headers can no longer be set.
/// </summary>
[HtmlTargetElement("island-deferred", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandDeferredTagHelper : TagHelper
{
    private static readonly ConcurrentDictionary<(Type ModelType, string PropertyName), PropertyInfo?> PropertyCache = new();

    private readonly ILogger<IslandDeferredTagHelper> _logger;

    public IslandDeferredTagHelper(ILogger<IslandDeferredTagHelper>? logger = null)
    {
        _logger = logger ?? NullLogger<IslandDeferredTagHelper>.Instance;
    }

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    [HtmlAttributeName("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// The name of a <c>Task&lt;TProps&gt;</c>-typed property on the current PageModel, already
    /// started (not awaited) in <c>OnGet</c>/<c>OnGetAsync</c>.
    /// </summary>
    [HtmlAttributeName("for")]
    public string For { get; set; } = string.Empty;

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Visible;

    [HtmlAttributeName("timeout-seconds")]
    public double TimeoutSeconds { get; set; } = 8;

    [HtmlAttributeName("private")]
    public bool? IsPrivate { get; set; }

    [HtmlAttributeName("policy")]
    public string? Policy { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var httpContext = ViewContext?.HttpContext;
        var requestServices = httpContext?.RequestServices;
        var model = ViewContext?.ViewData?.Model;
        if (httpContext is null || requestServices is null || model is null)
        {
            output.SuppressOutput();
            return;
        }

        if (string.IsNullOrWhiteSpace(Name) || string.IsNullOrWhiteSpace(For))
        {
            throw new InvalidOperationException("<island-deferred> requires both 'name' and 'for' attributes.");
        }

        var property = PropertyCache.GetOrAdd((model.GetType(), For), key =>
            key.ModelType.GetProperty(key.PropertyName, BindingFlags.Public | BindingFlags.Instance));

        if (property is null)
        {
            throw new InvalidOperationException($"<island-deferred for=\"{For}\"> could not find a public property '{For}' on '{model.GetType().FullName}'.");
        }

        if (!property.PropertyType.IsGenericType || property.PropertyType.GetGenericTypeDefinition() != typeof(Task<>))
        {
            throw new InvalidOperationException($"<island-deferred for=\"{For}\"> requires the property to be of type Task<TProps>; '{property.PropertyType.Name}' is not.");
        }

        var propsType = property.PropertyType.GetGenericArguments()[0];
        var rawTask = property.GetValue(model);
        if (rawTask is null)
        {
            throw new InvalidOperationException($"<island-deferred for=\"{For}\"> found a null Task - start it (without awaiting) in OnGet/OnGetAsync before rendering.");
        }

        // LT-2203/LT-2204-equivalent authorization check, evaluated the same way IslandTagHelper does.
        var evaluator = requestServices.GetService<IIslandAccessEvaluator>();
        if (evaluator is null)
        {
            output.SuppressOutput();
            return;
        }

        string? explicitPolicy = Policy;
        if (string.IsNullOrWhiteSpace(explicitPolicy))
        {
            var authAttr = propsType.GetCustomAttribute<IslandAuthorizeAttribute>();
            var anonAttr = propsType.GetCustomAttribute<IslandAllowAnonymousAttribute>();
            if (authAttr != null && anonAttr != null)
            {
                throw new InvalidOperationException($"Props type '{propsType.FullName}' cannot have both [IslandAuthorize] and [IslandAllowAnonymous].");
            }
            if (anonAttr != null)
            {
                requestServices.GetService<IIslandAuthorizationRegistry>()?.RegisterPublic(Name);
            }
            else if (authAttr != null)
            {
                explicitPolicy = authAttr.Policy;
            }
        }

        var decision = await evaluator.EvaluateAsync(
            Name,
            httpContext.User,
            requestServices,
            new IslandAccessContext(ExplicitPolicy: explicitPolicy, LocalOptions: null));

        if (!decision.IsAllowed)
        {
            output.SuppressOutput();
            return;
        }

        // Cache-privacy MUST be decided now, at shell-render time - Response.HasStarted will be true
        // by the time this island's deferred task resolves, and headers can no longer be set then.
        var hasPrivateAttr = IsPrivate == true
            || propsType.GetCustomAttribute<IslandPrivateAttribute>(true) != null
            || propsType.GetProperties(BindingFlags.Public | BindingFlags.Instance).Any(p => p.GetCustomAttribute<IslandPrivateAttribute>(true) != null);
        if (hasPrivateAttr)
        {
            IslandCachePrivacy.EnforceNoStore(httpContext, Name, _logger);
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var placeholderId = "lt-deferred-" + Guid.NewGuid().ToString("N");
        output.Attributes.SetAttribute("id", placeholderId);
        output.Attributes.SetAttribute("data-island-placeholder", Name);

        var childContent = await output.GetChildContentAsync();
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent(childContent.GetContent());
        }

        var objectTask = ToObjectTask(rawTask, propsType);
        DeferredIslandRegistry.GetOrCreate(httpContext).Entries.Add(new DeferredIslandEntry(
            placeholderId,
            Name,
            objectTask,
            TimeSpan.FromSeconds(TimeoutSeconds),
            Hydrate.ToString().ToLowerInvariant()));

        _logger.LogDebug("LaughTale deferred island registered: Name={Name}, Placeholder={PlaceholderId}", Name, placeholderId);
    }

    private static async Task<object?> AwaitAsObject<T>(Task<T> task) => await task.ConfigureAwait(false);

    private static Task<object?> ToObjectTask(object taskInstance, Type propsType)
    {
        var method = typeof(IslandDeferredTagHelper)
            .GetMethod(nameof(AwaitAsObject), BindingFlags.NonPublic | BindingFlags.Static)!
            .MakeGenericMethod(propsType);
        return (Task<object?>)method.Invoke(null, new[] { taskInstance })!;
    }
}

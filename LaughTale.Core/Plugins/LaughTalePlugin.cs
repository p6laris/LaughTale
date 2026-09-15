using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Configuration;

namespace LaughTale.Core.Plugins;

/// <summary>
/// Base class for LaughTale server lifecycle plugins (ROADMAP.v5.md Part G/L).
/// Mirrors <see cref="LaughTale.Components.TagHelpers.IslandTagHelperBase"/>'s own
/// <c>BuildProps()</c>/<c>BuildSsrHtml()</c> pattern: a small set of <c>virtual</c>
/// no-op hooks rather than a bare interface that forces every implementer to write
/// empty method bodies for extension points it doesn't care about.
/// </summary>
public abstract class LaughTalePlugin
{
    /// <summary>
    /// The plugin's unique, human-readable name (used for diagnostics/logging).
    /// </summary>
    public abstract string Name { get; }

    /// <summary>
    /// Called once, eagerly, at the <see cref="LaughTale.Core.Extensions.ServiceCollectionExtensions.AddLaughTalePlugin"/>
    /// call site - not deferred to service-provider build time. This lets a plugin
    /// mutate <see cref="LaughTaleOptions"/> and register its own services regardless
    /// of whether it is registered before or after <c>AddLaughTale()</c>.
    /// </summary>
    public virtual void OnConfigure(LaughTaleOptions options, IServiceCollection services) { }

    /// <summary>
    /// Called by <see cref="LaughTale.Components.TagHelpers.IslandTagHelperBase.ProcessAsync"/>
    /// immediately after props are built and before they are serialized into <c>data-props</c>.
    /// Because the splice lives in the shared base class, every island TagHelper reaches this
    /// hook for free. Mutate <see cref="IslandRenderingContext.Props"/> to change what gets
    /// serialized.
    /// </summary>
    public virtual ValueTask OnIslandRenderingAsync(IslandRenderingContext context) => ValueTask.CompletedTask;

    /// <summary>
    /// Called for every response, right before <see cref="HttpResponse.OnStarting(System.Func{System.Threading.Tasks.Task})"/>
    /// fires - fanned out by <see cref="LaughTalePluginMiddleware"/>. Runs after the response
    /// body has been fully composed but before headers/status are sent to the client.
    /// </summary>
    public virtual Task OnResponseStartingAsync(HttpContext context) => Task.CompletedTask;
}

/// <summary>
/// Per-render context passed to <see cref="LaughTalePlugin.OnIslandRenderingAsync"/>.
/// </summary>
public sealed class IslandRenderingContext
{
    /// <summary>
    /// The unique client-side island registration name being rendered (e.g. "datatable").
    /// </summary>
    public required string IslandName { get; init; }

    /// <summary>
    /// The current request's <see cref="HttpContext"/>.
    /// </summary>
    public required HttpContext HttpContext { get; init; }

    /// <summary>
    /// The TagHelper output being built for this island.
    /// </summary>
    public required TagHelperOutput Output { get; init; }

    /// <summary>
    /// The props object about to be serialized into <c>data-props</c>. Plugins may
    /// replace this reference to change what gets serialized.
    /// </summary>
    public object? Props { get; set; }
}

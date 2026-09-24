using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using LaughTale.Core.Plugins;
using LaughTale.Core.Serialization;

namespace LaughTale.Core.Ssr;

/// <summary>
/// Server-renders framework islands through the registered <see cref="ISsrRenderer"/> (normally
/// <see cref="NodeSsrSidecar"/>) and stamps them <c>data-lt-ssr="true"</c> so the client hydrates
/// instead of mounting from scratch. Fail-open: any renderer problem leaves the island untouched.
/// </summary>
/// <remarks>
/// The renderer and logger are resolved from <see cref="IslandRenderingContext.HttpContext"/>'s
/// RequestServices (the same service-location pattern the island TagHelpers use), so the plugin can be
/// registered as a plain instance through <c>AddLaughTalePlugin</c>. Islands with child (slot) content
/// are not server-rendered in this version. Plugins run in registration order; a plugin registered
/// after this one that replaces <see cref="IslandRenderingContext.Props"/> would desynchronize the
/// server-rendered markup from <c>data-props</c>.
/// </remarks>
public sealed class SsrSidecarPlugin : LaughTalePlugin
{
    public const string PluginName = "ssr-sidecar";

    /// <summary>Marker the client uses to hydrate rather than mount. Mirrors Components' IslandSsrHelper.</summary>
    public const string SsrAttributeName = "data-lt-ssr";

    private static readonly long WarningIntervalTicks = TimeSpan.FromMinutes(1).Ticks;
    private readonly long[] _lastWarning = new long[Enum.GetValues<SsrRenderFailure>().Length + 1];

    public override string Name => PluginName;

    public override async ValueTask OnIslandRenderingAsync(IslandRenderingContext context)
    {
        var services = context.HttpContext.RequestServices;
        var renderer = services?.GetService<ISsrRenderer>();
        if (renderer is null || !renderer.IsReady || !renderer.CanRender(context.IslandName))
        {
            return;
        }

        var output = context.Output;
        if (output.Content.IsModified && !output.Content.IsEmptyOrWhiteSpace)
        {
            return; // another plugin already supplied markup
        }

        // GetChildContentAsync caches its result, so the TagHelper's own later call sees the same content.
        var childContent = await output.GetChildContentAsync().ConfigureAwait(false);
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            return;
        }

        var logger = services!.GetService<ILogger<SsrSidecarPlugin>>();

        string propsJson;
        try
        {
            // Same serializer as data-props, so the server render sees exactly what the client hydrates with.
            propsJson = IslandJson.SerializeProps(context.Props);
        }
        catch (IslandSerializationException)
        {
            return; // the TagHelper will surface this itself when it serializes data-props
        }

        SsrRenderResult result;
        try
        {
            result = await renderer.RenderAsync(context.IslandName, propsJson, context.HttpContext.RequestAborted).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            result = SsrRenderResult.Fail(SsrRenderFailure.RenderError, ex.Message);
        }

        if (!result.Success)
        {
            LogFailure(logger, context.IslandName, result);
            return;
        }

        if (string.IsNullOrWhiteSpace(result.Html))
        {
            return;
        }

        output.Content.SetHtmlContent(result.Html);
        output.Attributes.SetAttribute(SsrAttributeName, "true");
    }

    private void LogFailure(ILogger? logger, string islandName, SsrRenderResult result)
    {
        if (logger is null || result.Failure == SsrRenderFailure.Canceled)
        {
            return;
        }

        var slot = (int)result.Failure;
        var now = DateTime.UtcNow.Ticks;
        var last = Volatile.Read(ref _lastWarning[slot]);
        if (now - last >= WarningIntervalTicks && Interlocked.CompareExchange(ref _lastWarning[slot], now, last) == last)
        {
            logger.LogWarning(
                "[LaughTale SSR] Island '{Island}' rendered without SSR ({Failure}): {Error}. Repeats of this failure are logged at Debug for the next minute.",
                islandName, result.Failure, result.Error);
        }
        else
        {
            logger.LogDebug("[LaughTale SSR] Island '{Island}' rendered without SSR ({Failure}): {Error}", islandName, result.Failure, result.Error);
        }
    }
}

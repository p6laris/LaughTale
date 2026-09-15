using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Serialization;

namespace LaughTale.Core.Endpoints;

/// <summary>
/// Server Actions Layer 2 (ROADMAP.v5.md Part G/L, optional). Ships after Layer 1
/// (<c>IslandFormTagHelper</c>), not as a blocker for it. Narrowly scoped to the one scenario
/// where the antiforgery-&gt;authorization-&gt;work triad from
/// <see cref="IslandEndpointExtensions.MapLaughTaleIslandRefresh"/> is the right clone target:
/// an action whose result is specifically "re-render this island's own authorized props",
/// computed server-side by the caller's own delegate - not client-supplied props echoed back
/// like <c>MapLaughTaleIslandRefresh</c> does.
/// </summary>
public static class IslandActionExtensions
{
    /// <summary>
    /// Maps a server action endpoint that runs <paramref name="action"/> to compute
    /// <paramref name="islandName"/>'s own authorized props server-side, then re-renders the
    /// island container with those props - after the same antiforgery and authorization checks
    /// as <see cref="IslandEndpointExtensions.MapLaughTaleIslandRefresh"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapLaughTaleIslandAction<TProps>(
        this IEndpointRouteBuilder endpoints,
        string pattern,
        string islandName,
        Func<HttpContext, Task<TProps>> action,
        Action<LaughTale.Core.Configuration.IslandRefreshOptions>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(endpoints);
        ArgumentNullException.ThrowIfNull(pattern);
        ArgumentNullException.ThrowIfNull(islandName);
        ArgumentNullException.ThrowIfNull(action);

        var localOptions = new LaughTale.Core.Configuration.IslandRefreshOptions();
        configure?.Invoke(localOptions);

        endpoints.MapPost(pattern, async (HttpContext context) =>
        {
            var laughTaleOptions = context.RequestServices.GetService<Microsoft.Extensions.Options.IOptions<LaughTale.Core.Configuration.LaughTaleOptions>>()?.Value;

            // 1. Antiforgery validation (same triad step as MapLaughTaleIslandRefresh)
            var requireAntiforgery = localOptions.RequireAntiforgery && (laughTaleOptions?.Refresh.RequireAntiforgery ?? true);
            if (requireAntiforgery)
            {
                var antiforgery = context.RequestServices.GetService<Microsoft.AspNetCore.Antiforgery.IAntiforgery>();
                if (antiforgery is null)
                {
                    return Results.StatusCode(StatusCodes.Status400BadRequest);
                }

                try
                {
                    await antiforgery.ValidateRequestAsync(context);
                }
                catch
                {
                    return Results.StatusCode(StatusCodes.Status400BadRequest);
                }
            }

            // 2. Authorization policy check (same triad step as MapLaughTaleIslandRefresh)
            var evaluator = context.RequestServices.GetService<LaughTale.Core.Security.IIslandAccessEvaluator>();
            if (evaluator is null)
            {
                return Results.StatusCode(StatusCodes.Status403Forbidden);
            }

            var decision = await evaluator.EvaluateAsync(
                islandName,
                context.User,
                context.RequestServices,
                new LaughTale.Core.Security.IslandAccessContext(ExplicitPolicy: null, LocalOptions: localOptions));

            if (!decision.IsAllowed)
            {
                // 403 Forbidden: render nothing, zero props leaked (matches MapLaughTaleIslandRefresh's
                // FR-006 / invariant I1 behavior).
                return Results.StatusCode(StatusCodes.Status403Forbidden);
            }

            // 3. Work: run the caller's action server-side to compute this island's own authorized
            // props. Unlike MapLaughTaleIslandRefresh, no client-supplied props JSON is trusted here.
            var props = await action(context);

            // 4. Render island container with the action's props
            var propsJson = IslandJson.SerializeProps(props);
            var html = $"<div data-island=\"{System.Net.WebUtility.HtmlEncode(islandName)}\" data-props=\"{System.Net.WebUtility.HtmlEncode(propsJson)}\" data-hydrate=\"load\"></div>";

            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync(html);
            return Results.Empty;
        })
        .WithName($"LaughTaleIslandAction_{islandName}")
        .Produces(StatusCodes.Status200OK, contentType: "text/html")
        .Produces(StatusCodes.Status403Forbidden)
        .Produces(StatusCodes.Status400BadRequest);

        return endpoints;
    }
}

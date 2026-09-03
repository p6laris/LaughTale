using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Data;
using LaughTale.Core.Serialization;

namespace LaughTale.Core.Endpoints;

/// <summary>
/// Server-side island refresh endpoints .
/// Enables repeatable on-demand server rendering of individual islands with DOM morphing.
/// </summary>
public static class IslandEndpointExtensions
{
    /// <summary>
    /// Maps the LaughTale server-driven island refresh endpoint with strict authorization and antiforgery enforcement (LT-2203).
    /// </summary>
    public static IEndpointRouteBuilder MapLaughTaleIslandRefresh(
        this IEndpointRouteBuilder endpoints, 
        string pattern = "/_laughtale/island/{name}",
        Action<LaughTale.Core.Configuration.IslandRefreshOptions>? configure = null)
    {
        var localOptions = new LaughTale.Core.Configuration.IslandRefreshOptions();
        configure?.Invoke(localOptions);

        endpoints.MapPost(pattern, async (string name, HttpContext context) =>
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return Results.BadRequest(new { error = "Island name is required." });
            }

            var laughTaleOptions = context.RequestServices.GetService<Microsoft.Extensions.Options.IOptions<LaughTale.Core.Configuration.LaughTaleOptions>>()?.Value;

            // 1. Antiforgery validation (LT-1503 / LT-2203 / LT-2204)
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

            // 2. Authorization policy check (LT-2203 / LT-2204)
            var evaluator = context.RequestServices.GetService<LaughTale.Core.Security.IIslandAccessEvaluator>();
            if (evaluator is null)
            {
                return Results.StatusCode(StatusCodes.Status403Forbidden);
            }

            var decision = await evaluator.EvaluateAsync(
                name,
                context.User,
                context.RequestServices,
                new LaughTale.Core.Security.IslandAccessContext(ExplicitPolicy: null, LocalOptions: localOptions));

            if (!decision.IsAllowed)
            {
                // 403 Forbidden: Render nothing, zero props leaked in the response body (FR-006, invariant I1).
                return Results.StatusCode(StatusCodes.Status403Forbidden);
            }

            // 3. Read props from JSON body if present
            string propsJson = "{}";
            if (context.Request.ContentLength > 0)
            {
                using var reader = new System.IO.StreamReader(context.Request.Body);
                propsJson = await reader.ReadToEndAsync();
            }

            // 4. Render island container with updated props
            var html = $"<div data-island=\"{System.Net.WebUtility.HtmlEncode(name)}\" data-props=\"{System.Net.WebUtility.HtmlEncode(propsJson)}\" data-hydrate=\"load\"></div>";

            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync(html);
            return Results.Empty;
        })
        .WithName("LaughTaleIslandRefresh")
        .Produces(StatusCodes.Status200OK, contentType: "text/html")
        .Produces(StatusCodes.Status403Forbidden)
        .Produces(StatusCodes.Status400BadRequest);

        return endpoints;
    }

    /// <summary>
    /// Maps a server-side data endpoint for DataTable, DataView, and TreeTable components.
    /// Handles filtering, multi-sorting, global search, and pagination safely via Expression Trees.
    /// </summary>
    public static IEndpointRouteBuilder MapIslandData<T>(
        this IEndpointRouteBuilder endpoints,
        string pattern,
        Func<HttpContext, Task<IQueryable<T>>> queryProvider,
        IReadOnlySet<string>? allowedFields = null)
    {
        endpoints.MapPost(pattern, async (HttpContext context, IslandDataRequest? request) =>
        {
            var req = request ?? new IslandDataRequest();
            var query = await queryProvider(context);
            var result = query.ToIslandDataResult(req, allowedFields);
            return Results.Json(result);
        })
        .WithName($"LaughTaleData_{typeof(T).Name}")
        .Produces<IslandDataResult<T>>(StatusCodes.Status200OK);

        return endpoints;
    }

    /// <summary>
    /// Maps a server-side data endpoint from a synchronous IQueryable source.
    /// </summary>
    public static IEndpointRouteBuilder MapIslandData<T>(
        this IEndpointRouteBuilder endpoints,
        string pattern,
        Func<HttpContext, IQueryable<T>> queryProvider,
        IReadOnlySet<string>? allowedFields = null)
    {
        return endpoints.MapIslandData(pattern, (ctx) => Task.FromResult(queryProvider(ctx)), allowedFields);
    }

    /// <summary>
    /// Maps the self-hosted Lucide SVG icon sprite endpoint with immutable cache headers.
    /// Serves /_lt/icons.svg, /_lt/icons-{hash}.svg, and /icons/lucide-sprites.svg.
    /// </summary>
    public static IEndpointRouteBuilder MapLaughTaleIcons(
        this IEndpointRouteBuilder endpoints,
        string pattern = "/_lt/icons.svg")
    {
        var handler = async (HttpContext context) =>
        {
            context.Response.Headers.CacheControl = "public, max-age=31536000, immutable";
            context.Response.ContentType = "image/svg+xml; charset=utf-8";

            var env = context.RequestServices.GetService<Microsoft.AspNetCore.Hosting.IWebHostEnvironment>();
            if (env != null)
            {
                var candidates = new[]
                {
                    System.IO.Path.Combine(env.WebRootPath ?? "wwwroot", "_lt", "icons.svg"),
                    System.IO.Path.Combine(env.WebRootPath ?? "wwwroot", "icons", "lucide-sprites.svg"),
                    System.IO.Path.Combine(AppContext.BaseDirectory, "wwwroot", "icons", "lucide-sprites.svg")
                };

                foreach (var candidate in candidates)
                {
                    if (System.IO.File.Exists(candidate))
                    {
                        await context.Response.SendFileAsync(candidate);
                        return Results.Empty;
                    }
                }
            }

            var defaultSprite = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display:none;\"><symbol id=\"zap\" viewBox=\"0 0 24 24\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon></symbol><symbol id=\"check\" viewBox=\"0 0 24 24\"><polyline points=\"20 6 9 17 4 12\"></polyline></symbol><symbol id=\"search\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line></symbol><symbol id=\"user\" viewBox=\"0 0 24 24\"><path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle></symbol><symbol id=\"settings\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"></path></symbol></svg>";
            await context.Response.WriteAsync(defaultSprite);
            return Results.Empty;
        };

        endpoints.MapGet("/_lt/icons.svg", handler);
        endpoints.MapGet("/_lt/icons-{hash}.svg", handler);
        endpoints.MapGet("/icons/lucide-sprites.svg", handler);
        if (pattern != "/_lt/icons.svg")
        {
            endpoints.MapGet(pattern, handler);
        }

        return endpoints;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Data;
using LaughTale.Core.Serialization;

namespace LaughTale.Core.Endpoints;

/// <summary>
/// Server-side island refresh endpoints (P12).
/// Enables repeatable on-demand server rendering of individual islands with DOM morphing.
/// </summary>
public static class IslandEndpointExtensions
{
    /// <summary>
    /// Maps the LaughTale server-driven island refresh endpoint.
    /// </summary>
    public static IEndpointRouteBuilder MapLaughTaleIslandRefresh(
        this IEndpointRouteBuilder endpoints, 
        string pattern = "/_laughtale/island/{name}")
    {
        endpoints.MapPost(pattern, async (string name, HttpContext context) =>
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return Results.BadRequest(new { error = "Island name is required." });
            }

            // Read props from JSON body if present
            string propsJson = "{}";
            if (context.Request.ContentLength > 0)
            {
                using var reader = new System.IO.StreamReader(context.Request.Body);
                propsJson = await reader.ReadToEndAsync();
            }

            // Render island container with updated props
            var html = $"<div data-island=\"{System.Net.WebUtility.HtmlEncode(name)}\" data-props=\"{System.Net.WebUtility.HtmlEncode(propsJson)}\" data-hydrate=\"load\"></div>";

            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync(html);
            return Results.Empty;
        })
        .WithName("LaughTaleIslandRefresh")
        .Produces(StatusCodes.Status200OK, contentType: "text/html");

        return endpoints;
    }

    /// <summary>
    /// Maps a server-side data endpoint for DataTable, DataView, and TreeTable components (LT-1508).
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
}

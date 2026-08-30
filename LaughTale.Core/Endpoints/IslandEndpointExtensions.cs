using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
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
}

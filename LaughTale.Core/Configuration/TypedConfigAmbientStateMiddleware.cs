using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using LaughTale.Core.State;

namespace LaughTale.Core.Configuration;

/// <summary>
/// LaughTale: Typed Config (ROADMAP.v5.md Part F). Seeds every registered
/// <see cref="ClientExposedConfigProjection"/>'s values into this request's Ambient State Pool
/// (<see cref="HttpContextAmbientStateExtensions.SetAmbientState"/>), under a shared
/// <c>"config"</c> key so the client reads it back as one object: <c>ctx.state('config')</c>. Mirrors
/// <see cref="LaughTale.Core.Security.LaughTaleCspMiddleware"/>'s constructor shape.
///
/// Registers nothing when no typed config was ever configured via <c>AddLaughTaleTypedConfig</c> - a
/// zero-cost no-op for every app that doesn't use this feature.
/// </summary>
public class TypedConfigAmbientStateMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IEnumerable<ClientExposedConfigProjection> _projections;

    public TypedConfigAmbientStateMiddleware(RequestDelegate next, IEnumerable<ClientExposedConfigProjection> projections)
    {
        _next = next;
        _projections = projections;
    }

    public System.Threading.Tasks.Task InvokeAsync(HttpContext context)
    {
        var merged = new Dictionary<string, object?>(System.StringComparer.Ordinal);
        foreach (var projection in _projections)
        {
            foreach (var (key, value) in projection.Values)
            {
                merged[key] = value;
            }
        }

        if (merged.Count > 0)
        {
            context.SetAmbientState("config", merged);
        }

        return _next(context);
    }
}

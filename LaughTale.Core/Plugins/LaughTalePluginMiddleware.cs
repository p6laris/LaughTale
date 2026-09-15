using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace LaughTale.Core.Plugins;

/// <summary>
/// Middleware that fans <see cref="LaughTalePlugin.OnResponseStartingAsync"/> out to every
/// registered <see cref="LaughTalePlugin"/> via ASP.NET Core's own <see cref="HttpResponse.OnStarting(System.Func{Task})"/>.
/// Mirrors <see cref="LaughTale.Core.Security.LaughTaleCspMiddleware"/>'s constructor-with-<see cref="RequestDelegate"/>
/// shape exactly.
/// </summary>
public class LaughTalePluginMiddleware
{
    private readonly RequestDelegate _next;

    public LaughTalePluginMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    // Plugins are resolved per-request via a parameter on InvokeAsync - ASP.NET Core's standard
    // per-request DI pattern for middleware. The constructor only ever receives singleton-lifetime
    // services, so IEnumerable<LaughTalePlugin> (itself singleton here, but resolved this way for
    // correctness regardless of a plugin's own registered lifetime) is not injected there.
    public async Task InvokeAsync(HttpContext context, IEnumerable<LaughTalePlugin>? plugins)
    {
        if (plugins != null)
        {
            using var pluginEnumerator = plugins.GetEnumerator();
            if (pluginEnumerator.MoveNext())
            {
                var pluginList = new List<LaughTalePlugin>();
                do
                {
                    pluginList.Add(pluginEnumerator.Current);
                }
                while (pluginEnumerator.MoveNext());

                context.Response.OnStarting(async () =>
                {
                    foreach (var plugin in pluginList)
                    {
                        await plugin.OnResponseStartingAsync(context);
                    }
                });
            }
        }

        await _next(context);
    }
}

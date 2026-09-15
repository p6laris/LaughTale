using Microsoft.AspNetCore.Builder;

namespace LaughTale.Core.Plugins;

public static class LaughTalePluginExtensions
{
    /// <summary>
    /// Adds the LaughTale plugin middleware to the application pipeline, fanning
    /// <see cref="LaughTalePlugin.OnResponseStartingAsync"/> out to every registered plugin.
    /// Mirrors <see cref="LaughTale.Core.Security.LaughTaleCspExtensions.UseLaughTaleCsp"/>'s
    /// registration style. Register early, before <c>UseRouting()</c>.
    /// </summary>
    public static IApplicationBuilder UseLaughTalePlugins(this IApplicationBuilder app)
    {
        return app.UseMiddleware<LaughTalePluginMiddleware>();
    }
}

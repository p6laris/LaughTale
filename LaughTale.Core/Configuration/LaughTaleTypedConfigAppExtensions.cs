using Microsoft.AspNetCore.Builder;

namespace LaughTale.Core.Configuration;

public static class LaughTaleTypedConfigAppExtensions
{
    /// <summary>
    /// Registers <see cref="TypedConfigAmbientStateMiddleware"/>. Place before
    /// <c>&lt;island-state-script /&gt;</c> renders (i.e. anywhere ahead of the Razor Pages
    /// middleware) so the config projection is in this request's Ambient State Pool by the time the
    /// page renders it.
    /// </summary>
    public static IApplicationBuilder UseLaughTaleTypedConfig(this IApplicationBuilder app) =>
        app.UseMiddleware<TypedConfigAmbientStateMiddleware>();
}

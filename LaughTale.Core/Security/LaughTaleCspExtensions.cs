using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace LaughTale.Core.Security;

public static class LaughTaleCspExtensions
{
    /// <summary>
    /// Adds LaughTale CSP and nonce services to the dependency injection container.
    /// </summary>
    public static IServiceCollection AddLaughTaleCsp(this IServiceCollection services, Action<LaughTaleCspOptions>? configure = null)
    {
        services.AddHttpContextAccessor();
        services.TryAddScoped<ICspNonceProvider, HttpContextCspNonceProvider>();

        if (configure != null)
        {
            services.Configure(configure);
        }
        else
        {
            services.Configure<LaughTaleCspOptions>(_ => { });
        }

        return services;
    }

    /// <summary>
    /// Adds the LaughTale CSP middleware to the application pipeline.
    /// </summary>
    public static IApplicationBuilder UseLaughTaleCsp(this IApplicationBuilder app)
    {
        return app.UseMiddleware<LaughTaleCspMiddleware>();
    }
}

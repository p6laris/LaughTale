using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;

namespace LaughTale.Core.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers LaughTale Islands Architecture core runtime and services with optional feature configuration (LT-1109).
    /// </summary>
    /// <param name="services">The IServiceCollection instance.</param>
    /// <param name="configure">Optional delegate to configure LaughTaleOptions.</param>
    public static IServiceCollection AddLaughTale(
        this IServiceCollection services, 
        Action<LaughTaleOptions>? configure = null)
    {
        var options = new LaughTaleOptions();
        configure?.Invoke(options);

        services.AddSingleton(options);
        services.AddSingleton<IOptions<LaughTaleOptions>>(new OptionsWrapper<LaughTaleOptions>(options));

        // Core island services
        return services;
    }

    /// <summary>
    /// Backward-compatibility alias for AddLaughTale().
    /// </summary>
    public static IServiceCollection AddIslands(
        this IServiceCollection services, 
        Action<LaughTaleOptions>? configure = null)
    {
        return services.AddLaughTale(configure);
    }
}

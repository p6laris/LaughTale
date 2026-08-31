using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;
using LaughTale.Core.Localization;

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
        services.TryAddSingleton<ILaughTaleLocalizer, LaughTaleLocalizer>();

        return services;
    }

    /// <summary>
    /// Registers and configures LaughTale localization engine with custom dictionaries and IStringLocalizer support.
    /// </summary>
    public static IServiceCollection AddLaughTaleLocalization(
        this IServiceCollection services,
        Action<LaughTaleLocalizationOptions>? configure = null)
    {
        var locOptions = new LaughTaleLocalizationOptions();
        configure?.Invoke(locOptions);

        services.Configure<LaughTaleOptions>(opt =>
        {
            opt.Localization = locOptions;
        });

        services.TryAddSingleton<ILaughTaleLocalizer, LaughTaleLocalizer>();
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

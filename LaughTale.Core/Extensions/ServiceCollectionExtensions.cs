using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;
using LaughTale.Core.Localization;
using LaughTale.Core.Plugins;

namespace LaughTale.Core.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Finds the LaughTaleOptions instance already registered in this IServiceCollection (from a
    /// prior AddLaughTale()/AddLaughTaleLocalization() call), or creates and registers a fresh one.
    /// LaughTaleOptions is registered as a directly-constructed singleton instance rather than
    /// through the standard IOptions&lt;T&gt; Configure() pipeline, so packages that extend LaughTale
    /// (e.g. LaughTale.Components' AddLaughTaleComponents(), which seeds built-in locale
    /// dictionaries) must mutate this same shared instance to take effect - this helper makes that
    /// safe regardless of whether such a package is registered before or after AddLaughTale().
    /// </summary>
    public static LaughTaleOptions EnsureLaughTaleOptions(this IServiceCollection services)
    {
        var existing = services
            .FirstOrDefault(d => d.ServiceType == typeof(LaughTaleOptions))
            ?.ImplementationInstance as LaughTaleOptions;
        if (existing != null)
        {
            return existing;
        }

        var options = new LaughTaleOptions();
        services.AddSingleton(options);
        services.AddSingleton<IOptions<LaughTaleOptions>>(new OptionsWrapper<LaughTaleOptions>(options));
        return options;
    }

    /// <summary>
    /// Registers LaughTale Islands Architecture core runtime and services with optional feature configuration.
    /// </summary>
    /// <param name="services">The IServiceCollection instance.</param>
    /// <param name="configure">Optional delegate to configure LaughTaleOptions.</param>
    public static IServiceCollection AddLaughTale(
        this IServiceCollection services,
        Action<LaughTaleOptions>? configure = null)
    {
        var options = services.EnsureLaughTaleOptions();
        configure?.Invoke(options);

        // Core island services
        services.TryAddSingleton<ILaughTaleLocalizer, LaughTaleLocalizer>();
        services.TryAddSingleton<LaughTale.Core.Security.IIslandAuthorizationRegistry, LaughTale.Core.Security.IslandAuthorizationRegistry>();
        services.TryAddSingleton<LaughTale.Core.Security.IIslandAccessEvaluator, LaughTale.Core.Security.IslandAccessEvaluator>();

        return services;
    }

    /// <summary>
    /// Registers and configures LaughTale localization engine with custom dictionaries and IStringLocalizer support.
    /// </summary>
    public static IServiceCollection AddLaughTaleLocalization(
        this IServiceCollection services,
        Action<LaughTaleLocalizationOptions>? configure = null)
    {
        var options = services.EnsureLaughTaleOptions();
        configure?.Invoke(options.Localization);

        services.TryAddSingleton<ILaughTaleLocalizer, LaughTaleLocalizer>();
        return services;
    }

    /// <summary>
    /// Registers a LaughTale plugin (ROADMAP.v5.md Part G/L). <see cref="LaughTalePlugin.OnConfigure"/>
    /// runs eagerly, at this call site, rather than being deferred to service-provider build time -
    /// that is what makes plugin registration order-independent relative to <see cref="AddLaughTale"/>.
    /// The plugin is also registered as both its concrete type and <see cref="LaughTalePlugin"/> so
    /// that <c>IEnumerable&lt;LaughTalePlugin&gt;</c> resolves every registered plugin.
    /// </summary>
    public static IServiceCollection AddLaughTalePlugin(this IServiceCollection services, LaughTalePlugin plugin)
    {
        ArgumentNullException.ThrowIfNull(plugin);

        var options = services.EnsureLaughTaleOptions();
        plugin.OnConfigure(options, services); // eager, at the call site - order-independent

        services.AddSingleton(plugin.GetType(), plugin);
        services.AddSingleton<LaughTalePlugin>(plugin);
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

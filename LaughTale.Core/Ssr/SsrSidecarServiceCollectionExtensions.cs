using System;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using LaughTale.Core.Extensions;

namespace LaughTale.Core.Ssr;

public static class SsrSidecarServiceCollectionExtensions
{
    /// <summary>
    /// Opts in to server-side rendering of framework islands through a Node sidecar. When
    /// <see cref="SsrSidecarOptions.Enabled"/> is false this registers nothing. When enabled it registers
    /// <see cref="NodeSsrSidecar"/> as a hosted service and as <see cref="ISsrRenderer"/>, and adds
    /// <see cref="SsrSidecarPlugin"/> via <see cref="ServiceCollectionExtensions.AddLaughTalePlugin"/>
    /// (so <c>UseLaughTalePlugins</c> and the island TagHelpers pick it up).
    /// </summary>
    public static IServiceCollection AddLaughTaleSsrSidecar(this IServiceCollection services, Action<SsrSidecarOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);
        var options = new SsrSidecarOptions();
        configure(options);
        return services.AddLaughTaleSsrSidecar(options);
    }

    /// <summary>
    /// Binds <see cref="SsrSidecarOptions"/> from the <c>LaughTale:Ssr</c> section of
    /// <paramref name="configuration"/>, then applies <paramref name="configure"/>.
    /// </summary>
    public static IServiceCollection AddLaughTaleSsrSidecar(
        this IServiceCollection services,
        IConfiguration configuration,
        Action<SsrSidecarOptions>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        var options = new SsrSidecarOptions();
        BindSection(configuration.GetSection(SsrSidecarOptions.SectionName), options);
        configure?.Invoke(options);
        return services.AddLaughTaleSsrSidecar(options);
    }

    // Hand-rolled instead of ConfigurationBinder.Bind to stay trim-safe (Core has trim analysis on).
    private static void BindSection(IConfiguration section, SsrSidecarOptions options)
    {
        if (bool.TryParse(section[nameof(SsrSidecarOptions.Enabled)], out var enabled)) options.Enabled = enabled;
        if (section[nameof(SsrSidecarOptions.NodePath)] is { Length: > 0 } nodePath) options.NodePath = nodePath;
        if (section[nameof(SsrSidecarOptions.ServerBundlePath)] is { Length: > 0 } bundle) options.ServerBundlePath = bundle;
        if (section[nameof(SsrSidecarOptions.WorkingDirectory)] is { Length: > 0 } workDir) options.WorkingDirectory = workDir;
        options.RenderTimeout = ReadTimeSpan(section, nameof(SsrSidecarOptions.RenderTimeout), options.RenderTimeout);
        options.StartupTimeout = ReadTimeSpan(section, nameof(SsrSidecarOptions.StartupTimeout), options.StartupTimeout);
        options.RestartBackoffInitial = ReadTimeSpan(section, nameof(SsrSidecarOptions.RestartBackoffInitial), options.RestartBackoffInitial);
        options.RestartBackoffMax = ReadTimeSpan(section, nameof(SsrSidecarOptions.RestartBackoffMax), options.RestartBackoffMax);
        options.RestartBackoffResetAfter = ReadTimeSpan(section, nameof(SsrSidecarOptions.RestartBackoffResetAfter), options.RestartBackoffResetAfter);
        options.ShutdownGracePeriod = ReadTimeSpan(section, nameof(SsrSidecarOptions.ShutdownGracePeriod), options.ShutdownGracePeriod);
    }

    private static TimeSpan ReadTimeSpan(IConfiguration section, string key, TimeSpan fallback) =>
        TimeSpan.TryParse(section[key], System.Globalization.CultureInfo.InvariantCulture, out var value) ? value : fallback;

    private static IServiceCollection AddLaughTaleSsrSidecar(this IServiceCollection services, SsrSidecarOptions options)
    {
        ArgumentNullException.ThrowIfNull(services);
        if (!options.Enabled)
        {
            return services;
        }

        if (string.IsNullOrWhiteSpace(options.ServerBundlePath))
        {
            throw new ArgumentException("SsrSidecarOptions.ServerBundlePath is required when the SSR sidecar is enabled.", nameof(options));
        }

        if (options.RenderTimeout <= TimeSpan.Zero || options.StartupTimeout <= TimeSpan.Zero)
        {
            throw new ArgumentException("SsrSidecarOptions.RenderTimeout and StartupTimeout must be positive.", nameof(options));
        }

        if (services.Any(d => d.ServiceType == typeof(NodeSsrSidecar)))
        {
            return services; // already registered; keep the first configuration
        }

        services.AddSingleton(options);
        services.AddSingleton(sp => new NodeSsrSidecar(options, sp.GetService<ILogger<NodeSsrSidecar>>()));
        services.TryAddSingleton<ISsrRenderer>(sp => sp.GetRequiredService<NodeSsrSidecar>());
        services.AddHostedService(sp => sp.GetRequiredService<NodeSsrSidecar>());
        services.AddLaughTalePlugin(new SsrSidecarPlugin());
        return services;
    }
}

using System;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace LaughTale.Core.Configuration;

/// <summary>
/// LaughTale: Typed Config (ROADMAP.v5.md Part F "Typed config &amp; sessions" - the config half; see
/// this class's own doc comment on <see cref="AddLaughTaleTypedConfig{TConfig}"/> for the honest scope
/// cut on "sessions" and "compile time"). Binds and validates an app's own config class from
/// <see cref="IConfiguration"/>, and computes the <see cref="ClientExposedAttribute"/>-only subset
/// once at startup for <see cref="TypedConfigAmbientStateMiddleware"/> to dehydrate into the Ambient
/// State Pool on every request.
/// </summary>
public static class TypedConfigExtensions
{
    /// <summary>
    /// Binds <typeparamref name="TConfig"/> from <paramref name="section"/>, validates it via
    /// DataAnnotations, and fails fast at host startup (<c>ValidateOnStart</c>) rather than on first
    /// use - a misconfigured deployment should crash immediately, not on the first request that
    /// happens to touch the bad value. Not literally compile-time (that would need a Roslyn source
    /// generator LaughTale doesn't have) - "validated" here means "the app refuses to start with an
    /// invalid config", the practical property Astro env/Nuxt runtimeConfig give you.
    ///
    /// Every property NOT marked <see cref="ClientExposedAttribute"/> is server-only by construction:
    /// <see cref="IOptions{TConfig}"/> resolves the full typed object for server code, but only the
    /// <c>[ClientExposed]</c> subset - reflected ONCE here, not per-request, since config values don't
    /// change per-request - ever reaches <see cref="TypedConfigAmbientStateMiddleware"/> and from
    /// there the browser.
    /// </summary>
    public static IServiceCollection AddLaughTaleTypedConfig<TConfig>(
        this IServiceCollection services,
        IConfiguration section)
        where TConfig : class
    {
        services.AddOptions<TConfig>()
            .Bind(section)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton(sp =>
        {
            var config = sp.GetRequiredService<IOptions<TConfig>>().Value;
            return BuildClientExposedProjection(config);
        });

        return services;
    }

    private static ClientExposedConfigProjection BuildClientExposedProjection<TConfig>(TConfig config)
        where TConfig : class
    {
        var values = new Dictionary<string, object?>(StringComparer.Ordinal);
        foreach (var property in typeof(TConfig).GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            if (property.GetCustomAttribute<ClientExposedAttribute>() is null)
            {
                continue;
            }

            var key = char.ToLowerInvariant(property.Name[0]) + property.Name[1..];
            values[key] = property.GetValue(config);
        }

        return new ClientExposedConfigProjection(values);
    }
}

/// <summary>
/// The pre-computed, request-independent <c>[ClientExposed]</c> projection of one typed config class.
/// Registered once per <see cref="TypedConfigExtensions.AddLaughTaleTypedConfig{TConfig}"/> call -
/// resolved as <c>IEnumerable&lt;ClientExposedConfigProjection&gt;</c> by
/// <see cref="TypedConfigAmbientStateMiddleware"/> so multiple typed config classes can coexist.
/// </summary>
public sealed record ClientExposedConfigProjection(IReadOnlyDictionary<string, object?> Values);

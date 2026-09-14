using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Extensions;
using LaughTale.Components.Localization;

namespace LaughTale.Components.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds LaughTale Batteries-Included Enterprise Components to DI, including seeding all 10
    /// built-in locale packs into LaughTale.Core's generic localization mechanism.
    /// </summary>
    public static IServiceCollection AddLaughTaleComponents(this IServiceCollection services)
    {
        // LaughTaleOptions is a directly-constructed singleton (not the standard IOptions<T>
        // Configure() pipeline), so it must be mutated via the shared EnsureLaughTaleOptions()
        // instance to take effect - this works regardless of whether AddLaughTale() or
        // AddLaughTaleComponents() is called first.
        var options = services.EnsureLaughTaleOptions();
        foreach (var (culture, factory) in LaughTaleBuiltInLocales.Locales)
        {
            var flattened = factory().ToDictionary();
            options.Localization.AddBuiltInLocale(culture, dict =>
            {
                foreach (var kv in flattened)
                {
                    dict[kv.Key] = kv.Value;
                }
            });
        }

        return services;
    }
}

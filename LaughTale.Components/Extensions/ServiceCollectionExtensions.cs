using Microsoft.Extensions.DependencyInjection;

namespace LaughTale.Components.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds LaughTale Batteries-Included Enterprise Components to DI.
    /// </summary>
    public static IServiceCollection AddLaughTaleComponents(this IServiceCollection services)
    {
        return services;
    }
}

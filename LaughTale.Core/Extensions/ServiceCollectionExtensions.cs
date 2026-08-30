using Microsoft.Extensions.DependencyInjection;

namespace LaughTale.Core.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers LaughTale services and configuration into the DI container.
    /// </summary>
    public static IServiceCollection AddIslands(this IServiceCollection services)
    {
        // Core island services registration
        return services;
    }
}

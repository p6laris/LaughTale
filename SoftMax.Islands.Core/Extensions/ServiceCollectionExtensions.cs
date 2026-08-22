using Microsoft.Extensions.DependencyInjection;

namespace SoftMax.Islands.Core.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers SoftMax.Islands services and configuration into the DI container.
    /// </summary>
    public static IServiceCollection AddIslands(this IServiceCollection services)
    {
        // Core island services registration
        return services;
    }
}

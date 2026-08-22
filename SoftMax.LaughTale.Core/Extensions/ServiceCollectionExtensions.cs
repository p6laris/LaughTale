using Microsoft.Extensions.DependencyInjection;

namespace SoftMax.LaughTale.Core.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers SoftMax.LaughTale services and configuration into the DI container.
    /// </summary>
    public static IServiceCollection AddIslands(this IServiceCollection services)
    {
        // Core island services registration
        return services;
    }
}

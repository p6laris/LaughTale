using Microsoft.Extensions.DependencyInjection;

namespace SoftMax.LaughTale.Components.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds SoftMax.LaughTale Batteries-Included Enterprise Components to DI.
    /// </summary>
    public static IServiceCollection AddLaughTaleComponents(this IServiceCollection services)
    {
        return services;
    }
}

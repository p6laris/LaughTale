using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace LaughTale.Core.Assets;

public static class AssetIntegrityServiceExtensions
{
    /// <summary>
    /// Registers <see cref="IAssetIntegrityService"/>, enabling the <c>lt-integrity</c> attribute
    /// (<c>AssetIntegrityTagHelper</c>) on <c>&lt;script&gt;</c>/<c>&lt;link&gt;</c> tags.
    /// </summary>
    public static IServiceCollection AddLaughTaleAssetIntegrity(this IServiceCollection services)
    {
        services.TryAddSingleton<IAssetIntegrityService, AssetIntegrityService>();
        return services;
    }
}

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace LaughTale.Core.Assets;

public static class ImageDimensionServiceExtensions
{
    /// <summary>
    /// Registers <see cref="IImageDimensionService"/>, enabling the <c>lt-optimize</c> attribute
    /// (<c>LaughTale.Core.TagHelpers.ImageOptimizationTagHelper</c>) on <c>&lt;img&gt;</c> tags.
    /// </summary>
    public static IServiceCollection AddLaughTaleImageOptimization(this IServiceCollection services)
    {
        services.TryAddSingleton<IImageDimensionService, ImageDimensionService>();
        return services;
    }
}

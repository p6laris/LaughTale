using Microsoft.Extensions.DependencyInjection;

namespace SoftMax.LaughTale.Markdown.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds SoftMax.LaughTale Markdown and Content Collection capabilities to DI.
    /// </summary>
    public static IServiceCollection AddLaughTaleMarkdown(this IServiceCollection services)
    {
        return services;
    }
}

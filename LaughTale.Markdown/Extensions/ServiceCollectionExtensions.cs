using Microsoft.Extensions.DependencyInjection;

namespace LaughTale.Markdown.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds LaughTale Markdown and Content Collection capabilities to DI.
    /// </summary>
    public static IServiceCollection AddLaughTaleMarkdown(this IServiceCollection services)
    {
        return services;
    }
}

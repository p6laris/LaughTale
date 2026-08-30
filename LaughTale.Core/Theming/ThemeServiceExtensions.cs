using Microsoft.Extensions.DependencyInjection;

namespace LaughTale.Core.Theming;

/// <summary>
/// Extension methods for configuring server-side theming in LaughTale.
/// </summary>
public static class ThemeServiceExtensions
{
    /// <summary>
    /// Registers LaughTale theme options for server-side SSR critical rendering.
    /// </summary>
    public static IServiceCollection AddLaughTaleTheme(this IServiceCollection services, Action<LaughTaleThemeOptions>? configure = null)
    {
        var options = new LaughTaleThemeOptions();
        configure?.Invoke(options);
        services.AddSingleton(options);
        return services;
    }
}

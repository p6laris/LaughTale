using System;

namespace SoftMax.LaughTale.Core.Diagnostics;

/// <summary>
/// Provides runtime environment detection and test overrides for LaughTale diagnostics.
/// </summary>
public static class LaughTaleEnvironment
{
    private static bool? _isDevelopmentOverride;

    /// <summary>
    /// Gets whether the current environment is Development.
    /// Checked against ASPNETCORE_ENVIRONMENT or DOTNET_ENVIRONMENT unless overridden in tests.
    /// </summary>
    public static bool IsDevelopment
    {
        get
        {
            if (_isDevelopmentOverride.HasValue)
            {
                return _isDevelopmentOverride.Value;
            }

            var aspnet = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (!string.IsNullOrEmpty(aspnet))
            {
                return string.Equals(aspnet, "Development", StringComparison.OrdinalIgnoreCase);
            }

            var dotnet = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT");
            return string.Equals(dotnet, "Development", StringComparison.OrdinalIgnoreCase);
        }
    }

    /// <summary>
    /// Sets an explicit override for unit testing environment branches.
    /// </summary>
    public static void SetDevelopment(bool? isDevelopment)
    {
        _isDevelopmentOverride = isDevelopment;
    }
}

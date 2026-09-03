using System;
using LaughTale.Core.Localization;

namespace LaughTale.Core.Configuration;

/// <summary>
/// Root configuration options for LaughTale Islands Architecture ( / §2.5).
/// Every non-essential feature defaults to disabled for maximum modularity and performance.
/// </summary>
public sealed class LaughTaleOptions
{
    /// <summary>
    /// View Transitions client-side routing options. Defaults to false.
    /// </summary>
    public ViewTransitionsOptions ViewTransitions { get; set; } = new();

    /// <summary>
    /// Smart viewport and hover link prefetching options. Defaults to false.
    /// </summary>
    public PrefetchOptions Prefetch { get; set; } = new();

    /// <summary>
    /// Content Security Policy (CSP) nonce injection and validation options. Defaults to false.
    /// </summary>
    public CspOptions Csp { get; set; } = new();

    /// <summary>
    /// Interactive Theme Studio and live customization options. Defaults to false.
    /// </summary>
    public ThemeStudioOptions ThemeStudio { get; set; } = new();

    /// <summary>
    /// Output caching and personal data protection options. Defaults to active safety.
    /// </summary>
    public CachingOptions Caching { get; set; } = new();

    /// <summary>
    /// Internationalization (i18n), culture resolution, and ASP.NET Core IStringLocalizer options.
    /// </summary>
    public LaughTaleLocalizationOptions Localization { get; set; } = new();

    /// <summary>
    /// Self-hosted SVG icon sprite and Lucide integration options.
    /// </summary>
    public IconOptions Icons { get; set; } = new();

    /// <summary>
    /// Server-driven island refresh, antiforgery, and authorization options (LT-2203).
    /// </summary>
    public IslandRefreshOptions Refresh { get; set; } = new();
}

/// <summary>
/// Server-driven island refresh, antiforgery, and authorization policy configuration.
/// </summary>
public sealed class IslandRefreshOptions
{
    /// <summary>
    /// Gets or sets whether CSRF antiforgery tokens must be validated on refresh POST requests. Default: true.
    /// </summary>
    public bool RequireAntiforgery { get; set; } = true;

    /// <summary>
    /// Gets or sets whether undeclared islands are allowed to render and refresh without authorization.
    /// Default: false (deny-by-default). When true, a one-time warning is logged for each undeclared island.
    /// </summary>
    public bool AllowUndeclaredIslands { get; set; } = false;

    /// <summary>
    /// Islands explicitly declared public (anonymous access allowed).
    /// </summary>
    public HashSet<string> AnonymousIslands { get; } = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Per-island policy requirements (islandName -> policyName).
    /// </summary>
    public Dictionary<string, string> IslandPolicies { get; } = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Registers an island as explicitly public (anonymous access allowed).
    /// </summary>
    public IslandRefreshOptions AllowAnonymous(string islandName)
    {
        if (!string.IsNullOrWhiteSpace(islandName))
        {
            AnonymousIslands.Add(islandName);
        }
        return this;
    }

    /// <summary>
    /// Registers a required authorization policy for a given island.
    /// </summary>
    public IslandRefreshOptions RequirePolicy(string islandName, string policyName)
    {
        if (!string.IsNullOrWhiteSpace(islandName) && !string.IsNullOrWhiteSpace(policyName))
        {
            IslandPolicies[islandName] = policyName;
        }
        return this;
    }
}

/// <summary>
/// Self-hosted icon sprite and Lucide rendering configuration.
/// </summary>
public sealed class IconOptions
{
    /// <summary>
    /// Path or URL prefix for the self-hosted SVG sprite. Default: "/_lt/icons.svg".
    /// </summary>
    public string SpritePath { get; set; } = "/_lt/icons.svg";

    /// <summary>
    /// Default CSS class applied to rendered SVG icon elements. Default: "lt-icon".
    /// </summary>
    public string DefaultClass { get; set; } = "lt-icon";

    /// <summary>
    /// Default dimension in pixels for icon elements. Default: 16.
    /// </summary>
    public int DefaultSize { get; set; } = 16;

    /// <summary>
    /// Default stroke-width for icons. Default: 2.
    /// </summary>
    public double DefaultStrokeWidth { get; set; } = 2.0;
}

/// <summary>
/// View Transitions client-side routing configuration.
/// </summary>
public sealed class ViewTransitionsOptions
{
    /// <summary>
    /// Gets or sets whether View Transitions single-page navigation is enabled. Default: false.
    /// </summary>
    public bool Enabled { get; set; } = false;

    /// <summary>
    /// Fallback strategy for browsers lacking document.startViewTransition support ('swap' | 'none').
    /// </summary>
    public string FallbackMode { get; set; } = "swap";
}

/// <summary>
/// Smart prefetching configuration.
/// </summary>
public sealed class PrefetchOptions
{
    /// <summary>
    /// Gets or sets whether link prefetching on hover and viewport visibility is enabled. Default: false.
    /// </summary>
    public bool Enabled { get; set; } = false;

    /// <summary>
    /// Delay in milliseconds before prefetching a hovered link. Default: 65 ms.
    /// </summary>
    public int HoverDelayMs { get; set; } = 65;

    /// <summary>
    /// Whether to respect user Save-Data headers and disable prefetching. Default: true.
    /// </summary>
    public bool RespectDataSaver { get; set; } = true;
}

/// <summary>
/// Content Security Policy options.
/// </summary>
public sealed class CspOptions
{
    /// <summary>
    /// Gets or sets whether CSP nonce generation and style/script injection is active. Default: false.
    /// </summary>
    public bool Enabled { get; set; } = false;

    /// <summary>
    /// Automatically generates and attaches a cryptographic nonce per HTTP request. Default: true.
    /// </summary>
    public bool AutoGenerateNonce { get; set; } = true;
}

/// <summary>
/// Theme Studio live visual customization options.
/// </summary>
public sealed class ThemeStudioOptions
{
    /// <summary>
    /// Gets or sets whether the Theme Studio customizer is active. Default: false.
    /// </summary>
    public bool Enabled { get; set; } = false;

    /// <summary>
    /// Route prefix for Theme Studio endpoints. Default: "/_laughtale/studio".
    /// </summary>
    public string Route { get; set; } = "/_laughtale/studio";
}

/// <summary>
/// Output caching and personal data leak protection options.
/// </summary>
public sealed class CachingOptions
{
    /// <summary>
    /// Automatically prevents public caching of pages carrying user-specific / authenticated island props. Default: true.
    /// </summary>
    public bool EnforcePrivateOnUserProps { get; set; } = true;
}

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

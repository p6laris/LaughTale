namespace LaughTale.Core.Theming;

/// <summary>
/// Preset color palettes supported by LaughTale.
/// </summary>
public enum LaughTalePalette
{
    Emerald,
    Blue,
    Violet,
    Amber,
    Rose,
    Cyan,
    Slate,
    Zinc,
    Custom
}

/// <summary>
/// Preset surface neutral palettes.
/// </summary>
public enum LaughTaleSurface
{
    Slate,
    Zinc,
    Neutral,
    Stone,
    Gray
}

/// <summary>
/// Border radius presets.
/// </summary>
public enum LaughTaleRadius
{
    None,
    Sm,
    Md,
    Lg,
    Xl,
    Full
}

/// <summary>
/// Theme mode presets.
/// </summary>
public enum LaughTaleDarkMode
{
    Auto,
    Light,
    Dark
}

/// <summary>
/// Configuration options for server-rendered theme variables and SSR critical styling.
/// </summary>
public sealed class LaughTaleThemeOptions
{
    /// <summary>
    /// Gets or sets the primary palette.
    /// </summary>
    public LaughTalePalette Primary { get; set; } = LaughTalePalette.Emerald;

    /// <summary>
    /// Gets or sets a custom primary color hex (e.g. "#6366f1") when Primary is set to Custom.
    /// </summary>
    public string? CustomPrimaryHex { get; set; }

    /// <summary>
    /// Gets or sets the neutral surface palette.
    /// </summary>
    public LaughTaleSurface Surface { get; set; } = LaughTaleSurface.Slate;

    /// <summary>
    /// Gets or sets the base border radius preset.
    /// </summary>
    public LaughTaleRadius Radius { get; set; } = LaughTaleRadius.Md;

    /// <summary>
    /// Gets or sets the SSR theme color mode.
    /// </summary>
    public LaughTaleDarkMode DarkMode { get; set; } = LaughTaleDarkMode.Auto;

    /// <summary>
    /// Gets or sets whether to parse the client 'lt-theme' cookie during SSR rendering. Default is true.
    /// </summary>
    public bool EnableCookieThemeSync { get; set; } = true;

    /// <summary>
    /// Resolves the effective CSS radius value.
    /// </summary>
    public static string GetRadiusCss(LaughTaleRadius radius) => radius switch
    {
        LaughTaleRadius.None => "0px",
        LaughTaleRadius.Sm => "0.375rem",
        LaughTaleRadius.Md => "0.5rem",
        LaughTaleRadius.Lg => "0.75rem",
        LaughTaleRadius.Xl => "1rem",
        LaughTaleRadius.Full => "9999px",
        _ => "0.5rem"
    };

    /// <summary>
    /// Resolves the primary palette name or custom hex string.
    /// </summary>
    public string GetPrimaryValue() => Primary == LaughTalePalette.Custom && !string.IsNullOrWhiteSpace(CustomPrimaryHex)
        ? CustomPrimaryHex
        : Primary.ToString().ToLowerInvariant();

    /// <summary>
    /// Resolves the surface palette name string.
    /// </summary>
    public string GetSurfaceValue() => Surface.ToString().ToLowerInvariant();
}

namespace LaughTale.Core.Assets;

/// <summary>
/// LaughTale: Image Optimization (ROADMAP.v5.md Part H). Resolves a local static image's real pixel
/// dimensions from wwwroot, the same "read straight from the file already sitting there, no separate
/// build-time manifest" shape <see cref="IAssetIntegrityService"/> already established for SRI hashes.
/// </summary>
public interface IImageDimensionService
{
    /// <summary>
    /// Returns the real pixel (width, height) of the image at <paramref name="relativePath"/> (rooted
    /// at wwwroot, e.g. <c>"images/hero.png"</c> or <c>"/images/hero.png"</c> - a leading slash is
    /// tolerated), or <see langword="null"/> if the file doesn't exist or isn't a format
    /// <see cref="ImageDimensionReader"/> understands (PNG/GIF/JPEG only - see its own doc comment).
    /// Computed once per process and cached, since a static file's content doesn't change without a
    /// redeploy/restart.
    /// </summary>
    (int Width, int Height)? GetDimensions(string relativePath);
}

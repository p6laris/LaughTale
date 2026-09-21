namespace LaughTale.Core.Assets;

/// <summary>
/// LaughTale: Asset Pipeline (ROADMAP.v5.md Part B). Computes Subresource Integrity hashes for static
/// assets already sitting under wwwroot - no separate build-time manifest step, since the file exists
/// on disk by the time a page renders a reference to it.
/// </summary>
public interface IAssetIntegrityService
{
    /// <summary>
    /// Returns a <c>sha384-BASE64</c> integrity hash for the static file at <paramref name="relativePath"/>
    /// (rooted at wwwroot, e.g. <c>"js/main.js"</c> or <c>"/js/main.js"</c> - a leading slash is
    /// tolerated), or <see langword="null"/> if no such file exists. Hashes are computed once per
    /// process and cached, since a static file's content doesn't change without a redeploy/restart.
    /// </summary>
    string? GetIntegrityHash(string relativePath);
}

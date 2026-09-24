using System.Threading;
using System.Threading.Tasks;

namespace LaughTale.Core.Ssr;

/// <summary>
/// Renders an island's framework component to HTML out-of-process. Implementations must be
/// fail-open: <see cref="RenderAsync"/> never throws for renderer-side problems, it returns a failed
/// <see cref="SsrRenderResult"/> instead.
/// </summary>
public interface ISsrRenderer
{
    /// <summary>True once the renderer has completed its startup handshake and can accept renders.</summary>
    bool IsReady { get; }

    /// <summary>True when the renderer is ready and knows a component registered under <paramref name="islandName"/>.</summary>
    bool CanRender(string islandName);

    /// <summary>
    /// Renders <paramref name="islandName"/> with <paramref name="propsJson"/> (a JSON value, or null).
    /// Enforces the configured render timeout itself.
    /// </summary>
    Task<SsrRenderResult> RenderAsync(string islandName, string? propsJson, CancellationToken cancellationToken = default);
}

/// <summary>Why an SSR render did not produce HTML.</summary>
public enum SsrRenderFailure
{
    None = 0,
    NotReady,
    UnknownIsland,
    InvalidProps,
    Timeout,
    Canceled,
    RenderError,
    ProcessExited,
    WriteFailed
}

/// <summary>Outcome of <see cref="ISsrRenderer.RenderAsync"/>.</summary>
public sealed record SsrRenderResult
{
    public bool Success => Failure == SsrRenderFailure.None;

    /// <summary>The rendered markup when <see cref="Success"/>.</summary>
    public string? Html { get; init; }

    public SsrRenderFailure Failure { get; init; }

    /// <summary>Error detail from the renderer, when available.</summary>
    public string? Error { get; init; }

    public static SsrRenderResult Ok(string html) => new() { Html = html };

    public static SsrRenderResult Fail(SsrRenderFailure failure, string? error = null) =>
        new() { Failure = failure, Error = error };
}

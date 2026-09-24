using System;

namespace LaughTale.Core.Ssr;

/// <summary>
/// Configuration for the Node SSR sidecar (<see cref="NodeSsrSidecar"/>). Bindable from the
/// <c>LaughTale:Ssr</c> configuration section via
/// <see cref="SsrSidecarServiceCollectionExtensions.AddLaughTaleSsrSidecar(Microsoft.Extensions.DependencyInjection.IServiceCollection, Microsoft.Extensions.Configuration.IConfiguration, Action{SsrSidecarOptions}?)"/>.
/// </summary>
public sealed class SsrSidecarOptions
{
    /// <summary>The configuration section the IConfiguration overload binds from.</summary>
    public const string SectionName = "LaughTale:Ssr";

    /// <summary>Opt-in switch. When false, nothing is registered and no process is ever spawned.</summary>
    public bool Enabled { get; set; }

    /// <summary>The Node executable (resolved through PATH when not rooted). Default "node".</summary>
    public string NodePath { get; set; } = "node";

    /// <summary>
    /// The server bundle the child runs as <c>node &lt;path&gt;</c>. Required when <see cref="Enabled"/>.
    /// Relative paths resolve against <see cref="WorkingDirectory"/> (or the current directory).
    /// </summary>
    public string? ServerBundlePath { get; set; }

    /// <summary>Working directory for the child process. Defaults to the current directory.</summary>
    public string? WorkingDirectory { get; set; }

    /// <summary>Per-island render budget. On expiry the island renders exactly as it would without SSR.</summary>
    public TimeSpan RenderTimeout { get; set; } = TimeSpan.FromMilliseconds(500);

    /// <summary>How long a freshly spawned child has to send its <c>ready</c> message before it is killed and restarted.</summary>
    public TimeSpan StartupTimeout { get; set; } = TimeSpan.FromSeconds(10);

    /// <summary>Delay before the first restart after a crash or failed spawn.</summary>
    public TimeSpan RestartBackoffInitial { get; set; } = TimeSpan.FromMilliseconds(500);

    /// <summary>Upper bound for the exponentially growing restart delay.</summary>
    public TimeSpan RestartBackoffMax { get; set; } = TimeSpan.FromSeconds(30);

    /// <summary>A child that stayed ready at least this long resets the restart delay to <see cref="RestartBackoffInitial"/>.</summary>
    public TimeSpan RestartBackoffResetAfter { get; set; } = TimeSpan.FromSeconds(30);

    /// <summary>How long the child gets to exit after its stdin is closed on shutdown before its process tree is killed.</summary>
    public TimeSpan ShutdownGracePeriod { get; set; } = TimeSpan.FromSeconds(2);
}

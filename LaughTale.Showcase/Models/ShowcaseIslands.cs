using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace LaughTale.Showcase.Models;

/// <summary>
/// Interactive numeric stepper island props.
/// </summary>
[IslandAllowAnonymous]
[Island("interactive-counter", DefaultStrategy = HydrateStrategy.Load)]
public record CounterProps(
    int InitialCount,
    int Step,
    string Label
);

/// <summary>
/// Drag & Drop enterprise document uploader props.
/// </summary>
[IslandAllowAnonymous]
[Island("file-dropzone", DefaultStrategy = HydrateStrategy.Visible)]
public record DropzoneProps(
    string TargetInputName,
    string AllowedExtensions,
    int MaxSizeMb,
    string DropPrompt
);

/// <summary>
/// Hierarchical organizational department tree props.
/// </summary>
[IslandAllowAnonymous]
[Island("cascade-tree", DefaultStrategy = HydrateStrategy.Visible)]
public record DepartmentTreeProps(
    string Placeholder,
    string TargetInputName,
    List<DepartmentNode> Departments
);

public record DepartmentNode(
    string Id,
    string Name,
    List<DepartmentNode>? Children = null
);

/// <summary>
/// Inter-island event bus broadcaster props.
/// </summary>
[IslandAllowAnonymous]
[Island("event-broadcaster", DefaultStrategy = HydrateStrategy.Interaction)]
public record EventBroadcasterProps(
    string ChannelName,
    string ButtonLabel
);

/// <summary>
/// Inter-island event bus receiver props.
/// </summary>
[IslandAllowAnonymous]
[Island("event-receiver", DefaultStrategy = HydrateStrategy.Idle)]
public record EventReceiverProps(
    string ChannelName,
    string InitialMessage
);

/// <summary>
/// Enterprise security modal dialog with server slot projection.
/// </summary>
[IslandAllowAnonymous]
[Island("modal-dialog", DefaultStrategy = HydrateStrategy.Interaction)]
public record SecurityModalProps(
    string TriggerButtonText,
    string DialogTitle
);

/// <summary>
/// Persistent system telemetry widget across View Transitions.
/// </summary>
[IslandAllowAnonymous]
[Island("persistent-telemetry", DefaultStrategy = HydrateStrategy.Load)]
public record SystemTelemetryProps(
    string MetricName,
    int RefreshIntervalSeconds
);

/// <summary>
/// ROADMAP.v5.md Part F "Ambient state pool" live demo island - two independent instances on the same
/// page both read/write the same `ctx.state('visitCount')` store, seeded from the server via
/// <c>HttpContext.SetAmbientState</c>, to prove the server's initial value survives into the client
/// AND that both instances share one reactive store (Nuxt <c>useState</c>-equivalent).
/// </summary>
[IslandAllowAnonymous]
[Island("ambient-counter", DefaultStrategy = HydrateStrategy.Load)]
public record AmbientCounterProps(
    string Label
);

/// <summary>
/// ROADMAP.v5.md Part D "New adapters" live demo - a real Custom Element (no Lit, no framework)
/// mounted through <c>createWebComponentIsland</c>.
/// </summary>
[IslandAllowAnonymous]
[Island("polyglot-web-component", DefaultStrategy = HydrateStrategy.Load)]
public record PolyglotWebComponentProps(
    string Label,
    int InitialCount
);

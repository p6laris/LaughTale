using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace LaughTale.Showcase.Models;

/// <summary>
/// Interactive numeric stepper island props.
/// </summary>
[Island("interactive-counter", DefaultStrategy = HydrateStrategy.Load)]
public record CounterProps(
    int InitialCount,
    int Step,
    string Label
);

/// <summary>
/// Drag & Drop enterprise document uploader props.
/// </summary>
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
[Island("event-broadcaster", DefaultStrategy = HydrateStrategy.Interaction)]
public record EventBroadcasterProps(
    string ChannelName,
    string ButtonLabel
);

/// <summary>
/// Inter-island event bus receiver props.
/// </summary>
[Island("event-receiver", DefaultStrategy = HydrateStrategy.Idle)]
public record EventReceiverProps(
    string ChannelName,
    string InitialMessage
);

/// <summary>
/// Enterprise security modal dialog with server slot projection.
/// </summary>
[Island("modal-dialog", DefaultStrategy = HydrateStrategy.Interaction)]
public record SecurityModalProps(
    string TriggerButtonText,
    string DialogTitle
);

/// <summary>
/// Persistent system telemetry widget across View Transitions.
/// </summary>
[Island("persistent-telemetry", DefaultStrategy = HydrateStrategy.Load)]
public record SystemTelemetryProps(
    string MetricName,
    int RefreshIntervalSeconds
);

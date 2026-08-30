using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace LaughTale.Docs.Models;

/// <summary>
/// Frontmatter metadata schema for documentation articles.
/// </summary>
public record DocFrontmatter
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; } = 0;
    public string Section { get; set; } = "General";
}

[Island("interactive-counter", DefaultStrategy = HydrateStrategy.Load)]
public record CounterProps(int InitialCount, int Step, string Label);

[Island("event-broadcaster", DefaultStrategy = HydrateStrategy.Interaction)]
public record EventBroadcasterProps(string ChannelName, string ButtonLabel);

[Island("event-receiver", DefaultStrategy = HydrateStrategy.Idle)]
public record EventReceiverProps(string ChannelName, string InitialMessage);

[Island("modal-dialog", DefaultStrategy = HydrateStrategy.Interaction)]
public record SecurityModalProps(string TriggerButtonText, string DialogTitle);

[Island("persistent-telemetry", DefaultStrategy = HydrateStrategy.Load)]
public record SystemTelemetryProps(string MetricName, int RefreshIntervalSeconds);

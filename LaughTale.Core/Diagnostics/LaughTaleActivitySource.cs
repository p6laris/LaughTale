using System.Diagnostics;

namespace LaughTale.Core.Diagnostics;

/// <summary>
/// LaughTale: Instrumentation Hook (ROADMAP.v5.md Part H "instrumentation hook exporting island
/// render/hydration timings as OpenTelemetry spans"). The one <see cref="ActivitySource"/> every
/// island render (and, via <c>IslandTelemetryEndpointExtensions</c>, every reported client hydration)
/// creates a span on.
///
/// <see cref="System.Diagnostics.ActivitySource"/>/<see cref="Activity"/> IS the OpenTelemetry .NET
/// API surface - no external OpenTelemetry SDK package reference is needed in this project for that
/// reason. An app that wants real, exportable spans adds the standard `OpenTelemetry` NuGet package to
/// ITS OWN project and calls `.AddSource(LaughTaleActivitySource.Name)` on its own
/// `TracerProviderBuilder` (the same opt-in shape every other ActivitySource-based library, including
/// ASP.NET Core's own internal ones, already uses) - LaughTale.Core stays free of any OpenTelemetry
/// package dependency itself.
///
/// Genuinely zero-cost when unused: <see cref="ActivitySource.StartActivity(string, ActivityKind)"/>
/// returns <see langword="null"/> when nothing is listening (no `AddSource` call anywhere), and every
/// call site here uses the null-conditional operator on the result - no allocation, no tag-string
/// work, happens unless an app actually opted in.
/// </summary>
public static class LaughTaleActivitySource
{
    public const string Name = "LaughTale.Islands";

    public static readonly ActivitySource Source = new(Name);
}

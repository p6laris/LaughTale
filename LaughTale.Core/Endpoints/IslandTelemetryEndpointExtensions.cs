using System;
using System.Diagnostics;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using LaughTale.Core.Diagnostics;

namespace LaughTale.Core.Endpoints;

/// <summary>
/// LaughTale: Instrumentation Hook (ROADMAP.v5.md Part H). Closes the loop between
/// <see cref="LaughTaleActivitySource"/>'s server-side island render spans and the browser's own
/// hydration timing (already computed client-side via <c>performance.mark</c>/<c>measure</c> in
/// <c>hydrator.ts</c> and carried on the <c>laughtale:diagnostic</c> DOM event) - a client that opts
/// in (via <c>runtime/telemetry.ts</c>'s <c>wireLaughTaleTelemetryReporting</c>, not wired by default)
/// beacons that duration here, and it becomes a real span under the SAME ActivitySource, so one
/// OpenTelemetry backend shows both halves of one island's lifecycle.
/// </summary>
public static class IslandTelemetryEndpointExtensions
{
    private sealed record HydrationTelemetryPayload(string Name, double DurationMs, string? Strategy);

    private sealed record WebVitalPayload(string Name, double Value);

    private static readonly string[] KnownWebVitalNames = ["LCP", "CLS", "INP"];

    /// <summary>
    /// Maps a POST endpoint accepting a small <c>{ name, durationMs, strategy }</c> JSON body
    /// (matching <c>navigator.sendBeacon</c>'s fire-and-forget shape - no antiforgery token is
    /// expected or required, since this endpoint never mutates anything and a beacon call can't
    /// reliably attach one anyway) and turns it into an <c>island.hydrate</c>
    /// <see cref="Activity"/>, start-time-approximated backward from now by the reported duration.
    /// Deliberately tolerant of a malformed/oversized body - a telemetry beacon failing silently is
    /// correct behavior; it must never surface as a user-visible error.
    /// </summary>
    public static IEndpointRouteBuilder MapLaughTaleIslandTelemetry(
        this IEndpointRouteBuilder endpoints,
        string pattern = "/_laughtale/telemetry/hydration")
    {
        ArgumentNullException.ThrowIfNull(endpoints);
        ArgumentNullException.ThrowIfNull(pattern);

        endpoints.MapPost(pattern, async (HttpContext context) =>
        {
            HydrationTelemetryPayload? payload;
            try
            {
                payload = await JsonSerializer.DeserializeAsync<HydrationTelemetryPayload>(
                    context.Request.Body,
                    new JsonSerializerOptions(JsonSerializerDefaults.Web),
                    context.RequestAborted);
            }
            catch (JsonException)
            {
                return Results.NoContent();
            }

            if (payload is null || string.IsNullOrWhiteSpace(payload.Name) || payload.DurationMs < 0)
            {
                return Results.NoContent();
            }

            var durationMs = Math.Min(payload.DurationMs, 300_000); // clamp against a bogus/hostile huge value
            var now = DateTimeOffset.UtcNow;
            using var activity = LaughTaleActivitySource.Source.StartActivity(
                "island.hydrate", ActivityKind.Client, parentContext: default,
                startTime: now - TimeSpan.FromMilliseconds(durationMs));

            activity?.SetTag("island.name", payload.Name);
            activity?.SetTag("island.hydrate.duration_ms", durationMs);
            if (!string.IsNullOrWhiteSpace(payload.Strategy))
            {
                activity?.SetTag("island.hydrate.strategy", payload.Strategy);
            }
            activity?.SetEndTime(now.UtcDateTime);

            return Results.NoContent();
        });

        return endpoints;
    }

    /// <summary>
    /// Maps a POST endpoint accepting a small <c>{ name, value }</c> JSON body (from
    /// <c>web-vitals.ts</c>'s <c>wireLaughTaleWebVitalsReporting</c>) and turns it into a
    /// <c>web-vitals.report</c> <see cref="Activity"/> under the same <see cref="LaughTaleActivitySource"/>
    /// island render/hydrate spans use - one OpenTelemetry backend ends up showing island timing and
    /// page-level Core Web Vitals together. <c>name</c> must be one of <c>LCP</c>/<c>CLS</c>/<c>INP</c>;
    /// anything else is silently dropped rather than polluting a trace with an unrecognized metric
    /// name a client could send.
    /// </summary>
    public static IEndpointRouteBuilder MapLaughTaleWebVitals(
        this IEndpointRouteBuilder endpoints,
        string pattern = "/_laughtale/telemetry/web-vitals")
    {
        ArgumentNullException.ThrowIfNull(endpoints);
        ArgumentNullException.ThrowIfNull(pattern);

        endpoints.MapPost(pattern, async (HttpContext context) =>
        {
            WebVitalPayload? payload;
            try
            {
                payload = await JsonSerializer.DeserializeAsync<WebVitalPayload>(
                    context.Request.Body,
                    new JsonSerializerOptions(JsonSerializerDefaults.Web),
                    context.RequestAborted);
            }
            catch (JsonException)
            {
                return Results.NoContent();
            }

            if (payload is null || Array.IndexOf(KnownWebVitalNames, payload.Name) < 0 || payload.Value < 0)
            {
                return Results.NoContent();
            }

            using var activity = LaughTaleActivitySource.Source.StartActivity("web-vitals.report", ActivityKind.Client);
            activity?.SetTag("web_vitals.metric", payload.Name);
            activity?.SetTag("web_vitals.value", payload.Value);

            return Results.NoContent();
        });

        return endpoints;
    }
}

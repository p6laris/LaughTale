# LaughTale vs. Blazor Server vs. Blazor WASM — a reproducible benchmark

ROADMAP.v5.md Part J: **"Publish honest numbers — a reproducible benchmark against Blazor Server and
WASM: TTFB, TTI, transferred bytes, memory after 50 navigations. Worth more than every adjective in
the README."**

## Methodology

Three deliberately minimal, structurally identical apps — Home / Counter / Weather, same markup shape,
same "Click me" single-increment counter behavior — one LaughTale (Razor Pages + one client island),
one Blazor Server, one Blazor WASM (standalone). All three scaffolded from `dotnet new`'s own default
templates (`blazor -int Server`, `blazorwasm`, `webapp`) with **no artificial slowdowns left in**: the
Blazor template's own `Weather.razor` ships a 500ms `Task.Delay` to demo streaming rendering — removed
from both Blazor apps (see `blazor-server-app/Components/Pages/Weather.razor`'s own comment) since it
would have unfairly inflated that page's numbers against the other two apps, which have no equivalent
delay.

All three apps published (`dotnet publish -c Release`) and run in `ASPNETCORE_ENVIRONMENT=Production`,
measured with a real Playwright/Chromium harness (`harness/run-benchmark.cjs`) — not synthetic
estimates. Each metric, and why it's measured the way it is:

- **TTFB** — `PerformanceNavigationTiming.responseStart` on the initial `/` request.
- **TTI** — NOT a synthetic idle-period heuristic. This harness navigates to `/counter` and repeatedly
  clicks the real "Click me" button until the status text actually changes, measuring total elapsed
  time. This matters: Blazor Server's counter text is server-rendered and visible in the DOM
  immediately, but `@onclick` does nothing until its SignalR circuit finishes connecting - a single
  click can silently race that gap. Retrying and measuring until a click actually registers is the
  honest "time until this page is actually interactive" number, applied identically to all three apps.
- **Transferred bytes** — reported as TWO numbers, not one, because the first draft of this harness
  measured only up to the `load` event and got a real result worth keeping in the record: Blazor
  WASM's own runtime (interpreter, BCL assemblies, ICU data — ~200 additional requests) keeps
  downloading for a further ~1-2 seconds AFTER `load` fires. A `load`-scoped byte count made WASM look
  artificially cheap (`transferredBytesAtLoad` alone). `transferredBytesUntilInteractive` — bytes
  counted continuously from the first navigation through confirmed interactivity (the same click-retry
  loop TTI uses) — is the number that actually answers "what does this app cost to become usable."
- **Memory after 50 navigations** — 50 client-side Home ↔ Counter navigations (all three apps route
  client-side by default; LaughTale's `enableViewTransitions()` was turned on in this benchmark app
  specifically so this metric measures the same thing for all three, not full-page-reload-reset memory
  for LaughTale against real client-routing memory growth for Blazor), then
  `performance.memory.usedJSHeapSize` after a forced GC via CDP.

## Results (mean of 3 runs)

| Metric | LaughTale | Blazor Server | Blazor WASM |
|---|---|---|---|
| TTFB | ~6 ms | ~4 ms | ~7 ms |
| DOMContentLoaded | ~57 ms | ~60 ms | ~106 ms |
| TTI (real click-to-response) | ~113 ms | ~118 ms | **~1,409 ms** |
| Transferred bytes at `load` | 380 KB | 75 KB | 1.7 MB |
| Transferred bytes until interactive | **761 KB** | **150 KB** | **31.2 MB** |
| Memory after 50 navigations | ~10 MB* | ~10 MB* | ~10 MB* |

\* Chromium's `performance.memory.usedJSHeapSize` is deliberately coarsened (bucketed) by the browser
itself for fingerprinting-privacy reasons — all three apps reporting the same rounded value is a real
platform behavior, not a harness bug, and this metric's resolution is too coarse in this environment to
distinguish the three apps' actual memory growth. Recorded honestly as inconclusive rather than
presented as if it were a precise reading.

## Honest caveats — read before quoting these numbers anywhere

- **Blazor WASM was published WITHOUT the `wasm-tools` workload** (not installed in this environment;
  `dotnet publish` printed its own warning: *"Publishing without optimizations... strongly recommend
  using `wasm-tools` workload!"*). Real Blazor WASM production deployments install this workload for
  IL trimming and (optionally) AOT compilation, which measurably shrinks the runtime payload —
  published guidance and community measurements put a real trimmed Blazor WASM "hello world" in the
  1-3 MB range, not 31 MB. **This benchmark's 31.2 MB / ~1.4s TTI numbers for Blazor WASM are a
  worst-case, un-optimized build, not representative of a properly published Blazor WASM app** — stated
  plainly rather than left as an implicit, unfair comparison.
- **LaughTale's own bundle here is not minimal either.** `761 KB` reflects importing
  `LaughTale.Client/src/runtime-core.ts` (the framework's own "lean" entry point) as-is — which
  transitively pulls in this session's newly-added prefetch/telemetry/web-vitals modules alongside
  hydration/routing. A real app that only needs `initIslands`/`defineIsland` pays for more than that
  today. Worth a follow-up: right-sizing `runtime-core.ts` is a real, separate finding from this
  benchmark, not something this pass fixed.
- **Memory after 50 navigations was inconclusive** (see the coarsening note above) — this metric
  needs either a non-Chromium measurement approach or accepting bucketed precision as a permanent
  limitation; not resolved here.
- Single-machine, single-run-set (3 repetitions) results on ordinary dev hardware, not a dedicated
  benchmarking rig — directionally reliable (byte counts are exactly reproducible; timings varied
  ±30-50ms across runs, reported as an average), not laboratory-grade.

## Reproducing this

```bash
# From benchmark/laughtale-app, benchmark/blazor-server-app, benchmark/blazor-wasm-app:
dotnet publish -c Release -o publish
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://localhost:5126 dotnet publish/LaughTaleBenchmarkApp.dll &
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://localhost:5214 dotnet publish/BlazorServerApp.dll &
# Blazor WASM standalone publishes static files, not a runnable server DLL - serve via its own dev host:
cd benchmark/blazor-wasm-app && dotnet run -c Release --no-build --urls http://localhost:5183 &

cd benchmark/harness
NODE_PATH=../../LaughTale.Client/node_modules node run-benchmark.cjs
```

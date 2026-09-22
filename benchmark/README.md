# ROADMAP.v5.md Part J benchmark

Three deliberately minimal, structurally identical apps for a reproducible comparison against Blazor
Server and Blazor WASM. See [`RESULTS.md`](RESULTS.md) for the actual numbers, methodology, and
honest caveats (read those before quoting anything here).

- `laughtale-app/` — Razor Pages + LaughTale.Core, one client island.
- `blazor-server-app/` — `dotnet new blazor -int Server`, default template.
- `blazor-wasm-app/` — `dotnet new blazorwasm`, default template.
- `harness/run-benchmark.cjs` — the Playwright-based measurement script.

Deliberately NOT part of `LaughTale.slnx` — these are standalone comparison apps, not part of the
framework's own build/test/CI surface.

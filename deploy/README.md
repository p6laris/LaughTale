# LaughTale deployment presets

ROADMAP.v5.md Part H "Deployment presets" — three real hosting targets: a container, IIS, and Azure
App Service. What "verified" means for each is stated explicitly below; not all three could be
verified the same way in this environment.

## Container (`Dockerfile`, repo root) — live-verified

A real multi-stage build for `LaughTale.Showcase`, actually built and run against the real Docker
daemon on this machine during this work, not just written and assumed correct. What that run confirmed:

- The full build — Node.js install, `LaughTale.Client`'s own build, the island-discovery pipeline
  (`LaughTale.Showcase.Islands`), and `dotnet publish` — succeeds inside the container.
- The running container serves real pages (`GET /` → 200, real `<title>`).
- The already-shipped asset pipeline (ROADMAP.v5.md Part B/J) works correctly through it: static
  assets came back `Cache-Control: public, max-age=31536000, immutable`, Brotli-compressed
  (`Content-Encoding: br`), and with real `integrity="sha384-..."` attributes on `<script>`/`<link>`
  tags in the served HTML.

**A real, previously-undiscovered bug this surfaced**: `dotnet publish` (which nothing in this repo's
own tooling had ever actually run before this pass — every prior build in this repo's history used
plain `dotnet build`) failed with `NETSDK1152` ("multiple publish output files with the same relative
path") because `LaughTale.Showcase` and `LaughTale.Showcase.Islands` both ship a `package.json`/
`package-lock.json` that collided at the same publish output path. Fixed by excluding both files from
each project's `Content` items — they're npm bookkeeping for the build step, which has already run by
the time `dotnet publish` copies output. See both `.csproj` files' own comments.

Build and run it yourself:
```bash
docker build -t laughtale-showcase .
docker run -p 8080:8080 laughtale-showcase
```

## IIS (`iis/web.config`) — SDK-verified, not live-server-verified

`dotnet publish` already generates a minimal, correct `web.config` for in-process ANCM hosting on its
own — confirmed directly by running a real Windows `dotnet publish` and inspecting the output, not
assumed. `iis/web.config` is that same shape, annotated with the production-relevant settings this
investigation found worth being explicit about (see the file's own comments for `stdoutLogEnabled`,
`requestTimeout`, and why IIS's own compression/static-file modules never actually touch a response
under this handler mapping — a real finding, not boilerplate).

No real Windows IIS server was available in this environment to deploy this to and verify against
live — that's the one gap in this preset's own verification, and it's stated here rather than implied
away. The file is schema-correct (validated as well-formed XML) and follows Microsoft's own documented
ANCM configuration shape, but hasn't been confirmed to actually serve traffic on a real IIS instance.

To use it: publish with `dotnet publish -c Release`, copy `iis/web.config` over the SDK-generated one
in the publish output (or diff them first — they may already match your ANCM version), and point an
IIS site/app pool at the publish folder with the ASP.NET Core Hosting Bundle installed.

## Azure App Service — documented, not deployed

App Service (Linux) can run the same container image built above directly (Web App for Containers), or
the same `dotnet publish` output on the native runtime — no App-Service-specific Dockerfile or
web.config is needed beyond what's already here. What IS App-Service-specific, and worth setting
explicitly:

- **Always On**: enable it for anything other than a free/shared-tier trial — App Service idles a
  site after inactivity by default, which would cold-start every request after a quiet period.
- **Health check path**: point App Service's own health-check probe (Configuration → Health check) at
  `/healthz` — this pass added a real health-check endpoint (`builder.Services.AddHealthChecks()` +
  `app.MapHealthChecks("/healthz")` in `LaughTale.Showcase/Program.cs`), deliberately unauthenticated
  and uncached so an external prober never gets tangled in this app's own auth/output-cache policies.
- **`WEBSITE_RUN_FROM_PACKAGE=1`**: recommended for the native (non-container) deployment path — runs
  the app directly from the uploaded zip package (read-only, faster cold start) instead of extracting
  it to disk first.
- Same DataProtection-key-persistence note as the container preset below applies here too if you scale
  to more than one instance.

## A real, general finding from actually running the container (applies to all three targets)

Running the built image in Production mode (not just building it) surfaced two genuine, standard
ASP.NET-Core-in-a-container warnings worth carrying into whichever target you actually deploy to:

1. **DataProtection keys aren't persisted across container restarts by default** (`Storing keys in a
   directory '/root/.aspnet/DataProtection-Keys' that may not be persisted...`). This invalidates
   antiforgery tokens/cookies for in-flight sessions on every restart/redeploy, and breaks if you ever
   run more than one instance (they wouldn't share a key ring). Mount a persistent volume at that path,
   or configure a real key-ring backend (Azure Blob Storage, Redis, a shared filesystem) via
   `AddDataProtection().PersistKeysTo...()` before this app runs at any real scale.
2. **`UseHttpsRedirection()` can't determine the HTTPS port** when the container itself only serves
   plain HTTP behind a TLS-terminating reverse proxy/load balancer (the normal, recommended topology
   for a container, an App Service instance, or an IIS/ARR front end) — expected and harmless (the app
   keeps serving HTTP correctly), but noisy. If it bothers you, either configure
   `UseForwardedHeaders()` so the app trusts your edge's `X-Forwarded-Proto` header, or drop
   `UseHttpsRedirection()` entirely for container/PaaS deployments where the edge already enforces
   HTTPS — this preset didn't change `Program.cs`'s own choice here, since that's a hosting-topology
   decision for each app to make, not something a deployment preset should silently decide.

# ROADMAP.v5.md Part H "Deployment presets" - container preset for LaughTale.Showcase.
#
# One `COPY . .` for the whole repo, not a fine-grained per-project restore-cache COPY: several npm
# projects here (LaughTale.Showcase.Islands, LaughTale.Docs) depend on LaughTale.Client via a
# `file:../LaughTale.Client` package.json reference, so `npm ci` for ANY of them needs the whole repo
# tree already in place. A partial COPY would either break those installs or have to replicate the
# same full-tree layout anyway - there is no real Docker-layer-caching win available here without
# first restructuring how the npm projects depend on each other, which is out of scope for a
# deployment preset.
#
# LaughTale.Showcase.csproj's own BuildIslandsJs MSBuild target (see its own comment there) already
# runs `npm run build` automatically as part of `dotnet build`/`publish` - so this build stage needs
# Node.js installed alongside the .NET SDK, not a separate Node-only stage feeding pre-built assets
# into a Node-less SDK stage (which would have to fight that target instead of just letting the
# project build the way it always does, in CI and on a dev machine alike).

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Node.js via NodeSource - the .NET SDK image doesn't ship it.
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY . .

# LaughTale.Showcase.csproj's BuildIslandsJs target runs plain `npm run build` (no install step of
# its own), and LaughTale.Generators.targets' island-discovery step runs `npx --no-install` (fails
# loudly rather than silently fetching) - both need each project's own node_modules already
# populated before `dotnet publish` runs. LaughTale.Client itself also needs a real `dist/` build:
# LaughTale.Showcase.Islands' Islands/UserCard.tsx resolves the `laughtale` package specifier
# through node_modules -> the file: symlink -> LaughTale.Client's own package.json `exports`.
RUN npm --prefix LaughTale.Client ci && npm --prefix LaughTale.Client run build \
    && npm --prefix LaughTale.Showcase ci \
    && npm --prefix LaughTale.Showcase.Islands ci

RUN dotnet publish LaughTale.Showcase/LaughTale.Showcase.csproj -c Release -o /app/publish

# Runtime stage - no SDK, no Node.js, just the published app. .NET's own container images default to
# a non-root "app" user and port 8080 since .NET 8; ASPNETCORE_HTTP_PORTS is the modern (.NET 8+)
# equivalent of the older ASPNETCORE_URLS env var for "just listen on this port over plain HTTP" -
# correct for the common case of a container sitting behind a TLS-terminating reverse
# proxy/load balancer (Azure App Service, most container platforms, an IIS ARR front end), which is
# also why this image does not configure HTTPS/a dev cert itself.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LaughTale.Showcase.dll"]

---
title: Production & Optimization
description: Best practices for production deployment, bundle code-splitting, response compression, asset caching, and Docker containerization.
order: 11
icon: zap
category: Framework Architecture
---

# 🚀 Production & Optimization

Deploying a LaughTale application to production is straightforward because it adheres to standard ASP.NET Core conventions. Here is the recommended optimization guide for maximum throughput and minimal bundle footprint.

---

## 📦 1. Client Bundle Code-Splitting

LaughTale uses **ESBuild** with automatic code-splitting. Every island component is compiled as an independent, lazy-loaded chunk:

```javascript
// esbuild.config.mjs
import esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/islands.ts'],
    bundle: true,
    splitting: true,
    format: 'esm',
    minify: true,
    sourcemap: false,
    outdir: 'wwwroot/js',
    target: ['es2022']
});
```

### Result:
- **Core Runtime**: Only **12 KB minified & brotli-compressed**.
- **On-Demand Chunks**: Components like `datatable.js` or `datepicker.js` are only fetched over the network when an island requiring them appears on the page.

---

## ⚡ 2. Response Compression (Brotli & Gzip)

Enable ASP.NET Core response compression in `Program.cs`:

```csharp
using Microsoft.AspNetCore.ResponseCompression;

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
    {
        "image/svg+xml",
        "application/javascript",
        "text/css"
    });
});

var app = builder.Build();
app.UseResponseCompression();
```

---

## 🛡️ 3. Static Asset Caching & Fingerprinting

Leverage aggressive browser caching for static JavaScript and CSS assets while using Razor's `asp-append-version` for instant cache busting:

```html
<link rel="stylesheet" href="/css/site.css" asp-append-version="true" />
<script type="module" src="/js/islands.js" asp-append-version="true"></script>
```

In `Program.cs`, set a 1-year cache duration for fingerprinted assets:

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // 365 Days Cache for static assets
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=31536000,immutable");
    }
});
```

---

## 🐳 4. Production Dockerfile

Here is an optimized multi-stage .NET 10 Dockerfile:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore
COPY ["LaughTale.Showcase/LaughTale.Showcase.csproj", "LaughTale.Showcase/"]
COPY ["LaughTale.Core/LaughTale.Core.csproj", "LaughTale.Core/"]
COPY ["LaughTale.Components/LaughTale.Components.csproj", "LaughTale.Components/"]
RUN dotnet restore "LaughTale.Showcase/LaughTale.Showcase.csproj"

# Copy everything and build release
COPY . .
WORKDIR "/src/LaughTale.Showcase"
RUN dotnet publish "LaughTale.Showcase.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "LaughTale.Showcase.dll"]
```

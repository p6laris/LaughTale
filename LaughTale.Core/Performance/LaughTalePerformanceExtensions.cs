using System;
using System.IO.Compression;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;

namespace LaughTale.Core.Performance
{
    /// <summary>
    /// Performance and caching extensions for LaughTale applications.
    /// </summary>
    public static class LaughTalePerformanceExtensions
    {
        private static readonly string[] DefaultMimeTypes =
        {
            "text/plain",
            "text/css",
            "application/javascript",
            "text/javascript",
            "text/html",
            "application/xml",
            "text/xml",
            "application/json",
            "text/json",
            "image/svg+xml"
        };

        /// <summary>
        /// Adds optimized Brotli and Gzip HTTP response compression for LaughTale islands, scripts, styles, and SVG sprites.
        /// </summary>
        public static IServiceCollection AddLaughTaleCompression(
            this IServiceCollection services,
            Action<ResponseCompressionOptions>? configure = null)
        {
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
                options.MimeTypes = DefaultMimeTypes;

                configure?.Invoke(options);
            });

            services.Configure<BrotliCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });

            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });

            return services;
        }

        /// <summary>
        /// Configures static asset caching with immutable Cache-Control headers for hashed LaughTale assets.
        /// </summary>
        public static IApplicationBuilder UseLaughTaleStaticAssetsCaching(
            this IApplicationBuilder app,
            TimeSpan? maxAge = null)
        {
            var cacheDuration = maxAge ?? TimeSpan.FromDays(365);
            var headerValue = $"public, max-age={(int)cacheDuration.TotalSeconds}, immutable";

            return app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    var path = ctx.Context.Request.Path.Value ?? string.Empty;
                    if (path.StartsWith("/_lt/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/js/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/css/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/fonts/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/font/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/images/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/img/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/dist/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/_content/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/icons/", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".js", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".css", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".svg", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".woff2", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".woff", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".ttf", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".otf", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".eot", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".webp", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase))
                    {
                        ctx.Context.Response.Headers[HeaderNames.CacheControl] = headerValue;
                    }
                }
            });
        }

        /// <summary>
        /// Applies per-path Cache-Control overrides declared via <see cref="LaughTale.Core.Configuration.LaughTaleOptions.RouteRules"/>
        /// (ROADMAP.v5.md Part E "Route rules"). Register before <c>UseRouting</c>, matching where
        /// <see cref="UseLaughTaleStaticAssetsCaching"/> already sits in the pipeline.
        /// </summary>
        public static IApplicationBuilder UseLaughTaleRouteRules(this IApplicationBuilder app)
        {
            return app.UseMiddleware<RouteRulesMiddleware>();
        }
    }
}

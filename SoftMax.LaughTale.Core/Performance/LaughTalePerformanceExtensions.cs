using System;
using System.IO.Compression;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;

namespace SoftMax.LaughTale.Core.Performance
{
    /// <summary>
    /// Performance and caching extensions for SoftMax.LaughTale applications.
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
                    if (path.StartsWith("/dist/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/_content/", StringComparison.OrdinalIgnoreCase) ||
                        path.StartsWith("/icons/", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".js", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".css", StringComparison.OrdinalIgnoreCase) ||
                        path.EndsWith(".svg", StringComparison.OrdinalIgnoreCase))
                    {
                        ctx.Context.Response.Headers[HeaderNames.CacheControl] = headerValue;
                    }
                }
            });
        }
    }
}

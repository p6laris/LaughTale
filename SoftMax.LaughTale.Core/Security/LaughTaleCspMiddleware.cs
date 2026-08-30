using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace SoftMax.LaughTale.Core.Security;

/// <summary>
/// Middleware that generates a cryptographically secure random nonce per request,
/// stores it in HttpContext.Items, and sets the Content-Security-Policy response header.
/// </summary>
public class LaughTaleCspMiddleware
{
    private readonly RequestDelegate _next;
    private readonly LaughTaleCspOptions _options;

    public LaughTaleCspMiddleware(RequestDelegate next, IOptions<LaughTaleCspOptions> options)
    {
        _next = next;
        _options = options.Value;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (_options.Enabled)
        {
            // 1. Check if a nonce was already established (e.g. by reverse proxy or upstream filter)
            string nonce;
            if (context.Items.TryGetValue(HttpContextCspNonceProvider.HttpContextItemKey, out var existing) && existing is string existingStr && !string.IsNullOrWhiteSpace(existingStr))
            {
                nonce = existingStr;
            }
            else
            {
                // Generate a cryptographically secure 128-bit (16-byte) random nonce
                var bytes = new byte[16];
                RandomNumberGenerator.Fill(bytes);
                nonce = Convert.ToBase64String(bytes);
                context.Items[HttpContextCspNonceProvider.HttpContextItemKey] = nonce;
            }

            // 2. Format and attach CSP header to response if not already present
            if (!string.IsNullOrWhiteSpace(_options.HeaderName) && !string.IsNullOrWhiteSpace(_options.PolicyTemplate))
            {
                var policy = string.Format(_options.PolicyTemplate, nonce);
                context.Response.Headers.TryAdd(_options.HeaderName, policy);
            }
        }

        await _next(context);
    }
}

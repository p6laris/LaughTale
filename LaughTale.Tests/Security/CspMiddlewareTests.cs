using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using LaughTale.Core.Security;
using Xunit;

namespace LaughTale.Tests.Security;

public class CspMiddlewareTests
{
    [Fact]
    public async Task LaughTaleCspMiddleware_Generates_Unique_Nonce_And_Emits_Header()
    {
        var options = Options.Create(new LaughTaleCspOptions());
        var middleware = new LaughTaleCspMiddleware(next: (ctx) => Task.CompletedTask, options);

        var context1 = new DefaultHttpContext();
        await middleware.InvokeAsync(context1);

        var header1 = context1.Response.Headers["Content-Security-Policy"].ToString();
        var nonce1 = context1.Items[HttpContextCspNonceProvider.HttpContextItemKey] as string;

        Assert.NotNull(nonce1);
        Assert.NotEmpty(nonce1);
        Assert.Contains($"'nonce-{nonce1}'", header1);
        Assert.Contains("script-src 'self'", header1);
        Assert.Contains("style-src 'self'", header1);

        var context2 = new DefaultHttpContext();
        await middleware.InvokeAsync(context2);

        var nonce2 = context2.Items[HttpContextCspNonceProvider.HttpContextItemKey] as string;
        Assert.NotNull(nonce2);
        Assert.NotEqual(nonce1, nonce2); // Nonce must be unique per request
    }

    [Fact]
    public async Task LaughTaleCspMiddleware_Respects_Existing_Nonce_In_Context()
    {
        var options = Options.Create(new LaughTaleCspOptions());
        var middleware = new LaughTaleCspMiddleware(next: (ctx) => Task.CompletedTask, options);

        var context = new DefaultHttpContext();
        const string customNonce = "upstream-established-nonce-98765";
        context.Items[HttpContextCspNonceProvider.HttpContextItemKey] = customNonce;

        await middleware.InvokeAsync(context);

        var header = context.Response.Headers["Content-Security-Policy"].ToString();
        Assert.Contains($"'nonce-{customNonce}'", header);
    }

    [Fact]
    public void HttpContextCspNonceProvider_Returns_Nonce_From_Context()
    {
        var context = new DefaultHttpContext();
        const string expectedNonce = "test-nonce-abc-123";
        context.Items[HttpContextCspNonceProvider.HttpContextItemKey] = expectedNonce;

        var accessor = new HttpContextAccessor { HttpContext = context };
        var provider = new HttpContextCspNonceProvider(accessor);

        var resolvedNonce = provider.GetNonce();
        Assert.Equal(expectedNonce, resolvedNonce);
    }

    [Fact]
    public async Task LaughTaleCspMiddleware_When_Disabled_Does_Not_Add_Header()
    {
        var options = Options.Create(new LaughTaleCspOptions { Enabled = false });
        var middleware = new LaughTaleCspMiddleware(next: (ctx) => Task.CompletedTask, options);

        var context = new DefaultHttpContext();
        await middleware.InvokeAsync(context);

        Assert.False(context.Response.Headers.ContainsKey("Content-Security-Policy"));
    }
}

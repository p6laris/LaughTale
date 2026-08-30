using Microsoft.AspNetCore.Http;

namespace SoftMax.LaughTale.Core.Security;

/// <summary>
/// Default implementation of <see cref="ICspNonceProvider"/> retrieving the nonce from <see cref="HttpContext.Items"/>.
/// </summary>
public class HttpContextCspNonceProvider : ICspNonceProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public const string HttpContextItemKey = "LaughTale_CspNonce";

    public HttpContextCspNonceProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetNonce()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context == null)
        {
            return string.Empty;
        }

        if (context.Items.TryGetValue(HttpContextItemKey, out var val) && val is string nonce)
        {
            return nonce;
        }

        return string.Empty;
    }
}

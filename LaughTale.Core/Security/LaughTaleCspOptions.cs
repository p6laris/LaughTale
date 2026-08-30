namespace LaughTale.Core.Security;

/// <summary>
/// Configuration options for LaughTale Content Security Policy middleware.
/// </summary>
public class LaughTaleCspOptions
{
    /// <summary>
    /// Gets or sets whether CSP middleware is active. Defaults to true.
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Gets or sets the HTTP header name. Defaults to "Content-Security-Policy".
    /// </summary>
    public string HeaderName { get; set; } = "Content-Security-Policy";

    /// <summary>
    /// Gets or sets the policy template where {0} is replaced by the per-request nonce.
    /// Defaults to a strict, production-ready CSP.
    /// </summary>
    public string PolicyTemplate { get; set; } =
        "default-src 'self'; script-src 'self' 'nonce-{0}'; style-src 'self' 'nonce-{0}'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";
}

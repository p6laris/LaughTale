namespace LaughTale.Core.Security;

/// <summary>
/// Provides access to the cryptographically secure CSP nonce for the current HTTP request.
/// </summary>
public interface ICspNonceProvider
{
    /// <summary>
    /// Gets the CSP nonce associated with the current HTTP request.
    /// </summary>
    string GetNonce();
}

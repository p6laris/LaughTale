using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace LaughTale.Core.Security;

/// <summary>
/// Registry and evaluator for Island authorization policies ( / LT-2203).
/// Ensures server-driven island refresh calls enforce the exact same policies as initial renders.
/// </summary>
public interface IIslandAuthorizationRegistry
{
    /// <summary>
    /// Registers an authorization policy name required to render or refresh an island.
    /// </summary>
    void RegisterPolicy(string islandName, string policyName);

    /// <summary>
    /// Gets the registered policy name for an island, or null if unrestricted.
    /// </summary>
    string? GetPolicy(string islandName);

    /// <summary>
    /// Evaluates whether the current HttpContext.User is authorized to render or refresh the island.
    /// </summary>
    Task<bool> AuthorizeAsync(string islandName, HttpContext context);
}

/// <summary>
/// Thread-safe default implementation of IIslandAuthorizationRegistry.
/// </summary>
public class IslandAuthorizationRegistry : IIslandAuthorizationRegistry
{
    private readonly ConcurrentDictionary<string, string> _policies = new(StringComparer.OrdinalIgnoreCase);

    public void RegisterPolicy(string islandName, string policyName)
    {
        if (string.IsNullOrWhiteSpace(islandName)) throw new ArgumentNullException(nameof(islandName));
        if (string.IsNullOrWhiteSpace(policyName)) throw new ArgumentNullException(nameof(policyName));
        _policies[islandName] = policyName;
    }

    public string? GetPolicy(string islandName)
    {
        if (string.IsNullOrWhiteSpace(islandName)) return null;
        return _policies.TryGetValue(islandName, out var policy) ? policy : null;
    }

    public async Task<bool> AuthorizeAsync(string islandName, HttpContext context)
    {
        var policy = GetPolicy(islandName);
        if (string.IsNullOrWhiteSpace(policy))
        {
            return true;
        }

        var authService = context.RequestServices.GetService<IAuthorizationService>();
        if (authService == null)
        {
            return false;
        }

        var result = await authService.AuthorizeAsync(context.User, policy);
        return result.Succeeded;
    }
}

using System;
using System.Collections.Concurrent;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Attributes;

namespace LaughTale.Core.Security;

/// <summary>
/// Registry and evaluator for Island authorization policies ( / LT-2203).
/// Ensures initial TagHelper renders and server-driven refresh calls enforce the exact same policies.
/// </summary>
public interface IIslandAuthorizationRegistry
{
    /// <summary>
    /// Registers an authorization policy name required to render or refresh an island.
    /// </summary>
    void RegisterPolicy(string islandName, string policyName);

    /// <summary>
    /// Registers an island as explicitly public (anonymous access allowed).
    /// </summary>
    void RegisterPublic(string islandName);

    /// <summary>
    /// Scans the provided assemblies for types decorated with [Island], [IslandAuthorize], and [IslandAllowAnonymous] and registers their policies.
    /// </summary>
    void RegisterPoliciesFromAttributes(params Assembly[] assemblies);

    /// <summary>
    /// Resolves the authorization policy resolution state for an island.
    /// </summary>
    IslandPolicyResolution Resolve(string islandName);

    /// <summary>
    /// Gets the registered policy name for an island, or null if unrestricted.
    /// </summary>
    [Obsolete("Use Resolve(islandName) instead.")]
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
    private readonly ConcurrentDictionary<string, byte> _publicIslands = new(StringComparer.OrdinalIgnoreCase);

    public void RegisterPolicy(string islandName, string policyName)
    {
        if (string.IsNullOrWhiteSpace(islandName)) throw new ArgumentNullException(nameof(islandName));
        if (string.IsNullOrWhiteSpace(policyName)) throw new ArgumentNullException(nameof(policyName));
        _policies[islandName] = policyName;
    }

    public void RegisterPublic(string islandName)
    {
        if (string.IsNullOrWhiteSpace(islandName)) throw new ArgumentNullException(nameof(islandName));
        _publicIslands[islandName] = 0;
    }

    public void RegisterPoliciesFromAttributes(params Assembly[] assemblies)
    {
        if (assemblies == null || assemblies.Length == 0) return;

        foreach (var assembly in assemblies)
        {
            if (assembly.IsDynamic) continue;
            try
            {
                foreach (var type in assembly.GetExportedTypes())
                {
                    var islandAttr = type.GetCustomAttribute<IslandAttribute>();
                    if (islandAttr != null)
                    {
                        var authAttr = type.GetCustomAttribute<IslandAuthorizeAttribute>();
                        var anonAttr = type.GetCustomAttribute<IslandAllowAnonymousAttribute>();

                        if (authAttr != null && anonAttr != null)
                        {
                            throw new InvalidOperationException($"Type '{type.FullName}' cannot have both [IslandAuthorize] and [IslandAllowAnonymous].");
                        }

                        if (anonAttr != null)
                        {
                            RegisterPublic(islandAttr.Name);
                        }
                        else if (authAttr != null && !string.IsNullOrWhiteSpace(authAttr.Policy))
                        {
                            RegisterPolicy(islandAttr.Name, authAttr.Policy);
                        }
                    }
                }
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch
            {
                // Continue scanning remaining assemblies
            }
        }
    }

    public IslandPolicyResolution Resolve(string islandName)
    {
        if (string.IsNullOrWhiteSpace(islandName)) return IslandPolicyResolution.Undeclared();
        if (_policies.TryGetValue(islandName, out var policy)) return IslandPolicyResolution.RequiringPolicy(policy);
        if (_publicIslands.ContainsKey(islandName)) return IslandPolicyResolution.Public();

        // Lazy discovery across non-system loaded assemblies
        var discovered = FindResolutionFromAttributes(islandName);
        if (discovered.PolicyName != null)
        {
            _policies[islandName] = discovered.PolicyName;
            return discovered;
        }
        if (discovered.IsExplicitlyPublic)
        {
            _publicIslands[islandName] = 0;
            return discovered;
        }

        return IslandPolicyResolution.Undeclared();
    }

    [Obsolete("Use Resolve(islandName) instead.")]
    public string? GetPolicy(string islandName)
    {
        if (string.IsNullOrWhiteSpace(islandName)) return null;
        if (_policies.TryGetValue(islandName, out var policy)) return policy;

        var resolution = Resolve(islandName);
        return resolution.PolicyName;
    }

    private static IslandPolicyResolution FindResolutionFromAttributes(string islandName)
    {
        foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
        {
            if (assembly.IsDynamic) continue;
            var name = assembly.GetName().Name;
            if (name != null && (name.StartsWith("System.") || name.StartsWith("Microsoft."))) continue;

            try
            {
                foreach (var type in assembly.GetTypes())
                {
                    var islandAttr = type.GetCustomAttribute<IslandAttribute>();
                    if (islandAttr != null && string.Equals(islandAttr.Name, islandName, StringComparison.OrdinalIgnoreCase))
                    {
                        var authAttr = type.GetCustomAttribute<IslandAuthorizeAttribute>();
                        var anonAttr = type.GetCustomAttribute<IslandAllowAnonymousAttribute>();

                        if (authAttr != null && anonAttr != null)
                        {
                            throw new InvalidOperationException($"Type '{type.FullName}' cannot have both [IslandAuthorize] and [IslandAllowAnonymous].");
                        }

                        if (anonAttr != null)
                        {
                            return IslandPolicyResolution.Public();
                        }

                        if (authAttr != null && !string.IsNullOrWhiteSpace(authAttr.Policy))
                        {
                            return IslandPolicyResolution.RequiringPolicy(authAttr.Policy);
                        }
                    }
                }
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch
            {
                // Ignore type load errors on external assemblies
            }
        }
        return IslandPolicyResolution.Undeclared();
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

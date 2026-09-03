using System;
using System.Collections.Concurrent;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;

namespace LaughTale.Core.Security;

public interface IIslandAccessEvaluator
{
    ValueTask<IslandAccessDecision> EvaluateAsync(
        string islandName,
        ClaimsPrincipal? user,
        IServiceProvider? services,
        IslandAccessContext context = default);
}

public readonly record struct IslandAccessContext(
    string? ExplicitPolicy = null,
    IslandRefreshOptions? LocalOptions = null);

public class IslandAccessEvaluator : IIslandAccessEvaluator
{
    private static readonly ConcurrentDictionary<string, byte> _loggedCompatWarnings = new(StringComparer.OrdinalIgnoreCase);

    public async ValueTask<IslandAccessDecision> EvaluateAsync(
        string islandName,
        ClaimsPrincipal? user,
        IServiceProvider? services,
        IslandAccessContext context = default)
    {
        if (string.IsNullOrWhiteSpace(islandName))
        {
            return new IslandAccessDecision(
                IslandAccessOutcome.Undeterminable,
                islandName ?? string.Empty,
                null,
                "Island name is missing or empty.");
        }

        // Row 1: services is null
        if (services == null)
        {
            return new IslandAccessDecision(
                IslandAccessOutcome.Undeterminable,
                islandName,
                null,
                "Service provider is null; cannot evaluate authorization.");
        }

        var globalOptions = services.GetService<IOptions<LaughTaleOptions>>()?.Value;
        var authRegistry = services.GetService<IIslandAuthorizationRegistry>();

        // Resolution order:
        // 1. context.ExplicitPolicy
        // 2. context.LocalOptions
        // 3. IOptions<LaughTaleOptions>.Value.Refresh
        // 4. IIslandAuthorizationRegistry.Resolve(name)
        // 5. Undeclared
        IslandPolicyResolution resolution = ResolvePolicy(islandName, context, globalOptions, authRegistry);

        // Public island
        if (resolution.IsExplicitlyPublic)
        {
            return new IslandAccessDecision(
                IslandAccessOutcome.Allowed,
                islandName,
                null,
                null);
        }

        // Undeclared island
        if (resolution.IsUndeclared)
        {
            bool compatOn = context.LocalOptions?.AllowUndeclaredIslands == true
                || globalOptions?.Refresh.AllowUndeclaredIslands == true;

            if (compatOn)
            {
                if (_loggedCompatWarnings.TryAdd(islandName, 0))
                {
                    var logger = services.GetService<ILogger<IslandAccessEvaluator>>()
                        ?? services.GetService<ILoggerFactory>()?.CreateLogger<IslandAccessEvaluator>();

                    logger?.LogWarning(
                        "Island '{IslandName}' is undeclared but allowed under the AllowUndeclaredIslands compatibility switch. This switch will be removed in a future release.",
                        islandName);
                }

                return new IslandAccessDecision(
                    IslandAccessOutcome.Allowed,
                    islandName,
                    null,
                    "Allowed under compatibility switch AllowUndeclaredIslands.");
            }

            return new IslandAccessDecision(
                IslandAccessOutcome.Undeclared,
                islandName,
                null,
                $"Island '{islandName}' has no authorization policy and is not declared public.");
        }

        // Requiring policy
        string policyName = resolution.PolicyName!;

        // Row 5: IAuthorizationService not registered
        var authService = services.GetService<IAuthorizationService>();
        if (authService == null)
        {
            return new IslandAccessDecision(
                IslandAccessOutcome.Undeterminable,
                islandName,
                policyName,
                "IAuthorizationService is not registered in the service container.");
        }

        // Row 6: Policy name unknown to authorization system
        var policyProvider = services.GetService<IAuthorizationPolicyProvider>();
        if (policyProvider != null)
        {
            try
            {
                var policy = await policyProvider.GetPolicyAsync(policyName);
                if (policy == null)
                {
                    return new IslandAccessDecision(
                        IslandAccessOutcome.Undeterminable,
                        islandName,
                        policyName,
                        $"Authorization policy '{policyName}' is not registered.");
                }
            }
            catch (Exception ex)
            {
                return new IslandAccessDecision(
                    IslandAccessOutcome.Undeterminable,
                    islandName,
                    policyName,
                    $"Authorization policy provider threw when looking up '{policyName}': {ex.Message}");
            }
        }

        // Row 7, 8, 9: Evaluate AuthorizeAsync
        try
        {
            var effectiveUser = user ?? new ClaimsPrincipal(new ClaimsIdentity());
            var result = await authService.AuthorizeAsync(effectiveUser, policyName);

            if (result.Succeeded)
            {
                return new IslandAccessDecision(
                    IslandAccessOutcome.Allowed,
                    islandName,
                    policyName,
                    null);
            }

            return new IslandAccessDecision(
                IslandAccessOutcome.Denied,
                islandName,
                policyName,
                $"User does not satisfy policy '{policyName}'.");
        }
        catch (InvalidOperationException ex)
        {
            return new IslandAccessDecision(
                IslandAccessOutcome.Undeterminable,
                islandName,
                policyName,
                $"Authorization evaluation threw InvalidOperationException for policy '{policyName}': {ex.Message}");
        }
        catch (Exception ex)
        {
            return new IslandAccessDecision(
                IslandAccessOutcome.Undeterminable,
                islandName,
                policyName,
                $"Authorization evaluation threw an exception for policy '{policyName}': {ex.Message}");
        }
    }

    private static IslandPolicyResolution ResolvePolicy(
        string islandName,
        IslandAccessContext context,
        LaughTaleOptions? globalOptions,
        IIslandAuthorizationRegistry? authRegistry)
    {
        // 1. context.ExplicitPolicy
        if (!string.IsNullOrWhiteSpace(context.ExplicitPolicy))
        {
            return IslandPolicyResolution.RequiringPolicy(context.ExplicitPolicy);
        }

        // 2. context.LocalOptions
        if (context.LocalOptions != null)
        {
            if (context.LocalOptions.IslandPolicies.TryGetValue(islandName, out var localPolicy) && !string.IsNullOrWhiteSpace(localPolicy))
            {
                return IslandPolicyResolution.RequiringPolicy(localPolicy);
            }
            if (context.LocalOptions.AnonymousIslands.Contains(islandName))
            {
                return IslandPolicyResolution.Public();
            }
        }

        // 3. Global options
        if (globalOptions?.Refresh != null)
        {
            if (globalOptions.Refresh.IslandPolicies.TryGetValue(islandName, out var globalPolicy) && !string.IsNullOrWhiteSpace(globalPolicy))
            {
                return IslandPolicyResolution.RequiringPolicy(globalPolicy);
            }
            if (globalOptions.Refresh.AnonymousIslands.Contains(islandName))
            {
                return IslandPolicyResolution.Public();
            }
        }

        // 4. Registry / Attribute discovery
        if (authRegistry != null)
        {
            var regResolution = authRegistry.Resolve(islandName);
            if (!regResolution.IsUndeclared)
            {
                return regResolution;
            }
        }

        // 5. Undeclared
        return IslandPolicyResolution.Undeclared();
    }
}

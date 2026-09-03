namespace LaughTale.Core.Security;

public enum IslandAccessOutcome
{
    /// <summary>A policy resolved and the caller satisfied it, or the island is declared public.</summary>
    Allowed = 0,

    /// <summary>A policy resolved and the caller did not satisfy it.</summary>
    Denied = 1,

    /// <summary>No policy and no public declaration resolved. The default state.</summary>
    Undeclared = 2,

    /// <summary>A decision could not be reached: service absent, policy name unknown, no container.</summary>
    Undeterminable = 3
}

public readonly record struct IslandAccessDecision(
    IslandAccessOutcome Outcome,
    string IslandName,
    string? PolicyName,
    string? DiagnosticReason)
{
    /// <summary>True only for Allowed. Every other outcome refuses.</summary>
    public bool IsAllowed => Outcome == IslandAccessOutcome.Allowed;
}

public readonly record struct IslandPolicyResolution
{
    public string? PolicyName { get; }
    public bool IsExplicitlyPublic { get; }
    public bool IsUndeclared => PolicyName is null && !IsExplicitlyPublic;

    private IslandPolicyResolution(string? policyName, bool isExplicitlyPublic)
    {
        PolicyName = policyName;
        IsExplicitlyPublic = isExplicitlyPublic;
    }

    public static IslandPolicyResolution RequiringPolicy(string policyName) => new(policyName, false);
    public static IslandPolicyResolution Public() => new(null, true);
    public static IslandPolicyResolution Undeclared() => new(null, false);
}

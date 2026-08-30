using LaughTale.Core.Enums;

namespace LaughTale.Core.Attributes;

/// <summary>
/// Marks a C# class or record as an Island component props contract.
/// Triggers Roslyn source generation for TypeScript interfaces and TagHelpers.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct, AllowMultiple = false, Inherited = false)]
public sealed class IslandAttribute : Attribute
{
    /// <summary>
    /// The unique name of the island matching the TypeScript module name (e.g. "cascade-tree").
    /// </summary>
    public string Name { get; }

    /// <summary>
    /// Default hydration strategy for this island.
    /// </summary>
    public HydrateStrategy DefaultStrategy { get; set; } = HydrateStrategy.Load;

    public IslandAttribute(string name)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
    }
}

/// <summary>
/// Marks a C# class, record, or enum to be emitted into TypeScript interfaces and types.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct | AttributeTargets.Enum, AllowMultiple = false, Inherited = false)]
public sealed class GenerateTypeScriptAttribute : Attribute
{
    /// <summary>
    /// Optional custom output module or file name.
    /// </summary>
    public string? ModuleName { get; set; }
}

/// <summary>
/// Attaches client-side keystroke formatting mask to an input property.
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
public sealed class InputMaskAttribute : Attribute
{
    public string Mask { get; }

    public InputMaskAttribute(string mask)
    {
        Mask = mask ?? throw new ArgumentNullException(nameof(mask));
    }
}

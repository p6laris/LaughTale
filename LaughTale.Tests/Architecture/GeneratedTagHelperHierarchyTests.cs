using System;
using System.CodeDom.Compiler;
using System.Linq;
using System.Reflection;
using LaughTale.Components.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Architecture;

/// <summary>
/// Guards the fix for ROADMAP.v5.md §0 ("The root cause nobody named") and closes the gap §15
/// calls out: "the architecture is guarded in one dimension [assembly references,
/// CoreOnlyBoundaryTests] and unguarded in the two that have actually failed" — class hierarchy is
/// one of those two. Before this fix, 81 of 96 island TagHelpers derived straight from
/// <see cref="Microsoft.AspNetCore.Razor.TagHelpers.TagHelper"/> and never reached
/// <see cref="IslandTagHelperBase"/>, so SSR (<c>BuildSsrHtml</c>), localization/RTL and
/// authorization were silently unreachable from the vast majority of call sites. Nothing checking
/// assembly references would ever have caught that: this test looks at the actual class hierarchy.
/// </summary>
public class GeneratedTagHelperHierarchyTests
{
    /// <summary>
    /// Every type IslandGenerator emits carries this marker attribute (see
    /// IslandGenerator.GenerateTagHelper), which distinguishes generated TagHelpers from both the
    /// hand-written Aura TagHelpers and the 27 unrelated classes in CompoundTagHelpers.cs (out of
    /// scope for this fix — ROADMAP.v5.md §9 debloat item), even though all three groups share the
    /// same "LaughTale.Components.TagHelpers" namespace and an "Island*TagHelper" naming style.
    /// </summary>
    private const string GeneratorToolName = "LaughTale.Generators.IslandGenerator";

    private static Type[] GetGeneratedIslandTagHelperTypes()
    {
        var assembly = typeof(IslandTagHelperBase).Assembly;
        return assembly.GetTypes()
            .Where(t => t.GetCustomAttribute<GeneratedCodeAttribute>()?.Tool == GeneratorToolName)
            .ToArray();
    }

    [Fact]
    public void GeneratedIslandTagHelpers_AreDiscoverable()
    {
        // If this is ever 0, the marker attribute or the generator wiring broke, and every other
        // assertion in this file would be vacuously true. Guard against that silently passing.
        var generated = GetGeneratedIslandTagHelperTypes();
        Assert.NotEmpty(generated);
        Assert.True(generated.Length >= 60, $"Expected roughly 67 generated island TagHelpers (81 [Island] models minus 14 skipped as redundant with hand-written classes), found {generated.Length}.");
    }

    [Fact]
    public void EveryGeneratedIslandTagHelper_ExtendsIslandTagHelperBase()
    {
        var generated = GetGeneratedIslandTagHelperTypes();

        var offenders = generated
            .Where(t => !t.IsSubclassOf(typeof(IslandTagHelperBase)))
            .Select(t => t.FullName)
            .ToList();

        Assert.True(offenders.Count == 0,
            "The following IslandGenerator-emitted TagHelpers do not derive from IslandTagHelperBase, " +
            "so they cannot reach authorization, localization/RTL or BuildSsrHtml (ROADMAP.v5.md §0): " +
            string.Join(", ", offenders));
    }

    /// <summary>
    /// The 15 hand-written island-root TagHelpers (ToastTagHelper, TieredMenuTagHelper,
    /// TimelineTagHelper, StepperTagHelper, MessageTagHelper, ConfirmDialogTagHelper,
    /// SidebarTagHelper, ConfirmPopupTagHelper, DialogTagHelper, DrawerTagHelper,
    /// ContextMenuTagHelper, BreadcrumbTagHelper, MenubarTagHelper, CommandMenuTagHelper,
    /// MenuTagHelper) under LaughTale.Components/TagHelpers/Aura/{Menu,Messages,Misc,Overlay}.
    /// Named explicitly rather than scanned by namespace: several *companion* part TagHelpers live
    /// alongside them in the same files/namespaces (e.g. StepListTagHelper, StepTagHelper,
    /// StepPanelsTagHelper, StepPanelTagHelper, StepItemTagHelper next to StepperTagHelper) and are,
    /// like CompoundTagHelpers.cs, legitimately plain TagHelpers with no IslandName of their own —
    /// they render markup structure, not an island root, so they are out of scope here too.
    /// </summary>
    private static readonly string[] HandWrittenIslandRootTypeNames =
    {
        "ToastTagHelper", "TieredMenuTagHelper", "TimelineTagHelper", "StepperTagHelper",
        "MessageTagHelper", "ConfirmDialogTagHelper", "SidebarTagHelper", "ConfirmPopupTagHelper",
        "DialogTagHelper", "DrawerTagHelper", "ContextMenuTagHelper", "BreadcrumbTagHelper",
        "MenubarTagHelper", "CommandMenuTagHelper", "MenuTagHelper"
    };

    [Fact]
    public void HandWrittenAuraTagHelpers_AlsoExtendIslandTagHelperBase()
    {
        // The 15 hand-written TagHelpers this fix intentionally leaves generation-free (see
        // IslandGenerator.HandWrittenIslandNames) must still reach the same base class — that was
        // the whole point of not duplicating them.
        var assembly = typeof(IslandTagHelperBase).Assembly;
        var handWritten = assembly.GetTypes()
            .Where(t => t.Namespace != null
                && t.Namespace.StartsWith("LaughTale.Components.TagHelpers.Aura", StringComparison.Ordinal)
                && HandWrittenIslandRootTypeNames.Contains(t.Name))
            .ToArray();

        Assert.Equal(15, handWritten.Length);

        var offenders = handWritten
            .Where(t => !t.IsSubclassOf(typeof(IslandTagHelperBase)))
            .Select(t => t.FullName)
            .ToList();

        Assert.True(offenders.Count == 0,
            "The following hand-written Aura TagHelpers do not derive from IslandTagHelperBase: " + string.Join(", ", offenders));
    }

    [Fact]
    public void CompoundTagHelpers_AreExcludedFromTheGeneratedSet()
    {
        // CompoundTagHelpers.cs's 27 classes are a separate, explicitly out-of-scope debloat item
        // (ROADMAP.v5.md §9) and must never be mistaken for IslandGenerator output by this test.
        var generatedNames = GetGeneratedIslandTagHelperTypes().Select(t => t.Name).ToHashSet();

        Assert.DoesNotContain("IslandFieldTagHelper", generatedNames);
        Assert.DoesNotContain("IslandLabelTagHelper", generatedNames);
    }
}

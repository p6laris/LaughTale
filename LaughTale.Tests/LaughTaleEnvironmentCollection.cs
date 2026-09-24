using Xunit;

namespace LaughTale.Tests;

/// <summary>
/// Test classes that toggle the process-global <see cref="LaughTale.Core.Diagnostics.LaughTaleEnvironment"/>
/// override. Run non-parallel so one class resetting it cannot flip another class's assertions mid-test.
/// </summary>
[CollectionDefinition(Name, DisableParallelization = true)]
public sealed class LaughTaleEnvironmentCollection
{
    public const string Name = "LaughTaleEnvironment";
}

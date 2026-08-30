using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace LaughTaleApp.Islands;

/// <summary>
/// Custom LaughTale Island: my-island
/// TagHelper `<my-island>` is automatically emitted at compile time by LaughTale.Generators.
/// </summary>
[Island("my-island", Hydrate = HydrateStrategy.Load)]
public record MyIslandProps(
    string Title = "Hello Island",
    int InitialCount = 0,
    bool Enabled = true
);

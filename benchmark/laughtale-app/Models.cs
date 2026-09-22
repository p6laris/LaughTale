using LaughTale.Core.Attributes;

namespace LaughTaleBenchmarkApp;

[IslandAllowAnonymous]
[Island("counter")]
public record CounterProps(int InitialCount);

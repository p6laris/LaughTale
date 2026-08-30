using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace MyApp.Models;

[Island("counter-widget", DefaultStrategy = HydrateStrategy.Visible)]
public record CounterProps(
    int InitialCount = 0,
    int Step = 1,
    string Label = "Active Workers"
);

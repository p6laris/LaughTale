using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace MyApp.Models;

[Island("gauge-widget", DefaultStrategy = HydrateStrategy.Idle)]
public record GaugeProps(
    string Title = "CPU Load",
    int Percentage = 45
);

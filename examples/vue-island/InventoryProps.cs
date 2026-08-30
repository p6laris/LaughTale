using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace MyApp.Models;

[Island("inventory-widget", DefaultStrategy = HydrateStrategy.Load)]
public record InventoryProps(
    string WarehouseCode = "WH-HQ-01",
    int InitialStock = 50
);

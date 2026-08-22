---
title: "SpeedDial FAB"
description: "Floating Action Button with expanding radial or linear quick actions"
order: 27
section: "Navigation & Overlays"
---

# SpeedDial FAB

The `<island-speed-dial />` TagHelper provides a Floating Action Button (FAB) that blossoms into quick action buttons upon clicking.

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var actions = new List<SpeedDialAction>
    {
        new("Sync Cluster", null, "sync"),
        new("Export Audit Logs", null, "export"),
        new("Trigger Backup", null, "backup")
    };
}

<island-speed-dial actions="@actions" direction="up" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `actions` | `List<SpeedDialAction>` | `new()` | Collection of actions with `Label`, `Icon`, and `Action`. |
| `direction` | `string` | `"up"` | Direction of expanding action items. |

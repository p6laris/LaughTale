---
title: "SpeedDial FAB"
description: "Floating Action Button with expanding radial or linear quick actions"
order: 27
section: "Navigation & Overlays"
---

# SpeedDial FAB

The `<island-speed-dial />` TagHelper provides a Floating Action Button (FAB) that blossoms into quick action buttons upon clicking.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; min-height: 180px; display: flex; align-items: flex-end;">
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Live SpeedDial (Click + to open actions)</div>
        <island name="speed-dial" props-json='{"direction": "up", "actions": [{"label": "Sync Cluster", "action": "sync"}, {"label": "Export Logs", "action": "export"}, {"label": "Backup", "action": "backup"}]}' hydrate="Load"></island>
    </div>
</div>

---

## 🚀 Basic Usage

```razor
@using LaughTale.Components.Models

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

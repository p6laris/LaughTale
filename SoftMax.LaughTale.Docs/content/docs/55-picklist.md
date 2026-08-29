---
title: "PickList Transfer"
description: "Dual-list transfer component for moving and reordering items between source and target lists"
order: 55
section: "Data & Tables"
---

# PickList

PickList displays two list containers with controls to transfer and reorder items between source and target lists.

---

## 🎮 Interactive Live Demos

### 1. Team Member Assignment

```razor
<island-picklist source="@Model.AvailableUsers" target="@Model.AssignedUsers" source-header="Available" target-header="Selected" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `source` | `IEnumerable<T>` | `null` | Source list items. |
| `target` | `IEnumerable<T>` | `null` | Target list items. |
| `source-header` | `string` | `null` | Title above source list. |
| `target-header` | `string` | `null` | Title above target list. |

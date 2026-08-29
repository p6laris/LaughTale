---
title: "Menu & TieredMenu"
description: "Vertical navigation and flyout menu components with category groupings, icons, badges, and command actions"
order: 50
section: "Panels & Navigation"
---

# Menu

Menu displays navigation links and actions in grouped vertical lists, supporting submenus, keyboard navigation, and custom action commands.

---

## 🎮 Interactive Live Demos

### 1. Grouped Vertical Menu

Categorized menu list with headers, vector icons, and action callbacks.

```razor
<island-menu model="@Model.AccountMenuItems" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `model` | `List<MenuItem>` | `null` | Hierarchical menu item items list. |
| `popup` | `bool` | `false` | When true, renders as an overlay anchored to a target element. |

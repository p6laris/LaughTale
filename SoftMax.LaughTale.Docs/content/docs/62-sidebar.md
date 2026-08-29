---
title: "Sidebar Navigation"
description: "Compound enterprise navigation sidebar system with collapsible icon mode, offcanvas overlay, and dark mode awareness"
order: 62
section: "Panels & Navigation"
---

# Sidebar

Sidebar is a compound navigation panel system supporting collapsible icon modes, offcanvas slide-over states, visual density variants, and smooth transition physics.

---

## 🎮 Interactive Live Demos

### 1. Collapsible Application Sidebar

```razor
<island-sidebar items="@Model.SidebarItems" position="left" collapsible="true" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `items` | `List<SidebarItem>` | `null` | Hierarchical sidebar navigation items. |
| `position` | `string` | `"left"` | `"left"`, `"right"`, `"top"`, `"bottom"`. |
| `collapsible` | `bool` | `true` | Allows user to collapse sidebar into icon-only mode. |

---
title: "Menubar Navigation"
description: "Horizontal global application header navigation bar with cascading dropdown submenus, vector icons, keyboard support, and search action slots"
order: 49
section: "Panels & Navigation"
---

# Menubar

Menubar is a standard horizontal navigation bar component for top-level application navigation with nested flyout submenus and responsive mobile drawers.

---

## 🎮 Interactive Live Demos

### 1. Application Menubar

Horizontal menu with icons, category submenus, and search slot projection.

```razor
<island-menubar model="@Model.MenuItems" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `model` | `List<MenuItem>` | `null` | Hierarchical menu items tree. |
| `aria-label` | `string` | `"Navigation Menu"` | Accessible label for WAI-ARIA navigation. |

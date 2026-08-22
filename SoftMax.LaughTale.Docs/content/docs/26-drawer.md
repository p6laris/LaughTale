---
title: "Offcanvas Slide Drawer"
description: "Slide-out drawer panel with backdrop blur wrapping server slots"
order: 26
section: "Navigation & Overlays"
---

# Offcanvas Slide Drawer

The `<island-drawer />` TagHelper provides a slide-in side panel (Left, Right, Top, or Bottom) with backdrop blur and ESC dismiss that wraps server-rendered C# Razor slots.

---

## 🚀 Basic Usage

```razor
<island-drawer position="right" title="Filter Records" trigger-text="Open Filters ⚙️" width="400px" hydrate="Load">
    <!-- Server-Rendered C# Razor Body Slot -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <label>Filter by Division:</label>
        <island-tree-select nodes="@Model.DepartmentTree" target-input="Dept" />
        <button type="submit" class="p-button p-button-primary">Apply Filters</button>
    </div>
</island-drawer>
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `position` | `string` | `"right"` | `"left"`, `"right"`, `"top"`, or `"bottom"`. |
| `title` | `string?` | `"Panel"` | Drawer header title. |
| `trigger-text` | `string?` | `null` | Optional button label that opens the drawer. |
| `width` | `string` | `"380px"` | Panel width. |

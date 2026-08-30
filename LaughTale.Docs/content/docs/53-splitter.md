---
title: "Splitter Panels"
description: "Resizable split layout component with draggable gutters for horizontal and vertical multi-pane views"
order: 53
section: "Panels & Navigation"
---

# Splitter

Splitter divides content into resizable panes separated by interactive drag gutters.

---

## 🎮 Interactive Live Demos

### 1. Horizontal & Vertical Panes

```razor
<island-splitter layout="horizontal">
    <div style="padding: 1rem;">Left Pane</div>
    <div style="padding: 1rem;">Right Pane</div>
</island-splitter>
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `layout` | `string` | `"horizontal"` | `"horizontal"` or `"vertical"`. |
| `gutter-size` | `int` | `4` | Width/height of the drag gutter in pixels. |

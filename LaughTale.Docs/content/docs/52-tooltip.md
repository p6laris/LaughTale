---
title: "Tooltip Directives"
description: "Lightweight floating tooltips with 4 directional placements, hover delays, and theme-aware styling"
order: 52
section: "Panels & Navigation"
---

# Tooltip

Tooltip provides informative text on element hover or focus, supporting `top`, `bottom`, `left`, and `right` placements.

---

## 🎮 Interactive Live Demos

### 1. Directional Tooltips

```razor
<button type="button" class="p-button" island-tooltip="Quick overview info" tooltip-position="top">Top</button>
<button type="button" class="p-button" island-tooltip="Verified credentials" tooltip-position="right">Right</button>
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `island-tooltip` | `string` | `null` | Tooltip text content. |
| `tooltip-position` | `string` | `"top"` | `"top"`, `"bottom"`, `"left"`, `"right"`. |
| `tooltip-delay` | `int` | `150` | Show delay in milliseconds. |

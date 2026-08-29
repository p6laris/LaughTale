---
title: "Popover Overlay"
description: "Contextual overlay panel that anchors to target elements to display rich interactive content, forms, and actions"
order: 51
section: "Overlays & Dialogs"
---

# Popover

Popover (OverlayPanel) displays contextual floating content anchored to a trigger element with arrow indicators and backdrop dismissal.

---

## 🎮 Interactive Live Demos

### 1. Target Anchored Popover

Clicking a button opens a rich overlay with search input, user list, or custom content.

```razor
<island-popover target="#btn-search">
    <div style="padding: 1rem;">
        <h4>Search Filters</h4>
        <p>Refine your telemetry criteria.</p>
    </div>
</island-popover>
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `target` | `string` | `null` | CSS selector of the trigger element. |
| `dismissable` | `bool` | `true` | Dismisses popover on outside click. |
| `show-close-icon` | `bool` | `false` | Displays a close button in top right corner. |

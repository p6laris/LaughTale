---
title: "BlockUI Locker"
description: "Overlay blocker to prevent user interaction on target containers or whole document during asynchronous operations"
order: 61
section: "Overlays & Dialogs"
---

# BlockUI

BlockUI masks a target container or document body with an animated spinner and glassy overlay to prevent user interaction while background operations complete.

---

## 🎮 Interactive Live Demos

### 1. Container Masking

```razor
<island-blockui blocked="true" message="Synchronizing cluster data...">
    <div style="padding: 2rem;">Protected Content Area</div>
</island-blockui>
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `blocked` | `bool` | `true` | Toggles overlay visibility and interaction block. |
| `message` | `string` | `"Processing..."` | Informative text displayed beside spinner. |

---
title: "Dialog Suite"
description: "Accessible overlay dialog window with responsive sizing, draggable positioning, focus trapping, headless templates, and backdrop blur"
order: 29
section: "Overlays & Dialogs"
---

# Dialog

Dialog is an overlay container with backdrop blur, focus trapping, keyboard escape dismiss, modal/non-modal modes, maximize button, and headless slot projections.

---

## 🎮 Interactive Live Demos

### 1. Basic Modal Dialog

Centered dialog with header, content body, and customizable action footer.

```razor
<island-dialog header="Edit User Profile" visible="true" modal="true">
    <p>Update your team credentials and access roles.</p>
</island-dialog>
```

---

### 2. Positioned Dialog (Corners & Edges)

Supports 8 screen placement anchors: `top`, `bottom`, `left`, `right`, `topleft`, `topright`, `bottomleft`, and `bottomright`.

```razor
<island-dialog header="System Notification" position="topright" modal="false">
    <p>Background sync completed successfully.</p>
</island-dialog>
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `header` | `string` | `null` | Text displayed in dialog header bar. |
| `visible` | `bool` | `false` | Controls visibility state of the dialog overlay. |
| `modal` | `bool` | `true` | Renders a backdrop mask to block background clicks. |
| `position` | `string` | `"center"` | Screen placement anchor (`"center"`, `"top"`, `"topright"`, etc.). |
| `dismissable-mask` | `bool` | `true` | Clicking the backdrop mask closes the dialog. |
| `close-on-escape` | `bool` | `true` | Pressing `Esc` dismisses the active dialog. |

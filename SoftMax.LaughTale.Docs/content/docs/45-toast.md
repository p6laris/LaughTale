---
title: "Toast Overlays"
description: "Non-blocking notification overlays with 7 viewport positions, stacked card deck and expanded display modes, promise flows, and accessibility"
order: 45
section: "Navigation & Overlays"
---

# Toast

Toast is used to display non-blocking messages in an overlay. It supports 7 viewport anchor positions, stacked card deck and expanded modes, hover-pause timers, async promise flows, custom templates, and interactive action buttons.

---

## 🎮 Interactive Live Demo

<island-toast />

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
    <button type="button" class="p-button p-button-info" onclick="window.$toast.add({ severity: 'info', summary: 'Heads up', detail: 'There is something you might want to check.', life: 3000 })">
        Info Toast
    </button>
    <button type="button" class="p-button p-button-success" onclick="window.$toast.add({ severity: 'success', summary: 'Saved successfully', detail: 'Your changes have been saved.', life: 3000 })">
        Success Toast
    </button>
    <button type="button" class="p-button p-button-warn" onclick="window.$toast.add({ severity: 'warn', summary: 'Check this', detail: 'Some fields may need your attention.', life: 3000 })">
        Warn Toast
    </button>
    <button type="button" class="p-button p-button-danger" onclick="window.$toast.add({ severity: 'error', summary: 'Something went wrong', detail: 'We could not complete the action. Please try again.', life: 3000 })">
        Error Toast
    </button>
</div>

---

## 🚀 Basic Usage

Place `<island-toast />` once in your layout or page:

```razor
<!-- Place in _Layout.cshtml or page -->
<island-toast position="top-right" />
```

Trigger toasts from JavaScript or C# Razor:

```javascript
import { useToast } from 'primevue/usetoast'; // or window.$toast

window.$toast.add({
    severity: 'success',
    summary: 'Successfully completed',
    detail: 'The task was completed successfully.',
    life: 3000
});
```

---

## 🎨 Severities

| Severity | Color Theme | Default Icon |
|---|---|---|
| `info` | Blue / Cyan | `Sparkles` / `Info` |
| `success` | Emerald | `Check` |
| `warn` | Amber | `Receipt` / `AlertTriangle` |
| `error` | Rose / Red | `XCircle` / `AlertTriangle` |
| `secondary` | Slate / Neutral | `Loader2` (spin) |
| `contrast` | Surface High Contrast | `Wifi` / `Sparkles` |

---

## 🔄 Promise & Async Flow

Display a sticky loading spinner toast while an asynchronous task runs, then replace it with a success or error notification:

```javascript
const loadingId = window.$toast.add({
    severity: 'secondary',
    summary: 'Please wait...',
    detail: 'Your request is being processed.',
    spin: true,
    group: 'promise',
    sticky: true
});

apiCall()
    .then((res) => {
        window.$toast.removeById(loadingId);
        window.$toast.add({ severity: 'success', summary: 'Success!', detail: 'Completed successfully.', group: 'promise', life: 3000 });
    })
    .catch((err) => {
        window.$toast.removeById(loadingId);
        window.$toast.add({ severity: 'error', summary: 'Failed', detail: err.message, group: 'promise', life: 3000 });
    });
```

---

## 📌 Viewport Positions

Position your toasts across 7 anchors:
- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`
- `center`

```razor
<island-toast position="bottom-center" />
```

---

## 🃏 Stacked Deck vs Expanded Mode

- **`mode="stacked"`** (default): Overlaps incoming toasts in a compact 3D card deck that smoothly expands into full view on hover or keyboard focus. Timers pause on hover.
- **`mode="expanded"`**: Displays all active toasts in an open vertical stack without overlap.

```razor
<island-toast mode="expanded" limit="7" />
```

---

## ⌨️ Accessibility

- `role="alert"`, `aria-live="assertive"`, `aria-atomic="true"`.
- Keyboard accessible close button (`Enter` / `Space`).
- Moving focus inside stacked container automatically expands stack to keep close buttons reachable.

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `position` | `string` | `"top-right"` | Viewport anchor: `top-right`, `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`, `center`. |
| `group` | `string` | `"default"` | Unique message routing group identifier. |
| `mode` | `string` | `"stacked"` | Display mode: `stacked` or `expanded`. |
| `limit` | `int` | `3` | Maximum number of visible toasts in stack. |
| `gap` | `int` | `12` | Spacing between toasts in pixels. |
| `auto-z-index` | `bool` | `true` | Automatically manage overlay layering. |
| `base-z-index` | `int` | `1100` | Base z-index layering value. |

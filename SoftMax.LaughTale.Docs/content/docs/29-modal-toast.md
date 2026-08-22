---
title: "Modal Dialog & Floating Toast"
description: "Animated dialogs wrapping C# server slots and floating toast dispatcher"
order: 29
section: "Navigation & Overlays"
---

# Modal Dialog & Floating Toast

The `<island-modal />` and `<island-toast />` TagHelpers provide animated dialogs and notification banners connected to the LaughTale Event Bus.

---

## 🪟 1. Modal Dialog (`<island-modal />`)

```razor
<island-modal title="Security Authorization" trigger-text="Open Verification Dialog" width="500px" hydrate="Load">
    <!-- Server-Rendered C# Razor Body Slot -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <p>Please enter your 6-digit verification code to escalate clearance:</p>
        <island-otp length="6" target-input="Code" />
        <button type="submit" class="p-button p-button-primary">Authorize Action</button>
    </div>
</island-modal>
```

---

## 🔔 2. Floating Toast Dispatcher (`<island-toast />`)

Place `<island-toast />` once in your `_Layout.cshtml`, and trigger toasts from anywhere in C# Razor or JavaScript using `$emit('toast', ...)`:

```razor
<!-- Place in _Layout.cshtml -->
<island-toast position="top-right" />

<!-- Trigger with declarative directive on any button -->
<button type="button" 
        l-on:click="$emit('toast', { title: 'HSM Signature Created', description: 'Transaction cryptographically sealed.', severity: 'success' })" 
        class="p-button p-button-primary">
    Seal Transaction 🔒
</button>
```

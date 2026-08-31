---
title: ToggleSwitch Component
description: Accessible animated boolean switch control supporting custom sizes, labels, and keyboard toggling.
order: 40
icon: toggle-left
category: Form Controls
---

# ToggleSwitch Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div data-island="toggle-switch" data-props='{"checked": true}' data-hydrate="load"></div>
        <span style="font-size: 0.875rem; font-weight: 600;">Enable Automatic Sync</span>
    </div>
</div>

`<island-toggle-switch />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-toggle-switch name="EnableNotifications" checked="@Model.NotificationsEnabled" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form input field name |
| `checked` | `bool` | `false` | Checked state of switch |
| `disabled` | `bool` | `false` | Disabled interaction state |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-toggle-switch />`:

```razor
<island-toggle-switch hydrate="Visible" />
```

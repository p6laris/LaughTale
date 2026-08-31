---
title: InputPassword Component
description: Secure password input with visibility toggle, password strength meter, and localized security rules.
order: 40
icon: lock
category: Form Controls
---

# InputPassword Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 320px;">
        <div data-island="input-password" data-props='{"toggleMask": true, "feedback": true, "placeholder": "Enter secure password..."}' data-hydrate="load"></div>
    </div>
</div>

`<island-input-password />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-input-password name="Password" toggle-mask="true" feedback="true" prompt-label="Choose password" weak-label="Weak" medium-label="Medium" strong-label="Strong" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name for model binding |
| `toggle-mask` | `bool` | `true` | Display show/hide password icon |
| `feedback` | `bool` | `true` | Display password strength meter popup |
| `prompt-label` | `string` | `Enter a password` | Helper prompt text |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-input-password />`:

```razor
<island-input-password hydrate="Visible" />
```

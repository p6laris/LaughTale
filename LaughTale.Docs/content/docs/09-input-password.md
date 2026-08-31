---
title: InputPassword Component
description: Secure password input with visibility toggle, password strength meter, and localized security rules.
order: 40
icon: lock
category: Form Controls
---

# InputPassword Component

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

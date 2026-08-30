---
title: "Password & Strength Meter"
description: "Password input with eye visibility toggle and real-time password strength meter"
order: 9
section: "Form & Input Controls"
---

# Password & Strength Meter

The `<island-password />` TagHelper provides a password field with a Solar eye visibility toggle and a real-time **Weak / Medium / Strong 3-stage color strength bar**.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Live Password Strength Tester (Type letters, numbers, symbols)</div>
    <island name="input-password" props-json='{"placeholder": "Type password to test strength...", "toggleMask": true, "showMeter": true}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-password placeholder="Enter your master password..." 
                 toggle-mask="true" 
                 show-meter="true" 
                 target-input="AccountPassword" 
                 hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string?` | `"Enter password..."` | Input placeholder text. |
| `toggle-mask` | `bool` | `true` | Show/hide eye visibility toggle button. |
| `show-meter` | `bool` | `true` | Display real-time 3-stage strength meter bar. |
| `target-input` | `string?` | `null` | Form input name receiving the password value. |
| `disabled` | `bool` | `false` | Disables user interaction. |

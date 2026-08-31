---
title: InputOtp Component
description: One-Time Password (OTP) 4 to 8 digit input with auto-focus advancing, numeric masking, and clipboard paste support.
order: 40
icon: key
category: Form Controls
---

# InputOtp Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="input-otp" data-props='{"length": 6, "integerOnly": true}' data-hydrate="load"></div>
</div>

`<island-input-otp />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-input-otp name="VerificationCode" length="6" integer-only="true" mask="false" autofocus="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name for model binding |
| `length` | `int` | `4` | Total number of digit input boxes |
| `mask` | `bool` | `false` | Mask entered characters like password |
| `integer-only` | `bool` | `true` | Only allow numeric keystrokes |
| `autofocus` | `bool` | `false` | Auto focus the first digit box on mount |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-input-otp />`:

```razor
<island-input-otp hydrate="Visible" />
```

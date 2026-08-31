---
title: InputOtp Component
description: One-Time Password (OTP) 4 to 8 digit input with auto-focus advancing, numeric masking, and clipboard paste support.
order: 40
icon: key
category: Form Controls
---

# InputOtp Component

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

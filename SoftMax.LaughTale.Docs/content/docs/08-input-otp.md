---
title: "OTP Verification Input"
description: "Multi-box OTP verification code input with auto-advance and paste support"
order: 8
section: "Form & Input Controls"
---

# OTP Verification Input

The `<island-otp />` TagHelper provides a PIN/OTP code input consisting of individual character boxes with auto-focus advancing, backspace navigation, and clipboard paste support.

---

## 🚀 Basic Usage

```razor
<!-- 6-digit standard verification code -->
<island-otp length="6" target-input="VerificationCode" hydrate="Load" />

<!-- 4-digit PIN with password masking -->
<island-otp length="4" mask="true" target-input="UserPin" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `length` | `int` | `6` | Total number of digit input boxes. |
| `mask` | `bool` | `false` | When true, renders boxes as masked password inputs. |
| `target-input` | `string?` | `null` | Name of the hidden input receiving the full concatenated string. |
| `disabled` | `bool` | `false` | Disables user interaction. |

---

## ⚡ Client Events

Listen to OTP completion events in JavaScript or with `l-on`:

```html
<div l-on:otp:change="if ($event.detail.isComplete) console.log('Code entered:', $event.detail.value)">
    <island-otp length="6" target-input="Code" hydrate="Load" />
</div>
```

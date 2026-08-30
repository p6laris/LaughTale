---
title: "OTP Verification Input"
description: "Multi-box OTP verification code input with auto-advance and paste support"
order: 8
section: "Form & Input Controls"
---

# OTP Verification Input

The `<island-otp />` TagHelper provides a PIN/OTP code input consisting of individual character boxes with auto-focus advancing, backspace navigation, and clipboard paste support.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1.25rem;">
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">6-Digit Verification Code (Type or Paste digits)</div>
        <island name="input-otp" props-json='{"length": 6}' hydrate="Load"></island>
    </div>
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">4-Digit Masked Security PIN</div>
        <island name="input-otp" props-json='{"length": 4, "mask": true}' hydrate="Load"></island>
    </div>
</div>

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

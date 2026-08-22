---
title: "Password & Strength Meter"
description: "Password input with eye visibility toggle and real-time password strength meter"
order: 9
section: "Form & Input Controls"
---

# Password & Strength Meter

The `<island-password />` TagHelper provides a password field with a Solar eye visibility toggle and a real-time **Weak / Medium / Strong 3-stage color strength bar**.

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

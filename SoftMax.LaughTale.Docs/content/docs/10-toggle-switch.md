---
title: "Aura Spring Switch"
description: "Smooth spring-physics toggle switch for boolean settings"
order: 10
section: "Form & Input Controls"
---

# Aura Spring Switch

The `<island-switch />` TagHelper provides a toggle switch with spring physics, custom text labels, and form input binding.

---

## 🚀 Basic Usage

```razor
<!-- Basic switch with label -->
<island-switch label="Enable Two-Factor Authentication" 
               checked="true" 
               target-input="Is2FaEnabled" 
               hydrate="Load" />

<!-- Disabled state -->
<island-switch label="Enterprise HSM Key (Locked)" 
               checked="true" 
               disabled="true" 
               hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `checked` | `bool` | `false` | Initial toggle state. |
| `label` | `string?` | `null` | Text label displayed adjacent to the switch. |
| `target-input` | `string?` | `null` | Form input name receiving `"true"` or `"false"`. |
| `disabled` | `bool` | `false` | Disables toggle interaction. |

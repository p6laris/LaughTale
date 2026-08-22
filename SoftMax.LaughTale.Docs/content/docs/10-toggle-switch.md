---
title: "Aura Spring Switch"
description: "Smooth spring-physics toggle switch for boolean settings"
order: 10
section: "Form & Input Controls"
---

# Aura Spring Switch

The `<island-switch />` TagHelper provides a toggle switch with spring physics, custom text labels, and form input binding.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem;">
    <div>
        <island name="toggle-switch" props-json='{"label": "Enable Two-Factor Authentication", "checked": true}' hydrate="Load"></island>
    </div>
    <div>
        <island name="toggle-switch" props-json='{"label": "Enforce mTLS Gateway Proxy", "checked": false}' hydrate="Load"></island>
    </div>
</div>

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

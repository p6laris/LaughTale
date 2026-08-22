---
title: "Inplace Click-to-Edit"
description: "Inline text display with seamless click-to-edit input transition"
order: 38
section: "Form & Input Controls"
---

# Inplace Click-to-Edit

The `<island-inplace />` TagHelper provides a click-to-edit text field with inline save/cancel buttons and Enter/Escape keyboard shortcut support.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Inplace (Click the text to edit)</div>
    <island name="inplace" props-json='{"value": "Production Node Alpha", "placeholder": "Enter node name..."}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-inplace value="Cluster Primary" target-input="ClusterName" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `string?` | `null` | Display and editable text. |
| `placeholder` | `string?` | `"Click to edit..."` | Empty placeholder text. |
| `target-input` | `string?` | `null` | Form input name receiving the edited value. |

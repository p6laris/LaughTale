---
title: "ColorPicker"
description: "Interactive palette swatch & hex color selector"
order: 33
section: "Form & Input Controls"
---

# ColorPicker

The `<island-color-picker />` TagHelper provides a popover color palette with predefined enterprise swatches, a native color spectrum picker, and hex code synchronization.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live ColorPicker (Click swatch to choose color)</div>
    <island name="color-picker" props-json='{"value": "#10b981", "targetInputName": "ThemeColor"}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-color-picker value="#10b981" target-input="ThemeColor" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `"#10b981"` | Current hex color code. |
| `target-input` | `string?` | `null` | Form input name receiving the hex value. |
| `disabled` | `bool` | `false` | Disables interaction. |

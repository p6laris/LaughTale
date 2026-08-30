---
title: "Radial Dial Knob"
description: "Circular dial knob with smooth pointer dragging and SVG progress arc"
order: 34
section: "Metrics & Display"
---

# Radial Dial Knob

The `<island-knob />` TagHelper provides a circular dial knob with 360-degree pointer drag calculation and dynamic SVG stroke dash offset updates.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Radial Knob (Click &amp; drag circular dial)</div>
    <div style="display: flex; justify-content: center;">
        <island name="knob" props-json='{"value": 75, "min": 0, "max": 100, "size": 110, "color": "var(--p-primary-600)"}' hydrate="Load"></island>
    </div>
</div>

---

## 🚀 Basic Usage

```razor
<island-knob value="75" min="0" max="100" size="110" color="var(--p-primary-600)" target-input="ClusterLoad" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `double` | `50` | Current dial value. |
| `min` | `double` | `0` | Minimum value. |
| `max` | `double` | `100` | Maximum value. |
| `step` | `double` | `1` | Increment step. |
| `size` | `int` | `96` | Diameter in pixels. |
| `color` | `string?` | `null` | Progress arc stroke color. |
| `value-template` | `string` | `"{value}%"` | String format template for center label. |

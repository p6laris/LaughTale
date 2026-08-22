---
title: "Range Slider"
description: "Smooth range slider with draggable handle, fill track, and live value bubble"
order: 11
section: "Form & Input Controls"
---

# Range Slider

The `<island-slider />` TagHelper provides a draggable range slider supporting mouse and touch gestures, customizable steps, and min/max constraints.

---

## 🚀 Basic Usage

```razor
<island-slider value="65" 
               min="0" 
               max="100" 
               step="5" 
               target-input="BandwidthLimit" 
               hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `double` | `0` | Initial slider position. |
| `min` | `double` | `0` | Minimum allowed value. |
| `max` | `double` | `100` | Maximum allowed value. |
| `step` | `double` | `1` | Step increment granularity. |
| `target-input` | `string?` | `null` | Form input name receiving the numeric value string. |
| `disabled` | `bool` | `false` | Disables handle dragging. |

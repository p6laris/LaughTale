---
title: "Compare Slider"
description: "Side-by-side comparison slider supporting horizontal and vertical orientation, slideOnHover, custom handles, SVG charts, and rich templates"
order: 24
section: "Metrics & Visual Media"
---

# Compare

Compare is used to display two items side by side with a slider. It supports horizontal and vertical layouts, hover sliding, custom drag indicators, SVG chart comparisons, and full WAI-ARIA range input accessibility.

---

## 🎮 Interactive Live Demos

### 1. Basic

Composition-based comparison with Before and After image layers and a keyboard-accessible indicator handle.

<island-compare demo-type="basic" />

---

### 2. Custom Handle

The indicator handle can be customized with translucent blur styling, rounded icons, and scale effects on hover.

<island-compare demo-type="custom-handle" custom-handle="true" />

---

### 3. Slide on Hover

Enable `slideOnHover` to update the slider position automatically by hovering over the component.

<island-compare demo-type="hover" slide-on-hover="true" />

---

### 4. Vertical Orientation

Set `orientation="vertical"` for a vertical comparison layout with top and bottom layers.

<island-compare demo-type="vertical" orientation="vertical" />

---

### 5. With Chart Reveal

Combine `slideOnHover` with controlled values for interactive chart reveals with SVG clip paths and gradients.

<island-compare demo-type="with-chart" slide-on-hover="true" />

---

### 6. Controlled Sync

Bind the value with `v-model` or external buttons to keep external UI controls in sync with the slider.

<island-compare demo-type="controlled" />

---

### 7. Creative Template Comparison

Compare is not limited to images — any HTML cards, themes, or UI states can be compared side-by-side.

<island-compare demo-type="template" />

---

## 🚀 Razor Usage

```razor
<!-- Basic Compare -->
<island-compare before-image="https://example.com/before.jpg" 
                after-image="https://example.com/after.jpg" />

<!-- Custom Handle & Hover -->
<island-compare slide-on-hover="true" custom-handle="true" />

<!-- Vertical Layout -->
<island-compare orientation="vertical" />

<!-- SVG Chart Reveal -->
<island-compare demo-type="with-chart" slide-on-hover="true" />

<!-- Controlled Two-Way Binding -->
<island-compare demo-type="controlled" />

<!-- Template Card Comparison -->
<island-compare demo-type="template" />
```

---

## ⌨️ Accessibility

- Hidden native `<input type="range" class="p-compare-input" min="0" max="100" />` for full screen reader and keyboard accessibility.
- Keyboard support: `ArrowLeft`/`ArrowRight` (or `ArrowUp`/`ArrowDown`) adjusts value, `Home` (0%), `End` (100%), `PageUp` (+10%), `PageDown` (-10%).
- `aria-label`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` attributes.

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `model-value` | `double?` | `50` | Slider position percentage (0 to 100). |
| `min` | `double` | `0` | Minimum boundary value. |
| `max` | `double` | `100` | Maximum boundary value. |
| `step` | `double` | `1` | Increment step factor. |
| `orientation` | `string` | `"horizontal"` | Layout orientation: `horizontal` or `vertical`. |
| `slide-on-hover` | `bool` | `false` | Update slider position automatically on mouse hover. |
| `custom-handle` | `bool` | `false` | Render a translucent rounded bubble indicator. |
| `disabled` | `bool` | `false` | Disables interaction and darkens the component. |
| `readonly` | `bool` | `false` | Prevents value adjustment. |
| `before-image` | `string?` | `null` | Image URL for the top/before layer. |
| `after-image` | `string?` | `null` | Image URL for the bottom/after layer. |
| `demo-type` | `string?` | `null` | Preconfigured demo preset (`basic`, `custom-handle`, `hover`, `vertical`, `with-chart`, `controlled`, `template`). |

---
title: "Star Rating"
description: "Interactive 5-star review rating with hover previews and reset button"
order: 12
section: "Form & Input Controls"
---

# Star Rating

The `<island-rating />` TagHelper provides a star rating input with Solar vector SVGs, hover highlights, and an optional cancel button.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Live 5-Star Rating (Hover and Click to Rate)</div>
    <island name="rating" props-json='{"value": 4, "stars": 5, "allowCancel": true}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-rating value="4" 
               stars="5" 
               allow-cancel="true" 
               target-input="OperatorRating" 
               hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `int` | `0` | Initial rating score. |
| `stars` | `int` | `5` | Total number of stars to display. |
| `allow-cancel` | `bool` | `true` | Show/hide the reset (cancel) button. |
| `target-input` | `string?` | `null` | Form input name receiving the integer rating. |
| `disabled` | `bool` | `false` | Read-only mode. |

---
title: "Star Rating"
description: "Interactive 5-star review rating with hover previews and reset button"
order: 12
section: "Form & Input Controls"
---

# Star Rating

The `<island-rating />` TagHelper provides a star rating input with Solar vector SVGs, hover highlights, and an optional cancel button.

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

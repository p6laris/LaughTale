---
title: "Image Compare Slider"
description: "Before and after image comparison slider with a draggable divider"
order: 24
section: "Metrics & Display"
---

# Image Compare Slider

The `<island-image-compare />` TagHelper provides a before/after split slider allowing users to compare two images side-by-side by dragging the divider.

---

## 🚀 Basic Usage

```razor
<island-image-compare before-image="https://example.com/raw.jpg" 
                      after-image="https://example.com/enhanced.jpg" 
                      before-label="Original WebRTC" 
                      after-label="Enhanced HD" 
                      hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `before-image` | `string` | `""` | Image URL displayed on the left/top clip. |
| `after-image` | `string` | `""` | Image URL displayed underneath on the right. |
| `before-label` | `string?` | `"Before"` | Badge text for the before image. |
| `after-label` | `string?` | `"After"` | Badge text for the after image. |

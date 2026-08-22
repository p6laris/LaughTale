---
title: "Image Compare Slider"
description: "Before and after image comparison slider with a draggable divider"
order: 24
section: "Metrics & Display"
---

# Image Compare Slider

The `<island-image-compare />` TagHelper provides a before/after split slider allowing users to compare two images side-by-side by dragging the divider.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Image Compare (Drag handle left/right)</div>
    <island name="image-compare" props-json='{"beforeImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop", "afterImage": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=340&fit=crop", "beforeLabel": "Raw Snapshot", "afterLabel": "Enhanced HD"}' hydrate="Load"></island>
</div>

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

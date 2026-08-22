---
title: "Live WebRTC Camera"
description: "Webcam and mobile camera stream with face framing guide and snapshot capture"
order: 18
section: "Data & Structure"
---

# Live WebRTC Camera

The `<island-camera />` TagHelper provides a camera interface with live video preview, oval face framing guide, resolution control, and instant photo snapshot capture into hidden form inputs.

---

## 🚀 Basic Usage

```razor
<island-camera target-input="CapturedPhoto" 
               title="Facial Identity Verification" 
               show-face-guide="true" 
               hydrate="Interaction" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `target-input` | `string?` | `null` | Form input name receiving base64 image data. |
| `title` | `string?` | `"Camera"` | Display header title. |
| `show-face-guide` | `bool` | `true` | Show/hide the biometric oval face guide overlay. |
| `width` / `height` | `int` | `640` / `480` | Capture canvas resolution dimensions. |

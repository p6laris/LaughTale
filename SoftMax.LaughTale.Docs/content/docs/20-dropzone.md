---
title: "Document Vault Dropzone"
description: "Drag-and-drop file upload with client-side MIME checking and previews"
order: 20
section: "Data & Structure"
---

# Document Vault Dropzone

The `<island-dropzone />` TagHelper provides a drag-and-drop file upload container with client-side MIME verification, file size limits, and instant thumbnail previews.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live File Vault Dropzone (Drag files or click to browse)</div>
    <island name="dropzone" props-json='{"name": "SecurityDocs", "maxSizeMb": 15, "allowedExtensions": [".pdf", ".png", ".jpg"]}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-dropzone name="SecurityCredentials" 
                 max-size-mb="15" 
                 allowed-extensions="@(new[] { ".pdf", ".png", ".jpg" })" 
                 hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `"files"` | Form field input name for multipart uploads. |
| `max-size-mb` | `int` | `10` | Maximum file size in megabytes. |
| `allowed-extensions` | `string[]?` | `null` | Allowed file extensions (`.pdf`, `.png`, etc.). |
| `multiple` | `bool` | `true` | Allow multiple file selections. |

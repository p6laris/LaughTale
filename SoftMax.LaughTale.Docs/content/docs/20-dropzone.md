---
title: "Document Vault Dropzone"
description: "Drag-and-drop file upload with client-side MIME checking and previews"
order: 20
section: "Data & Structure"
---

# Document Vault Dropzone

The `<island-dropzone />` TagHelper provides a drag-and-drop file upload container with client-side MIME verification, file size limits, and instant thumbnail previews.

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

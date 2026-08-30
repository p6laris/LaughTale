---
title: "FileUpload Suite"
description: "Advanced multi-file upload manager with drag-and-drop, progress tracking, file validation, custom templates, and badges"
order: 18
section: "Media & Files"
---

# FileUpload

FileUpload is an advanced file upload component featuring multi-file uploads, drag-and-drop dropzones, real-time upload progress indicators, file type & size validation, and custom templates.

---

## 🎮 Interactive Live Demos

### 1. Basic Single Upload

Quick single-file uploader with auto-upload support and compact button interface.

```razor
<island-fileupload mode="basic" name="demo[]" url="/api/upload" max-file-size="1000000" auto="true" />
```

---

### 2. Advanced Multi-File with Dropzone

Complete upload manager with drag-and-drop zone, file previews, item remove actions, and unified upload triggers.

```razor
<island-fileupload name="demo[]" url="/api/upload" multiple="true" accept="image/*" max-file-size="1000000">
    <template #empty>
        <p>Drag and drop files to here to upload.</p>
    </template>
</island-fileupload>
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `null` | Name of the incoming file parameter for multipart requests. |
| `url` | `string` | `null` | Target upload endpoint URL. |
| `mode` | `string` | `"advanced"` | Layout mode: `"basic"` or `"advanced"`. |
| `multiple` | `bool` | `false` | Allows selecting multiple files simultaneously. |
| `accept` | `string` | `null` | Comma-separated MIME types or file extensions (e.g. `image/*`). |
| `max-file-size` | `long` | `null` | Maximum allowed file size in bytes. |
| `auto` | `bool` | `false` | Automatically starts upload when file selection is made. |

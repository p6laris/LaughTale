---
title: FileUpload Component
description: Advanced file upload control with drag-and-drop, client-side preview, file type validation, chunking, and Anti-CSRF token integration.
order: 23
icon: upload-cloud
category: Form Controls
---

# 📤 FileUpload Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="fileupload" data-props='{"name": "demo-files", "chooseLabel": "Select Attachments", "multiple": true}' data-hydrate="load"></div>
</div>


`<island-fileupload />` provides a drag-and-drop file uploader with real-time upload progress, image thumbnail previews, file size validation, and automatic ASP.NET Core Anti-Forgery token inclusion.

---

## ⚡ 1. Basic Usage

```razor
<island-fileupload name="attachments" 
                   url="/api/upload" 
                   mode="advanced" 
                   multiple="true" 
                   accept="image/*,application/pdf" 
                   max-file-size="10485760" 
                   hydrate="Interaction">
</island-fileupload>
```

In your ASP.NET Core Controller:
```csharp
[HttpPost("/api/upload")]
[ValidateAntiForgeryToken]
public async Task<IActionResult> UploadFiles(List<IFormFile> attachments)
{
    foreach (var file in attachments)
    {
        var savePath = Path.Combine(uploadsDir, file.FileName);
        using var stream = System.IO.File.Create(savePath);
        await file.CopyToAsync(stream);
    }
    return Ok(new { count = attachments.Count });
}
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `files` | Form payload field name |
| `url` | `string` | `null` | Upload endpoint target URL |
| `mode` | `basic \| advanced` | `advanced` | Basic button vs full drag-and-drop UI |
| `multiple` | `bool` | `false` | Allow selecting multiple files |
| `accept` | `string` | `null` | MIME type filter (e.g. `image/*`) |
| `max-file-size` | `long` | `null` | Maximum allowed file size in bytes |
| `auto` | `bool` | `false` | Upload automatically upon selection |

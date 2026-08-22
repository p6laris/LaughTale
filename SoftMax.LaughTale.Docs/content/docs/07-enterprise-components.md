---
title: "Batteries-Included Enterprise Components"
description: "Production-ready Steppers, Timelines, WebRTC Camera, Dropzones, and DataGrids"
order: 7
section: "Zero-JS Architecture"
---

# Batteries-Included Enterprise Components

The `SoftMax.LaughTale.Components` package provides **pre-built, production-ready enterprise UI TagHelpers** styled in Aura.

You write pure C# Razor markup without creating any client script files!

---

## 🏗️ 1. Multi-Step Form Wizard (`<island-stepper />`)

Projects server-rendered C# Razor slots per step with step validation and progress tracking:

```razor
@using SoftMax.LaughTale.Components.Models

<island-stepper steps="@Model.Steps" hydrate="Load">
    <!-- Step 1 C# Slot -->
    <div data-step="0">
        <h3>Step 1: Personal Profile</h3>
        <input type="text" name="FullName" />
    </div>

    <!-- Step 2 C# Slot -->
    <div data-step="1">
        <h3>Step 2: Department Selection</h3>
        <island-tree-select nodes="@Model.Departments" target-input="DeptId" />
    </div>

    <!-- Step 3 C# Slot -->
    <div data-step="2">
        <h3>Step 3: Document Upload</h3>
        <island-dropzone name="VerificationDocs" />
    </div>
</island-stepper>
```

---

## 🕒 2. Event & Audit Log Timeline (`<island-timeline />`)

Renders chronological audit trails with status badges and actor metadata:

```razor
<island-timeline events="@Model.AuditLogs" title="System Security Audit" hydrate="Visible" />
```

---

## 📸 3. Live Hardware Camera (`<island-camera />`)

Captures webcam/mobile camera snapshots via HTML5 WebRTC with face framing guide and canvas output:

```razor
<island-camera target-input="BiometricPhotoData" 
               title="Facial Identity Verification" 
               show-face-guide="true" 
               hydrate="Interaction" />
```

---

## 📊 4. Filterable Enterprise DataGrid (`<island-datagrid />`)

Provides client/server sorting, real-time search filtering, and pagination:

```razor
<island-datagrid columns="@Model.Columns" 
                 data="@Model.Operators" 
                 page-size="5" 
                 title="Cluster Nodes" 
                 hydrate="Visible" />
```

---

## 📂 5. Secure Document Vault (`<island-dropzone />`)

Drag & drop file upload with client-side MIME checking, size limits, and instant previews:

```razor
<island-dropzone name="Credentials" 
                 max-size-mb="15" 
                 allowed-extensions="@(new[] { ".pdf", ".png", ".jpg" })" 
                 hydrate="Load" />
```

---
title: "Multi-Step Stepper Wizard"
description: "Multi-step form progression with server-rendered C# Razor slots"
order: 16
section: "Data & Structure"
---

# Multi-Step Stepper Wizard

The `<island-stepper />` TagHelper provides a multi-step form workflow that projects server-rendered C# Razor slots per step with progress indicators and validation guards.

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var steps = new List<StepperStep>
    {
        new("step-1", "Identity", "Biometrics", "1"),
        new("step-2", "Department", "Role Allocation", "2"),
        new("step-3", "Clearance", "Sign-Off", "3")
    };
}

<island-stepper steps="@steps" hydrate="Load">
    <!-- Step 1 C# Slot -->
    <div data-step="0">
        <h3>Step 1: Facial Biometrics</h3>
        <p>Verify your physical identity.</p>
    </div>

    <!-- Step 2 C# Slot -->
    <div data-step="1">
        <h3>Step 2: Department Assignment</h3>
        <p>Select your organizational unit.</p>
    </div>

    <!-- Step 3 C# Slot -->
    <div data-step="2">
        <h3>Step 3: Document Vault Upload</h3>
        <p>Upload your signed credentials.</p>
    </div>
</island-stepper>
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `steps` | `List<StepperStep>` | `new()` | Step definitions containing `Id`, `Title`, `Description`, and `Icon`. |
| `active-step` | `int` | `0` | 0-indexed initial active step. |
| `linear` | `bool` | `true` | Enforces sequential forward progression. |

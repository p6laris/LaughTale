---
title: "Stepper Multi-Step Wizard"
description: "Linear and non-linear multi-step form wizard with validation, progress indicators, and server-rendered C# Razor step slots."
order: 16
section: "Data & Tables"
---

# Stepper Multi-Step Wizard

Stepper is a structured multi-step form and process wizard component that guides users through complex enterprise workflows with linear or non-linear progression, validation gates, and server-rendered Razor step slots.

---

## 🎮 Interactive Live Demos

### 1. Basic Multi-Step Wizard

```razor
@page
@model StepperPageModel

<island-stepper value="1" linear="true">
    <stepper-panel header="Account Details">
        <div class="p-4 bg-surface-50 rounded-lg">
            <h4>Step 1: Create Account</h4>
            <div class="form-group my-3">
                <label>Email Address</label>
                <input type="email" class="p-inputtext" placeholder="user@company.io" />
            </div>
            <button type="button" class="p-button p-button-primary" onclick="$stepper.next()">Next Step &rarr;</button>
        </div>
    </stepper-panel>

    <stepper-panel header="Profile Information">
        <div class="p-4 bg-surface-50 rounded-lg">
            <h4>Step 2: Profile Details</h4>
            <div class="form-group my-3">
                <label>Full Name</label>
                <input type="text" class="p-inputtext" placeholder="Alice Montgomery" />
            </div>
            <div class="flex gap-2">
                <button type="button" class="p-button p-button-secondary" onclick="$stepper.prev()">&larr; Previous</button>
                <button type="button" class="p-button p-button-primary" onclick="$stepper.next()">Next Step &rarr;</button>
            </div>
        </div>
    </stepper-panel>

    <stepper-panel header="Confirmation">
        <div class="p-4 bg-surface-50 rounded-lg">
            <h4>Step 3: Review & Submit</h4>
            <p class="text-sm text-muted">Please confirm your details before completing setup.</p>
            <div class="flex gap-2 mt-4">
                <button type="button" class="p-button p-button-secondary" onclick="$stepper.prev()">&larr; Previous</button>
                <button type="button" class="p-button p-button-success" onclick="alert('Account Created!')">Complete Registration</button>
            </div>
        </div>
    </stepper-panel>
</island-stepper>
```

---

## ⚙️ C# TagHelper Attributes & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `int` | `1` | The currently active step index (1-based). |
| `linear` | `bool` | `true` | When true, enforces sequential step completion. |
| `orientation` | `string` | `"horizontal"` | `"horizontal"` or `"vertical"` step layout. |
| `class` | `string` | `null` | Additional CSS class for the root wrapper. |

---

## 🧩 Addressable Parts (`data-part`)

| Part Name | Target Element | Description |
|---|---|---|
| `root` | `.p-stepper` | Outer wizard container. |
| `nav` | `.p-stepper-nav` | Step headers indicator track. |
| `step` | `.p-stepper-step` | Individual step item (circle & label). |
| `panel` | `.p-stepper-panel` | Active step body container. |

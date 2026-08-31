---
title: Stepper Component
description: Multi-step linear or non-linear wizard for checkout, onboarding, and multi-stage form workflows.
order: 24
icon: list
category: Navigation
---

# 🪜 Stepper Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="stepper" data-props='{"activeStep": 1, "linear": false, "steps": [{"title": "Account", "icon": "user"}, {"title": "Address", "icon": "mapPin"}, {"title": "Confirmation", "icon": "check"}]}' data-hydrate="load"></div>
</div>


`<island-stepper />` provides a multi-step workflow container for complex forms, user onboarding, and checkout processes.

---

## ⚡ 1. Basic Usage

```razor
@model CheckoutModel

<island-stepper value="1" linear="true">
    <!-- Step 1: Personal Info -->
    <div slot="step-1" title="Personal Details" icon="user">
        <h4 class="font-bold text-lg mb-3">Step 1: Contact Information</h4>
        <input type="text" class="p-inputtext w-full mb-3" placeholder="Full Name" />
        <input type="email" class="p-inputtext w-full" placeholder="Email Address" />
    </div>

    <!-- Step 2: Shipping -->
    <div slot="step-2" title="Shipping Address" icon="truck">
        <h4 class="font-bold text-lg mb-3">Step 2: Delivery Location</h4>
        <input type="text" class="p-inputtext w-full mb-3" placeholder="Street Address" />
        <input type="text" class="p-inputtext w-full" placeholder="City / Postal Code" />
    </div>

    <!-- Step 3: Payment -->
    <div slot="step-3" title="Payment" icon="credit-card">
        <h4 class="font-bold text-lg mb-3">Step 3: Review & Confirm</h4>
        <p class="text-sm text-surface-600">Total: <strong>$149.00</strong></p>
    </div>
</island-stepper>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `int \| string` | `1` | Current active step index (1-based) |
| `linear` | `bool` | `true` | Enforce linear forward step completion |
| `orientation` | `horizontal \| vertical` | `horizontal` | Header layout axis |

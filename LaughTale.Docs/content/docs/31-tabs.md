---
title: Tabs Component
description: Accessible tabbed content container with keyboard navigation, active indicators, and dynamic lazy panels.
order: 26
icon: folders
category: Navigation
---

# 🗂️ Tabs Component

`<island-tabs />` organizes content into tabbed panels with smooth indicator sliding and full ARIA keyboard navigation (ArrowLeft / ArrowRight).

---

## ⚡ 1. Basic Usage

```razor
<island-tabs value="0">
    <div slot="tab-0" header="Account Profile" icon="user">
        <p class="p-4 text-surface-700">Manage your profile information and credentials.</p>
    </div>

    <div slot="tab-1" header="Security & 2FA" icon="shield">
        <p class="p-4 text-surface-700">Configure multi-factor authentication and active sessions.</p>
    </div>

    <div slot="tab-2" header="Billing & Invoices" icon="credit-card">
        <p class="p-4 text-surface-700">View past invoices and update payment methods.</p>
    </div>
</island-tabs>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `int \| string` | `0` | Default active tab index |
| `scrollable` | `bool` | `false` | Enable horizontal tab header scrolling on overflow |
| `lazy` | `bool` | `false` | Only render panel DOM when tab becomes active |

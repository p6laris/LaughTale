---
title: Tabs Component
description: Accessible tabbed content container with keyboard navigation, active indicators, and dynamic lazy panels.
order: 26
icon: folders
category: Navigation
---

# 🗂️ Tabs Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="tabs" data-props='{"value": 0}' data-hydrate="load">
        <div slot="tab-0" header="Account Details">
            <p style="padding: 1rem; margin: 0; color: var(--p-text-muted);">Manage your personal profile and email preferences.</p>
        </div>
        <div slot="tab-1" header="Security Keys">
            <p style="padding: 1rem; margin: 0; color: var(--p-text-muted);">Configure WebAuthn FIDO2 keys and 2FA credentials.</p>
        </div>
    </div>
</div>

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

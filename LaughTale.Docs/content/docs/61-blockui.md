---
title: BlockUI Component
description: Content blocker masking target elements or full page during background operations.
order: 40
icon: shield-off
category: Overlays & Dialogs
---

# BlockUI Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="position: relative; padding: 1.5rem; border: 1px solid var(--p-border-color); border-radius: 8px; background: var(--p-surface-0);">
        <h4 style="margin: 0 0 0.5rem 0; font-weight: 700;">Protected Transaction Panel</h4>
        <p style="margin: 0; font-size: 0.875rem; color: var(--p-text-muted);">This panel automatically dims and locks when background sync or long-running queries are in progress.</p>
    </div>
</div>


`<island-blockui />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-blockui blocked="@Model.IsBusy">
    <div class="p-6">Protected Content</div>
</island-blockui>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `blocked` | `bool` | `false` | Active blocking mask state |
| `full-screen` | `bool` | `false` | Block entire browser viewport |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-blockui />`:

```razor
<island-blockui hydrate="Visible" />
```

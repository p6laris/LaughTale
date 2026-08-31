---
title: Tag & Badge Components
description: Compact labels and numeric status badges with semantic severities.
order: 40
icon: tag
category: Media & Misc
---

# Tag & Badge Components



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
        <span class="p-tag p-tag-success">Active</span>
        <span class="p-tag p-tag-info">Processing</span>
        <span class="p-tag p-tag-warn">Pending Review</span>
        <span class="p-tag p-tag-danger">Rejected</span>
    </div>
</div>

`<island-tag />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-tag value="Active" severity="success" icon="check" rounded="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `null` | Tag text caption |
| `severity` | `primary | success | info | warn | danger | secondary` | `primary` | Color severity |
| `rounded` | `bool` | `false` | Pill rounded shape |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-tag />`:

```razor
<island-tag hydrate="Visible" />
```

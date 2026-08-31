---
title: Button Component
description: Versatile button control with severity variants, sizes, Lucide icons, loading states, and badge counters.
order: 28
icon: zap
category: Form Controls
---

# 🔘 Button Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <button type="button" class="p-button p-button-primary">Primary Action</button>
        <button type="button" class="p-button p-button-secondary">Secondary</button>
        <button type="button" class="p-button p-button-success">Success</button>
        <button type="button" class="p-button p-button-danger">Danger</button>
        <button type="button" class="p-button p-button-outlined">Outlined</button>
    </div>
</div>

`<island-button />` renders an interactive button supporting multiple severity variants, sizes, Lucide icons, loading spinners, and badges.

---

## ⚡ 1. Basic Usage & Variants

```razor
<!-- 1. Primary Button with Icon -->
<island-button label="Submit Order" icon="check" severity="primary" size="large" />

<!-- 2. Secondary & Outlined -->
<island-button label="Cancel" severity="secondary" variant="outlined" />

<!-- 3. Danger Severity for Destructive Actions -->
<island-button label="Delete Record" icon="trash-2" severity="danger" />

<!-- 4. Loading State -->
<island-button label="Saving..." loading="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `null` | Button text caption |
| `icon` | `string` | `null` | Lucide icon name (e.g. `check`, `zap`, `trash-2`) |
| `severity` | `primary \| secondary \| success \| info \| warn \| danger` | `primary` | Color theme severity |
| `variant` | `solid \| outlined \| text` | `solid` | Visual style variant |
| `size` | `small \| medium \| large` | `medium` | Button dimensions and font size |
| `loading` | `bool` | `false` | Display animated spinner and disable clicks |
| `badge` | `string` | `null` | Optional numeric or text badge attached to button |

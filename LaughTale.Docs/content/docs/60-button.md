---
title: Button Component
description: Versatile button control with severity variants, sizes, Lucide icons, loading states, and badge counters.
order: 28
icon: zap
category: Form Controls
---

# 🔘 Button Component

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

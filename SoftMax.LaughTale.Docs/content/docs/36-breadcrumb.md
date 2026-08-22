---
title: "Breadcrumb Navigation"
description: "Hierarchical navigation trail with home icon and Lucide chevron separators"
order: 36
section: "Panels & Navigation"
---

# Breadcrumb Navigation

The `<island-breadcrumb />` TagHelper renders a clean hierarchical breadcrumb navigation trail with home icon and active path styling.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Breadcrumb Trail</div>
    <island name="breadcrumb" props-json='{"homeUrl": "/", "items": [{"label": "Enterprise Portal", "url": "/enterprise"}, {"label": "Security Clusters", "url": "/enterprise#clusters"}, {"label": "Node Zero-Trust #01"}]}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-breadcrumb items="@Model.Breadcrumbs" home-url="/" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `items` | `List<BreadcrumbItem>` | `new()` | List of breadcrumb models (`Label`, `Url`, `Icon`). |
| `home-url` | `string` | `"/"` | Home icon target URL. |

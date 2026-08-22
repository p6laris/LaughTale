---
title: "Status Tag & Badge"
description: "Visual status pill with icons, rounded borders, and severity themes"
order: 35
section: "Metrics & Display"
---

# Status Tag & Badge

The `<island-tag />` TagHelper renders styled status pills with severity color themes (`success`, `info`, `warning`, `danger`, `secondary`, `contrast`).

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Status Tags</div>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <island name="tag" props-json='{"value": "Encrypted Session", "severity": "success", "rounded": true}' hydrate="Load"></island>
        <island name="tag" props-json='{"value": "HSM Key Level 4", "severity": "info", "rounded": false}' hydrate="Load"></island>
        <island name="tag" props-json='{"value": "Awaiting Sign-Off", "severity": "warning", "rounded": true}' hydrate="Load"></island>
        <island name="tag" props-json='{"value": "Revoked Certificate", "severity": "danger", "rounded": false}' hydrate="Load"></island>
    </div>
</div>

---

## 🚀 Basic Usage

```razor
<island-tag value="Verified Node" severity="success" rounded="true" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `""` | Tag display label. |
| `severity` | `string` | `"info"` | Theme (`success`, `info`, `warning`, `danger`, `secondary`, `contrast`). |
| `rounded` | `bool` | `false` | When true, renders with fully rounded pill borders. |

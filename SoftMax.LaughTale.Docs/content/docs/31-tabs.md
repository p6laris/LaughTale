---
title: "Tabs & TabView"
description: "Animated underlined tab switcher for modular dashboard sections"
order: 31
section: "Panels & Navigation"
---

# Tabs & TabView

The `<island-tabs />` TagHelper provides an animated, underlined tab navigation bar with support for Razor slots and form input synchronization.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Tabs (Click tabs to switch views)</div>
    <island name="tabs" props-json='{"tabs": [{"id": "t1", "header": "Cluster Health", "content": "All 18 core services running at nominal latency (< 5ms). Zero anomalous egress detected.", "icon": "⚡"}, {"id": "t2", "header": "Threat Monitoring", "content": "Real-time AI behavioral anomaly detection active. 0 critical vulnerabilities identified.", "icon": "🛡️"}, {"id": "t3", "header": "Backups", "content": "Geo-redundant continuous volume backups synchronized with RPO < 15s.", "icon": "💾"}], "activeIndex": 0}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-tabs tabs="@Model.TabSections" active-index="0" target-input="ActiveTab" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `tabs` | `List<TabItem>` | `new()` | List of tab models (`Id`, `Header`, `Content`, `Icon`, `Disabled`). |
| `active-index` | `int` | `0` | Default active tab index. |
| `target-input` | `string?` | `null` | Form input name receiving the selected tab index. |

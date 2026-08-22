---
title: "Accordion & Panels"
description: "Collapsible multi-tab accordion sections with smooth chevron animation and slot projection"
order: 30
section: "Panels & Navigation"
---

# Accordion & Collapsible Panels

The `<island-accordion />` TagHelper renders collapsible content panels with animated Lucide chevrons, keyboard accessibility, and multi-panel expansion support.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Accordion (Click headers to expand/collapse)</div>
    <island name="accordion" props-json='{"tabs": [{"id": "t1", "header": "Zero-Trust Security Architecture", "content": "All internal IPC transactions and REST endpoints require mutual TLS 1.3 authentication.", "icon": "🔒"}, {"id": "t2", "header": "Islands Hydration Lifecycle", "content": "Micro-bundles are lazy-loaded only when the island becomes visible in the viewport.", "icon": "⚡"}, {"id": "t3", "header": "FIPS 140-3 Hardware Security Module", "content": "Physical tamper-resistant HSM keys with automated annual key rotations.", "icon": "🛡️"}], "activeIndex": 0}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-accordion tabs="@Model.SecurityPanels" active-index="0" multiple="false" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `tabs` | `List<AccordionTab>` | `new()` | List of tab models with `Id`, `Header`, `Content`, and optional `Icon`. |
| `active-index` | `int` | `0` | Initially expanded tab index. |
| `multiple` | `bool` | `false` | When true, multiple tabs can be open simultaneously. |

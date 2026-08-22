---
title: "TweakAura Theme Studio"
description: "tweakcn-style interactive visual theme editor with 1-click CSS and C# token export"
order: 42
section: "Panels & Navigation"
---

# TweakAura Theme Studio

The `<island-theme-studio />` TagHelper embeds a floating **live theme customizer** directly into your application.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Interactive Theme Studio Drawer</div>
    <island name="theme-studio" props-json='{"defaultOpen": false}' hydrate="Load"></island>
    <button type="button" onclick="document.dispatchEvent(new CustomEvent('studio:open'))" class="p-button p-button-primary">
        Launch Theme Studio 🎨
    </button>
</div>

---

## 🚀 Basic Usage

```razor
<!-- Embed anywhere in your layout -->
<island-theme-studio />
```

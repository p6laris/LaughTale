---
title: Message Component
description: Inline alert and banner messages with severity icons and closable dismiss actions.
order: 40
icon: info
category: Overlays & Dialogs
---

# Message Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div data-island="message" data-props='{"severity": "success", "text": "Operation executed successfully."}' data-hydrate="load"></div>
        <div data-island="message" data-props='{"severity": "warn", "text": "Warning: High memory footprint detected."}' data-hydrate="load"></div>
        <div data-island="message" data-props='{"severity": "danger", "text": "Error: Database connection failed."}' data-hydrate="load"></div>
    </div>
</div>


`<island-message />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-message severity="warn" icon="alert-triangle" closable="true">
    Please verify your email address to unlock full features.
</island-message>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `severity` | `success | info | warn | error | secondary` | `info` | Color severity theme |
| `icon` | `string` | `null` | Custom Lucide icon name |
| `closable` | `bool` | `false` | Display dismiss close button |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-message />`:

```razor
<island-message hydrate="Visible" />
```

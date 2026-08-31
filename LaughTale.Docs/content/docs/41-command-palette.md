---
title: Command Palette Component
description: Global Ctrl+K spotlight modal for instant fuzzy search, route jumping, and shortcuts.
order: 40
icon: command
category: Overlays & Dialogs
---

# Command Palette Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; align-items: center; gap: 1rem;">
        <button type="button" class="p-button p-button-primary" onclick="document.dispatchEvent(new CustomEvent('palette:open'))">
            Open Command Palette <kbd style="margin-left: 0.5rem; background: rgba(255,255,255,0.2); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem;">⌘K</kbd>
        </button>
    </div>
</div>


`<island-command-palette />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-command-palette placeholder="Type a command or search..." />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `placeholder` | `string` | `Search...` | Input placeholder text |
| `hotkey` | `string` | `ctrl+k` | Keyboard shortcut trigger |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-command-palette />`:

```razor
<island-command-palette hydrate="Visible" />
```

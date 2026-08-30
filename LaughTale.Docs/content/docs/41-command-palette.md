---
title: "Spotlight Command Palette"
description: "Global Ctrl+K / Cmd+K fuzzy-search command palette with shortcut badges"
order: 41
section: "Panels & Navigation"
---

# Spotlight Command Palette

The `<island-command />` TagHelper injects an accessible, keyboard-first **Spotlight Command Palette** triggered by `Ctrl+K` or `Cmd+K`.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Command Palette Trigger (Press Ctrl+K or Click Below)</div>
    <island name="command" props-json='{"placeholder": "Search documentation or trigger actions...", "items": [{"id": "1", "label": "Getting Started", "group": "Docs", "icon": "file-text", "url": "/doc/01-getting-started", "shortcut": "G S"}, {"id": "2", "label": "Composables API", "group": "Docs", "icon": "code", "url": "/doc/39-composables", "shortcut": "G C"}, {"id": "3", "label": "Launch Theme Studio", "group": "Actions", "icon": "palette", "action": "open-studio", "shortcut": "T S"}, {"id": "4", "label": "Toggle Dark Mode", "group": "Preferences", "icon": "moon", "action": "toggle-dark", "shortcut": "T D"}]}' hydrate="Load"></island>
    <button type="button" onclick="document.dispatchEvent(new CustomEvent('command:open'))" class="p-button p-button-primary">
        Open Spotlight (Ctrl+K)
    </button>
</div>

---

## 🚀 Basic Usage

```razor
@using LaughTale.Components.Models

@{
    var commands = new List<CommandPaletteItem>
    {
        new("dash", "Open Dashboard", "Navigation", "bar-chart", "G D", "/dashboard"),
        new("docs", "Documentation", "Navigation", "file-text", "G D", "/doc/01-getting-started"),
        new("studio", "Theme Studio", "Actions", "palette", "T S", null, "open-studio")
    };
}

<island-command items="@commands" />
```

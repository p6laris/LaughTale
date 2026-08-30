---
title: "ContextMenu Overlay"
description: "Right-click context menu overlay with cascading submenus, global document attachment, custom templates, command actions, and router navigation"
order: 47
section: "Panels & Navigation"
---

# ContextMenu

ContextMenu displays an overlay menu on right click of its target element or across the document. It supports multi-level recursive flyout submenus, keyboard navigation, shortcuts, badges, command callbacks, and router links.

---

## 🎮 Interactive Live Demos

### 1. Basic

Attached to a target element and activated with a right-click.

<island-contextmenu demo-type="basic" />

---

### 2. Submenus

Multi-level nested submenus with flyout cascading and viewport edge collision detection.

<island-contextmenu demo-type="submenus" />

---

### 3. Global Attachment

Attaches the context menu globally to the entire card area.

<island-contextmenu demo-type="global" global="true" />

---

### 4. Custom Item Template

Product list context menu featuring keyboard shortcuts (`⌘+D`, `⌘+A`), category icons, and colored numeric badges.

<island-contextmenu demo-type="template" />

---

### 5. Command & Dynamic Actions

User management context menu that mutates roles (`Admin`, `Member`, `Guest`) and fires toast notifications via command callbacks.

<island-contextmenu demo-type="command" />

---

### 6. Router & External Links

Supports navigation via router links, programmatic command routing, or external URLs.

<island-contextmenu demo-type="router" />

---

## 🚀 Razor Usage

```razor
<!-- Basic ContextMenu -->
<island-contextmenu demo-type="basic" />

<!-- Submenus -->
<island-contextmenu demo-type="submenus" />

<!-- Global Document ContextMenu -->
<island-contextmenu global="true" />

<!-- With Custom Model Items -->
<island-contextmenu model="@Model.ContextMenuItems" />
```

---

## ⌨️ Accessibility (WAI-ARIA)

- Screen Reader: `role="menubar"` with `aria-orientation="vertical"`.
- Menu items use `role="menuitem"` with `aria-haspopup="true"` and `aria-expanded` attributes for submenus.
- Keyboard support:
  - `Tab` / `Escape`: Closes the context menu overlay.
  - `ArrowDown` / `ArrowUp`: Navigates through menu items with focus rings.
  - `ArrowRight`: Opens active submenu and focuses first child.
  - `ArrowLeft`: Closes active submenu and returns focus to parent item.
  - `Enter` / `Space`: Activates the item's command/action and closes the menu.
  - `Home` / `End`: Jumps to the first or last item in the list.

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `model` | `List<MenuItem>?` | `null` | Array of hierarchical menu items. |
| `target` | `string?` | `null` | CSS selector of target element. |
| `global` | `bool` | `false` | When true, attaches context menu to document. |
| `breakpoint` | `string` | `"960px"` | Maximum width boundary for responsive layout. |
| `demo-type` | `string?` | `null` | Preconfigured demo preset (`basic`, `submenus`, `global`, `template`, `command`, `router`). |

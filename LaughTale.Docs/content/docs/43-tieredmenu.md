---
title: "TieredMenu Flyout"
description: "Hierarchical vertical navigation menu with nested flyout overlay submenus and accessibility"
order: 43
section: "Panels & Navigation"
---

# TieredMenu

TieredMenu displays submenus in nested overlays with cascading flyouts, popup trigger modes, shortcuts, badges, commands, and full WAI-ARIA accessibility.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1.5rem; margin: 1.5rem 0; display: flex; justify-content: center;">
    <island name="tieredmenu" props-json='{"model": [{"label": "File", "icon": "file", "items": [{"label": "New", "icon": "plus", "items": [{"label": "Document", "icon": "file"}, {"label": "Image", "icon": "image"}, {"label": "Video", "icon": "video"}]}, {"label": "Open", "icon": "folderOpen"}, {"label": "Print", "icon": "print"}]}, {"label": "Edit", "icon": "fileEdit", "items": [{"label": "Copy", "icon": "copy"}, {"label": "Delete", "icon": "trash2"}]}, {"label": "Search", "icon": "search"}, {"separator": true}, {"label": "Share", "icon": "share2", "items": [{"label": "Slack", "icon": "slack"}, {"label": "Whatsapp", "icon": "phone"}]}]}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-tieredmenu items="@Model.TieredMenuItems" />
```

```csharp
public List<MenuItem> TieredMenuItems { get; set; } = new()
{
    new(Label: "File", Icon: "file", Items: new()
    {
        new(Label: "New", Icon: "plus", Items: new()
        {
            new(Label: "Document", Icon: "file"),
            new(Label: "Image", Icon: "image"),
            new(Label: "Video", Icon: "video")
        }),
        new(Label: "Open", Icon: "folderOpen"),
        new(Label: "Print", Icon: "printer")
    }),
    new(Label: "Edit", Icon: "fileEdit", Items: new()
    {
        new(Label: "Copy", Icon: "copy"),
        new(Label: "Delete", Icon: "trash2")
    }),
    new(Label: "Search", Icon: "search"),
    new(Separator: true),
    new(Label: "Share", Icon: "share2", Items: new()
    {
        new(Label: "Slack", Icon: "slack"),
        new(Label: "Whatsapp", Icon: "phone")
    })
};
```

---

## 🔘 Popup Overlay Trigger

Popup mode is enabled by setting `popup="true"`:

```razor
<island-tieredmenu items="@Model.TieredMenuItems" popup="true" trigger-text="Toggle TieredMenu" trigger-icon="layers" trigger-severity="primary" />
```

---

## ⌨️ Accessibility & Keyboard Navigation

| Key | Function |
|---|---|
| `Tab` | Moves focus to the first item if entering menu. |
| `Down Arrow` | Moves focus to the next menuitem within current submenu. |
| `Up Arrow` | Moves focus to the previous menuitem within current submenu. |
| `Right Arrow` | Opens nested flyout submenu and moves focus to the first sub-item. |
| `Left Arrow` | Closes active flyout submenu and returns focus to the parent item. |
| `Enter` / `Space` | Activates the menuitem or toggles the submenu visibility. |
| `Escape` | Closes any active submenus or dismisses the popup overlay. |
| `Home` / `End` | Moves focus to first or last item in the active menu list. |

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `model` / `items` | `List<MenuItem>` | `new()` | An array of hierarchical MenuItem models. |
| `popup` | `bool` | `false` | Defines if menu is displayed as an overlay popup. |
| `trigger-text` | `string` | `null` | Label text for the trigger button in popup mode. |
| `trigger-icon` | `string` | `null` | Vector Lucide icon for the popup trigger button. |
| `trigger-severity` | `string` | `"primary"` | Button severity (`primary`, `secondary`, `success`, `info`, `warn`, `danger`). |
| `custom-template` | `bool` | `false` | Enables badge pills and shortcut annotations. |
| `breakpoint` | `string` | `"960px"` | Breakpoint to define maximum width boundary. |
| `auto-z-index` | `bool` | `true` | Whether to automatically manage layering. |
| `base-z-index` | `int` | `0` | Base zIndex value to use in layering. |

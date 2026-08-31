---
title: Chips Component
description: Multi-value text tag input with keyboard Enter/Backspace chip creation and deletion.
order: 40
icon: tag
category: Form Controls
---

# Chips Component

`<island-chips />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-chips name="Tags" value="@Model.SelectedTags" separator="," placeholder="Add tag..." />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `value` | `List<string>` | `null` | Array of tag strings |
| `max` | `int?` | `null` | Maximum number of allowed chips |
| `separator` | `string` | `null` | Character delimiter for paste splitting |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-chips />`:

```razor
<island-chips hydrate="Visible" />
```

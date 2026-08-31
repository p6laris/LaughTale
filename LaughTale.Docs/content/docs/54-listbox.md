---
title: ListBox Component
description: Scrollable single and multi-selection list options with search filtering and custom templates.
order: 40
icon: list
category: Form Controls
---

# ListBox Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 280px;">
        <div data-island="listbox" data-props='{"options": [{"label": "New York", "value": "NY"}, {"label": "London", "value": "LDN"}, {"label": "Tokyo", "value": "TKO"}, {"label": "Berlin", "value": "BER"}]}' data-hydrate="load"></div>
    </div>
</div>


`<island-listbox />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-listbox name="SelectedUser" options="@Model.Users" option-label="Name" option-value="Id" filter="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `options` | `IEnumerable<T>` | `null` | Options list |
| `multiple` | `bool` | `false` | Enable multi-selection |
| `filter` | `bool` | `false` | Enable search filter input |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-listbox />`:

```razor
<island-listbox hydrate="Visible" />
```

---
title: "Button & SplitButton"
description: "Complete Aura button suites with severities, outlined/text/raised variants, loading spinners, icons, badges, and split dropdowns"
order: 60
section: "Buttons & Actions"
---

# Button

Button provides extensive styling variants (Primary, Secondary, Success, Info, Warn, Help, Danger, Contrast), loading state management, and split button dropdown menus.

---

## 🎮 Interactive Live Demos

### 1. Severities & Outlined Variants

```razor
<button type="button" class="p-button p-button-primary">Primary</button>
<button type="button" class="p-button p-button-success">Success</button>
<button type="button" class="p-button p-button-danger">Danger</button>
```

---

### 2. SplitButton

```razor
<island-split-button label="Save" model="@Model.SaveActions" severity="primary" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `null` | Primary button text label. |
| `model` | `List<MenuItem>` | `null` | Split dropdown action items. |
| `severity` | `string` | `"primary"` | Button color scheme. |

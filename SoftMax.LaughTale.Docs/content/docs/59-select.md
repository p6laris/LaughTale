---
title: "Select & MultiSelect"
description: "Modern dropdown select components with virtual scrolling, live filtering, checkbox multi-selection, and grouping"
order: 59
section: "Form & Input Controls"
---

# Select

Select (Dropdown), MultiSelect, and CascadeSelect provide flexible option selection interfaces with search filtering, clear buttons, and loading states.

---

## 🎮 Interactive Live Demos

### 1. Select Dropdown

```razor
<island-select options="@Model.Countries" placeholder="Select a Country" filter="true" show-clear="true" />
```

---

### 2. MultiSelect with Chips

```razor
<island-multiselect options="@Model.Roles" display="chip" placeholder="Select Roles" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `options` | `IEnumerable<T>` | `null` | Options list. |
| `placeholder` | `string` | `null` | Hint text when no option is selected. |
| `filter` | `bool` | `false` | Live search input inside overlay. |
| `show-clear` | `bool` | `false` | Displays clear button when value is set. |

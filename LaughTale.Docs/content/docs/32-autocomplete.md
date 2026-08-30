---
title: "AutoComplete & Combobox"
description: "Filterable dropdown with live item search, check indicator, and clear button"
order: 32
section: "Form & Input Controls"
---

# AutoComplete & Combobox

The `<island-autocomplete />` TagHelper provides a filterable search dropdown combobox with instant typing filtering and quick clear button.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live AutoComplete (Type to search cities)</div>
    <island name="autocomplete" props-json='{"items": [{"label": "Erbil, Kurdistan", "value": "EBL"}, {"label": "Sulaymaniyah, Kurdistan", "value": "SUL"}, {"label": "Duhok, Kurdistan", "value": "DHK"}, {"label": "Baghdad, Iraq", "value": "BGW"}], "placeholder": "Search city or airport code..."}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-autocomplete items="@Model.CityOptions" 
                     placeholder="Search city..." 
                     target-input="SelectedCity" 
                     hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `items` | `List<AutoCompleteItem>` | `new()` | Searchable list of items (`Label`, `Value`, `Icon`). |
| `placeholder` | `string?` | `"Search or select..."` | Input placeholder text. |
| `value` | `string?` | `null` | Pre-selected item value. |
| `target-input` | `string?` | `null` | Hidden form input name receiving the selected value. |

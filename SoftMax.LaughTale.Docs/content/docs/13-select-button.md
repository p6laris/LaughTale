---
title: "Segmented SelectButton"
description: "Segmented pill button switcher for toggling view modes and filters"
order: 13
section: "Form & Input Controls"
---

# Segmented SelectButton

The `<island-select-button />` TagHelper renders a grouped set of buttons in a pill container for toggling between distinct options.

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var intervals = new List<SelectButtonItem>
    {
        new("Daily", "daily"),
        new("Weekly", "weekly"),
        new("Monthly", "monthly"),
        new("Annual", "annual")
    };
}

<island-select-button items="@intervals" 
                      value="monthly" 
                      target-input="ReportingPeriod" 
                      hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `items` | `List<SelectButtonItem>` | `new()` | Collection of button options with labels and values. |
| `value` | `string?` | `null` | Initial active option value. |
| `target-input` | `string?` | `null` | Form input name receiving the selected value string. |
| `disabled` | `bool` | `false` | Disables all buttons. |

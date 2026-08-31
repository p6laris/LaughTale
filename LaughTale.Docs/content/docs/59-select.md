---
title: Select Component
description: High-performance dropdown selector supporting search filtering, clear buttons, virtual scrolling, and custom option templates.
order: 27
icon: chevron-down
category: Form Controls
---

# 🔽 Select Component

`<island-select />` provides an accessible dropdown selection menu with built-in search filtering, option virtualization, and model binding.

---

## ⚡ 1. Basic Usage

```razor
<island-select name="SelectedCountry" 
               options="@Model.Countries" 
               option-label="Name" 
               option-value="Code" 
               filter="true" 
               show-clear="true" 
               placeholder="Select a country...">
</island-select>
```

In your PageModel:
```csharp
[BindProperty]
public string? SelectedCountry { get; set; }

public record CountryOption(string Code, string Name);

public List<CountryOption> Countries { get; set; } = new()
{
    new("IQ", "Iraq (Kurdistan)"),
    new("US", "United States"),
    new("DE", "Germany"),
    new("JP", "Japan"),
    new("AE", "United Arab Emirates")
};
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form input field name for model binding |
| `options` | `IEnumerable<T>` | `null` | Data source collection for dropdown options |
| `option-label` | `string` | `label` | Property name used for display text |
| `option-value` | `string` | `value` | Property name used for selected value |
| `filter` | `bool` | `false` | Enable live search filtering input |
| `show-clear` | `bool` | `false` | Display clear (X) icon button |
| `placeholder` | `string` | `null` | Placeholder text when empty |

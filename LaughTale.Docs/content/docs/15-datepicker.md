---
title: DatePicker Component
description: Rich calendar datepicker supporting single date, date ranges, localized month/day names, first day of week, and time selection.
order: 21
icon: calendar
category: Form Controls
---

# 📅 DatePicker Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 320px;">
        <div data-island="datepicker" data-props='{"placeholder": "Pick delivery date...", "showIcon": true, "showButtonBar": true}' data-hydrate="load"></div>
    </div>
</div>

`<island-datepicker />` is an accessible, localized date selection calendar supporting keyboard navigation, weekend overrides, date ranges, and direct ASP.NET Core Model Binding.

---

## ⚡ 1. Basic Usage & Model Binding

```razor
<!-- Basic DatePicker -->
<island-datepicker name="DeliveryDate" 
                   value="@Model.SelectedDate?.ToString("yyyy-MM-dd")" 
                   show-icon="true" 
                   placeholder="Select delivery date..." />
```

In your PageModel:
```csharp
[BindProperty]
public DateTime? SelectedDate { get; set; } = DateTime.Today;
```

---

## 🌍 2. Range & Localization Support

```razor
<!-- Date Range Selection with Kurdish RTL Support -->
<island-datepicker selection-mode="range" 
                   number-of-months="2" 
                   first-day-of-week="6" 
                   show-button-bar="true" 
                   placeholder="Select date range..." />
```

---

## 📋 3. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form input field name for model binding |
| `value` | `string` | `null` | Current selected date value (ISO string) |
| `placeholder` | `string` | `null` | Placeholder text in input field |
| `show-icon` | `bool` | `true` | Display calendar trigger icon button |
| `selection-mode` | `single \| multiple \| range` | `single` | Date selection behavior |
| `date-format` | `string` | `yy-mm-dd` | Display date format pattern |
| `first-day-of-week`| `int` | `0` | First day of week (0=Sun, 1=Mon, 6=Sat) |
| `min-date` | `string` | `null` | Minimum selectable date |
| `max-date` | `string` | `null` | Maximum selectable date |
| `show-button-bar` | `bool` | `false` | Display Today and Clear action buttons |

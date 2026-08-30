---
title: "Calendar DatePicker"
description: "Aura calendar popover with month/year navigation and date selection"
order: 15
section: "Form & Input Controls"
---

# Calendar DatePicker

The `<island-datepicker />` TagHelper renders a calendar picker with an animated dropdown overlay, month/year switcher, and ISO date formatting (`YYYY-MM-DD`).

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Live Calendar Dropdown (Click to Pick Date)</div>
    <island name="datepicker" props-json='{"placeholder": "Select deployment date..."}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-datepicker value="2026-09-15" 
                   placeholder="Select deployment date..." 
                   target-input="ScheduledDate" 
                   hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `string?` | `null` | Initial date in ISO format (`YYYY-MM-DD`). |
| `placeholder` | `string?` | `"Select date..."` | Input placeholder text. |
| `target-input` | `string?` | `null` | Form input name receiving the formatted date string. |
| `disabled` | `bool` | `false` | Disables picker trigger. |

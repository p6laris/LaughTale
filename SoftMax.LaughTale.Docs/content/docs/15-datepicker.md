---
title: "Calendar DatePicker"
description: "Aura calendar popover with month/year navigation and date selection"
order: 15
section: "Form & Input Controls"
---

# Calendar DatePicker

The `<island-datepicker />` TagHelper renders a calendar picker with an animated dropdown overlay, month/year switcher, and ISO date formatting (`YYYY-MM-DD`).

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

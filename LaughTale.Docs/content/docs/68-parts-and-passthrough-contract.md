---
title: PassThrough (PT) & CSS Parts Contract
description: Deeply customize component internals, styles, attributes, and events using the PassThrough (PT) contract and Shadow Parts.
order: 56
icon: sliders
category: Framework Architecture
---

# 🎨 PassThrough (PT) & CSS Parts Contract

Every LaughTale component adheres to the **PassThrough (PT) Contract**, giving you full access to customize any internal DOM element's classes, inline styles, data attributes, and event listeners.

---

## ⚡ 1. Using `pt` on TagHelpers

You can pass a `pt` object or JSON dictionary to override internal sections:

```razor
<island-datatable value="@Model.Orders" 
                  pt="@(new { 
                      Header = new { @class = "bg-indigo-900 text-white font-mono" },
                      Row = new { @class = "hover:bg-indigo-50" },
                      Paginator = new { @class = "border-t-2 border-indigo-200" }
                  })">
</island-datatable>
```

---

## 🎯 2. Standard PassThrough Sections

| Component | Common PT Target Keys |
| :--- | :--- |
| **DataTable** | `root`, `header`, `table`, `thead`, `tbody`, `row`, `cell`, `paginator` |
| **DatePicker** | `root`, `input`, `panel`, `header`, `title`, `table`, `day` |
| **Dialog** | `root`, `mask`, `header`, `title`, `closeButton`, `content`, `footer` |
| **Drawer** | `root`, `mask`, `header`, `content`, `closeButton` |

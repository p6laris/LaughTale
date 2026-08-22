---
title: "Filterable DataGrid"
description: "High-performance data table with sorting, search filtering, and pagination"
order: 19
section: "Data & Structure"
---

# Filterable DataGrid

The `<island-datagrid />` TagHelper provides a data table with instant text filtering, column header sorting, and pagination.

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var columns = new List<DataGridCol>
    {
        new("id", "ID", true),
        new("name", "Operator Name", true),
        new("role", "Access Role", true),
        new("latency", "Latency", true)
    };

    var records = new List<object>
    {
        new { id = "USR-101", name = "Alice Montgomery", role = "Security Architect", latency = "4ms" },
        new { id = "USR-102", name = "David Vance", role = "Cloud Engineer", latency = "8ms" },
        new { id = "USR-103", name = "Elena Rostova", role = "Database Lead", latency = "12ms" }
    };
}

<island-datagrid columns="@columns" 
                 data="@records" 
                 page-size="5" 
                 title="Active Operators" 
                 hydrate="Visible" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `columns` | `List<DataGridCol>` | `new()` | Column schema with field name and sortability. |
| `data` | `IEnumerable<object>` | `new()` | Row records collection. |
| `page-size` | `int` | `10` | Number of records displayed per page. |
| `title` | `string?` | `null` | Header caption title. |

---
title: "Filterable DataGrid"
description: "High-performance data table with sorting, search filtering, and pagination"
order: 19
section: "Data & Structure"
---

# Filterable DataGrid

The `<island-datagrid />` TagHelper provides a data table with instant text filtering, column header sorting, and pagination.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Sortable &amp; Searchable DataGrid</div>
    <island name="datagrid" props-json='{"title": "Cluster Nodes", "pageSize": 3, "columns": [{"field": "id", "header": "Node ID", "sortable": true}, {"field": "name", "header": "Operator", "sortable": true}, {"field": "role", "header": "Role", "sortable": true}, {"field": "latency", "header": "Latency", "sortable": true}], "data": [{"id": "USR-101", "name": "Alice Montgomery", "role": "Security Architect", "latency": "4ms"}, {"id": "USR-102", "name": "David Vance", "role": "Cloud Engineer", "latency": "8ms"}, {"id": "USR-103", "name": "Elena Rostova", "role": "Database Lead", "latency": "12ms"}, {"id": "USR-104", "name": "Marcus Thorne", "role": "Site Reliability Eng", "latency": "2ms"}]}' hydrate="Load"></island>
</div>

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

---
title: "Paginator Suite"
description: "Standalone pagination bar with page links, first/prev/next/last buttons, rows per page dropdown, and page jump inputs"
order: 58
section: "Data & Tables"
---

# Paginator

Paginator is a standalone pagination controller that can be connected to any data collection.

---

## 🎮 Interactive Live Demos

### 1. Standalone Paginator

```razor
<island-paginator total-records="120" rows="10" rows-per-page-options="new[] { 10, 20, 50 }" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `total-records` | `int` | `0` | Total count of records. |
| `rows` | `int` | `10` | Records per page. |
| `first` | `int` | `0` | Zero-based index of first record. |

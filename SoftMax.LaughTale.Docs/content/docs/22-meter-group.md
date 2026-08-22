---
title: "MeterGroup Gauge"
description: "Multi-segment metric progress gauge for resource and quota allocations"
order: 22
section: "Metrics & Display"
---

# MeterGroup Gauge

The `<island-meter-group />` TagHelper renders a multi-segment progress bar with color-coded legends, ideal for displaying disk usage, memory breakdown, and project progress.

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var storageMetrics = new List<MeterValue>
    {
        new("System OS", 35, "#10b981"),
        new("Database", 30, "#3b82f6"),
        new("Encrypted Logs", 20, "#f59e0b"),
        new("Available Free", 15, "#94a3b8")
    };
}

<island-meter-group values="@storageMetrics" 
                    title="NVMe Storage Pool (2.4 TB)" 
                    show-labels="true" 
                    hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `values` | `List<MeterValue>` | `new()` | List of segments containing `Label`, `Value` (percentage), and `Color`. |
| `title` | `string?` | `null` | Header title displayed above the gauge. |
| `show-labels` | `bool` | `true` | Show or hide the bottom legend badges. |

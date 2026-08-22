---
title: "MeterGroup Gauge"
description: "Multi-segment metric progress gauge for resource and quota allocations"
order: 22
section: "Metrics & Display"
---

# MeterGroup Gauge

The `<island-meter-group />` TagHelper renders a multi-segment progress bar with color-coded legends, ideal for displaying disk usage, memory breakdown, and project progress.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <island name="meter-group" props-json='{"title": "Cluster NVMe Pool Allocation (2.4 TB)", "showLabels": true, "values": [{"label": "OS Kernel", "value": 35, "color": "#10b981"}, {"label": "Database", "value": 30, "color": "#3b82f6"}, {"label": "Encrypted Logs", "value": 20, "color": "#f59e0b"}, {"label": "Available Free", "value": 15, "color": "#94a3b8"}]}' hydrate="Load"></island>
</div>

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

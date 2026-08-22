---
title: "Audit Log & Event Timeline"
description: "Chronological event timeline with status badges and actor metadata"
order: 17
section: "Data & Structure"
---

# Audit Log & Event Timeline

The `<island-timeline />` TagHelper visualizes a series of chronological events with status pills, timestamps, and actor tags.

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var events = new List<TimelineItem>
    {
        new("1", "TLS 1.3 Handshake Established", "Zero-Trust session authenticated.", "14:45:12", "completed", "Gateway-01"),
        new("2", "Facial Geometry Match", "Face matched 99.4% confidence score.", "14:46:05", "completed", "Camera-Engine"),
        new("3", "Security Clearance Escalation", "Clearance raised to Level 4 Tier.", "14:48:30", "in_progress", "Auth-Worker-03"),
        new("4", "HSM Sign-Off", "Awaiting certificate validation.", "14:50:00", "warning", "HSM-Cluster")
    };
}

<island-timeline events="@events" title="Security Audit Stream" hydrate="Visible" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `events` | `List<TimelineItem>` | `new()` | List of timeline items. |
| `title` | `string?` | `null` | Header title above the timeline. |
| `layout` | `string` | `"vertical"` | `"vertical"` or `"horizontal"`. |

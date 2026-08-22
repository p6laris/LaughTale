---
title: "Audit Log & Event Timeline"
description: "Chronological event timeline with status badges and actor metadata"
order: 17
section: "Data & Structure"
---

# Audit Log & Event Timeline

The `<island-timeline />` TagHelper visualizes a series of chronological events with status pills, timestamps, and actor tags.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Security Audit Stream</div>
    <island name="timeline" props-json='{"title": "Security Clearance Stream", "events": [{"id": "1", "title": "TLS 1.3 Handshake Established", "description": "Zero-Trust session authenticated via OAuth2 Bearer token.", "timestamp": "14:45:12", "status": "completed", "actor": "Gateway-01", "icon": "🔒"}, {"id": "2", "title": "Facial Geometry Match", "description": "Face matched 99.4% confidence score.", "timestamp": "14:46:05", "status": "completed", "actor": "Camera-Engine", "icon": "📸"}, {"id": "3", "title": "Security Clearance Escalation", "description": "Clearance raised to Level 4 Tier.", "timestamp": "14:48:30", "status": "in_progress", "actor": "Auth-Worker-03", "icon": "⚡"}]}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var events = new List<TimelineItem>
    {
        new("1", "TLS 1.3 Handshake Established", "Zero-Trust session authenticated.", "14:45:12", "completed", "Gateway-01"),
        new("2", "Facial Geometry Match", "Face matched 99.4% confidence score.", "14:46:05", "completed", "Camera-Engine"),
        new("3", "Security Clearance Escalation", "Clearance raised to Level 4 Tier.", "14:48:30", "in_progress", "Auth-Worker-03")
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

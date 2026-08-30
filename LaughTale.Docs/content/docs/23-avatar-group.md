---
title: "Avatar & AvatarGroup"
description: "Stacked avatar circles with initials, photos, and overflow count badges"
order: 23
section: "Metrics & Display"
---

# Avatar & AvatarGroup

The `<island-avatar-group />` TagHelper renders stacked overlapping user avatars with photos or initials and an automatic `+N` overflow badge.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1.25rem;">
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Stacked Team Avatars (with +2 overflow)</div>
        <island name="avatar-group" props-json='{"max": 4, "size": "md", "avatars": [{"label": "AM", "name": "Alice Montgomery", "bg": "#059669"}, {"label": "DV", "name": "David Vance", "bg": "#2563eb"}, {"label": "ER", "name": "Elena Rostova", "bg": "#7c3aed"}, {"label": "MT", "name": "Marcus Thorne", "bg": "#d97706"}, {"label": "SJ", "name": "Sarah Jenkins", "bg": "#dc2626"}, {"label": "TW", "name": "Thomas Wright", "bg": "#475569"}]}' hydrate="Load"></island>
    </div>
</div>

---

## 🚀 Basic Usage

```razor
@using LaughTale.Components.Models

@{
    var team = new List<AvatarItem>
    {
        new("AM", null, "Alice Montgomery", "#059669"),
        new("DV", null, "David Vance", "#2563eb"),
        new("ER", null, "Elena Rostova", "#7c3aed"),
        new("MT", null, "Marcus Thorne", "#d97706"),
        new("SJ", null, "Sarah Jenkins", "#dc2626")
    };
}

<island-avatar-group avatars="@team" max="4" size="md" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `avatars` | `List<AvatarItem>` | `new()` | List of avatars with `Label` (initials), `Image` (URL), and `Bg`. |
| `max` | `int` | `4` | Maximum visible avatars before rendering `+N` badge. |
| `size` | `string` | `"md"` | Avatar diameter: `"sm"`, `"md"`, or `"lg"`. |

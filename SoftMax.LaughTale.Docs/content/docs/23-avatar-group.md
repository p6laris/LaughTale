---
title: "Avatar & AvatarGroup"
description: "Stacked avatar circles with initials, photos, and overflow count badges"
order: 23
section: "Metrics & Display"
---

# Avatar & AvatarGroup

The `<island-avatar-group />` TagHelper renders stacked overlapping user avatars with photos or initials and an automatic `+N` overflow badge.

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

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

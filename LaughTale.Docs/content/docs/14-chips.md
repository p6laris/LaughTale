---
title: "InputTags & Chips"
description: "Tag entry input converting typed text into removable Aura chip badges"
order: 14
section: "Form & Input Controls"
---

# InputTags & Chips

The `<island-chips />` TagHelper provides a tag management input that turns entered text into removable chip badges upon pressing Enter or comma.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Live Tag Manager (Type and press Enter)</div>
    <island name="chips" props-json='{"values": ["OAuth2", "mTLS", "FIDO2"], "placeholder": "Add tag and press Enter..."}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-chips values="@(new List<string> { "OAuth2", "mTLS", "FIDO2" })" 
              placeholder="Add security protocol..." 
              max="6" 
              target-input="EnabledProtocols" 
              hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `values` | `List<string>?` | `null` | Pre-populated list of tag strings. |
| `placeholder` | `string?` | `"Add tag..."` | Placeholder text when empty. |
| `max` | `int?` | `null` | Maximum allowed number of chips. |
| `target-input` | `string?` | `null` | Form input name receiving the JSON string array `["tag1", "tag2"]`. |
| `disabled` | `bool` | `false` | Disables tag addition and removal. |

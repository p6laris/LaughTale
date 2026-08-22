---
title: "InputTags & Chips"
description: "Tag entry input converting typed text into removable Aura chip badges"
order: 14
section: "Form & Input Controls"
---

# InputTags & Chips

The `<island-chips />` TagHelper provides a tag management input that turns entered text into removable chip badges upon pressing Enter or comma.

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

---
title: "OrganizationChart"
description: "Hierarchical organization structure diagram with collapsible nodes and custom templates"
order: 57
section: "Data & Tables"
---

# OrganizationChart

OrganizationChart displays hierarchical structures such as organizational hierarchies and tree graphs.

---

## 🎮 Interactive Live Demos

### 1. Enterprise Hierarchy

```razor
<island-orgchart value="@Model.RootOrgNode" collapsible="true" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `OrgChartNode` | `null` | Root hierarchical node. |
| `collapsible` | `bool` | `true` | Allows expanding and collapsing branch nodes. |

---
title: "ProgressBar & Skeleton Shimmer"
description: "Progress status bars and animated skeleton placeholders for loading states"
order: 25
section: "Metrics & Display"
---

# ProgressBar & Skeleton Shimmer

The `<island-progress-bar />` and `<island-skeleton />` TagHelpers provide loading indicators and animated placeholder shimmers.

---

## 🚀 ProgressBar Usage

```razor
<!-- Determinate with percentage value -->
<island-progress-bar value="68" show-value="true" height="1rem" hydrate="Load" />

<!-- Indeterminate animated loader -->
<island-progress-bar mode="indeterminate" height="0.5rem" color="#3b82f6" hydrate="Load" />
```

---

## 💀 Skeleton Usage

```razor
<!-- Shimmer line placeholder -->
<island-skeleton width="100%" height="1.25rem" hydrate="Load" />

<!-- Shimmer circle avatar -->
<island-skeleton shape="circle" width="3rem" height="3rem" hydrate="Load" />
```

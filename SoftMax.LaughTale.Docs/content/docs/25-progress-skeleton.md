---
title: "ProgressBar & Skeleton Shimmer"
description: "Progress status bars and animated skeleton placeholders for loading states"
order: 25
section: "Metrics & Display"
---

# ProgressBar & Skeleton Shimmer

The `<island-progress-bar />` and `<island-skeleton />` TagHelpers provide loading indicators and animated placeholder shimmers.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1.25rem;">
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Determinate Progress Bar (72%)</div>
        <island name="progress-bar" props-json='{"value": 72, "showValue": true, "height": "1rem"}' hydrate="Load"></island>
    </div>
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Indeterminate Pulsing Progress Bar</div>
        <island name="progress-bar" props-json='{"mode": "indeterminate", "height": "0.5rem", "color": "#3b82f6"}' hydrate="Load"></island>
    </div>
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Animated Shimmer Skeleton Loader</div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <island name="skeleton" props-json='{"width": "100%", "height": "1rem"}' hydrate="Load"></island>
            <island name="skeleton" props-json='{"width": "75%", "height": "1rem"}' hydrate="Load"></island>
        </div>
    </div>
</div>

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

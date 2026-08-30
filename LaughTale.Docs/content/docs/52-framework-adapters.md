---
title: "Multi-Framework Adapters"
description: "Zero-friction mounting for React, Vue, Svelte, and Preact components"
order: 52
section: "Framework Adapters"
---

# Multi-Framework Adapters

LaughTale provides thin, zero-overhead client adapters for rendering components authored in your favorite JavaScript frontend libraries.

---

## Supported Frameworks

| Framework | Import Path | Unmount Lifecycle |
| :--- | :--- | :--- |
| **React 18 / 19** | `laughtale/adapters/react` | `root.unmount()` on island teardown |
| **Vue 3** | `laughtale/adapters/vue` | `app.unmount()` on island teardown |
| **Svelte 4 / 5** | `laughtale/adapters/svelte` | `$destroy()` / `unmount()` on island teardown |
| **Preact** | `laughtale/adapters/preact` | `render(null, container)` on island teardown |
| **Vanilla TS** | `laughtale/adapters/vanilla` | Direct DOM node cleanup |

---

## ⚡ Example: React Island

```typescript
import React from 'react';
import { createReactAdapter } from 'laughtale/adapters/react';

function InteractiveChart({ title, values }: { title: string; values: number[] }) {
    return (
        <div className="chart-wrapper">
            <h3>{title}</h3>
            <p>Total: {values.reduce((a, b) => a + b, 0)}</p>
        </div>
    );
}

// Export the adapted island function
export default createReactAdapter(InteractiveChart);
```

```razor
<island name="interactive-chart" 
        framework="React" 
        props="@(new { title = "Sales", values = new[] { 10, 20, 30 } })" 
        hydrate="Visible" />
```

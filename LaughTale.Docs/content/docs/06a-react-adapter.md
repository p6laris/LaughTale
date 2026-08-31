---
title: React 18 & 19 Islands
description: Mount modern React 18 and 19 components as interactive islands in ASP.NET Core with type-safe props, hooks, and automatic root cleanup.
order: 14
icon: code
category: Multi-Framework Adapters
---

# ⚛️ React 18 & 19 Islands

LaughTale lets you seamlessly mount **React 18 & 19** components inside ASP.NET Core Razor Pages, MVC views, or Blazor applications without turning your entire application into an SPA.

---

## ⚡ 1. Razor TagHelper Syntax

To mount a React island, use the `<island>` TagHelper with `framework="React"`:

```razor
@page
@model AnalyticsModel

<island name="analytics-dashboard" 
        framework="React" 
        props="@Model.DashboardProps" 
        hydrate="Visible" />
```

In your C# PageModel (`AnalyticsModel.cs`):

```csharp
public class AnalyticsModel : PageModel
{
    public record DashboardData(string Title, int InitialScore, string Badge);

    public DashboardData DashboardProps { get; set; } = new(
        Title: "Live Sales Pipeline",
        InitialScore: 1500,
        Badge: "Enterprise"
    );
}
```

---

## 💻 2. Writing the React Island (`src/islands/analytics-dashboard.tsx`)

A LaughTale React island is a module exporting a standard React component or an initialization function using `createRoot`:

```tsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { IslandContext, emitIslandEvent, onIslandEvent } from '@softmax/laughtale-client';

export interface DashboardProps {
    title: string;
    initialScore: number;
    badge: string;
}

// React Functional Component
function AnalyticsDashboardComponent({ title, initialScore, badge }: DashboardProps) {
    const [score, setScore] = useState(initialScore);

    useEffect(() => {
        // Listen to external island events (e.g. from Vue or Svelte)
        const unsubscribe = onIslandEvent('warehouse:restocked', (data: any) => {
            setScore(prev => prev + 50);
        });

        return () => unsubscribe();
    }, []);

    const handleSale = (amount: number) => {
        setScore(prev => prev + amount);
        // Broadcast sale event to all other islands on the page
        emitIslandEvent('polyglot:sale', {
            source: 'React 19 Island',
            amount,
            timestamp: new Date().toLocaleTimeString()
        });
    };

    return (
        <div className="p-card p-6 bg-surface-0 border rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-surface-900">{title}</h3>
                <span className="p-tag p-tag-info">{badge}</span>
            </div>
            
            <div className="text-3xl font-extrabold text-primary-600 mb-4">
                ${score.toLocaleString()}
            </div>

            <div className="flex gap-2">
                <button 
                    type="button" 
                    onClick={() => handleSale(250)}
                    className="p-button p-button-primary text-sm px-3 py-2 rounded-lg">
                    + $250 Quick Sale
                </button>
            </div>
        </div>
    );
}

// LaughTale Island Mount Entrypoint
export default function AnalyticsDashboardIsland(
    container: HTMLElement, 
    props: DashboardProps, 
    ctx?: IslandContext
) {
    const root = createRoot(container);
    root.render(<AnalyticsDashboardComponent {...props} />);

    // Automatic unmount on View Transitions or DOM removal
    ctx?.onCleanup(() => {
        root.unmount();
    });

    return () => root.unmount();
}
```

---

## 📦 3. Client Bundle Configuration (ESBuild)

Compile your React islands with ESBuild JSX support in `esbuild.config.mjs`:

```javascript
import esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/islands/analytics-dashboard.tsx'],
    bundle: true,
    format: 'esm',
    jsx: 'automatic',
    outdir: 'wwwroot/js/islands'
});
```

---

## 🛡️ 4. Key Benefits of React in LaughTale

1. **Zero Full-Page Hydration Penalty**: React only mounts and runs inside the `<div data-island>` container.
2. **Proper Cleanup**: When users navigate away using View Transitions, `root.unmount()` is called automatically, preventing memory leaks and orphaned subscriptions.
3. **Ecosystem Compatibility**: Use your favorite React libraries (Lucide React, Recharts, Framer Motion, TanStack) seamlessly inside any Razor page.

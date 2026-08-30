---
title: "React 18 & 19 Islands Adapter"
description: "How to mount, pass props, project slots, and handle lifecycle teardown for React 18 and React 19 components in ASP.NET Core Razor Pages."
order: 6
section: "Multi-Framework Adapters"
---

# React 18 & 19 Islands Adapter

LaughTale provides a first-class mount adapter for **React 18 and React 19** via `createReactAdapter` / `createReactIsland`.

This allows you to build rich, stateful React component trees that hydrate on demand inside an ASP.NET Core Razor Page or MVC view while enjoying automatic prop revival, slot projection, and `AbortSignal` lifecycle teardown.

---

## 📦 Installation

To use React inside your LaughTale client bundle:

```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

---

## ⚡ Step 1: Author Your React Component

Create your component file (e.g. `src/islands/analytics-dashboard.tsx`):

```tsx
import React, { useState, useEffect } from 'react';
import { createReactAdapter } from 'laughtale/adapters/react';
import { emitIslandEvent } from 'laughtale';

// 1. Define your component props
interface AnalyticsProps {
    dashboardTitle: string;
    initialVisitors: number;
    metrics: number[];
    refreshIntervalMs?: number;
}

// 2. Build standard React component
export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({
    dashboardTitle,
    initialVisitors,
    metrics,
    refreshIntervalMs = 3000
}) => {
    const [visitors, setVisitors] = useState(initialVisitors);
    const [trend, setTrend] = useState<number[]>(metrics);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisitors(prev => {
                const delta = Math.floor(Math.random() * 11) - 5;
                const next = Math.max(0, prev + delta);
                setTrend(t => [...t.slice(-9), next]);
                
                // Emit event to other islands (Vue, Svelte, etc.)
                emitIslandEvent('analytics:tick', { visitors: next });
                
                return next;
            });
        }, refreshIntervalMs);

        return () => clearInterval(interval);
    }, [refreshIntervalMs]);

    return (
        <div className="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-primary">{dashboardTitle}</h3>
                <span className="aura-tag tag-emerald">Live React 19</span>
            </div>
            
            <div className="text-3xl font-mono font-bold my-2 text-surface-900">
                {visitors.toLocaleString()} <span className="text-sm font-normal text-muted">active users</span>
            </div>

            <div className="flex gap-1 h-8 items-end mt-3 pt-2 border-t border-border">
                {trend.map((val, i) => (
                    <div 
                        key={i} 
                        className="flex-1 bg-primary-500 rounded-t transition-all duration-300"
                        style={{ height: `${Math.min(100, Math.max(15, (val / (initialVisitors * 1.5)) * 100))}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

// 3. Export as LaughTale island mount adapter
export default createReactAdapter(AnalyticsDashboard);
```

---

## 🏗️ Step 2: Render in Razor (`.cshtml`)

In your Razor view or page, render the island using `<island>` or your generated TagHelper:

```razor
@page
@model AnalyticsPageModel
@{
    ViewData["Title"] = "React 19 Island Demo";
}

<div class="container py-4">
    <h2>Real-Time Telemetry</h2>
    
    <!-- React Island hydrates only when scrolled into view -->
    <island name="analytics-dashboard" 
            framework="React" 
            props="@(new { 
                DashboardTitle = "Global API Traffic", 
                InitialVisitors = 1420, 
                Metrics = new[] { 1350, 1380, 1400, 1420 },
                RefreshIntervalMs = 2000 
            })" 
            hydrate="Visible"
            class="chart-island">
        
        <!-- SSR Placeholder displayed before client hydration -->
        <div class="p-skeleton p-4 rounded-xl" style="height: 180px;">
            Loading React Dashboard...
        </div>
    </island>
</div>
```

---

## 🧩 Server Slot Projection into React (`children`)

LaughTale automatically captures server-rendered child HTML inside `<island>` and exposes it as the `children` prop in your React component:

```razor
<island name="react-modal" framework="React" props="@(new { Title = "Account Settings" })" hydrate="Load">
    <!-- Server-rendered Razor slot projected into React children -->
    <div class="slot-content">
        <p>Current User: <strong>@User.Identity?.Name</strong></p>
        <p>Role Clearance: <span class="badge">Enterprise Admin</span></p>
    </div>
</island>
```

In your React component:

```tsx
interface ModalProps {
    title: string;
    children?: React.ReactNode;
}

export const ReactModal: React.FC<ModalProps> = ({ title, children }) => {
    return (
        <div className="p-dialog">
            <div className="p-dialog-header"><h3>{title}</h3></div>
            <div className="p-dialog-content">{children}</div>
        </div>
    );
};

export default createReactAdapter(ReactModal);
```

---

## 🛡️ Automatic Lifecycle & Teardown

When the user navigates away via the LaughTale View Transitions router, LaughTale triggers `ctx.signal` and calls `root.unmount()`.

This guarantees:
* All React `useEffect` cleanup return functions execute.
* Active intervals, timeouts, and WebSocket connections are closed.
* Zero memory leaks across multi-page navigation.

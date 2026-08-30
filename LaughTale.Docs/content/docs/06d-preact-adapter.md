---
title: "Preact Islands Adapter"
description: "Ultra-lightweight (3KB) React-compatible virtual DOM adapter for maximum performance and minimal bundle size in ASP.NET Core."
order: 6
section: "Multi-Framework Adapters"
---

# Preact Islands Adapter

LaughTale provides a dedicated mount adapter for **Preact** via `createPreactAdapter` / `createPreactIsland`.

Preact offers a **100% React-compatible Virtual DOM and Hooks API in just 3 KB**, making it the premier choice for ultra-fast, high-performance islands where minimal JavaScript bundle size is a top priority.

---

## 📦 Installation

To use Preact inside your LaughTale project:

```bash
npm install preact
```

---

## ⚡ Step 1: Author Your Preact Component

Create your component file (e.g. `src/islands/sparkline-chart.tsx`):

```tsx
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { createPreactAdapter } from 'laughtale/adapters/preact';

interface SparklineProps {
    label: string;
    points: number[];
    accentColor?: string;
}

export function SparklineChart({ label, points, accentColor = '#10b981' }: SparklineProps) {
    const [data, setData] = useState(points);

    const min = Math.min(...data);
    const max = Math.max(...data) || 1;
    const range = max - min || 1;

    return (
        <div class="p-card p-3 bg-surface-0 border border-border rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-semibold text-muted">{label}</span>
                <span class="aura-tag tag-slate text-xs">Preact (3KB)</span>
            </div>
            
            <!-- Lightweight SVG Sparkline -->
            <svg viewBox="0 0 100 24" class="w-full h-8 overflow-visible">
                <polyline
                    fill="none"
                    stroke={accentColor}
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    points={data.map((val, i) => `${(i / (data.length - 1)) * 100},${24 - ((val - min) / range) * 20}`).join(' ')}
                />
            </svg>
            
            <div class="flex justify-between text-xs font-mono text-muted mt-1">
                <span>Min: {min}</span>
                <span>Latest: <strong>{data[data.length - 1]}</strong></span>
                <span>Max: {max}</span>
            </div>
        </div>
    );
}

// Export as LaughTale island mount adapter
export default createPreactAdapter(SparklineChart);
```

---

## 🏗️ Step 2: Render in Razor (`.cshtml`)

```razor
@page
@model TelemetryGridModel
@{
    ViewData["Title"] = "Preact 3KB Islands";
}

<div class="container py-4">
    <h2>Micro Sparkline Gauges (Preact)</h2>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <island name="sparkline-chart" 
                framework="Preact" 
                props="@(new { Label = "Memory Usage (MB)", Points = new[] { 412, 415, 420, 418, 430, 425, 440 } })" 
                hydrate="Visible" />

        <island name="sparkline-chart" 
                framework="Preact" 
                props="@(new { Label = "Network Inbound (MB/s)", Points = new[] { 12, 18, 14, 25, 30, 22, 28 }, AccentColor = "#6366f1" })" 
                hydrate="Visible" />
    </div>
</div>
```

---

## 🚀 Performance Comparison

| Metric | React 19 Bundle | Preact Bundle |
|---|---|---|
| **Runtime Footprint** | ~42 KB (gzip) | **~3 KB (gzip)** |
| **Virtual DOM Memory** | Standard | **Minimal** |
| **Hydration Speed** | Fast (< 8ms) | **Near-Instant (< 1.5ms)** |

---
title: Preact (3KB) Islands
description: Mount ultra-lightweight 3KB Preact components with full React-compatible VDOM and Signals inside ASP.NET Core.
order: 17
icon: zap
category: Multi-Framework Adapters
---

# ⚡ Preact (3KB) Islands

When you want the developer ergonomics of JSX and React's Virtual DOM but need a **microscopic bundle footprint (under 3 KB minified & compressed)**, **Preact** is the ultimate choice.

---

## ⚡ 1. Razor TagHelper Syntax

To mount a Preact island, set `framework="Preact"` on the `<island>` TagHelper:

```razor
@page
@model TelemetryModel

<island name="throughput-chart" 
        framework="Preact" 
        props="@Model.TelemetryProps" 
        hydrate="Visible" />
```

In your C# PageModel (`TelemetryModel.cs`):

```csharp
public class TelemetryModel : PageModel
{
    public record MetricData(string MetricName, int InitialThroughput);

    public MetricData TelemetryProps { get; set; } = new(
        MetricName: "Transactions Throughput",
        InitialThroughput: 52
    );
}
```

---

## 💻 2. Writing the Preact Island (`src/islands/throughput-chart.tsx`)

```tsx
import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { IslandContext, emitIslandEvent, onIslandEvent } from '@softmax/laughtale-client';

export interface ThroughputProps {
    metricName: string;
    initialThroughput: number;
}

function ThroughputComponent({ metricName, initialThroughput }: ThroughputProps) {
    const [throughput, setThroughput] = useState(initialThroughput);

    useEffect(() => {
        const unsubscribe = onIslandEvent('polyglot:sale', () => {
            setThroughput(prev => prev + 12);
        });

        return () => unsubscribe();
    }, []);

    const triggerBurst = () => {
        const next = throughput + 25;
        setThroughput(next);
        emitIslandEvent('polyglot:burst', {
            source: 'Preact Island (3KB)',
            throughput: next,
            timestamp: new Date().toLocaleTimeString()
        });
    };

    return (
        <div className="p-card p-6 bg-surface-0 border rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-surface-900">{metricName}</h4>
                <span className="p-tag p-tag-secondary">Preact (3KB)</span>
            </div>

            <div className="text-4xl font-extrabold text-indigo-600 mb-2">
                {throughput} <span className="text-sm font-medium text-surface-500">tx/sec</span>
            </div>

            <div className="text-xs text-surface-500 mb-4">
                Latency: <strong className="text-emerald-500">3.8 ms</strong>
            </div>

            <button 
                type="button" 
                onClick={triggerBurst}
                className="p-button p-button-outlined text-sm px-3 py-2">
                ⚡ Burst (+25 tx/s)
            </button>
        </div>
    );
}

// LaughTale Island Mount Entrypoint
export default function ThroughputChartIsland(
    container: HTMLElement, 
    props: ThroughputProps, 
    ctx?: IslandContext
) {
    render(<ThroughputComponent {...props} />, container);

    // Teardown with Preact render(null, container)
    ctx?.onCleanup(() => {
        render(null, container);
    });

    return () => render(null, container);
}
```

---

## 🛡️ 3. Key Benefits of Preact in LaughTale

1. **Microscopic Footprint**: Full component model, hooks, and virtual DOM diffing in **just 3 KB**.
2. **React Ecosystem Compatibility**: Seamlessly alias `react` and `react-dom` to `preact/compat` in ESBuild.
3. **Instant Hydration**: Loads in under 2ms, ideal for mobile devices and latency-sensitive web applications.

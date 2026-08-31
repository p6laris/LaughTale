---
title: Svelte 4 & 5 Islands
description: Mount compiled Svelte 4 and Svelte 5 Runes components with zero virtual DOM overhead directly inside ASP.NET Core Razor Pages.
order: 16
icon: code
category: Multi-Framework Adapters
---

# 🧡 Svelte 4 & 5 Islands

Svelte is one of the most popular pairings for LaughTale because **Svelte compiles away the Virtual DOM**, resulting in minuscule bundle sizes (typically 10-18 KB) and blazing fast microsecond execution.

---

## ⚡ 1. Razor TagHelper Syntax

To mount a Svelte island, set `framework="Svelte"` on the `<island>` TagHelper:

```razor
@page
@model ClusterModel

<island name="cluster-gauge" 
        framework="Svelte" 
        props="@Model.GaugeProps" 
        hydrate="Visible" />
```

In your C# PageModel (`ClusterModel.cs`):

```csharp
public class ClusterModel : PageModel
{
    public record GaugeData(string GaugeTitle, int InitialLoad);

    public GaugeData GaugeProps { get; set; } = new(
        GaugeTitle: "Cluster Node 01",
        InitialLoad: 42
    );
}
```

---

## 💻 2. Writing the Svelte Island (`src/islands/cluster-gauge.ts`)

### Svelte 5 (Runes API)
In Svelte 5, components are mounted using the `mount` and `unmount` functions:

```typescript
import { mount, unmount } from 'svelte';
import ClusterGaugeComponent from './ClusterGauge.svelte';
import { IslandContext } from '@softmax/laughtale-client';

export interface GaugeProps {
    gaugeTitle: string;
    initialLoad: number;
}

// LaughTale Island Mount Entrypoint
export default function ClusterGaugeIsland(
    container: HTMLElement, 
    props: GaugeProps, 
    ctx?: IslandContext
) {
    const instance = mount(ClusterGaugeComponent, {
        target: container,
        props
    });

    // Cleanup Svelte 5 instance when unmounted
    ctx?.onCleanup(() => {
        unmount(instance);
    });

    return () => unmount(instance);
}
```

---

### The Svelte Component (`src/islands/ClusterGauge.svelte`)

```svelte
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { emitIslandEvent, onIslandEvent } from '@softmax/laughtale-client';

    let { gaugeTitle = 'Cluster Node', initialLoad = 40 } = $props();

    let load = $state(initialLoad);
    let isHighLoad = $derived(load >= 75);

    let unsub: (() => void) | null = null;

    onMount(() => {
        // Listen to external events from React or Vue
        unsub = onIslandEvent('polyglot:sale', () => {
            load = Math.min(98, load + 15);
        });
    });

    onDestroy(() => {
        unsub?.();
    });

    function triggerSpike() {
        load = Math.min(98, load + 25);
        emitIslandEvent('polyglot:spike', {
            source: 'Svelte 5 Island',
            node: gaugeTitle,
            loadPercent: load
        });
    }
</script>

<div class="p-card p-6 bg-surface-0 border rounded-xl shadow-sm">
    <div class="flex justify-between items-center mb-4">
        <h4 class="font-bold text-lg text-surface-900">{gaugeTitle}</h4>
        <span class="p-tag p-tag-warn">Svelte 5</span>
    </div>

    <div class="text-4xl font-black mb-2 {isHighLoad ? 'text-red-500' : 'text-orange-500'}">
        {load}%
    </div>

    <p class="text-xs text-surface-500 mb-4">
        Status: <strong>{isHighLoad ? 'Peak Load' : 'Nominal'}</strong>
    </p>

    <button type="button" onclick={triggerSpike} class="p-button p-button-outlined text-sm px-3 py-2">
        Trigger Node Spike (+25%)
    </button>
</div>
```

---

## 🛡️ 3. Key Benefits of Svelte in LaughTale

1. **Zero Virtual DOM Overhead**: Svelte compiles directly into tiny, imperative DOM manipulation statements.
2. **Tiny Bundle Footprint**: Perfect for high-performance dashboards, animated SVG meters, and real-time canvas visualizations.
3. **Runes Reactivity**: Svelte 5 `$state` and `$derived` provide fine-grained reactivity without bundle bloat.

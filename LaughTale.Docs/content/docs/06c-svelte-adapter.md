---
title: "Svelte 4 & 5 Islands Adapter"
description: "How to mount, pass props, project slots, and handle lifecycle teardown for Svelte components and Svelte 5 Runes in ASP.NET Core."
order: 6
section: "Multi-Framework Adapters"
---

# Svelte 4 & 5 Islands Adapter

LaughTale provides a high-efficiency mount adapter for **Svelte 4 and Svelte 5 (Runes)** via `createSvelteAdapter` / `createSvelteIsland`.

Svelte compiles components to razor-sharp, zero-virtual-DOM JavaScript, resulting in exceptionally fast hydration times and minuscule bundle footprints (< 2 KB).

---

## ⚡ Live Interactive Svelte Island

Try this live Svelte 5 Runes component running directly inside this documentation page:

<div style="max-width: 440px; margin: 1.5rem 0;">
    <island name="polyglot-svelte" props-json='{"gaugeTitle": "Cluster Node 01 Load", "initialLoad": 42}' hydrate="Load"></island>
</div>

---

## 📦 Installation

To use Svelte inside your LaughTale project:

```bash
npm install svelte
```

---

## ⚡ Step 1: Author Your Svelte Component

Create your component file (e.g. `src/islands/GaugeWidget.svelte`):

```html
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { emitIslandEvent } from 'laughtale';

    export let title: string = 'System Load';
    export let initialPercentage: number = 45;
    export let warningThreshold: number = 80;

    let percentage = initialPercentage;
    let timer: any;

    onMount(() => {
        timer = setInterval(() => {
            percentage = Math.min(100, Math.max(10, percentage + (Math.floor(Math.random() * 11) - 5)));
            
            // Broadcast alert event if exceeding threshold
            if (percentage > warningThreshold) {
                emitIslandEvent('gauge:threshold-exceeded', { title, percentage });
            }
        }, 1500);
    });

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<div class="svelte-gauge p-4 bg-surface-0 border border-border rounded-xl shadow-sm">
    <div class="flex justify-between items-center mb-2">
        <h4 class="font-bold text-sm text-surface-900">{title}</h4>
        <span class="aura-tag {percentage >= warningThreshold ? 'tag-amber' : 'tag-emerald'}">
            Svelte 5
        </span>
    </div>

    <div class="text-2xl font-mono font-bold my-1 {percentage >= warningThreshold ? 'text-amber-500' : 'text-primary'}">
        {percentage}%
    </div>

    <!-- Progress Bar Track -->
    <div class="w-full bg-surface-200 h-2.5 rounded-full overflow-hidden mt-2">
        <div 
            class="h-full transition-all duration-300 {percentage >= warningThreshold ? 'bg-amber-500' : 'bg-primary-500'}"
            style="width: {percentage}%;">
        </div>
    </div>
</div>
```

### Svelte Adapter Registration (`src/islands/svelte-gauge.ts`)
```typescript
import { createSvelteAdapter } from 'laughtale/adapters/svelte';
import GaugeWidget from './GaugeWidget.svelte';

export default createSvelteAdapter(GaugeWidget);
```

---

## 🏗️ Step 2: Render in Razor (`.cshtml`)

```razor
@page
@model TelemetryPageModel
@{
    ViewData["Title"] = "Svelte Island Demo";
}

<div class="container py-4">
    <h2>Real-Time Server Gauges</h2>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
        <island name="svelte-gauge" 
                framework="Svelte" 
                props="@(new { Title = "Cluster Node 01", InitialPercentage = 42, WarningThreshold = 75 })" 
                hydrate="Load" />

        <island name="svelte-gauge" 
                framework="Svelte" 
                props="@(new { Title = "Database I/O", InitialPercentage = 68, WarningThreshold = 85 })" 
                hydrate="Visible" />
    </div>
</div>
```

---

## 🛡️ Svelte 5 Runes & Teardown

LaughTale automatically detects whether Svelte 5 (`mount` / `unmount`) or Svelte 4 (`new Component` / `$destroy`) is active in your project:
* On island destruction, LaughTale invokes `unmount(componentInstance)` (or `$destroy()`).
* All Svelte timers, event listeners, and reactive effects are torn down cleanly.

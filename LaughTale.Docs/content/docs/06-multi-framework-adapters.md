---
title: "Multi-Framework Polyglot Architecture"
description: "Mount React 18/19, Vue 3, Svelte 4/5, Preact, and Vanilla TypeScript islands side-by-side on the same Razor page with cross-island communication."
order: 6
section: "Multi-Framework Adapters"
---

# Multi-Framework Polyglot Architecture

LaughTale is fundamentally **framework-agnostic**. You are never locked into a single frontend library.

You can mount **React 19**, **Vue 3**, **Svelte 5**, **Preact**, and **Vanilla TypeScript** islands **side-by-side on the exact same Razor page** with zero conflict, independent hydration triggers, and seamless cross-framework communication.

---

## 🌐 Dedicated Adapter Guides

Explore in-depth documentation and recipes for each supported framework:

- ⚛️ **[React 18 & 19 Islands Adapter](/doc/06a-react-adapter)** — Hooks, JSX, virtual DOM reconciliation, and slot projection.
- 🟢 **[Vue 3 Islands Adapter](/doc/06b-vue-adapter)** — Composition API, `ref`/`computed`, templates, and reactive props.
- 🧡 **[Svelte 4 & 5 Islands Adapter](/doc/06c-svelte-adapter)** — Zero-virtual-DOM compiled widgets and Svelte 5 Runes.
- ⚡ **[Preact Islands Adapter](/doc/06d-preact-adapter)** — 3 KB React-compatible virtual DOM for extreme performance budgets.
- 🍦 **[Vanilla TypeScript Adapter](/doc/06e-vanilla-adapter)** — Raw Web APIs, zero dependencies, and instant hydration.

---

## ⚡ Live Interactive Polyglot Demo

Interact with **React 19**, **Vue 3**, and **Svelte 5** live in real-time below. Click the **"+ $250 Sale"** button in React to see Vue and Svelte update instantly across LaughTale's event bus!

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin: 1.5rem 0;">
    <island name="polyglot-react" props-json='{"title": "React 19 Emitter", "initialScore": 2500, "badge": "Live"}' hydrate="Load"></island>
    <island name="polyglot-vue" props-json='{"warehouse": "Central Logistics Hub", "initialStock": 45}' hydrate="Load"></island>
    <island name="polyglot-svelte" props-json='{"gaugeTitle": "Svelte 5 Load Dial", "initialLoad": 35}' hydrate="Load"></island>
</div>

---

## 🎮 Complete Polyglot Page: React + Vue + Svelte on One Razor Page

Here is a full, real-world Razor Page demonstrating 3 different framework islands communicating seamlessly over the LaughTale event bus:

### 1. Razor View (`PolyglotDemo.cshtml`)

```razor
@page "/polyglot-demo"
@model PolyglotDemoModel
@{
    ViewData["Title"] = "Polyglot Islands: React + Vue + Svelte";
}

<!-- Top Header with Server-Rendered Breadcrumb -->
<div class="header mb-6">
    <span class="aura-tag tag-indigo">Polyglot Architecture</span>
    <h1 class="text-3xl font-extrabold text-surface-900 mt-2">Cross-Framework Islands</h1>
    <p class="text-muted">React 19, Vue 3, and Svelte 5 collaborating on a single ASP.NET Core page.</p>
</div>

<!-- 3-Column Polyglot Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">

    <!-- 1. REACT 19 ISLAND: Sales Metric Generator -->
    <div class="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm">
        <island name="react-sales-emitter" 
                framework="React" 
                props="@(new { InitialRevenue = 75000, CurrencySymbol = "$" })" 
                hydrate="Load" />
    </div>

    <!-- 2. VUE 3 ISLAND: Live Inventory Consumer -->
    <div class="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm">
        <island name="vue-inventory-listener" 
                framework="Vue" 
                props="@(new { WarehouseName = "Central Hub", TotalSKUs = 420 })" 
                hydrate="Load" />
    </div>

    <!-- 3. SVELTE 5 ISLAND: System Health Monitor -->
    <div class="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm">
        <island name="svelte-load-dial" 
                framework="Svelte" 
                props="@(new { DialTitle = "Server Load", InitialLoad = 38 })" 
                hydrate="Idle" />
    </div>

</div>
```

---

### 2. The React Emitter Island (`src/islands/react-sales-emitter.tsx`)

```tsx
import React, { useState } from 'react';
import { createReactAdapter } from 'laughtale/adapters/react';
import { emitIslandEvent } from 'laughtale';

export const ReactSalesEmitter: React.FC<{ InitialRevenue: number; CurrencySymbol: string }> = ({
    InitialRevenue,
    CurrencySymbol
}) => {
    const [revenue, setRevenue] = useState(InitialRevenue);

    const recordTransaction = (amount: number) => {
        const next = revenue + amount;
        setRevenue(next);
        
        // 📢 Broadcast to Vue and Svelte islands!
        emitIslandEvent('revenue:transaction', {
            amount,
            newTotal: next,
            timestamp: new Date().toLocaleTimeString()
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-primary">React 19 Island</h3>
                <span className="aura-tag tag-sky text-xs">Emitter</span>
            </div>
            <p className="text-2xl font-mono font-bold text-surface-900 my-2">
                {CurrencySymbol}{revenue.toLocaleString()}
            </p>
            <div className="flex gap-2 mt-3">
                <button 
                    type="button" 
                    onClick={() => recordTransaction(250)}
                    className="p-button p-button-sm p-button-primary">
                    + $250 Sale
                </button>
                <button 
                    type="button" 
                    onClick={() => recordTransaction(1000)}
                    className="p-button p-button-sm p-button-secondary">
                    + $1,000 Bulk
                </button>
            </div>
        </div>
    );
};

export default createReactAdapter(ReactSalesEmitter);
```

---

### 3. The Vue Listener Island (`src/islands/vue-inventory-listener.ts`)

```typescript
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { createVueAdapter } from 'laughtale/adapters/vue';
import { onIslandEvent } from 'laughtale';

export const VueInventoryListener = defineComponent({
    props: {
        warehouseName: { type: String, required: true },
        totalSKUs: { type: Number, default: 0 }
    },
    setup(props) {
        const transactions = ref<string[]>([]);
        let unsubscribe: (() => void) | null = null;

        onMounted(() => {
            // 👂 Listen to React's broadcasted event
            unsubscribe = onIslandEvent('revenue:transaction', (payload: any) => {
                transactions.value.unshift(
                    `[${payload.timestamp}] Received $${payload.amount} sale! Total: $${payload.newTotal.toLocaleString()}`
                );
                if (transactions.value.length > 3) transactions.value.pop();
            });
        });

        onUnmounted(() => unsubscribe?.());

        return { props, transactions };
    },
    template: `
        <div>
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-emerald-600">Vue 3 Island</h3>
                <span class="aura-tag tag-emerald text-xs">Listener</span>
            </div>
            <p class="text-xs text-muted mb-2">Warehouse: <strong>{{ props.warehouseName }}</strong> ({{ props.totalSKUs }} SKUs)</p>
            <div class="space-y-1 mt-2">
                <div v-if="transactions.length === 0" class="text-xs text-muted italic">Waiting for React transactions...</div>
                <div v-for="(tx, idx) in transactions" :key="idx" class="text-xs p-1.5 bg-surface-50 rounded border border-border text-surface-800">
                    {{ tx }}
                </div>
            </div>
        </div>
    `
});

export default createVueAdapter(VueInventoryListener);
```

---

### 4. The Svelte Health Dial (`src/islands/svelte-load-dial.svelte`)

```html
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { onIslandEvent } from 'laughtale';

    export let DialTitle: string = 'System Load';
    export let InitialLoad: number = 35;

    let load = InitialLoad;
    let unsubscribe: any;

    onMount(() => {
        // Increase dial activity when sales transactions happen
        unsubscribe = onIslandEvent('revenue:transaction', () => {
            load = Math.min(95, load + 8);
        });

        const timer = setInterval(() => {
            load = Math.max(20, load - 2);
        }, 1000);

        return () => clearInterval(timer);
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });
</script>

<div>
    <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-amber-600">{DialTitle}</h3>
        <span class="aura-tag tag-amber text-xs">Svelte 5</span>
    </div>
    <div class="text-2xl font-mono font-bold text-surface-900 my-2">{load}% Load</div>
    <div class="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
        <div class="bg-amber-500 h-full transition-all duration-300" style="width: {load}%;"></div>
    </div>
</div>
```

---

## ⚡ Framework Isolation & Clean Resource Teardown

LaughTale ensures that when a user navigates away:
- React calls `root.unmount()`.
- Vue calls `app.unmount()`.
- Svelte invokes its teardown function.
- Event bus listeners are safely unsubscribed.
- **Zero memory leaks or zombie event listeners.**

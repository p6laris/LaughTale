---
title: Vue 3 Islands
description: Mount Vue 3 reactive components using the Composition API, refs, and Pinia stores directly inside ASP.NET Core Razor Pages.
order: 15
icon: code
category: Multi-Framework Adapters
---

# 💚 Vue 3 Islands

LaughTale provides native support for **Vue 3**, allowing you to use Vue's reactive Composition API, `ref()`, and `computed()` properties within lightweight, isolated islands in ASP.NET Core.

---

## ⚡ 1. Razor TagHelper Syntax

To mount a Vue 3 island, set `framework="Vue"` on the `<island>` TagHelper:

```razor
@page
@model WarehouseModel

<island name="warehouse-cart" 
        framework="Vue" 
        props="@Model.WarehouseProps" 
        hydrate="Visible" />
```

In your C# PageModel (`WarehouseModel.cs`):

```csharp
public class WarehouseModel : PageModel
{
    public record WarehouseData(string WarehouseName, int InitialStock);

    public WarehouseData WarehouseProps { get; set; } = new(
        WarehouseName: "Erbil Central Logistics",
        InitialStock: 45
    );
}
```

---

## 💻 2. Writing the Vue Island

LaughTale supports standard **Single File Components (`.vue`)** using `<script setup>` and `<template>`, mounted seamlessly via `createVueIsland`.

### A. The Single File Component (`src/components/WarehouseCart.vue`)

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { onIslandEvent, emitIslandEvent } from 'laughtale';

interface Props {
  warehouseName: string;
  initialStock: number;
}

const props = defineProps<Props>();
const stock = ref(props.initialStock);
const cartQty = ref(0);
const isLowStock = computed(() => stock.value < 10);

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // Listen to sales emitted from React or other islands
  unsubscribe = onIslandEvent('polyglot:sale', () => {
    if (stock.value > 0) stock.value--;
  });
});

onUnmounted(() => {
  unsubscribe?.();
});

function addItem() {
  if (stock.value > 0) {
    stock.value--;
    cartQty.value++;
    // Emit event to cross-island ledger
    emitIslandEvent('polyglot:cart', {
      source: 'Vue 3 Island',
      action: 'add_item',
      cartQty: cartQty.value,
      remainingStock: stock.value
    });
  }
}

function restock() {
  stock.value += 10;
  emitIslandEvent('polyglot:restock', {
    source: 'Vue 3 Island',
    addedUnits: 10
  });
}
</script>

<template>
  <div class="p-card p-6 bg-surface-0 border rounded-xl shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <h4 class="font-bold text-lg text-surface-900">{{ warehouseName }}</h4>
      <span class="p-tag p-tag-success">Vue 3</span>
    </div>

    <div class="mb-4">
      <div class="text-sm text-surface-500">Available Stock:</div>
      <div :class="['text-3xl font-black', isLowStock ? 'text-red-500' : 'text-emerald-600']">
        {{ stock }} units
      </div>
    </div>

    <div class="flex gap-2">
      <button type="button" @click="addItem" :disabled="stock === 0" class="p-button p-button-primary text-sm px-3 py-2">
        Add to Cart ({{ cartQty }})
      </button>
      <button type="button" @click="restock" class="p-button p-button-outlined text-sm px-3 py-2">
        + Restock (+10)
      </button>
    </div>
  </div>
</template>
```

### B. Island Mount Entrypoint (`src/islands/warehouse-cart.ts`)

With LaughTale's built-in `createVueIsland` adapter, mounting the `.vue` component takes only two lines:

```typescript
import { createVueIsland } from 'laughtale';
import WarehouseCart from '../components/WarehouseCart.vue';

// LaughTale mounts the Vue SFC and automatically manages app.unmount() on cleanup
export default createVueIsland(WarehouseCart);
```

---

### C. Zero-Config Pure TypeScript Alternative (`src/islands/warehouse-cart-ts.ts`)

If your bundler pipeline doesn't have a `.vue` compiler plugin configured, you can also author Vue 3 islands in pure TypeScript with `defineComponent` or `h()`:

```typescript
import { defineComponent, ref, computed, h } from 'vue';
import { createVueIsland } from 'laughtale';

export interface WarehouseProps {
    warehouseName: string;
    initialStock: number;
}

export const WarehouseComponent = defineComponent({
    props: {
        warehouseName: { type: String, required: true },
        initialStock: { type: Number, required: true }
    },
    setup(props) {
        const stock = ref(props.initialStock);
        const cartQty = ref(0);

        return () => h('div', { class: 'p-card p-6 bg-surface-0 border rounded-xl' }, [
            h('h4', { class: 'font-bold text-lg' }, props.warehouseName),
            h('p', `Available Stock: ${stock.value} units`),
            h('button', { 
                type: 'button',
                class: 'p-button p-button-primary',
                onClick: () => { if (stock.value > 0) { stock.value--; cartQty.value++; } }
            }, `Add to Cart (${cartQty.value})`)
        ]);
    }
});

export default createVueIsland(WarehouseComponent);
```

---

## 🛡️ 3. Key Benefits of Vue in LaughTale

1. **Scoped Reactivity**: Vue's reactivity system operates exclusively inside the island's container DOM node.
2. **Clean Lifecycle**: LaughTale's `IslandContext.onCleanup` calls `app.unmount()`, ensuring zero memory leaks during page navigation.
3. **No Heavy Shell**: Avoids the overhead of a full Vue-Router / Single Page App setup while retaining all Composition API power.

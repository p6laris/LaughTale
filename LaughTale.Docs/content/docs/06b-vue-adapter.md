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

## 💻 2. Writing the Vue Island (`src/islands/warehouse-cart.ts`)

```typescript
import { createApp, ref, computed, onMounted, onUnmounted } from 'vue';
import { IslandContext, emitIslandEvent, onIslandEvent } from 'laughtale';

export interface WarehouseProps {
    warehouseName: string;
    initialStock: number;
}

// Vue Component Definition (Composition API)
const WarehouseComponent = {
    props: ['warehouseName', 'initialStock'],
    setup(props: WarehouseProps) {
        const stock = ref(props.initialStock);
        const cartQty = ref(0);

        const isLowStock = computed(() => stock.value < 10);

        let unsubscribe: (() => void) | null = null;

        onMounted(() => {
            // Listen to sales emitted from React or other islands
            unsubscribe = onIslandEvent('polyglot:sale', (payload: any) => {
                if (stock.value > 0) {
                    stock.value--;
                }
            });
        });

        onUnmounted(() => {
            unsubscribe?.();
        });

        const addItem = () => {
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
        };

        const restock = () => {
            stock.value += 10;
            emitIslandEvent('polyglot:restock', {
                source: 'Vue 3 Island',
                addedUnits: 10
            });
        };

        return { stock, cartQty, isLowStock, addItem, restock, props };
    },
    template: `
        <div class="p-card p-6 bg-surface-0 border rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-bold text-lg text-surface-900">{{ props.warehouseName }}</h4>
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
    `
};

// LaughTale Island Mount Entrypoint
export default function WarehouseCartIsland(
    container: HTMLElement, 
    props: WarehouseProps, 
    ctx?: IslandContext
) {
    const app = createApp(WarehouseComponent, props);
    app.mount(container);

    // Teardown when navigated away
    ctx?.onCleanup(() => {
        app.unmount();
    });

    return () => app.unmount();
}
```

---

## 🛡️ 3. Key Benefits of Vue in LaughTale

1. **Scoped Reactivity**: Vue's reactivity system operates exclusively inside the island's container DOM node.
2. **Clean Lifecycle**: LaughTale's `IslandContext.onCleanup` calls `app.unmount()`, ensuring zero memory leaks during page navigation.
3. **No Heavy Shell**: Avoids the overhead of a full Vue-Router / Single Page App setup while retaining all Composition API power.

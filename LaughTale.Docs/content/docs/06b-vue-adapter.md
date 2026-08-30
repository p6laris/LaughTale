---
title: "Vue 3 Islands Adapter"
description: "How to mount, pass reactive props, project slots, and handle lifecycle teardown for Vue 3 Composition API components in ASP.NET Core."
order: 6
section: "Multi-Framework Adapters"
---

# Vue 3 Islands Adapter

LaughTale provides a dedicated mount adapter for **Vue 3** (supporting both the Composition API and Options API) via `createVueAdapter` / `createVueIsland`.

Vue components hydrate cleanly inside Razor Pages with reactive prop binding, slots, and automatic `app.unmount()` cleanup.

---

## 📦 Installation

To use Vue 3 inside your LaughTale client bundle:

```bash
npm install vue
```

---

## ⚡ Step 1: Author Your Vue 3 Component

Create your component file (e.g. `src/islands/inventory-manager.ts`):

```typescript
import { defineComponent, ref, computed } from 'vue';
import { createVueAdapter } from 'laughtale/adapters/vue';
import { emitIslandEvent } from 'laughtale';

export interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    price: number;
}

export const InventoryManager = defineComponent({
    props: {
        warehouseCode: { type: String, required: true },
        initialItems: { type: Array as () => InventoryItem[], default: () => [] }
    },
    setup(props) {
        const items = ref<InventoryItem[]>([...props.initialItems]);
        const newItemName = ref('');
        const newItemStock = ref(10);

        const totalStock = computed(() => items.value.reduce((sum, item) => sum + item.stock, 0));

        const addItem = () => {
            if (!newItemName.value.trim()) return;
            const newItem: InventoryItem = {
                id: `SKU-${Date.now().toString().slice(-4)}`,
                name: newItemName.value.trim(),
                stock: newItemStock.value,
                price: 29.99
            };
            items.value.push(newItem);
            newItemName.value = '';
            
            // Broadcast event to React or Svelte islands on the same page
            emitIslandEvent('inventory:item-added', newItem);
        };

        const removeItem = (index: number) => {
            items.value.splice(index, 1);
        };

        return {
            items,
            newItemName,
            newItemStock,
            totalStock,
            addItem,
            removeItem
        };
    },
    template: `
        <div class="vue-card p-4 bg-surface-0 border border-border rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-lg text-primary">Warehouse: {{ warehouseCode }}</h3>
                <span class="aura-tag tag-emerald">Vue 3 Composition</span>
            </div>

            <p class="text-sm text-muted mb-3">Total Items in Stock: <strong class="text-surface-900">{{ totalStock }}</strong></p>

            <ul class="space-y-2 mb-4">
                <li v-for="(item, idx) in items" :key="item.id" class="flex justify-between items-center p-2 bg-surface-50 rounded border border-border text-sm">
                    <span><strong>{{ item.name }}</strong> ({{ item.id }})</span>
                    <div class="flex items-center gap-2">
                        <span class="badge font-mono">{{ item.stock }} units</span>
                        <button type="button" @click="removeItem(idx)" class="text-red-500 hover:text-red-700 font-bold px-1">✕</button>
                    </div>
                </li>
            </ul>

            <div class="flex gap-2">
                <input v-model="newItemName" type="text" placeholder="Item name..." class="p-inputtext flex-1 text-sm" />
                <input v-model.number="newItemStock" type="number" min="1" class="p-inputtext w-20 text-sm" />
                <button type="button" @click="addItem" class="p-button p-button-sm">Add Item</button>
            </div>
        </div>
    `
});

// Export as LaughTale island adapter
export default createVueAdapter(InventoryManager);
```

---

## 🏗️ Step 2: Render in Razor (`.cshtml`)

```razor
@page
@model InventoryPageModel
@{
    ViewData["Title"] = "Vue 3 Island Demo";
    
    var defaultItems = new[]
    {
        new { Id = "SKU-1001", Name = "Enterprise Security Key", Stock = 45, Price = 79.99 },
        new { Id = "SKU-1002", Name = "Biometric Scanner", Stock = 12, Price = 249.00 }
    };
}

<div class="container py-4">
    <h2>Inventory Management</h2>
    
    <!-- Vue Island mounts with revived C# typed objects -->
    <island name="inventory-manager" 
            framework="Vue" 
            props="@(new { WarehouseCode = "WH-HQ-01", InitialItems = defaultItems })" 
            hydrate="Load" />
</div>
```

---

## 🛡️ Clean Teardown on Navigation

When the user navigates away:
1. LaughTale dispatches `laughtale:unmount`.
2. The Vue adapter calls `app.unmount()`.
3. All Vue reactivity watchers, computed properties, and lifecycle hooks (`onUnmounted`) trigger cleanly with zero memory leaks.

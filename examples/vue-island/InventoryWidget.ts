import { defineComponent, ref } from 'vue';
import { createVueAdapter } from 'laughtale/adapters/vue';

export const InventoryWidget = defineComponent({
    props: {
        warehouseCode: { type: String, required: true },
        initialStock: { type: Number, default: 20 }
    },
    setup(props) {
        const stock = ref(props.initialStock);

        return { props, stock };
    },
    template: `
        <div class="p-card p-4 bg-surface-0 border border-border rounded-xl">
            <h3 class="font-bold text-emerald-600">Warehouse {{ warehouseCode }}</h3>
            <p class="text-xl font-mono my-2">{{ stock }} items in stock</p>
            <button type="button" @click="stock++" class="p-button p-button-sm">Restock (+1)</button>
        </div>
    `
});

export default createVueAdapter(InventoryWidget);

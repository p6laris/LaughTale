import { defineComponent, h, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { emitIslandEvent, onIslandEvent } from '../../../../LaughTale.Client/src/runtime/events';

// A real Vue 3 component, rendered to HTML by the SSR sidecar and hydrated in the browser. It is
// imported by both the client island and the server bundle (Scripts/ssr-entry.ts), so its first
// render must be deterministic: randomness and time only in event handlers and lifecycle hooks.
// Written with render functions (h) because Vue JSX and .vue files each need an extra compiler.

type IconNode = [tag: string, attrs: Record<string, string>];

function icon(size: number, strokeWidth: number, nodes: IconNode[]) {
    return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }, nodes.map(([tag, attrs]) => h(tag, attrs)));
}

const PackageIcon = () => icon(18, 2, [
    ['path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }],
    ['path', { d: 'M12 22V12' }],
    ['path', { d: 'm3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7' }],
    ['path', { d: 'm7.5 4.27 9 5.15' }]
]);
const PlusIcon = () => icon(12, 2.5, [['path', { d: 'M5 12h14' }], ['path', { d: 'M12 5v14' }]]);
const MinusIcon = () => icon(12, 2.5, [['path', { d: 'M5 12h14' }]]);
const RefreshIcon = () => icon(13, 2, [
    ['path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }],
    ['path', { d: 'M21 3v5h-5' }],
    ['path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }],
    ['path', { d: 'M8 16H3v5' }]
]);

interface Product {
    name: string;
    stock: number;
    price: number;
    qty: number;
}

const INITIAL_PRODUCTS: Product[] = [
    { name: 'LaughTale Enterprise Pro License', stock: 12, price: 499, qty: 0 },
    { name: 'Dedicated Support Tier (1-Yr)', stock: 8, price: 299, qty: 0 },
    { name: 'Custom Theme Studio Pack', stock: 25, price: 99, qty: 0 }
];

export default defineComponent({
    name: 'PolyglotVue',
    // initialStock is declared (not used) so Vue doesn't fall it through as an HTML attribute.
    props: {
        warehouse: { type: String, default: 'Erbil Regional Depot' },
        initialStock: { type: Number, default: 0 }
    },
    setup(props) {
        const products = reactive(INITIAL_PRODUCTS.map(p => ({ ...p })));
        const log = ref<string[]>(['Warehouse inventory initialized (Vue 3 Reactive).']);

        // Reacts to the React island's sales on the same page. Lifecycle hooks never run on the server.
        let unsubscribe: (() => void) | undefined;
        onMounted(() => {
            unsubscribe = onIslandEvent('polyglot:sale', (payload: any) => {
                log.value = [`Sale detected: ${payload.amount} ${payload.source}`, ...log.value].slice(0, 3);
            });
        });
        onBeforeUnmount(() => unsubscribe?.());

        function change(index: number, delta: 1 | -1) {
            const product = products[index];
            if (delta === 1 ? product.stock === 0 : product.qty === 0) return;
            product.qty += delta;
            product.stock -= delta;
            emitIslandEvent('polyglot:cart', {
                source: 'Vue 3 Island',
                action: delta === 1 ? 'add_item' : 'remove_item',
                product: product.name,
                qtyInCart: product.qty,
                remainingStock: product.stock,
                timestamp: new Date().toLocaleTimeString()
            });
        }

        function restock() {
            products.forEach(p => { p.stock += 5; });
            emitIslandEvent('polyglot:restock', {
                source: 'Vue 3 Island',
                warehouse: props.warehouse,
                addedUnits: 15,
                timestamp: new Date().toLocaleTimeString()
            });
        }

        return () => {
            const itemsInCart = products.reduce((sum, p) => sum + p.qty, 0);
            const cartTotal = products.reduce((sum, p) => sum + p.qty * p.price, 0);

            return h('div', { class: 'p-card', style: 'background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;' }, [
                h('div', [
                    h('div', { style: 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;' }, [
                        h('div', { style: 'display: flex; align-items: center; gap: 0.75rem;' }, [
                            h('div', { style: 'width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-emerald-50, rgba(16, 185, 129, 0.1)); color: var(--p-emerald-500, #10b981); display: flex; align-items: center; justify-content: center;' }, [PackageIcon()]),
                            h('div', [
                                h('h4', { style: 'margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);' }, props.warehouse),
                                h('span', { style: 'font-size: 0.75rem; color: var(--p-text-muted);' }, 'Server-rendered • Hydrated')
                            ])
                        ]),
                        h('span', { class: 'p-tag p-tag-success', style: 'font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem;' }, 'Vue 3')
                    ]),

                    h('div', { style: 'display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;' }, products.map((product, index) =>
                        h('div', { key: product.name, style: 'display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem; border-radius: var(--p-border-radius-md); background: var(--p-surface-50); border: 1px solid var(--p-border-color);' }, [
                            h('div', { style: 'display: flex; flex-direction: column;' }, [
                                h('span', { style: 'font-size: 0.8125rem; font-weight: 600; color: var(--p-text-color);' }, product.name),
                                h('span', { style: 'font-size: 0.7rem; color: var(--p-text-muted);' }, [
                                    `$${product.price} • Stock: `,
                                    h('strong', { 'data-testid': `vue-stock-${index}`, style: `color: ${product.stock < 5 ? 'var(--p-red-500, #ef4444)' : 'var(--p-text-color)'};` }, String(product.stock))
                                ])
                            ]),
                            h('div', { style: 'display: flex; align-items: center; gap: 0.4rem;' }, [
                                h('button', { type: 'button', class: 'p-button p-button-secondary p-button-sm', 'data-testid': `vue-dec-${index}`, disabled: product.qty === 0, onClick: () => change(index, -1), style: 'padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px;' }, [MinusIcon()]),
                                h('span', { style: 'font-size: 0.8125rem; font-weight: 700; min-width: 1.5rem; text-align: center;' }, String(product.qty)),
                                h('button', { type: 'button', class: 'p-button p-button-primary p-button-sm', 'data-testid': `vue-inc-${index}`, disabled: product.stock === 0, onClick: () => change(index, 1), style: 'padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px;' }, [PlusIcon()])
                            ])
                        ])
                    )),

                    h('div', { style: 'background: var(--p-surface-100, #f1f5f9); border-radius: var(--p-border-radius-md); padding: 0.5rem 0.75rem; font-size: 0.7rem; font-family: var(--p-font-mono); color: var(--p-text-muted);' },
                        log.value.map(message => h('div', `• ${message}`)))
                ]),

                h('div', { style: 'border-top: 1px solid var(--p-border-color); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;' }, [
                    h('div', [
                        h('span', { style: 'font-size: 0.7rem; color: var(--p-text-muted);' }, `Cart (${itemsInCart} items):`),
                        h('div', { 'data-testid': 'vue-cart-total', style: 'font-size: 1.25rem; font-weight: 800; color: var(--p-text-color);' }, `$${cartTotal}`)
                    ]),
                    h('button', { type: 'button', class: 'p-button p-button-outlined p-button-sm', 'data-testid': 'vue-restock', onClick: restock, style: 'font-size: 0.75rem; padding: 0.4rem 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 600;' }, [RefreshIcon(), ' Restock'])
                ])
            ]);
        };
    }
});

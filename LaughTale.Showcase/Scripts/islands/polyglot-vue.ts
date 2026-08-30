import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

const ICONS = {
    package: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/></svg>`,
    plus: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    minus: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
    refresh: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
    shield: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    bell: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`
};

interface ProductItem {
    id: string;
    name: string;
    stock: number;
    price: number;
    qty: number;
}

export default function VuePolyglotIsland(
    container: HTMLElement,
    props: any,
    ctx?: IslandContext
) {
    const warehouse = props?.warehouse || 'Central Logistics Hub';
    let products: ProductItem[] = [
        { id: 'SKU-801', name: 'Security FIDO2 Key', stock: 18, price: 45, qty: 0 },
        { id: 'SKU-802', name: 'Biometric Iris Reader', stock: 6, price: 320, qty: 0 },
        { id: 'SKU-803', name: 'HSM Cryptocard', stock: 24, price: 110, qty: 0 }
    ];
    const logMessages: string[] = [];

    function render() {
        const totalItemsInCart = products.reduce((acc, p) => acc + p.qty, 0);
        const totalCartPrice = products.reduce((acc, p) => acc + (p.qty * p.price), 0);

        container.innerHTML = `
            <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-green-50, rgba(16, 185, 129, 0.1)); color: var(--p-green-500, #10b981); display: flex; align-items: center; justify-content: center;">
                                ${ICONS.package}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">Vue 3 Cart & Warehouse</h4>
                                <span style="font-size: 0.75rem; color: var(--p-text-muted);">Composition API • Reactive State</span>
                            </div>
                        </div>
                        <span class="p-tag p-tag-success" style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem;">Vue 3</span>
                    </div>

                    <!-- Warehouse Location Readout -->
                    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-md); padding: 0.6rem 0.85rem; margin-bottom: 0.85rem; font-size: 0.75rem;">
                        <span style="color: var(--p-text-muted);">Location: <strong style="color: var(--p-text-color);">${warehouse}</strong></span>
                        <span class="p-badge p-badge-success" style="font-size: 0.65rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.2rem;">
                            ${ICONS.shield} Active
                        </span>
                    </div>

                    <!-- Products Reactive List -->
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem;">
                        ${products.map((p, idx) => `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-md); font-size: 0.8125rem;">
                                <div>
                                    <div style="font-weight: 600; color: var(--p-text-color);">${p.name}</div>
                                    <div style="font-size: 0.7rem; color: var(--p-text-muted);">$${p.price} • Stock: <strong style="color: ${p.stock <= 5 ? 'var(--p-amber-500, #f59e0b)' : 'var(--p-green-500, #10b981)'}">${p.stock}</strong></div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.4rem;">
                                    <button type="button" class="btn-dec p-button p-button-outlined p-button-sm" data-idx="${idx}" style="padding: 0.2rem 0.4rem; min-width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center;" ${p.qty === 0 ? 'disabled' : ''}>
                                        ${ICONS.minus}
                                    </button>
                                    <span style="font-weight: 700; font-family: var(--p-font-mono); min-width: 1.25rem; text-align: center; font-size: 0.85rem; color: var(--p-text-color);">${p.qty}</span>
                                    <button type="button" class="btn-inc p-button p-button-primary p-button-sm" data-idx="${idx}" style="padding: 0.2rem 0.4rem; min-width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center;" ${p.stock === 0 ? 'disabled' : ''}>
                                        ${ICONS.plus}
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Live Event Toast Feed -->
                    ${logMessages.length > 0 ? `
                        <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-left: 3px solid var(--p-green-500, #10b981); border-radius: var(--p-border-radius-md); padding: 0.5rem 0.75rem; font-size: 0.725rem; color: var(--p-text-color); display: flex; align-items: flex-start; gap: 0.4rem; margin-bottom: 0.5rem;">
                            <span style="color: var(--p-green-500, #10b981); flex-shrink: 0; margin-top: 0.1rem;">${ICONS.bell}</span>
                            <span>${logMessages[0]}</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Footer Summary & Actions -->
                <div style="border-top: 1px solid var(--p-border-color); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                    <div>
                        <span style="font-size: 0.7rem; color: var(--p-text-muted);">Cart (${totalItemsInCart} items):</span>
                        <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">$${totalCartPrice}</div>
                    </div>
                    <button type="button" class="btn-restock p-button p-button-outlined p-button-sm" style="font-size: 0.75rem; padding: 0.4rem 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 600;">
                        ${ICONS.refresh} Restock (+5)
                    </button>
                </div>
            </div>
        `;

        container.querySelectorAll('.btn-inc').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
                if (products[idx].stock > 0) {
                    products[idx].stock--;
                    products[idx].qty++;
                    render();
                }
            }, { signal: ctx?.signal });
        });

        container.querySelectorAll('.btn-dec').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
                if (products[idx].qty > 0) {
                    products[idx].qty--;
                    products[idx].stock++;
                    render();
                }
            }, { signal: ctx?.signal });
        });

        container.querySelector('.btn-restock')?.addEventListener('click', () => {
            products.forEach(p => p.stock += 5);
            render();
        }, { signal: ctx?.signal });
    }

    render();

    const unsubscribe = onIslandEvent('polyglot:sale', (payload: any) => {
        const available = products.filter(p => p.stock > 0);
        if (available.length > 0) {
            const randomProd = available[Math.floor(Math.random() * available.length)];
            randomProd.stock--;
            logMessages.unshift(`Dispatched 1x ${randomProd.name} for $${payload.amount} ${payload.source} sale!`);
            if (logMessages.length > 3) logMessages.pop();
            render();
        }
    });

    ctx?.onCleanup(() => unsubscribe?.());
    return () => unsubscribe?.();
}

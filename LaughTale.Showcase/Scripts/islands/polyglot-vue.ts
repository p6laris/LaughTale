import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

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
            <div class="p-card rounded-2xl border border-border bg-surface-0 p-5 shadow-md" style="border-top: 4px solid #10b981; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <div style="width: 2rem; height: 2rem; border-radius: 8px; background: rgba(16, 185, 129, 0.12); color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: bold;">🟢</div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">Vue 3 Cart & Warehouse</h4>
                                <span style="font-size: 0.7rem; color: var(--p-text-muted);">Reactivity • Composition API</span>
                            </div>
                        </div>
                        <span class="aura-tag tag-emerald" style="font-size: 0.7rem; font-weight: 600;">Vue 3</span>
                    </div>

                    <!-- Warehouse Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 10px; padding: 0.5rem 0.85rem; margin-bottom: 0.75rem; font-size: 0.75rem;">
                        <span>Warehouse: <strong class="text-surface-900">${warehouse}</strong></span>
                        <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px;">Active</span>
                    </div>

                    <!-- Products Reactive List -->
                    <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem;">
                        ${products.map((p, idx) => `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.65rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 8px; font-size: 0.8rem;">
                                <div>
                                    <div style="font-weight: 600; color: var(--p-text-color);">${p.name}</div>
                                    <div style="font-size: 0.7rem; color: var(--p-text-muted);">$${p.price} • Stock: <strong style="color: ${p.stock <= 5 ? '#f59e0b' : '#10b981'}">${p.stock}</strong></div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.35rem;">
                                    <button type="button" class="btn-dec p-button p-button-secondary" data-idx="${idx}" style="padding: 0.15rem 0.45rem; font-size: 0.75rem;" ${p.qty === 0 ? 'disabled' : ''}>-</button>
                                    <span style="font-weight: 700; font-family: var(--p-font-mono); min-width: 1.25rem; text-align: center;">${p.qty}</span>
                                    <button type="button" class="btn-inc p-button p-button-primary" data-idx="${idx}" style="padding: 0.15rem 0.45rem; font-size: 0.75rem;" ${p.stock === 0 ? 'disabled' : ''}>+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Live Event Toast Feed -->
                    ${logMessages.length > 0 ? `
                        <div style="background: rgba(16, 185, 129, 0.08); border: 1px dashed #10b981; border-radius: 8px; padding: 0.4rem 0.6rem; font-size: 0.7rem; color: #065f46; margin-bottom: 0.5rem;">
                            ${logMessages[0]}
                        </div>
                    ` : ''}
                </div>

                <!-- Footer Summary & Checkout -->
                <div style="border-top: 1px solid var(--p-border-color); padding-top: 0.65rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 0.7rem; color: var(--p-text-muted);">Cart (${totalItemsInCart} items):</span>
                        <div style="font-size: 1.1rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">$${totalCartPrice}</div>
                    </div>
                    <button type="button" class="btn-restock p-button p-button-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                        Restock (+5)
                    </button>
                </div>
            </div>
        `;

        // Wire Quantity Inc/Dec
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

    // Listen to sales from React island
    const unsubscribe = onIslandEvent('polyglot:sale', (payload: any) => {
        // Auto-decrement a random product to simulate automated warehouse dispatch
        const available = products.filter(p => p.stock > 0);
        if (available.length > 0) {
            const randomProd = available[Math.floor(Math.random() * available.length)];
            randomProd.stock--;
            logMessages.unshift(`⚡ Auto-dispatched 1x ${randomProd.name} for $${payload.amount} ${payload.source} transaction!`);
            if (logMessages.length > 3) logMessages.pop();
            render();
        }
    });

    ctx?.onCleanup(() => unsubscribe?.());
    return () => unsubscribe?.();
}

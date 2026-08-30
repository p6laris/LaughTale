import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

interface LogEntry {
    time: string;
    source: string;
    action: string;
    payload: string;
}

export default function VanillaPolyglotIsland(
    container: HTMLElement,
    props: any,
    ctx?: IslandContext
) {
    const title = props?.logTitle || 'Inter-Island Event Bus Ledger';
    const logs: LogEntry[] = [];

    function render() {
        container.innerHTML = `
            <div class="p-card rounded-2xl border border-border bg-surface-950 p-5 shadow-md font-mono text-xs" style="border-top: 4px solid #e2e8f0; height: 100%; display: flex; flex-direction: column; justify-content: space-between; color: #cbd5e1;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <div style="width: 2rem; height: 2rem; border-radius: 8px; background: rgba(255, 255, 255, 0.08); color: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🍦</div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #ffffff; font-family: var(--p-font-family, sans-serif);">${title}</h4>
                                <span style="font-size: 0.7rem; color: #94a3b8; font-family: var(--p-font-family, sans-serif);">0 KB VDOM • Standard CustomEvents</span>
                            </div>
                        </div>
                        <button type="button" class="btn-clear bg-surface-800 hover:bg-surface-700 text-surface-200" style="padding: 0.2rem 0.5rem; font-size: 0.65rem; border-radius: 4px; border: 1px solid #475569; cursor: pointer;">
                            Clear
                        </button>
                    </div>

                    <!-- Terminal Window -->
                    <div style="background: rgba(0, 0, 0, 0.5); border: 1px solid #334155; border-radius: 10px; padding: 0.75rem; min-height: 110px; max-height: 120px; overflow-y: auto; font-size: 0.725rem; line-height: 1.5;">
                        ${logs.length === 0 ? `
                            <div style="color: #64748b; font-style: italic; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 1.5s infinite;"></span>
                                Listening to cross-framework broadcasts... (Click React or Svelte buttons!)
                            </div>
                        ` : ''}
                        ${logs.map(log => `
                            <div style="margin-bottom: 0.35rem; display: flex; flex-direction: column;">
                                <div style="display: flex; gap: 0.4rem; align-items: center;">
                                    <span style="color: #64748b;">[${log.time}]</span>
                                    <span style="color: #38bdf8; font-weight: 600;">${log.source}</span>
                                    <span style="color: #a78bfa;">→ ${log.action}</span>
                                </div>
                                <div style="color: #34d399; font-size: 0.675rem; padding-left: 0.75rem; word-break: break-all;">
                                    ${log.payload}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Footer Summary -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.7rem; color: #64748b; font-family: var(--p-font-family, sans-serif);">
                    <span>Total Packets: <strong style="color: #ffffff;">${logs.length}</strong></span>
                    <span style="color: #10b981;">● Event Bus Active</span>
                </div>
            </div>
        `;

        container.querySelector('.btn-clear')?.addEventListener('click', () => {
            logs.length = 0;
            render();
        }, { signal: ctx?.signal });
    }

    render();

    const unsubscribe = onIslandEvent('polyglot:sale', (payload: any) => {
        logs.unshift({
            time: payload.timestamp || new Date().toLocaleTimeString(),
            source: payload.source || 'EventBus',
            action: 'EVENT:polyglot:sale',
            payload: JSON.stringify(payload)
        });
        if (logs.length > 8) logs.pop();
        render();
    });

    ctx?.onCleanup(() => unsubscribe?.());
    return () => unsubscribe?.();
}

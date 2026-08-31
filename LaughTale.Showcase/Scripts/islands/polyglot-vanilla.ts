import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

const ICONS = {
    terminal: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
    trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    radio: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>`
};

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
            <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-surface-100); color: var(--p-text-color); display: flex; align-items: center; justify-content: center;">
                                ${ICONS.terminal}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${title}</h4>
                                <span style="font-size: 0.75rem; color: var(--p-text-muted);">0 KB VDOM • Standard CustomEvents</span>
                            </div>
                        </div>
                        <button type="button" class="btn-clear p-button p-button-outlined p-button-sm" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 600;">
                            ${ICONS.trash} Clear
                        </button>
                    </div>

                    <!-- Terminal Event Log Box -->
                    <div style="background: var(--p-surface-950, #0f172a); border: 1px solid var(--p-surface-800, #1e293b); border-radius: var(--p-border-radius-md); padding: 0.85rem; min-height: 120px; max-height: 130px; overflow-y: auto; font-family: var(--p-font-mono, monospace); font-size: 0.75rem; line-height: 1.6; color: #cbd5e1;">
                        ${logs.length === 0 ? `
                            <div style="color: #64748b; font-style: italic; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0;">
                                <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; animation: pulse 1.5s infinite;"></span>
                                Listening to cross-framework broadcasts... (Click React or Svelte buttons!)
                            </div>
                        ` : ''}
                        ${logs.map(log => `
                            <div style="margin-bottom: 0.4rem; display: flex; flex-direction: column;">
                                <div style="display: flex; gap: 0.4rem; align-items: center;">
                                    <span style="color: #64748b;">[${log.time}]</span>
                                    <span style="color: #38bdf8; font-weight: 600;">${log.source}</span>
                                    <span style="color: #a78bfa;">→ ${log.action}</span>
                                </div>
                                <div style="color: #34d399; font-size: 0.7rem; padding-left: 0.75rem; word-break: break-all;">
                                    ${log.payload}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Footer Summary -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid var(--p-border-color); padding-top: 0.75rem; font-size: 0.75rem; color: var(--p-text-muted);">
                    <span>Captured Packets: <strong style="color: var(--p-text-color);">${logs.length}</strong></span>
                    <span style="color: var(--p-green-500, #10b981); display: inline-flex; align-items: center; gap: 0.3rem; font-weight: 600;">
                        ${ICONS.radio} Event Bus Online
                    </span>
                </div>
            </div>
        `;

        container.querySelector('.btn-clear')?.addEventListener('click', () => {
            logs.length = 0;
            render();
        }, { signal: ctx?.signal });
    }

    render();

    function logEvent(actionName: string, payload: any) {
        logs.unshift({
            time: payload.timestamp || new Date().toLocaleTimeString(),
            source: payload.source || 'EventBus',
            action: `EVENT:${actionName}`,
            payload: JSON.stringify(payload)
        });
        if (logs.length > 10) logs.pop();
        render();
    }

    const unsubs = [
        onIslandEvent('polyglot:sale', (payload: any) => logEvent('polyglot:sale', payload)),
        onIslandEvent('polyglot:cart', (payload: any) => logEvent('polyglot:cart', payload)),
        onIslandEvent('polyglot:restock', (payload: any) => logEvent('polyglot:restock', payload)),
        onIslandEvent('polyglot:spike', (payload: any) => logEvent('polyglot:spike', payload)),
        onIslandEvent('polyglot:burst', (payload: any) => logEvent('polyglot:burst', payload))
    ];

    ctx?.onCleanup(() => unsubs.forEach(u => u?.()));
    return () => unsubs.forEach(u => u?.());
}

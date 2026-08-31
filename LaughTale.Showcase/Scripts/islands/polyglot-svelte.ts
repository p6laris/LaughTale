import { IslandContext, onIslandEvent, emitIslandEvent } from '../../../LaughTale.Client/src/index';

const ICONS = {
    activity: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>`,
    zap: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`
};

export default function SveltePolyglotIsland(
    container: HTMLElement,
    props: any,
    ctx?: IslandContext
) {
    const gaugeTitle = props?.gaugeTitle || 'Cluster Node 01';
    let load = props?.initialLoad ?? 40;

    function render() {
        const isWarning = load >= 75;
        const strokeDash = Math.round((load / 100) * 283);

        container.innerHTML = `
            <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-orange-50, rgba(249, 115, 22, 0.1)); color: var(--p-orange-500, #f97316); display: flex; align-items: center; justify-content: center;">
                                ${ICONS.activity}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${gaugeTitle}</h4>
                                <span style="font-size: 0.75rem; color: var(--p-text-muted);">Svelte 5 • Runes Engine</span>
                            </div>
                        </div>
                        <span class="p-tag p-tag-warn" style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem;">Svelte 5</span>
                    </div>

                    <!-- Circular Animated SVG Radial Meter -->
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin: 1rem 0;">
                        <div style="position: relative; width: 100px; height: 100px;">
                            <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--p-surface-200)" stroke-width="8" />
                                <circle cx="50" cy="50" r="45" fill="none" 
                                        stroke="${isWarning ? 'var(--p-red-500, #ef4444)' : 'var(--p-orange-500, #f97316)'}" 
                                        stroke-width="8" 
                                        stroke-linecap="round"
                                        stroke-dasharray="283"
                                        stroke-dashoffset="${283 - strokeDash}"
                                        style="transition: stroke-dashoffset 0.4s ease, stroke 0.3s ease;" />
                            </svg>
                            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                <span style="font-size: 1.35rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">${load}%</span>
                                <span style="font-size: 0.65rem; color: var(--p-text-muted); font-weight: 600; text-transform: uppercase;">Load</span>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                            <div style="font-size: 0.75rem; color: var(--p-text-muted);">
                                Status:
                            </div>
                            <div>
                                <span class="p-badge ${isWarning ? 'p-badge-warn' : 'p-badge-info'}" style="font-weight: 700; font-size: 0.65rem;">
                                    ${isWarning ? 'Peak Load' : 'Nominal'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trigger Action -->
                <div style="border-top: 1px solid var(--p-border-color); padding-top: 1rem; margin-top: 1rem;">
                    <button type="button" class="btn-stress p-button p-button-outlined" style="width: 100%; justify-content: center; font-size: 0.8125rem; padding: 0.5rem; display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600;">
                        ${ICONS.zap} Trigger Node Spike (+25%)
                    </button>
                </div>
            </div>
        `;

        container.querySelector('.btn-stress')?.addEventListener('click', () => {
            load = Math.min(98, load + 25);
            emitIslandEvent('polyglot:spike', {
                source: 'Svelte 5 Island',
                node: gaugeTitle,
                loadPercent: load,
                status: load >= 75 ? 'Peak Load Spike' : 'Nominal',
                timestamp: new Date().toLocaleTimeString()
            });
            render();
        }, { signal: ctx?.signal });
    }

    render();

    const unsubscribe = onIslandEvent('polyglot:sale', () => {
        load = Math.min(98, load + 14);
        render();
    });

    const timer = setInterval(() => {
        if (load > 25) {
            load = Math.max(20, load - 2);
            render();
        }
    }, 1200);

    ctx?.onCleanup(() => {
        unsubscribe?.();
        clearInterval(timer);
    });

    return () => {
        unsubscribe?.();
        clearInterval(timer);
    };
}

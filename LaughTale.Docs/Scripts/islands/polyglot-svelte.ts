import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

const ICONS = {
    cpu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    zap: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    activity: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>`
};

export default function SveltePolyglotIsland(
    container: HTMLElement,
    props: any,
    ctx?: IslandContext
) {
    const title = props?.gaugeTitle || 'System CPU & Telemetry';
    let load = props?.initialLoad || 38;
    let ghz = 3.6;
    let memoryAlloc = 14.2;

    function render() {
        const isWarning = load >= 75;
        const strokeColor = isWarning ? 'var(--p-amber-500, #f59e0b)' : 'var(--p-primary-500, #0ea5e9)';
        
        const radius = 38;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (load / 100) * circumference;

        container.innerHTML = `
            <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-orange-50, rgba(249, 115, 22, 0.1)); color: var(--p-orange-500, #f97316); display: flex; align-items: center; justify-content: center;">
                                ${ICONS.cpu}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${title}</h4>
                                <span style="font-size: 0.75rem; color: var(--p-text-muted);">Compiled Runes • Zero-Virtual-DOM</span>
                            </div>
                        </div>
                        <span class="p-tag ${isWarning ? 'p-tag-warn' : 'p-tag-secondary'}" style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem;">Svelte 5</span>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin: 1rem 0;">
                        <div style="position: relative; width: 95px; height: 95px; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 95 95" style="width: 95px; height: 95px; transform: rotate(-90deg);">
                                <circle cx="47.5" cy="47.5" r="${radius}" stroke="var(--p-surface-200, #e2e8f0)" stroke-width="7.5" fill="transparent" />
                                <circle cx="47.5" cy="47.5" r="${radius}" stroke="${strokeColor}" stroke-width="7.5" fill="transparent"
                                    stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round"
                                    style="transition: stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease;" />
                            </svg>
                            <div style="position: absolute; text-align: center;">
                                <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">${load}%</div>
                                <div style="font-size: 0.65rem; color: var(--p-text-muted); text-transform: uppercase; font-weight: 600;">Load</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.75rem;">
                            <div>
                                <span style="color: var(--p-text-muted);">Clock Speed:</span>
                                <strong style="color: var(--p-text-color); font-family: var(--p-font-mono);">${(ghz + (load * 0.01)).toFixed(2)} GHz</strong>
                            </div>
                            <div>
                                <span style="color: var(--p-text-muted);">Allocated:</span>
                                <strong style="color: var(--p-text-color); font-family: var(--p-font-mono);">${(memoryAlloc + (load * 0.05)).toFixed(1)} GB / 32 GB</strong>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <span style="color: var(--p-text-muted);">Status:</span>
                                <span class="p-badge ${isWarning ? 'p-badge-warn' : 'p-badge-info'}" style="font-weight: 700; font-size: 0.65rem;">
                                    ${isWarning ? 'Peak Load' : 'Nominal'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="border-top: 1px solid var(--p-border-color); padding-top: 1rem; margin-top: 1rem;">
                    <button type="button" class="btn-stress p-button p-button-outlined" style="width: 100%; justify-content: center; font-size: 0.8125rem; padding: 0.5rem; display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600;">
                        ${ICONS.zap} Trigger Node Spike (+25%)
                    </button>
                </div>
            </div>
        `;

        container.querySelector('.btn-stress')?.addEventListener('click', () => {
            load = Math.min(98, load + 25);
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

import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

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
        const strokeColor = isWarning ? '#f59e0b' : '#3b82f6';
        
        // Circular progress math (radius: 40, circumference: 251.2)
        const radius = 38;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (load / 100) * circumference;

        container.innerHTML = `
            <div class="p-card rounded-2xl border border-border bg-surface-0 p-5 shadow-md" style="border-top: 4px solid #f59e0b; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <div style="width: 2rem; height: 2rem; border-radius: 8px; background: rgba(245, 158, 11, 0.12); color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: bold;">🧡</div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${title}</h4>
                                <span style="font-size: 0.7rem; color: var(--p-text-muted);">Compiled Runes • 0 KB VDOM</span>
                            </div>
                        </div>
                        <span class="aura-tag ${isWarning ? 'tag-amber' : 'tag-slate'}" style="font-size: 0.7rem; font-weight: 600;">Svelte 5</span>
                    </div>

                    <!-- Circular Radial Gauge -->
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1.25rem; margin: 0.75rem 0;">
                        <div style="position: relative; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 90 90" style="width: 90px; height: 90px; transform: rotate(-90deg);">
                                <!-- Background Track -->
                                <circle cx="45" cy="45" r="${radius}" stroke="var(--p-surface-200, #e2e8f0)" stroke-width="7" fill="transparent" />
                                <!-- Progress Arc -->
                                <circle cx="45" cy="45" r="${radius}" stroke="${strokeColor}" stroke-width="7" fill="transparent"
                                    stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round"
                                    style="transition: stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease;" />
                            </svg>
                            <div style="position: absolute; text-align: center;">
                                <div style="font-size: 1.2rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">${load}%</div>
                                <div style="font-size: 0.6rem; color: var(--p-text-muted); text-transform: uppercase;">Load</div>
                            </div>
                        </div>

                        <!-- Side Specs -->
                        <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.75rem;">
                            <div>
                                <span style="color: var(--p-text-muted);">Clock Speed:</span>
                                <strong style="color: var(--p-text-color); font-family: var(--p-font-mono);">${(ghz + (load * 0.01)).toFixed(2)} GHz</strong>
                            </div>
                            <div>
                                <span style="color: var(--p-text-muted);">Allocated:</span>
                                <strong style="color: var(--p-text-color); font-family: var(--p-font-mono);">${(memoryAlloc + (load * 0.05)).toFixed(1)} GB / 32 GB</strong>
                            </div>
                            <div>
                                <span style="color: var(--p-text-muted);">Status:</span>
                                <span class="badge" style="background: ${isWarning ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.15)'}; color: ${isWarning ? '#d97706' : '#2563eb'}; font-weight: 700; font-size: 0.65rem;">${isWarning ? 'Warning Peak' : 'Nominal'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Interactive Trigger -->
                <div style="margin-top: 0.5rem;">
                    <button type="button" class="btn-stress p-button p-button-secondary" style="width: 100%; justify-content: center; font-size: 0.75rem; padding: 0.45rem;">
                        ⚡ Trigger Cluster Spike (+25% Load)
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

    // Event listener: React sales create CPU activity
    const unsubscribe = onIslandEvent('polyglot:sale', () => {
        load = Math.min(98, load + 14);
        render();
    });

    // Natural recovery cycle
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

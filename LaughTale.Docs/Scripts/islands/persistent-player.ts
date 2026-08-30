export interface SystemTelemetryProps {
    metricName: string;
    refreshIntervalSeconds: number;
}

export default function PersistentTelemetryIsland(container: HTMLElement, props: SystemTelemetryProps) {
    let requests = 1420;
    let latency = 14;

    container.innerHTML = `
        <div style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.35rem 0.75rem; background: var(--p-surface-100); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); font-size: 0.8125rem;">
            <div style="display: flex; align-items: center; gap: 0.375rem;">
                <span class="live-dot" style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background-color: var(--p-primary-500);"></span>
                <span style="font-weight: 600; color: var(--p-surface-800); font-family: var(--p-font-mono); font-size: 0.75rem;">${props.metricName}</span>
            </div>
            
            <div style="font-family: var(--p-font-mono); font-size: 0.75rem; color: var(--p-surface-600); display: flex; gap: 0.5rem;">
                <span class="req-stat">${requests} req/s</span>
                <span style="color: var(--p-surface-400);">&bull;</span>
                <span class="lat-stat" style="color: var(--p-primary-700); font-weight: 600;">${latency}ms</span>
            </div>

            <span class="aura-tag tag-slate" style="font-size: 0.625rem; padding: 0.15rem 0.35rem;">persist</span>
        </div>
    `;

    const reqEl = container.querySelector('.req-stat') as HTMLElement;
    const latEl = container.querySelector('.lat-stat') as HTMLElement;

    setInterval(() => {
        requests += Math.floor(Math.random() * 9) - 4;
        latency = 12 + Math.floor(Math.random() * 5);
        if (reqEl) reqEl.textContent = `${requests} req/s`;
        if (latEl) latEl.textContent = `${latency}ms`;
    }, (props.refreshIntervalSeconds || 3) * 1000);
}

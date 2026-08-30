import { IslandContext, emitIslandEvent } from '../../../LaughTale.Client/src/index';

interface ReactPolyglotProps {
    title?: string;
    initialScore?: number;
    badge?: string;
}

export default function ReactPolyglotIsland(
    container: HTMLElement,
    props: ReactPolyglotProps,
    ctx?: IslandContext
) {
    let revenue = props.initialScore || 78500;
    let selectedQuarter = 'Q3';
    let bars = [45, 58, 62, 75, 88, 70, 92, 85, 96, 110];

    function render() {
        const maxVal = Math.max(...bars, 120);

        container.innerHTML = `
            <div class="p-card rounded-2xl border border-border bg-surface-0 p-5 shadow-md" style="border-top: 4px solid #0ea5e9; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <div style="width: 2rem; height: 2rem; border-radius: 8px; background: rgba(14, 165, 233, 0.12); color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: bold;">⚛️</div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${props.title || 'React 19 Revenue Node'}</h4>
                                <span style="font-size: 0.7rem; color: var(--p-text-muted);">JSX Virtual DOM • Fiber Engine</span>
                            </div>
                        </div>
                        <span class="aura-tag tag-sky" style="font-size: 0.7rem; font-weight: 600;">React 19</span>
                    </div>

                    <!-- Revenue KPI Metric -->
                    <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <span style="font-size: 0.75rem; color: var(--p-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Total ARR Revenue</span>
                            <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">+18.4% ↑</span>
                        </div>
                        <div style="font-size: 1.75rem; font-weight: 800; font-family: var(--p-font-mono, monospace); color: var(--p-text-color); margin-top: 0.25rem;">
                            $${revenue.toLocaleString()}
                        </div>
                    </div>

                    <!-- Interactive Histogram Chart -->
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                            <span style="font-size: 0.75rem; font-weight: 600; color: var(--p-text-muted);">Quarterly Velocity</span>
                            <div style="display: flex; gap: 0.25rem;">
                                ${['Q1', 'Q2', 'Q3', 'Q4'].map(q => `
                                    <button type="button" class="btn-quarter ${q === selectedQuarter ? 'active' : ''}" data-q="${q}" style="font-size: 0.65rem; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid ${q === selectedQuarter ? '#0ea5e9' : 'var(--p-border-color)'}; background: ${q === selectedQuarter ? '#0ea5e9' : 'transparent'}; color: ${q === selectedQuarter ? '#fff' : 'var(--p-text-muted)'}; cursor: pointer;">${q}</button>
                                `).join('')}
                            </div>
                        </div>
                        <div style="height: 60px; display: flex; align-items: flex-end; gap: 4px; padding-top: 8px; border-bottom: 1px solid var(--p-border-color);">
                            ${bars.map((val, i) => `
                                <div style="flex: 1; height: ${(val / maxVal) * 100}%; background: ${i === bars.length - 1 ? '#0ea5e9' : 'rgba(14, 165, 233, 0.35)'}; border-radius: 3px 3px 0 0; transition: height 0.3s cubic-bezier(0.16, 1, 0.3, 1);" title="Bucket ${i + 1}: $${val}k"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Action Triggers -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem;">
                    <button type="button" class="btn-sale-250 p-button p-button-primary" style="font-size: 0.75rem; padding: 0.45rem 0.5rem; justify-content: center;">
                        + $250 Quick Sale
                    </button>
                    <button type="button" class="btn-sale-1000 p-button p-button-secondary" style="font-size: 0.75rem; padding: 0.45rem 0.5rem; justify-content: center;">
                        + $1,000 Enterprise
                    </button>
                </div>
            </div>
        `;

        // Wire Quarter Toggles
        container.querySelectorAll('.btn-quarter').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedQuarter = btn.getAttribute('data-q') || 'Q3';
                bars = bars.map(() => Math.floor(Math.random() * 60) + 40);
                render();
            }, { signal: ctx?.signal });
        });

        // Wire Sale Buttons (Cross-Island Event Broadcasters)
        container.querySelector('.btn-sale-250')?.addEventListener('click', () => {
            revenue += 250;
            bars.push(Math.floor(Math.random() * 30) + 70);
            if (bars.length > 10) bars.shift();
            emitIslandEvent('polyglot:sale', {
                source: 'React 19 Island',
                amount: 250,
                total: revenue,
                timestamp: new Date().toLocaleTimeString()
            });
            render();
        }, { signal: ctx?.signal });

        container.querySelector('.btn-sale-1000')?.addEventListener('click', () => {
            revenue += 1000;
            bars.push(Math.floor(Math.random() * 40) + 90);
            if (bars.length > 10) bars.shift();
            emitIslandEvent('polyglot:sale', {
                source: 'React 19 Island',
                amount: 1000,
                total: revenue,
                timestamp: new Date().toLocaleTimeString()
            });
            render();
        }, { signal: ctx?.signal });
    }

    render();
}

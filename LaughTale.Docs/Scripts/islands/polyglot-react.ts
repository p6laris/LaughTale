import { IslandContext, emitIslandEvent } from '../../../LaughTale.Client/src/index';

const ICONS = {
    atom: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 2a10 10 0 0 0-9.5 6.8c1.3.6 2.8 1.1 4.5 1.5A11 11 0 0 1 12 4c2.8 0 5.4.8 7.5 2.1a15.7 15.7 0 0 1 2-4.1A10 10 0 0 0 12 2Z"/><path d="M2 12a10 10 0 0 0 6.8 9.5c.6-1.3 1.1-2.8 1.5-4.5A11 11 0 0 1 4 12c0-2.8.8-5.4 2.1-7.5a15.7 15.7 0 0 1-4.1-2A10 10 0 0 0 2 12Z"/></svg>`,
    zap: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    activity: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>`
};

export default function ReactPolyglotIsland(
    container: HTMLElement,
    props: any,
    ctx?: IslandContext
) {
    let revenue = props?.initialScore || 84500;
    let selectedQuarter = 'Q3';
    let bars = [48, 56, 64, 72, 85, 68, 94, 82, 98, 115];

    function render() {
        const maxVal = Math.max(...bars, 120);

        container.innerHTML = `
            <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-primary-50, rgba(14, 165, 233, 0.1)); color: var(--p-primary-500); display: flex; align-items: center; justify-content: center;">
                                ${ICONS.atom}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${props?.title || 'React 19 Revenue Node'}</h4>
                                <span style="font-size: 0.75rem; color: var(--p-text-muted);">Virtual DOM • Fiber Reconciliation</span>
                            </div>
                        </div>
                        <span class="p-tag p-tag-info" style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem;">React 19</span>
                    </div>

                    <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <span style="font-size: 0.75rem; color: var(--p-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Recurring Revenue ARR</span>
                            <span style="font-size: 0.75rem; color: var(--p-green-500, #10b981); font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem;">
                                ${ICONS.activity} +18.4%
                            </span>
                        </div>
                        <div style="font-size: 1.85rem; font-weight: 800; font-family: var(--p-font-mono, monospace); color: var(--p-text-color); margin-top: 0.25rem;">
                            $${revenue.toLocaleString()}
                        </div>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; font-weight: 600; color: var(--p-text-muted);">Sales Velocity</span>
                            <div style="display: flex; gap: 0.25rem;">
                                ${['Q1', 'Q2', 'Q3', 'Q4'].map(q => `
                                    <button type="button" class="btn-quarter ${q === selectedQuarter ? 'p-button-primary' : 'p-button-outlined'}" data-q="${q}" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; border: 1px solid var(--p-border-color); background: ${q === selectedQuarter ? 'var(--p-primary-500)' : 'transparent'}; color: ${q === selectedQuarter ? '#ffffff' : 'var(--p-text-color)'}; font-weight: 600;">
                                        ${q}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div style="height: 60px; display: flex; align-items: flex-end; gap: 5px; padding-top: 8px; border-bottom: 1px solid var(--p-border-color);">
                            ${bars.map((val, i) => `
                                <div style="flex: 1; height: ${(val / maxVal) * 100}%; background: ${i === bars.length - 1 ? 'var(--p-primary-500)' : 'var(--p-primary-200, rgba(14, 165, 233, 0.35))'}; border-radius: 3px 3px 0 0; transition: height 0.3s cubic-bezier(0.16, 1, 0.3, 1);" title="Slot ${i + 1}: $${val}k"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--p-border-color); padding-top: 1rem;">
                    <button type="button" class="btn-sale-250 p-button p-button-primary" style="font-size: 0.8125rem; padding: 0.5rem 0.75rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 600;">
                        ${ICONS.zap} + $250 Quick Sale
                    </button>
                    <button type="button" class="btn-sale-1000 p-button p-button-outlined" style="font-size: 0.8125rem; padding: 0.5rem 0.75rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 600;">
                        ${ICONS.plus} + $1,000 Enterprise
                    </button>
                </div>
            </div>
        `;

        container.querySelectorAll('.btn-quarter').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedQuarter = btn.getAttribute('data-q') || 'Q3';
                bars = bars.map(() => Math.floor(Math.random() * 60) + 40);
                render();
            }, { signal: ctx?.signal });
        });

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

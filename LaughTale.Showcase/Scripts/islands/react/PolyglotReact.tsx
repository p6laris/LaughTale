import { useState } from 'react';
import { emitIslandEvent } from '../../../../LaughTale.Client/src/runtime/events';

// A real React component, rendered to HTML by the SSR sidecar and hydrated in the browser. It is
// imported by both the client island and the server bundle (Scripts/ssr-entry.ts), so its first
// render must be deterministic: no Math.random, Date or locale-dependent formatting during render,
// or the server's HTML won't match the browser's and React will discard it.

interface PolyglotReactProps {
    title?: string;
    initialScore?: number;
    badge?: string;
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
const INITIAL_BARS = [48, 56, 64, 72, 85, 68, 94, 82, 98, 115];

// Fixed locale: toLocaleString() with no argument formats differently on a server and a browser
// with different locales ("84,500" vs "84.500"), which is a guaranteed hydration mismatch.
const formatMoney = (n: number) => n.toLocaleString('en-US');

function AtomIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="2" />
            <path d="M12 2a10 10 0 0 0-9.5 6.8c1.3.6 2.8 1.1 4.5 1.5A11 11 0 0 1 12 4c2.8 0 5.4.8 7.5 2.1a15.7 15.7 0 0 1 2-4.1A10 10 0 0 0 12 2Z" />
            <path d="M2 12a10 10 0 0 0 6.8 9.5c.6-1.3 1.1-2.8 1.5-4.5A11 11 0 0 1 4 12c0-2.8.8-5.4 2.1-7.5a15.7 15.7 0 0 1-4.1-2A10 10 0 0 0 2 12Z" />
        </svg>
    );
}

function ZapIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}

function ActivityIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2" />
        </svg>
    );
}

export default function PolyglotReact(props: PolyglotReactProps) {
    const [revenue, setRevenue] = useState(props.initialScore || 84500);
    const [quarter, setQuarter] = useState<(typeof QUARTERS)[number]>('Q3');
    const [bars, setBars] = useState(INITIAL_BARS);

    const maxVal = Math.max(...bars, 120);

    function recordSale(amount: number, low: number, spread: number) {
        const total = revenue + amount;
        setRevenue(total);
        setBars(prev => [...prev, Math.floor(Math.random() * spread) + low].slice(-10));
        emitIslandEvent('polyglot:sale', {
            source: 'React 19 Island',
            amount,
            total,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    function selectQuarter(q: (typeof QUARTERS)[number]) {
        setQuarter(q);
        setBars(prev => prev.map(() => Math.floor(Math.random() * 60) + 40));
    }

    return (
        <div className="p-card" style={{ background: 'var(--p-surface-0)', border: '1px solid var(--p-border-color)', borderRadius: 'var(--p-border-radius-xl)', padding: '1.5rem', boxShadow: 'var(--p-shadow-sm)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--p-border-radius-md)', background: 'var(--p-primary-50, rgba(14, 165, 233, 0.1))', color: 'var(--p-primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AtomIcon />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--p-text-color)' }}>{props.title || 'React 19 Revenue Node'}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--p-text-muted)' }}>Server-rendered • Hydrated</span>
                        </div>
                    </div>
                    <span className="p-tag p-tag-info" style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem' }}>{props.badge || 'React 19'}</span>
                </div>

                <div style={{ background: 'var(--p-surface-50)', border: '1px solid var(--p-border-color)', borderRadius: 'var(--p-border-radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--p-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recurring Revenue ARR</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--p-green-500, #10b981)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ActivityIcon /> +18.4%
                        </span>
                    </div>
                    <div data-testid="react-revenue" style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--p-font-mono, monospace)', color: 'var(--p-text-color)', marginTop: '0.25rem' }}>
                        ${formatMoney(revenue)}
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--p-text-muted)' }}>Sales Velocity</span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {QUARTERS.map(q => (
                                <button
                                    key={q}
                                    type="button"
                                    className={q === quarter ? 'p-button-primary' : 'p-button-outlined'}
                                    onClick={() => selectQuarter(q)}
                                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--p-border-color)', background: q === quarter ? 'var(--p-primary-500)' : 'transparent', color: q === quarter ? '#ffffff' : 'var(--p-text-color)', fontWeight: 600 }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '5px', paddingTop: '8px', borderBottom: '1px solid var(--p-border-color)' }}>
                        {bars.map((val, i) => (
                            <div
                                key={i}
                                title={`Slot ${i + 1}: $${val}k`}
                                style={{ flex: 1, height: `${(val / maxVal) * 100}%`, background: i === bars.length - 1 ? 'var(--p-primary-500)' : 'var(--p-primary-200, rgba(14, 165, 233, 0.35))', borderRadius: '3px 3px 0 0', transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--p-border-color)', paddingTop: '1rem' }}>
                <button type="button" data-testid="react-sale-250" className="p-button p-button-primary" onClick={() => recordSale(250, 70, 30)} style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    <ZapIcon /> + $250 Quick Sale
                </button>
                <button type="button" className="p-button p-button-outlined" onClick={() => recordSale(1000, 90, 40)} style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    <PlusIcon /> + $1,000 Enterprise
                </button>
            </div>
        </div>
    );
}

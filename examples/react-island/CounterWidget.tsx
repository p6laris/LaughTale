import React, { useState } from 'react';
import { createReactAdapter } from 'laughtale/adapters/react';

export interface CounterProps {
    initialCount?: number;
    step?: number;
    label?: string;
}

export const CounterWidget: React.FC<CounterProps> = ({
    initialCount = 0,
    step = 1,
    label = 'React Count'
}) => {
    const [count, setCount] = useState(initialCount);

    return (
        <div className="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm">
            <h3 className="font-bold text-primary">{label}</h3>
            <p className="text-2xl font-mono my-2">{count}</p>
            <button 
                type="button" 
                onClick={() => setCount(c => c + step)}
                className="p-button p-button-primary">
                Increment (+{step})
            </button>
        </div>
    );
};

export default createReactAdapter(CounterWidget);

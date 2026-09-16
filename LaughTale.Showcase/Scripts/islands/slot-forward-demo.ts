import * as React from 'react';
import { createReactIsland } from '../../../LaughTale.Client/src/index';

interface SlotForwardDemoProps {
    title?: string;
}

/**
 * Real, permanent example for ROADMAP.v5.md Part D ("close adapter gaps" — slot forwarding).
 * Everything written between this island's open/close tags in Razor (see Polyglot.cshtml) is
 * server-wrapped by IslandTagHelper.cs in `<div class="island-slot">` and forwarded here as
 * `props.children` by react.ts's adapter fix - previously it was silently destroyed by React's
 * mount instead.
 */
function SlotForwardCard(props: React.PropsWithChildren<SlotForwardDemoProps>) {
    return React.createElement(
        'div',
        {
            className: 'p-card',
            style: {
                background: 'var(--p-surface-0)',
                border: '1px solid var(--p-border-color)',
                borderRadius: 'var(--p-border-radius-xl)',
                padding: '1.5rem',
                boxShadow: 'var(--p-shadow-sm)',
                height: '100%'
            }
        },
        React.createElement('h4', { style: { margin: '0 0 0.5rem 0', color: 'var(--p-text-color)' } }, props.title || 'React Slot Forwarding'),
        React.createElement(
            'p',
            { style: { margin: '0 0 1rem 0', fontSize: '0.8125rem', color: 'var(--p-text-muted)' } },
            'The boxed content below was written directly inside this island\'s <island>...</island> tag in Razor and rendered here as props.children:'
        ),
        React.createElement(
            'div',
            {
                style: {
                    border: '1px dashed var(--p-border-color)',
                    borderRadius: 'var(--p-border-radius-md)',
                    padding: '1rem'
                }
            },
            props.children
        )
    );
}

export default createReactIsland(SlotForwardCard);

/**
 * SoftMax.LaughTale: Enterprise InputGroup & InputGroupAddon (Aura InputGroup)
 * Flex grouping container combining text inputs, addons, buttons, dropdowns,
 * checkboxes, float labels, and ifta labels with border-collapse and dark mode support.
 */

import { injectIslandStyle } from '../runtime/styles';
import { getLucideIcon, LucideIcons } from '../icons/lucide';

export interface InputGroupProps {
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
}

export interface InputGroupAddonProps {
    icon?: string;
    text?: string;
}

const CSS = `
.laughtale-inputgroup,
.p-inputgroup {
    display: flex;
    align-items: stretch;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.laughtale-inputgroup > *,
.p-inputgroup > * {
    border-radius: 0 !important;
    margin-left: -1px;
    box-sizing: border-box;
}

.laughtale-inputgroup > *:first-child,
.p-inputgroup > *:first-child {
    margin-left: 0;
    border-top-left-radius: var(--p-border-radius) !important;
    border-bottom-left-radius: var(--p-border-radius) !important;
}

.laughtale-inputgroup > *:last-child,
.p-inputgroup > *:last-child {
    border-top-right-radius: var(--p-border-radius) !important;
    border-bottom-right-radius: var(--p-border-radius) !important;
}

/* Propagate border-radius into nested form elements / islands */
.laughtale-inputgroup > *:first-child input,
.laughtale-inputgroup > *:first-child textarea,
.laughtale-inputgroup > *:first-child .p-input,
.laughtale-inputgroup > *:first-child .cs-trigger,
.laughtale-inputgroup > *:first-child .dp-trigger,
.laughtale-inputgroup > *:first-child .laughtale-select-trigger,
.laughtale-inputgroup > *:first-child .p-button,
.p-inputgroup > *:first-child input,
.p-inputgroup > *:first-child textarea,
.p-inputgroup > *:first-child .p-input,
.p-inputgroup > *:first-child .cs-trigger,
.p-inputgroup > *:first-child .dp-trigger,
.p-inputgroup > *:first-child .laughtale-select-trigger,
.p-inputgroup > *:first-child .p-button {
    border-top-left-radius: var(--p-border-radius) !important;
    border-bottom-left-radius: var(--p-border-radius) !important;
}

.laughtale-inputgroup > *:last-child input,
.laughtale-inputgroup > *:last-child textarea,
.laughtale-inputgroup > *:last-child .p-input,
.laughtale-inputgroup > *:last-child .cs-trigger,
.laughtale-inputgroup > *:last-child .dp-trigger,
.laughtale-inputgroup > *:last-child .laughtale-select-trigger,
.laughtale-inputgroup > *:last-child .p-button,
.p-inputgroup > *:last-child input,
.p-inputgroup > *:last-child textarea,
.p-inputgroup > *:last-child .p-input,
.p-inputgroup > *:last-child .cs-trigger,
.p-inputgroup > *:last-child .dp-trigger,
.p-inputgroup > *:last-child .laughtale-select-trigger,
.p-inputgroup > *:last-child .p-button {
    border-top-right-radius: var(--p-border-radius) !important;
    border-bottom-right-radius: var(--p-border-radius) !important;
}

.laughtale-inputgroup > *:not(:first-child):not(:last-child) input,
.laughtale-inputgroup > *:not(:first-child):not(:last-child) textarea,
.laughtale-inputgroup > *:not(:first-child):not(:last-child) .p-input,
.laughtale-inputgroup > *:not(:first-child):not(:last-child) .cs-trigger,
.laughtale-inputgroup > *:not(:first-child):not(:last-child) .dp-trigger,
.laughtale-inputgroup > *:not(:first-child):not(:last-child) .laughtale-select-trigger,
.laughtale-inputgroup > *:not(:first-child):not(:last-child) .p-button,
.p-inputgroup > *:not(:first-child):not(:last-child) input,
.p-inputgroup > *:not(:first-child):not(:last-child) textarea,
.p-inputgroup > *:not(:first-child):not(:last-child) .p-input,
.p-inputgroup > *:not(:first-child):not(:last-child) .cs-trigger,
.p-inputgroup > *:not(:first-child):not(:last-child) .dp-trigger,
.p-inputgroup > *:not(:first-child):not(:last-child) .laughtale-select-trigger,
.p-inputgroup > *:not(:first-child):not(:last-child) .p-button {
    border-radius: 0 !important;
}

/* Addon Styling */
.laughtale-inputgroup-addon,
.p-inputgroup-addon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    border: 1px solid var(--p-border-color);
    font-size: 0.875rem;
    font-weight: 500;
    min-width: 2.5rem;
    user-select: none;
    white-space: nowrap;
    box-sizing: border-box;
    gap: 0.35rem;
}

/* FloatLabel & IftaLabel inside InputGroup adjustments */
.laughtale-inputgroup .laughtale-float-label,
.p-inputgroup .laughtale-float-label {
    flex: 1;
    margin-top: 0;
}
.laughtale-inputgroup .laughtale-ifta-label,
.p-inputgroup .laughtale-ifta-label {
    flex: 1;
}

/* Elevation on focus */
.laughtale-inputgroup > *:focus-within,
.p-inputgroup > *:focus-within {
    z-index: 2;
}

/* Dark Mode Tokens */
.dark .laughtale-inputgroup-addon,
.dark .p-inputgroup-addon {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
`;

export default function InputGroupIsland(container: HTMLElement, props: InputGroupProps) {
    injectIslandStyle('laughtale-inputgroup', CSS);
    
    // Ensure container has inputgroup classes
    container.classList.add('laughtale-inputgroup', 'p-inputgroup');
    if (props.size) {
        container.classList.add(`size-${props.size}`);
    }
}

export function InputGroupAddonIsland(container: HTMLElement, props: InputGroupAddonProps) {
    injectIslandStyle('laughtale-inputgroup', CSS);
    
    container.classList.add('laughtale-inputgroup-addon', 'p-inputgroup-addon');
    
    if (props.icon || props.text) {
        const iconSvg = props.icon ? getLucideIcon(props.icon) : '';
        const textSpan = props.text ? `<span>${props.text}</span>` : '';
        container.innerHTML = `${iconSvg}${textSpan}${container.innerHTML}`;
    }
}

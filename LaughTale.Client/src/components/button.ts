import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { getLucideIcon } from '../icons/lucide';
import { setHtml, unsafe } from '../runtime/html';

export interface ButtonProps {
    label?: string;
    icon?: string;
    iconPos?: 'left' | 'right' | 'top' | 'bottom';
    iconOnly?: boolean;
    loading?: boolean;
    loadingIcon?: string;
    disabled?: boolean;
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';
    variant?: 'filled' | 'outlined' | 'text' | 'link';
    raised?: boolean;
    rounded?: boolean;
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    badge?: string;
    badgeSeverity?: string;
    badgeClass?: string;
    type?: string;
    as?: string;
    href?: string;
    target?: string;
    ariaLabel?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* CSS is provided globally in site.css / theme */
`;

export default function ButtonIsland(container: HTMLElement, props: ButtonProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-button', CSS);

    let isLoading = props.loading === true || String(props.loading) === 'true';
    let isDisabled = props.disabled === true || String(props.disabled) === 'true';

    const btnEl = container.tagName.toLowerCase() === 'button' || container.tagName.toLowerCase() === 'a' 
        ? container 
        : container.querySelector<HTMLElement>('button, a') || container;

    function renderLoading() {
        if (isLoading) {
            btnEl.classList.add('p-button-loading', 'p-disabled');
            btnEl.setAttribute('aria-busy', 'true');
            let spinner = btnEl.querySelector<HTMLElement>('.p-button-loading-icon');
            if (!spinner) {
                spinner = document.createElement('span');
                spinner.className = 'p-button-loading-icon p-button-icon'; container.setAttribute('data-part', 'root');
                setHtml(spinner, unsafe(getLucideIcon(props.loadingIcon || 'spinner', 16)) /* static svg icon */);
                btnEl.prepend(spinner);
            }
        } else {
            btnEl.classList.remove('p-button-loading');
            btnEl.removeAttribute('aria-busy');
            if (!isDisabled) {
                btnEl.classList.remove('p-disabled');
            }
            btnEl.querySelector('.p-button-loading-icon')?.remove();
        }
    }

    btnEl.addEventListener('click', (e) => {
        if (isLoading || isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        container.dispatchEvent(new CustomEvent('button:click', {
            bubbles: true,
            detail: { label: props.label }
        }));
    }, { signal: ctx?.signal });

    renderLoading();
}

import { MenuItem } from '../types/models';
import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { useFloatingPosition } from '../../composables/useFloatingPosition'; // Assuming path
import { useClickOutside } from '../../composables/useClickOutside';

export interface MenuProps {
    items: MenuItem[];
    popup?: boolean;
    triggerId?: string;
}

export default function MenuIsland(container: HTMLElement, props: MenuProps) {
    const items = props.items || [];
    const popup = props.popup || false;
    let isOpen = !popup;
    
    injectIslandStyle('menu', `
        .laughtale-menu {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            min-width: 12.5rem;
            padding: 0.5rem 0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            font-family: var(--p-font-family, inherit);
        }
        [data-theme="dark"] .laughtale-menu {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
        }
        .menu-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .menu-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            color: var(--p-text-color);
            text-decoration: none;
            cursor: pointer;
            transition: background 150ms ease, color 150ms ease;
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        .menu-item:hover {
            background: var(--p-surface-100);
        }
        .menu-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .menu-separator {
            height: 1px;
            background: var(--p-border-color);
            margin: 0.5rem 0;
        }
        
        .p-anchored-overlay-enter {
            opacity: 0;
            transform: scaleY(0.8);
        }
        .p-anchored-overlay-enter-active {
            opacity: 1;
            transform: scaleY(1);
            transition: opacity 150ms ease, transform 150ms ease;
            transform-origin: top;
        }
        .p-anchored-overlay-leave-active {
            opacity: 0;
            transition: opacity 150ms ease;
        }
    `);

    function renderMenu(menuItems: MenuItem[]) {
        return `
            <ul class="menu-list">
                ${menuItems.map(item => {
                    if (item.separator) return `<li class="menu-separator"></li>`;
                    const iconSvg = item.icon && (LucideIcons as any)[item.icon] ? (LucideIcons as any)[item.icon] : '';
                    return `
                        <li>
                            <a class="menu-item ${item.disabled ? 'disabled' : ''}" href="${item.url || '#'}" tabindex="0">
                                ${iconSvg ? `<span style="width: 16px; height: 16px; display: flex;">${iconSvg}</span>` : ''}
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    function render() {
        if (!isOpen && popup) {
            container.innerHTML = `

`;
            return;
        }

        const menuHtml = `
            <div class="laughtale-menu ${popup ? 'p-anchored-overlay-enter-active' : ''}" style="${popup ? 'position: absolute; z-index: 1000;' : ''}">
                ${renderMenu(items)}
            </div>
        `;
        container.innerHTML = menuHtml;

        if (popup) {
            const menuEl = container.querySelector('.laughtale-menu') as HTMLElement;
            const trigger = document.getElementById(props.triggerId || '');
            if (trigger && menuEl) {
                // simple positioning logic
                const rect = trigger.getBoundingClientRect();
                menuEl.style.top = `${rect.bottom + window.scrollY + 4}px`;
                menuEl.style.left = `${rect.left + window.scrollX}px`;

                // useClickOutside mock logic if composable not fully available here
                const closeHandler = (e: Event) => {
                    if (!container.contains(e.target as Node) && !trigger.contains(e.target as Node)) {
                        isOpen = false;
                        render();
                        document.removeEventListener('click', closeHandler);
                    }
                };
                setTimeout(() => document.addEventListener('click', closeHandler), 0);
            }
        }
    }

    if (popup && props.triggerId) {
        const trigger = document.getElementById(props.triggerId);
        trigger?.addEventListener('click', (e) => {
            e.preventDefault();
            isOpen = !isOpen;
            render();
        });
    }

    render();
}

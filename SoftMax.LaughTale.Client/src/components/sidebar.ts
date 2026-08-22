import { SidebarItem } from '../types/models';
import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface SidebarProps {
    items: SidebarItem[];
    collapsed?: boolean;
    position?: 'left' | 'right';
}

export default function SidebarIsland(container: HTMLElement, props: SidebarProps) {
    let collapsed = props.collapsed || false;
    const items = props.items || [];
    const position = props.position || 'left';

    injectIslandStyle('sidebar', `
        .laughtale-sidebar {
            display: flex;
            flex-direction: column;
            background: var(--p-surface-0);
            border-right: 1px solid var(--p-border-color);
            height: 100vh;
            width: 260px;
            transition: width 150ms ease;
            font-family: var(--p-font-family, inherit);
            overflow-y: auto;
        }
        .laughtale-sidebar.collapsed {
            width: 64px;
        }
        .laughtale-sidebar.right {
            border-right: none;
            border-left: 1px solid var(--p-border-color);
        }
        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            border-bottom: 1px solid var(--p-border-color);
        }
        .sidebar-toggle {
            background: transparent;
            border: none;
            color: var(--p-text-muted-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--p-border-radius);
            width: 2rem;
            height: 2rem;
            transition: background 150ms ease;
        }
        .sidebar-toggle:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .sidebar-menu {
            list-style: none;
            padding: 0.5rem;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            color: var(--p-text-color);
            text-decoration: none;
            border-radius: var(--p-border-radius);
            transition: background 150ms ease, color 150ms ease;
            gap: 0.75rem;
            white-space: nowrap;
            overflow: hidden;
        }
        .sidebar-item:hover {
            background: var(--p-surface-100);
        }
        .sidebar-item.active {
            background: var(--p-primary-50);
            color: var(--p-primary-color);
            font-weight: 600;
        }
        [data-theme="dark"] .sidebar-item.active {
            background: var(--p-primary-900);
        }
        .sidebar-item-icon {
            display: flex;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            color: var(--p-text-muted-color);
        }
        .sidebar-item.active .sidebar-item-icon {
            color: var(--p-primary-color);
        }
        .sidebar-item-label {
            opacity: 1;
            transition: opacity 150ms ease;
        }
        .collapsed .sidebar-item-label, .collapsed .sidebar-header-title {
            opacity: 0;
            width: 0;
            display: none;
        }
    `);

    function renderMenu(menuItems: SidebarItem[]) {
        return menuItems.map(item => {
            const iconSvg = item.icon && (LucideIcons as any)[item.icon] ? (LucideIcons as any)[item.icon] : '';
            return `
                <li>
                    <a href="${item.url || '#'}" class="sidebar-item ${item.active ? 'active' : ''}">
                        ${iconSvg ? `<span class="sidebar-item-icon">${iconSvg}</span>` : ''}
                        <span class="sidebar-item-label">${item.label}</span>
                    </a>
                </li>
            `;
        }).join('');
    }

    function render() {
        container.innerHTML = `
<div class="laughtale-sidebar ' + collapsed ? 'collapsed' : '' + ' \${position}">
                <div class="sidebar-header">
                    <span class="sidebar-header-title" style="font-weight: 700; color: var(--p-text-color);">Menu</span>
                    <button class="sidebar-toggle" aria-label="Toggle Sidebar">
                        \${collapsed ? LucideIcons.chevronRight : LucideIcons.chevronLeft}
                    </button>
                </div>
                <ul class="sidebar-menu">
                    \${renderMenu(items)}
                </ul>
            </div>
`;

        container.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
            collapsed = !collapsed;
            render();
        });
    }

    render();
}

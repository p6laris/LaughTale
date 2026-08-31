import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿import { injectIslandStyle } from '../runtime/styles';
/**
 * LaughTale: Enterprise Avatar & AvatarGroup Component (Aura AvatarGroup inspired)
 */

export interface AvatarItem {
    label?: string; // Initials e.g. "JD"
    image?: string; // Photo URL
    name?: string;  // Full name tooltip
    bg?: string;    // Custom background
}

export interface AvatarGroupProps {
    avatars: AvatarItem[];
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
html.dark .avatar-circle,
[data-theme="dark"] .avatar-circle,
.dark .avatar-circle {
    border-color: var(--p-surface-0) !important;
}
html.dark .avatar-overflow,
[data-theme="dark"] .avatar-overflow,
.dark .avatar-overflow {
    border-color: var(--p-surface-0) !important;
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
`;

export default function AvatarGroupIsland(container: HTMLElement, props: AvatarGroupProps, ctx?: IslandContext) {
    injectIslandStyle('avatar-group', CSS);
    const max = props.max || 4;
    const rawAvatars: AvatarItem[] = Array.isArray(props.avatars) ? props.avatars : (Array.isArray((props as any).items) ? (props as any).items : []);
    const visible = rawAvatars.slice(0, max);
    const overflowCount = rawAvatars.length - max;

    const sizePx = props.size === 'sm' ? '1.75rem' : props.size === 'lg' ? '2.75rem' : '2.25rem';
    const fontSize = props.size === 'sm' ? '0.6875rem' : props.size === 'lg' ? '0.9375rem' : '0.75rem';

    const avatarElements = visible.map((av: AvatarItem) => {
        const bg = av.bg || 'var(--lt-surface-800)';
        return `
            <div class="avatar-circle" data-part="root" title="${av.name || av.label || ''}" style="width: ${sizePx}; height: ${sizePx}; border-radius: 50%; border: 2px solid var(--lt-surface-0, var(--lt-surface-0)); background: ${bg}; color: var(--lt-surface-0, var(--lt-surface-0)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize}; margin-left: -0.5rem; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                ${av.image ? `<img src="${av.image}" alt="${av.name || ''}" style="width: 100%; height: 100%; object-fit: cover;" />` : (av.label || 'U')}
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="laughtale-avatar-group" style="display: inline-flex; align-items: center; padding-left: 0.5rem;">
            ${avatarElements}
            ${overflowCount > 0 ? `
                <div class="avatar-overflow" style="width: ${sizePx}; height: ${sizePx}; border-radius: 50%; border: 2px solid var(--lt-surface-0, var(--lt-surface-0)); background: var(--lt-surface-200); color: var(--lt-surface-700); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize}; margin-left: -0.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                    +${overflowCount}
                </div>
            ` : ''}
        </div>
    `;
}

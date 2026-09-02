import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url, attr, type Raw } from '../runtime/html';

/**
 * LaughTale: Enterprise Avatar & AvatarGroup Component (Aura Design System compliant)
 * Overlapping avatar stacks, initial badges, image photos, overflow excess pills,
 * multiple size tiers (sm, md, lg, xl), and circle/square geometries.
 */

export interface AvatarItem {
    label?: string; // Initials e.g. "JD"
    image?: string; // Photo URL
    name?: string;  // Full name tooltip
    bg?: string;    // Custom background color
    color?: string; // Text color
    icon?: string;
}

export interface AvatarGroupProps {
    avatars?: AvatarItem[];
    items?: AvatarItem[];
    max?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl' | string;
    shape?: 'circle' | 'square';
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const AVATAR_GROUP_CSS = `
island-avatar-group,
p-avatargroup {
    display: contents !important;
}

.p-avatargroup {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

.p-avatargroup .p-avatar {
    margin-left: -0.625rem;
    border: 2px solid var(--p-content-bg, var(--p-surface-0, #ffffff));
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.2s ease;
    position: relative;
    z-index: 1;
}

.p-avatargroup .p-avatar:first-child {
    margin-left: 0;
}

.p-avatargroup .p-avatar:hover {
    transform: translateY(-2px) scale(1.06);
    z-index: 10;
}

.p-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-avatar-width, 2.5rem);
    height: var(--p-avatar-height, 2.5rem);
    font-size: var(--p-avatar-font-size, 0.875rem);
    font-weight: 700;
    background: var(--p-avatar-background, var(--p-surface-200, #e2e8f0));
    color: var(--p-avatar-color, var(--p-text-color, #1e293b));
    border-radius: var(--p-avatar-border-radius, var(--p-border-radius, 6px));
    user-select: none;
    overflow: hidden;
    flex-shrink: 0;
    box-sizing: border-box;
}

.p-avatar.p-avatar-circle {
    border-radius: 50% !important;
}

.p-avatar.p-avatar-sm {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
}

.p-avatar.p-avatar-lg {
    width: 3rem;
    height: 3rem;
    font-size: 1.125rem;
}

.p-avatar.p-avatar-xl {
    width: 4rem;
    height: 4rem;
    font-size: 1.5rem;
}

.p-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.p-avatar.p-avatargroup-overflow {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-muted, #64748b);
    font-weight: 700;
}

/* Dark Mode Tokens */
html.dark .p-avatargroup .p-avatar,
[data-theme="dark"] .p-avatargroup .p-avatar,
.dark .p-avatargroup .p-avatar {
    border-color: var(--p-surface-900, #0f172a);
}

html.dark .p-avatar.p-avatargroup-overflow,
[data-theme="dark"] .p-avatar.p-avatargroup-overflow,
.dark .p-avatar.p-avatargroup-overflow {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-300, #cbd5e1);
}
`;

export default function AvatarGroupIsland(container: HTMLElement, props: AvatarGroupProps, ctx?: IslandContext) {
    injectIslandStyle('avatar-group', AVATAR_GROUP_CSS);

    let rawAvatars: AvatarItem[] = [];
    const source = props.avatars || props.items;

    if (typeof source === 'string') {
        try {
            rawAvatars = JSON.parse(source);
        } catch {
            rawAvatars = [];
        }
    } else if (Array.isArray(source)) {
        rawAvatars = source;
    }

    const max = props.max ?? 4;
    const isCircle = props.shape !== 'square';
    const size = props.size || 'md';
    const sizeClass = size === 'sm' ? 'p-avatar-sm' : size === 'lg' ? 'p-avatar-lg' : size === 'xl' ? 'p-avatar-xl' : '';
    const shapeClass = isCircle ? 'p-avatar-circle' : '';

    const visible = rawAvatars.slice(0, max);
    const overflowCount = rawAvatars.length - max;

    const avatarElements = visible.map((av: AvatarItem) => {
        const bg = av.bg ? `background-color: ${av.bg};` : '';
        const color = av.color || (av.bg ? '#ffffff' : '');
        const colorStyle = color ? `color: ${color};` : '';
        const combinedStyle = `${bg} ${colorStyle}`.trim();
        const title = av.name || av.label || '';

        return html`
            <div class="p-avatar p-component ${shapeClass} ${sizeClass}" title="${title}" ${attr('style', combinedStyle)}>
                ${av.image ? html`<img src="${url(av.image)}" alt="${title}" />` : html`<span>${av.label || title.charAt(0) || 'U'}</span>`}
            </div>
        `;
    });

    const overflowHtml = overflowCount > 0
        ? html`<div class="p-avatar p-component p-avatargroup-overflow ${shapeClass} ${sizeClass}" title="${overflowCount} more members">+${overflowCount}</div>`
        : '';

    const rootEl = document.createElement('div');
    rootEl.className = `p-avatargroup p-component ${props.class || ''}`.trim();
    if (props.style) rootEl.style.cssText += props.style;
    setHtml(rootEl, html`${avatarElements}${overflowHtml}`);

    setHtml(container, '');
    container.appendChild(rootEl);

    container.setAttribute('data-part', 'root');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}

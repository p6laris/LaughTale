import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'dialog'
};

/**
 * LaughTale: Enterprise Galleria Component (Aura Design System compliant)
 * Fullscreen responsive image gallery, animated stage cross-fading, interactive thumbnail strips,
 * dot indicator tracks, autoplay interval cycles, and theme studio design tokens.
 */

export interface GalleriaItem {
    itemImageSrc?: string;
    thumbnailImageSrc?: string;
    alt?: string;
    title?: string;
    subtitle?: string;
}

export interface GalleriaProps {
    value?: GalleriaItem[];
    images?: GalleriaItem[];
    items?: GalleriaItem[];
    activeIndex?: number;
    fullScreen?: boolean;
    visible?: boolean;
    numVisible?: number;
    showThumbnails?: boolean;
    showIndicators?: boolean;
    showItemNavigators?: boolean;
    showThumbnailNavigators?: boolean;
    autoPlay?: boolean;
    transitionInterval?: number;
    circular?: boolean;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const GALLERIA_CSS = `
island-galleria,
p-galleria {
    display: block !important;
    width: 100%;
}

.p-galleria {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 8px);
    overflow: hidden;
    background: var(--p-surface-0, #ffffff);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.p-galleria-item-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.p-galleria-item-container {
    position: relative;
    width: 100%;
    height: 340px;
    background: #090d16;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-galleria-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-galleria-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-galleria-item-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(6px);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 150ms ease, transform 150ms ease;
    z-index: 5;
}

.p-galleria-item-nav:hover {
    background: rgba(15, 23, 42, 0.85);
    transform: translateY(-50%) scale(1.08);
}

.p-galleria-item-prev {
    left: 0.875rem;
}

.p-galleria-item-next {
    right: 0.875rem;
}

.p-galleria-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(10, 15, 30, 0.88) 100%);
    padding: 1.25rem 1.25rem 0.875rem 1.25rem;
    color: #ffffff;
    z-index: 4;
}

.p-galleria-caption-title {
    font-size: 0.9375rem;
    font-weight: 700;
    margin-bottom: 0.125rem;
}

.p-galleria-caption-subtitle {
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.75);
}

/* Indicators */
.p-galleria-indicators {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--p-surface-0, #ffffff);
}

.p-galleria-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--p-surface-300, #cbd5e1);
    cursor: pointer;
    transition: all 0.2s ease;
}

.p-galleria-indicator.active {
    width: 1.5rem;
    border-radius: 9999px;
    background: var(--p-primary-500, #10b981);
}

/* Thumbnail Track */
.p-galleria-thumbnails-content {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-top: 1px solid var(--p-border-color, #e2e8f0);
    overflow-x: auto;
}

.p-galleria-thumbnail-item {
    flex: 0 0 76px;
    height: 52px;
    border-radius: var(--p-border-radius, 6px);
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    opacity: 0.55;
    transition: all 0.2s ease;
    box-sizing: border-box;
}

.p-galleria-thumbnail-item:hover {
    opacity: 0.85;
}

.p-galleria-thumbnail-item.active {
    border-color: var(--p-primary-500, #10b981);
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.p-galleria-thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* Dark Mode Tokens */
html.dark .p-galleria,
[data-theme="dark"] .p-galleria,
.dark .p-galleria {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-galleria-thumbnails-content,
[data-theme="dark"] .p-galleria-thumbnails-content,
.dark .p-galleria-thumbnails-content {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-800, #1e293b);
}

html.dark .p-galleria-indicators,
[data-theme="dark"] .p-galleria-indicators,
.dark .p-galleria-indicators {
    background: var(--p-surface-900, #0f172a);
}

html.dark .p-galleria-indicator,
[data-theme="dark"] .p-galleria-indicator,
.dark .p-galleria-indicator {
    background: var(--p-surface-700, #334155);
}

html.dark .p-galleria-indicator.active,
[data-theme="dark"] .p-galleria-indicator.active,
.dark .p-galleria-indicator.active {
    background: var(--p-primary-400, #34d399);
}
`;

const DEFAULT_GALLERIA_IMAGES: GalleriaItem[] = [
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=160&auto=format&fit=crop&q=80',
        alt: 'Data Center Server Rack',
        title: 'Cluster Primary Region',
        subtitle: 'Enterprise high-availability hyperconverged node'
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=160&auto=format&fit=crop&q=80',
        alt: 'Matrix Cryptographic Terminal',
        title: 'Zero-Trust HSM Mesh',
        subtitle: 'Hardware security module & cryptographic root'
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=160&auto=format&fit=crop&q=80',
        alt: 'Real-time Telemetry Dashboard',
        title: 'Observability Engine',
        subtitle: 'Low-latency telemetry streaming & metric metrics'
    }
];

export default function GalleriaIsland(container: HTMLElement, props: GalleriaProps, ctx?: IslandContext) {
    injectIslandStyle('galleria', GALLERIA_CSS);

    let images: GalleriaItem[] = [];
    const source = props.value || props.images || props.items;

    if (typeof source === 'string') {
        try {
            images = JSON.parse(source);
        } catch {
            images = DEFAULT_GALLERIA_IMAGES;
        }
    } else if (Array.isArray(source) && source.length > 0) {
        images = source;
    } else {
        images = DEFAULT_GALLERIA_IMAGES;
    }

    let activeIndex = props.activeIndex ?? 0;
    const showThumbnails = props.showThumbnails !== false;
    const showIndicators = props.showIndicators === true;
    const showNavigators = props.showItemNavigators !== false;
    const isCircular = props.circular !== false;
    let autoPlayTimer: any = null;

    function render() {
        const current = images[activeIndex] || images[0];

        const thumbnailsHtml = showThumbnails ? html`
            <div class="p-galleria-thumbnails-content">
                ${images.map((img, idx) => html`
                    <div class="p-galleria-thumbnail-item ${idx === activeIndex ? 'active' : ''}" data-index="${idx}">
                        <img src="${safeUrl(img.thumbnailImageSrc || img.itemImageSrc)}" alt="${img.alt || ''}" />
                    </div>
                `)}
            </div>
        ` : '';

        const indicatorsHtml = showIndicators ? html`
            <div class="p-galleria-indicators">
                ${images.map((_, idx) => html`
                    <div class="p-galleria-indicator ${idx === activeIndex ? 'active' : ''}" data-index="${idx}"></div>
                `)}
            </div>
        ` : '';

        setHtml(container, html`
            <div class="p-galleria p-component ${props.class || ''}" role="dialog" aria-modal="true" style="${props.style || ''}">
                <div class="p-galleria-item-wrapper">
                    <div class="p-galleria-item-container">
                        <div class="p-galleria-item">
                            <img src="${safeUrl(current.itemImageSrc)}" alt="${current.alt || ''}" />
                        </div>

                        ${showNavigators ? html`
                            <button type="button" class="p-galleria-item-nav p-galleria-item-prev" aria-label="Previous image">
                                <span style="transform: rotate(90deg); display: flex;">${unsafe(LucideIcons.chevronDown)}</span>
                            </button>
                            <button type="button" class="p-galleria-item-nav p-galleria-item-next" aria-label="Next image">
                                <span style="transform: rotate(-90deg); display: flex;">${unsafe(LucideIcons.chevronDown)}</span>
                            </button>
                        ` : ''}

                        <div class="p-galleria-caption">
                            <div class="p-galleria-caption-title">${current.title || current.alt || ''}</div>
                            ${current.subtitle ? html`<div class="p-galleria-caption-subtitle">${current.subtitle}</div>` : ''}
                        </div>
                    </div>
                </div>

                ${indicatorsHtml}
                ${thumbnailsHtml}
            </div>
        `);

        bindEvents();
    }

    function navigate(nextIdx: number) {
        if (isCircular) {
            activeIndex = (nextIdx + images.length) % images.length;
        } else {
            activeIndex = Math.max(0, Math.min(images.length - 1, nextIdx));
        }
        render();
    }

    function bindEvents() {
        container.querySelector('.p-galleria-item-prev')?.addEventListener('click', () => {
            navigate(activeIndex - 1);
            restartAutoplay();
        }, { signal: ctx?.signal });

        container.querySelector('.p-galleria-item-next')?.addEventListener('click', () => {
            navigate(activeIndex + 1);
            restartAutoplay();
        }, { signal: ctx?.signal });

        container.querySelectorAll('.p-galleria-thumbnail-item').forEach((el) => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.getAttribute('data-index') || '0', 10);
                navigate(idx);
                restartAutoplay();
            }, { signal: ctx?.signal });
        });

        container.querySelectorAll('.p-galleria-indicator').forEach((el) => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.getAttribute('data-index') || '0', 10);
                navigate(idx);
                restartAutoplay();
            }, { signal: ctx?.signal });
        });
    }

    function startAutoplay() {
        if (props.autoPlay && images.length > 1) {
            const interval = props.transitionInterval || 4000;
            autoPlayTimer = setInterval(() => {
                navigate(activeIndex + 1);
            }, interval);
        }
    }

    function stopAutoplay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    render();
    startAutoplay();

    if (ctx?.signal) {
        ctx.signal.addEventListener('abort', () => stopAutoplay(), { signal: ctx.signal });
    }
    ctx?.onCleanup?.(() => stopAutoplay());

    container.setAttribute('data-part', 'root');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}

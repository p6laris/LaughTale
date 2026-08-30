/**
 * LaughTale: Enterprise Carousel Component (PrimeVue 4 Aura Design System)
 * Native CSS scroll-snap content slider supporting alignment (start, center, end),
 * partial slidesPerPage (e.g. 1.5, 1.3, 1.75), horizontal & vertical orientation,
 * continuous looping, autoSize variable widths with pixel-perfect center alignment padding,
 * synchronized gallery thumbnails, silky smooth 60fps transitions, and WAI-ARIA.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';

export interface CarouselProps {
    items?: any[];
    align?: 'start' | 'center' | 'end';
    orientation?: 'horizontal' | 'vertical';
    slidesPerPage?: number;
    loop?: boolean;
    autoSize?: boolean;
    spacing?: number;
    slide?: number;
    autoplayInterval?: number;
    showIndicators?: boolean;
    showNavigators?: boolean;
    demoType?: 'basic' | 'alignment' | 'orientation' | 'loop' | 'variable' | 'gallery';
    galleryImages?: string[];
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CAROUSEL_CSS = `
/* ==========================================================================
   PrimeVue 4 Aura Carousel Component Tokens & Styles
   ========================================================================== */
.p-carousel {
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    font-family: var(--p-font-family, inherit);
}

.p-carousel-vertical {
    flex-direction: column;
    align-items: center;
}

.p-carousel-content {
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    scroll-snap-type: x mandatory;
}

.p-carousel-content::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
}

/* Vertical Carousel Content Flow */
.p-carousel-vertical .p-carousel-content {
    flex-direction: column !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scroll-snap-type: y mandatory !important;
}

/* Alignments */
.p-carousel-align-start .p-carousel-item {
    scroll-snap-align: start;
}
.p-carousel-align-center .p-carousel-item {
    scroll-snap-align: center;
}
.p-carousel-align-end .p-carousel-item {
    scroll-snap-align: end;
}

/* Items & Cards */
.p-carousel-item {
    flex: 0 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Number Card Box */
.p-carousel-card-num {
    height: 100%;
    width: 100%;
    font-size: 3rem;
    font-weight: 700;
    background: var(--lt-surface-50);
    color: var(--lt-surface-950);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: var(--lt-radius);
    border: 1px solid var(--lt-surface-200);
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: background-color 200ms ease, border-color 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms ease;
}

.p-carousel-card-num:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dark .p-carousel-card-num,
[data-theme="dark"] .p-carousel-card-num {
    background: var(--lt-surface-950);
    color: var(--lt-surface-0);
    border-color: var(--lt-surface-800);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Bottom Bar (Indicators + Prev/Next Controls) */
.p-carousel-footer-bar {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
    width: 100%;
}

.p-carousel-indicator-list {
    display: flex;
    align-items: center;
    gap: var(--p-carousel-indicator-list-gap, 0.5rem);
    padding: var(--p-carousel-indicator-list-padding, 0.25rem 0);
    margin: 0;
    list-style: none;
}

.p-carousel-indicator {
    display: inline-flex;
}

.p-carousel-indicator-button {
    width: var(--p-carousel-indicator-width, 1.75rem);
    height: var(--p-carousel-indicator-height, 0.375rem);
    border-radius: var(--p-carousel-indicator-border-radius, 9999px);
    background: var(--p-carousel-indicator-background, var(--lt-surface-200));
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background-color 280ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
                width 280ms cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
}

.dark .p-carousel-indicator-button,
[data-theme="dark"] .p-carousel-indicator-button {
    background: var(--lt-surface-700);
}

.p-carousel-indicator-button:hover {
    background: var(--p-carousel-indicator-hover-background, var(--lt-surface-400));
}

.p-carousel-indicator-button.p-carousel-indicator-active {
    background: var(--p-carousel-indicator-active-background, var(--lt-primary-500));
    width: 2.5rem;
}

/* Navigation Buttons */
.p-carousel-nav-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    flex: 1;
}

.p-carousel-prev,
.p-carousel-next {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 1px solid var(--lt-surface-200);
    background: var(--lt-surface-0);
    color: var(--p-text-muted, var(--lt-surface-500));
    cursor: pointer;
    transition: background-color 180ms ease, color 180ms ease, opacity 180ms ease, transform 140ms cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
    padding: 0;
    box-sizing: border-box;
    flex-shrink: 0;
}

.dark .p-carousel-prev,
.dark .p-carousel-next,
[data-theme="dark"] .p-carousel-prev,
[data-theme="dark"] .p-carousel-next {
    background: var(--lt-surface-800);
    border-color: var(--lt-surface-700);
    color: var(--lt-surface-400);
}

.p-carousel-prev:hover:not(:disabled),
.p-carousel-next:hover:not(:disabled) {
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
}

.dark .p-carousel-prev:hover:not(:disabled),
.dark .p-carousel-next:hover:not(:disabled),
[data-theme="dark"] .p-carousel-prev:hover:not(:disabled),
[data-theme="dark"] .p-carousel-next:hover:not(:disabled) {
    background: var(--lt-surface-700);
    color: var(--lt-surface-0);
}

.p-carousel-prev:active:not(:disabled),
.p-carousel-next:active:not(:disabled) {
    transform: scale(0.9);
}

.p-carousel-prev:disabled,
.p-carousel-next:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

/* Gallery Thumbnails */
.p-carousel-gallery-thumb {
    cursor: pointer;
    border-radius: var(--lt-radius);
    overflow: hidden;
    transition: opacity 220ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease;
    border: 2px solid transparent;
}
.p-carousel-gallery-thumb.p-carousel-thumb-active {
    border-color: var(--lt-primary-500);
    opacity: 1 !important;
}
.p-carousel-gallery-thumb:not(.p-carousel-thumb-active) {
    opacity: 0.55;
}
.p-carousel-gallery-thumb:not(.p-carousel-thumb-active):hover {
    opacity: 0.85;
}
`;

const CHEVRON_LEFT = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const CHEVRON_RIGHT = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const CHEVRON_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
const CHEVRON_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

const GALLERY_DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1704905832963-37d6f12654b7?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470130623320-9583a8d06241?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1678841446310-d045487ef299?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497752531616-c3afd9760a11?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511885663737-eea53f6d6187?q=80&w=1374&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?q=80&w=1472&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1638255402906-e838358069ab?q=80&w=1631&auto=format&fit=crop'
];

export default function CarouselIsland(container: HTMLElement, props: CarouselProps, ctx?: IslandContext) {
    injectIslandStyle('carousel', CAROUSEL_CSS);

    const demoType = props.demoType || 'basic';
    const align = props.align || (demoType === 'alignment' ? 'start' : 'center');
    const orientation = props.orientation || (demoType === 'orientation' ? 'vertical' : 'horizontal');
    const isVertical = orientation === 'vertical';
    const slidesPerPage = props.slidesPerPage !== undefined ? props.slidesPerPage : (demoType === 'alignment' ? 1.5 : (demoType === 'orientation' ? 1.3 : (demoType === 'loop' ? 1.75 : 1)));
    const loop = props.loop === true || demoType === 'loop';
    const autoSize = props.autoSize === true || demoType === 'variable';
    const spacing = props.spacing !== undefined ? props.spacing : 16;
    let currentSlide = props.slide || 0;

    let itemCount = 5;
    let customWidths: string[] = [];

    if (demoType === 'variable') {
        customWidths = ['120px', '80px', '200px', '160px', '220px', '180px', '280px', '100px'];
        itemCount = customWidths.length;
    } else if (demoType === 'gallery') {
        const images = props.galleryImages || GALLERY_DEFAULT_IMAGES;
        renderGalleryDemo(images);
        return;
    }

    function renderStandardCarousel(): string {
        const itemDimensionsStyle = isVertical
            ? `height: calc((240px - ${(spacing * (Math.ceil(slidesPerPage) - 1))}px) / ${slidesPerPage}); width: 100%; flex: 0 0 auto;`
            : (autoSize
                ? `height: 100%; flex: 0 0 auto;`
                : `width: calc((100% - ${(spacing * (Math.ceil(slidesPerPage) - 1))}px) / ${slidesPerPage}); height: 100%; flex: 0 0 auto;`);

        const itemsHtml = Array.from({ length: itemCount }, (_, i) => {
            const widthOverride = autoSize ? `width: ${customWidths[i]};` : '';
            return `
                <div class="p-carousel-item" style="${itemDimensionsStyle} ${widthOverride}" role="group" aria-roledescription="slide" aria-label="Slide ${i + 1} of ${itemCount}" data-slide-index="${i}">
                    <div class="p-carousel-card-num">
                        <span>${i + 1}</span>
                    </div>
                </div>
            `;
        }).join('');

        const indicatorsHtml = Array.from({ length: itemCount }, (_, i) => `
            <li class="p-carousel-indicator">
                <button type="button" class="p-carousel-indicator-button ${i === currentSlide ? 'p-carousel-indicator-active' : ''}" aria-label="Slide ${i + 1}" data-indicator-index="${i}" ${i === currentSlide ? 'aria-current="true"' : ''}></button>
            </li>
        `).join('');

        if (isVertical) {
            return `
                <div class="p-carousel p-carousel-vertical p-carousel-align-${align} ${props.class || ''}" role="region" aria-roledescription="carousel" aria-label="Vertical Content Slider" style="max-width: 24rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; ${props.style || ''}">
                    <button type="button" class="p-carousel-prev" aria-label="Previous slide" data-carousel-prev>
                        ${CHEVRON_UP}
                    </button>
                    <div class="p-carousel-content" style="height: 240px; width: 100%; flex-direction: column; overflow-y: auto; overflow-x: hidden; gap: ${spacing}px;" data-carousel-content>
                        ${itemsHtml}
                    </div>
                    <button type="button" class="p-carousel-next" aria-label="Next slide" data-carousel-next>
                        ${CHEVRON_DOWN}
                    </button>
                </div>
            `;
        }

        return `
            <div class="p-carousel p-carousel-align-${align} ${props.class || ''}" role="region" aria-roledescription="carousel" aria-label="Content Slider" style="max-width: 36rem; margin: 0 auto; ${props.style || ''}">
                <div class="p-carousel-content" style="height: ${autoSize ? '140px' : '240px'}; width: 100%; gap: ${spacing}px;" data-carousel-content>
                    ${itemsHtml}
                </div>
                <div class="p-carousel-footer-bar">
                    <ul class="p-carousel-indicator-list">
                        ${indicatorsHtml}
                    </ul>
                    <div class="p-carousel-nav-group">
                        <button type="button" class="p-carousel-prev" aria-label="Previous slide" data-carousel-prev>
                            ${CHEVRON_LEFT}
                        </button>
                        <button type="button" class="p-carousel-next" aria-label="Next slide" data-carousel-next>
                            ${CHEVRON_RIGHT}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderGalleryDemo(images: string[]) {
        container.innerHTML = `
            <div class="p-carousel-gallery-container" style="max-width: 42rem; margin: 0 auto; width: 100%;">
                <!-- Main Stage Photo Carousel -->
                <div class="p-carousel p-carousel-align-center" data-main-carousel style="width: 100%; border-radius: var(--lt-radius); overflow: hidden; border: 1px solid var(--lt-surface-200);">
                    <div class="p-carousel-content" style="height: 396px; width: 100%;" data-main-content>
                        ${images.map((src, i) => `
                            <div class="p-carousel-item" style="width: 100%; height: 100%; flex-shrink: 0;" data-slide-index="${i}">
                                <img src="${src}" alt="Polar Bear in Nature ${i + 1}" draggable="false" style="width: 100%; height: 100%; object-fit: cover; select-none;" />
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Synchronized Thumbnail Strip -->
                <div class="p-carousel p-carousel-align-center" data-thumb-carousel style="margin-top: 0.75rem; width: 100%;">
                    <div class="p-carousel-content" style="height: 90px; width: 100%; gap: 8px;" data-thumb-content>
                        ${images.map((src, i) => `
                            <div class="p-carousel-item p-carousel-gallery-thumb ${i === currentSlide ? 'p-carousel-thumb-active' : ''}" style="width: calc((100% - 24px) / 4); height: 100%; flex-shrink: 0;" data-thumb-index="${i}">
                                <img src="${src}" alt="Thumbnail ${i + 1}" draggable="false" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;" />
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        const mainContent = container.querySelector<HTMLElement>('[data-main-content]');
        const thumbContent = container.querySelector<HTMLElement>('[data-thumb-content]');

        function selectGallerySlide(index: number) {
            currentSlide = index;
            if (mainContent) {
                const mainItem = mainContent.querySelector<HTMLElement>(`[data-slide-index="${index}"]`);
                if (mainItem) {
                    mainContent.scrollTo({
                        left: mainItem.offsetLeft,
                        behavior: 'smooth'
                    });
                }
            }
            if (thumbContent) {
                thumbContent.querySelectorAll('.p-carousel-gallery-thumb').forEach((thumb, i) => {
                    if (i === index) {
                        thumb.classList.add('p-carousel-thumb-active');
                    } else {
                        thumb.classList.remove('p-carousel-thumb-active');
                    }
                });
                const activeThumb = thumbContent.querySelector<HTMLElement>(`[data-thumb-index="${index}"]`);
                if (activeThumb) {
                    thumbContent.scrollTo({
                        left: activeThumb.offsetLeft - (thumbContent.clientWidth / 2) + (activeThumb.clientWidth / 2),
                        behavior: 'smooth'
                    });
                }
            }
        }

        container.querySelectorAll<HTMLElement>('[data-thumb-index]').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const idx = parseInt(thumb.getAttribute('data-thumb-index') || '0', 10);
                selectGallerySlide(idx);
            });
        });

        if (mainContent) {
            let debounceTimer: any = null;
            mainContent.addEventListener('scroll', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const scrollLeft = mainContent.scrollLeft;
                    const items = mainContent.querySelectorAll<HTMLElement>('[data-slide-index]');
                    let closestIdx = 0;
                    let minDiff = Infinity;
                    items.forEach((item, i) => {
                        const diff = Math.abs(item.offsetLeft - scrollLeft);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestIdx = i;
                        }
                    });
                    if (closestIdx !== currentSlide) {
                        currentSlide = closestIdx;
                        if (thumbContent) {
                            thumbContent.querySelectorAll('.p-carousel-gallery-thumb').forEach((thumb, i) => {
                                if (i === currentSlide) thumb.classList.add('p-carousel-thumb-active');
                                else thumb.classList.remove('p-carousel-thumb-active');
                            });
                        }
                    }
                }, 80);
            });
        }

        return;
    }

    container.innerHTML = renderStandardCarousel();

    const contentEl = container.querySelector<HTMLElement>('[data-carousel-content]');
    const prevBtn = container.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const nextBtn = container.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const indicators = container.querySelectorAll<HTMLButtonElement>('[data-indicator-index]');

    function applyCenterPadding() {
        if (!contentEl || align !== 'center') return;
        const firstItem = contentEl.querySelector<HTMLElement>('[data-slide-index="0"]');
        const lastItem = contentEl.querySelector<HTMLElement>(`[data-slide-index="${itemCount - 1}"]`);
        if (!firstItem || !lastItem) return;

        if (isVertical) {
            const padTop = Math.max(0, (contentEl.clientHeight / 2) - (firstItem.offsetHeight / 2));
            const padBottom = Math.max(0, (contentEl.clientHeight / 2) - (lastItem.offsetHeight / 2));
            contentEl.style.paddingTop = `${padTop}px`;
            contentEl.style.paddingBottom = `${padBottom}px`;
        } else {
            const padLeft = Math.max(0, (contentEl.clientWidth / 2) - (firstItem.offsetWidth / 2));
            const padRight = Math.max(0, (contentEl.clientWidth / 2) - (lastItem.offsetWidth / 2));
            contentEl.style.paddingLeft = `${padLeft}px`;
            contentEl.style.paddingRight = `${padRight}px`;
        }
    }

    setTimeout(applyCenterPadding, 20);
    window.addEventListener('resize', applyCenterPadding);

    let isProgrammaticScroll = false;
    let scrollTimeoutId: any = null;

    function scrollToSlide(index: number) {
        if (!contentEl) return;
        const targetItem = contentEl.querySelector<HTMLElement>(`[data-slide-index="${index}"]`);
        if (!targetItem) return;

        currentSlide = Math.max(0, Math.min(itemCount - 1, index));
        isProgrammaticScroll = true;
        clearTimeout(scrollTimeoutId);

        if (isVertical) {
            let targetTop = targetItem.offsetTop;
            if (align === 'center') {
                targetTop = targetItem.offsetTop - (contentEl.clientHeight / 2) + (targetItem.offsetHeight / 2);
            } else if (align === 'end') {
                targetTop = targetItem.offsetTop - contentEl.clientHeight + targetItem.offsetHeight;
            }
            contentEl.scrollTo({
                top: Math.max(0, targetTop),
                behavior: 'smooth'
            });
        } else {
            let targetLeft = targetItem.offsetLeft;
            if (align === 'center') {
                targetLeft = targetItem.offsetLeft - (contentEl.clientWidth / 2) + (targetItem.offsetWidth / 2);
            } else if (align === 'end') {
                targetLeft = targetItem.offsetLeft - contentEl.clientWidth + targetItem.offsetWidth;
            }
            contentEl.scrollTo({
                left: Math.max(0, targetLeft),
                behavior: 'smooth'
            });
        }

        updateUI();

        scrollTimeoutId = setTimeout(() => {
            isProgrammaticScroll = false;
        }, 400);
    }

    function updateUI() {
        indicators.forEach((ind, i) => {
            if (i === currentSlide) {
                ind.classList.add('p-carousel-indicator-active');
                ind.setAttribute('aria-current', 'true');
            } else {
                ind.classList.remove('p-carousel-indicator-active');
                ind.removeAttribute('aria-current');
            }
        });

        if (!loop) {
            if (prevBtn) prevBtn.disabled = currentSlide <= 0;
            if (nextBtn) nextBtn.disabled = currentSlide >= itemCount - 1;
        } else {
            if (prevBtn) prevBtn.disabled = false;
            if (nextBtn) nextBtn.disabled = false;
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                scrollToSlide(currentSlide - 1);
            } else if (loop) {
                scrollToSlide(itemCount - 1);
            }
        }, { signal: ctx?.signal });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < itemCount - 1) {
                scrollToSlide(currentSlide + 1);
            } else if (loop) {
                scrollToSlide(0);
            }
        }, { signal: ctx?.signal });
    }

    indicators.forEach(ind => {
        ind.addEventListener('click', () => {
            const idx = parseInt(ind.getAttribute('data-indicator-index') || '0', 10);
            scrollToSlide(idx);
        }, { signal: ctx?.signal });
    });

    if (contentEl) {
        let scrollDebounce: any = null;
        contentEl.addEventListener('scroll', () => {
            if (isProgrammaticScroll) return;

            clearTimeout(scrollDebounce);
            scrollDebounce = setTimeout(() => {
                if (isProgrammaticScroll) return;

                const items = contentEl.querySelectorAll<HTMLElement>('[data-slide-index]');
                let closestIdx = 0;
                let minDiff = Infinity;

                if (isVertical) {
                    const viewportCenter = contentEl.scrollTop + (contentEl.clientHeight / 2);
                    items.forEach((item, i) => {
                        const itemCenter = item.offsetTop + (item.offsetHeight / 2);
                        const diff = Math.abs(itemCenter - viewportCenter);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestIdx = i;
                        }
                    });
                } else {
                    const viewportCenter = contentEl.scrollLeft + (contentEl.clientWidth / 2);
                    items.forEach((item, i) => {
                        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
                        const diff = Math.abs(itemCenter - viewportCenter);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestIdx = i;
                        }
                    });
                }

                if (closestIdx !== currentSlide) {
                    currentSlide = closestIdx;
                    updateUI();
                }
            }, 80);
        }, { signal: ctx?.signal });

        ctx?.onCleanup(() => {
            if (scrollDebounce) clearTimeout(scrollDebounce);
        });
    }

    updateUI();
}

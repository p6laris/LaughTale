import { CarouselItem } from '../types/models';
import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface CarouselProps {
    items: CarouselItem[];
    numVisible?: number;
    numScroll?: number;
    autoplay?: boolean;
    autoplayInterval?: number;
    circular?: boolean;
    showIndicators?: boolean;
    showNavigators?: boolean;
}

export default function CarouselIsland(container: HTMLElement, props: CarouselProps) {
    const items = props.items || [];
    const numVisible = props.numVisible || 1;
    const numScroll = props.numScroll || 1;
    const autoplay = props.autoplay || false;
    const autoplayInterval = props.autoplayInterval || 5000;
    const circular = props.circular || false;
    const showIndicators = props.showIndicators !== false;
    const showNavigators = props.showNavigators !== false;

    let currentIndex = 0;
    let autoplayTimer: number | null = null;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    injectIslandStyle('carousel', `
        .laughtale-carousel {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
        }
        .carousel-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            position: relative;
        }
        .carousel-viewport {
            overflow: hidden;
            width: 100%;
            border-radius: var(--p-border-radius);
            touch-action: pan-y;
        }
        .carousel-track {
            display: flex;
            transition: transform 0.3s ease;
            cursor: grab;
        }
        .carousel-track:active {
            cursor: grabbing;
        }
        .carousel-item {
            flex: 0 0 auto;
            padding: 0.5rem;
            box-sizing: border-box;
        }
        .carousel-item-content {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: box-shadow 150ms ease, transform 150ms ease;
            height: 100%;
        }
        [data-theme="dark"] .carousel-item-content {
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .carousel-item-content:hover {
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .carousel-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }
        .carousel-body {
            padding: 1rem;
        }
        .carousel-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--p-text-color);
            margin-bottom: 0.5rem;
        }
        .carousel-desc {
            font-size: 0.875rem;
            color: var(--p-text-muted-color);
        }
        .carousel-btn {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            color: var(--p-text-color);
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 150ms ease, color 150ms ease, box-shadow 150ms ease;
            flex-shrink: 0;
            z-index: 2;
        }
        .carousel-btn:hover:not(:disabled) {
            background: var(--p-surface-100);
        }
        .carousel-btn:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px var(--p-primary-color);
        }
        .carousel-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .carousel-indicators {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        }
        .carousel-indicator {
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
            background: var(--p-surface-300);
            border: none;
            cursor: pointer;
            transition: background 150ms ease, transform 150ms ease;
        }
        .carousel-indicator.active {
            background: var(--p-primary-color);
            transform: scale(1.2);
        }
    `);

    function getPositionByIndex(index: number) {
        return -(index * (100 / numVisible));
    }

    function setPositionByIndex() {
        const track = container.querySelector('.carousel-track') as HTMLElement;
        if (!track) return;
        currentTranslate = getPositionByIndex(currentIndex);
        prevTranslate = currentTranslate;
        track.style.transform = 'translateX(' + currentTranslate + '%)';
        updateIndicators();
        updateButtons();
    }

    function render() {
        const itemWidth = 100 / numVisible;
        const totalPages = Math.ceil((items.length - numVisible) / numScroll) + 1;

        container.innerHTML = `
            <div class="laughtale-carousel">
                <div class="carousel-content">
                    ${showNavigators ? `
                        <button type="button" class="carousel-btn prev-btn" aria-label="Previous">
                            ${LucideIcons.chevronLeft}
                        </button>
                    ` : ''}
                    
                    <div class="carousel-viewport">
                        <div class="carousel-track">
                            ${items.map(item => `
                                <div class="carousel-item" style="width: ${itemWidth}%">
                                    <div class="carousel-item-content">
                                        ${item.image ? `<img src="${item.image}" alt="${item.title || ''}" class="carousel-img" />` : ''}
                                        <div class="carousel-body">
                                            ${item.title ? `<div class="carousel-title">${item.title}</div>` : ''}
                                            ${item.description ? `<div class="carousel-desc">${item.description}</div>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    ${showNavigators ? `
                        <button type="button" class="carousel-btn next-btn" aria-label="Next">
                            ${LucideIcons.chevronRight}
                        </button>
                    ` : ''}
                </div>

                ${showIndicators && totalPages > 1 ? `
                    <div class="carousel-indicators">
                        ${Array.from({ length: totalPages }).map((_, i) => `
                            <button type="button" class="carousel-indicator ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Page ${i + 1}"></button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        bindEvents();
        setPositionByIndex();
        if (autoplay) startAutoplay();
    }

    function updateIndicators() {
        if (!showIndicators) return;
        const page = Math.floor(currentIndex / numScroll);
        container.querySelectorAll('.carousel-indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === page);
        });
    }

    function updateButtons() {
        if (!showNavigators || circular) return;
        const prevBtn = container.querySelector('.prev-btn') as HTMLButtonElement;
        const nextBtn = container.querySelector('.next-btn') as HTMLButtonElement;
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= items.length - numVisible;
    }

    function navPrev() {
        if (currentIndex === 0) {
            if (circular) currentIndex = Math.max(0, items.length - numVisible);
        } else {
            currentIndex = Math.max(0, currentIndex - numScroll);
        }
        setPositionByIndex();
    }

    function navNext() {
        if (currentIndex >= items.length - numVisible) {
            if (circular) currentIndex = 0;
        } else {
            currentIndex = Math.min(items.length - numVisible, currentIndex + numScroll);
        }
        setPositionByIndex();
    }

    function startAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = window.setInterval(navNext, autoplayInterval);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function bindEvents() {
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const track = container.querySelector('.carousel-track') as HTMLElement;
        const indicators = container.querySelectorAll('.carousel-indicator');

        prevBtn?.addEventListener('click', navPrev);
        nextBtn?.addEventListener('click', navNext);

        indicators.forEach(ind => {
            ind.addEventListener('click', (e) => {
                const idx = Number((e.target as HTMLElement).dataset.index);
                currentIndex = Math.min(idx * numScroll, items.length - numVisible);
                setPositionByIndex();
            });
        });

        if (autoplay) {
            container.addEventListener('mouseenter', stopAutoplay);
            container.addEventListener('mouseleave', startAutoplay);
        }

        // Touch/Pointer events
        if (track) {
            track.addEventListener('pointerdown', (e) => {
                isDragging = true;
                startX = e.clientX;
                track.style.transition = 'none';
                if (autoplay) stopAutoplay();
            });

            window.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const currentX = e.clientX;
                const diff = ((currentX - startX) / container.offsetWidth) * 100;
                track.style.transform = `translateX(${prevTranslate + diff}%)`;
            });

            window.addEventListener('pointerup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                track.style.transition = 'transform 0.3s ease';
                const diff = ((e.clientX - startX) / container.offsetWidth) * 100;
                
                if (Math.abs(diff) > 10) {
                    if (diff > 0) navPrev();
                    else navNext();
                } else {
                    setPositionByIndex();
                }
                if (autoplay) startAutoplay();
            });
        }
    }

    render();
}

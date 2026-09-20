import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Rating Component (Aura Rating)
 * Star-based selection with half-star precision, vertical orientation,
 * custom emoji templates, keyboard accessibility, and zero-flicker incremental DOM updates.
 */

import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { getLucideIcon } from '../icons/lucide';
import { useControllableState } from '../composables/useControllableState';
import { useFormField } from '../composables/useFormField';
import { useLocale } from '../composables/useLocale';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'radiogroup'
};

/**
 * Pure hit-test for a rating star's half-star precision: returns true when the pointer is
 * over the half that represents the *lower* of the two values a star can produce (i.e.
 * `starVal - 0.5`). In LTR the lower half is the physical left half (values read low-to-high
 * left-to-right); in RTL the row is mirrored, so the lower half becomes the physical right
 * half. Exported so this mirroring can be unit-tested without simulating mouse events.
 */
export function isLowerHalfHit(clientX: number, rectLeft: number, rectWidth: number, isRtl: boolean): boolean {
    if (rectWidth <= 0) return false;
    const isPhysicalLeftHalf = (clientX - rectLeft) < rectWidth / 2;
    return isRtl ? !isPhysicalLeftHalf : isPhysicalLeftHalf;
}

export interface RatingProps {
    value?: number;
    stars?: number;
    allowHalf?: boolean;
    cancel?: boolean;
    allowCancel?: boolean;
    orientation?: 'horizontal' | 'vertical';
    readonlyMode?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    size?: 'small' | 'normal' | 'large';
    mode?: 'stars' | 'emoji' | 'template';
    emojis?: string[] | string;
    targetInputName?: string;
    name?: string;
    inputId?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-rating,
.p-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--p-font-family, inherit);
    user-select: none;
    box-sizing: border-box;
}

.p-rating.p-rating-vertical {
    flex-direction: column;
}

/* Rating Items (Stars / Icons) */
.p-rating-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 9999px;
    padding: 0.125rem;
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease, opacity 150ms ease;
    color: var(--lt-surface-300);
    outline: none;
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:hover {
    transform: scale(1.15);
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:focus-visible {
    box-shadow: 0 0 0 2px var(--lt-primary-500);
}

.p-rating-item.p-rating-item-active {
    color: var(--lt-primary-500);
}

.p-rating-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: color 150ms ease, fill 150ms ease;
}

.p-rating-icon svg {
    width: 100%;
    height: 100%;
}

/* Sizes */
.p-rating.size-small .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Half Stars Overlay */
.p-rating-half-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.p-rating-half-overlay {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    color: var(--lt-primary-500);
    pointer-events: none;
}
.p-rating-half-overlay .p-rating-icon {
    width: 20px;
    height: 20px;
}
.p-rating.size-small .p-rating-half-overlay .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-half-overlay .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Cancel Button */
.p-rating-cancel-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.125rem;
    margin-inline-end: 0.25rem;
    color: var(--lt-surface-400);
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease, transform 150ms ease;
    outline: none;
}
.p-rating-vertical .p-rating-cancel-item {
    margin-inline-end: 0;
    margin-bottom: 0.25rem;
}
.p-rating-cancel-item:hover {
    color: var(--p-red-500, var(--lt-danger-500));
    transform: scale(1.1);
}
.p-rating-cancel-item:focus-visible {
    box-shadow: 0 0 0 2px var(--p-red-500);
}
.p-rating-cancel-item svg {
    width: 16px;
    height: 16px;
}

/* Emoji / Template Mode */
.p-rating-emoji-item {
    font-size: 1.5rem;
    line-height: 1;
    filter: grayscale(100%);
    opacity: 0.5;
    transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}
.p-rating-emoji-item.p-rating-item-active,
.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-emoji-item:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.25);
}

/* Text Template Mode (e.g. A A A A A) */
.p-rating-text-item {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--lt-surface-300);
    transition: color 150ms ease, transform 150ms ease;
}
.p-rating-text-item.p-rating-item-active {
    color: var(--lt-primary-500);
}

/* States */
.p-rating.p-readonly .p-rating-item,
.p-rating.p-readonly .p-rating-cancel-item {
    cursor: default;
}
.p-rating.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.p-rating.p-disabled .p-rating-item,
.p-rating.p-disabled .p-rating-cancel-item {
    cursor: not-allowed;
    pointer-events: none;
}

/* ==================== DARK MODE ==================== */
html.dark .p-rating-item,
[data-theme="dark"] .p-rating-item,
.dark .p-rating-item {
    color: var(--p-surface-400);
}
html.dark .p-rating-item.p-rating-item-active,
html.dark .p-rating-half-overlay,
[data-theme="dark"] .p-rating-item.p-rating-item-active,
[data-theme="dark"] .p-rating-half-overlay,
.dark .p-rating-item.p-rating-item-active,
.dark .p-rating-half-overlay {
    color: var(--p-primary-400);
}
html.dark .p-rating-cancel-item,
[data-theme="dark"] .p-rating-cancel-item,
.dark .p-rating-cancel-item {
    color: var(--p-text-muted);
}
html.dark .p-rating-cancel-item:hover,
[data-theme="dark"] .p-rating-cancel-item:hover,
.dark .p-rating-cancel-item:hover {
    color: var(--p-red-400);
}
html.dark .p-rating-text-item,
[data-theme="dark"] .p-rating-text-item,
.dark .p-rating-text-item {
    color: var(--p-surface-400);
}
html.dark .p-rating-text-item.p-rating-item-active,
[data-theme="dark"] .p-rating-text-item.p-rating-item-active,
.dark .p-rating-text-item.p-rating-item-active {
    color: var(--p-primary-400);
}
`;

const starFilledSvg = getLucideIcon('star', 20, 2, undefined, { filled: true });
const starEmptySvg = getLucideIcon('star', 20, 2);
const cancelSvg = getLucideIcon('ban', 16, 2);

export default function RatingIsland(container: HTMLElement, props: RatingProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-rating', CSS);
    const locale = useLocale(ctx);

    const formField = useFormField(container, ctx, {
        cardinality: 'Single',
        fieldKind: 'Hidden',
        name: props.name || props.targetInputName
    });

    const totalStars = props.stars ? Number(props.stars) : 5;
    const isAllowHalf = props.allowHalf === true || String(props.allowHalf) === 'true';
    const isCancelAllowed = (props.cancel !== false && props.allowCancel !== false && String(props.cancel) !== 'false' && String(props.allowCancel) !== 'false');
    const isVertical = props.orientation === 'vertical';
    const isReadonly = props.readonlyMode === true || props.readonly === true || String(props.readonlyMode) === 'true' || String(props.readonly) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const mode = props.mode || 'stars';

    // Parse custom emojis if any
    let emojiList: string[] = ['😡', '🙁', '😐', '😊', '🤩'];
    if (props.emojis) {
        if (Array.isArray(props.emojis)) emojiList = props.emojis;
        else if (typeof props.emojis === 'string') {
            try {
                const parsed = JSON.parse(props.emojis);
                if (Array.isArray(parsed)) emojiList = parsed;
                else emojiList = props.emojis.split(',').map(s => s.trim()).filter(Boolean);
            } catch {
                emojiList = props.emojis.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
    }

    const [getRating, setRating] = useControllableState<number>({
        defaultValue: props.value !== undefined ? Number(props.value) : (formField.field?.value ? Number(formField.field.value) : 0),
        onChange: (val) => {
            syncValue(val);
        }
    });

    let hoverValue: number | null = null;

    function init() {
        const rating = getRating();
        const rootClasses = [
            'laughtale-rating',
            'p-rating',
            isVertical ? 'p-rating-vertical' : '',
            props.size ? `size-${props.size}` : '',
            isReadonly ? 'p-readonly' : '',
            isDisabled ? 'p-disabled' : ''
        ].filter(Boolean).join(' ');

        container.className = rootClasses;
        container.setAttribute('role', 'radiogroup');
        container.setAttribute('aria-label', `${rating} of ${totalStars} stars`);

        const cancelBtnHtml = (isCancelAllowed && !isReadonly && !isDisabled) ? html`
            <button type="button" class="p-rating-cancel-item" data-part="root" aria-label="Clear rating" tabindex="0">
                ${unsafe(cancelSvg)}
            </button>
        ` : '';

        const itemsHtml: Raw[] = [];
        for (let i = 1; i <= totalStars; i++) {
            if (mode === 'emoji') {
                const emoji = emojiList[(i - 1) % emojiList.length] || '⭐';
                itemsHtml.push(html`
                    <span class="p-rating-item p-rating-emoji-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? 'true' : 'false'}" aria-label="${i} Star" tabindex="${isReadonly || isDisabled ? '-1' : '0'}">
                        ${emoji}
                    </span>
                `);
            } else if (mode === 'template') {
                itemsHtml.push(html`
                    <span class="p-rating-item p-rating-text-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? 'true' : 'false'}" aria-label="${i} Star" tabindex="${isReadonly || isDisabled ? '-1' : '0'}">
                        A
                    </span>
                `);
            } else {
                // Standard Star Item with Half-Star support
                itemsHtml.push(html`
                    <span class="p-rating-item p-rating-star-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? 'true' : 'false'}" aria-label="${i} Stars" tabindex="${isReadonly || isDisabled ? '-1' : '0'}">
                        <div class="p-rating-half-wrapper">
                            <span class="p-rating-icon p-rating-icon-off">${unsafe(starEmptySvg)}</span>
                            <span class="p-rating-half-overlay" style="display: none;">
                                <span class="p-rating-icon p-rating-icon-half">${unsafe(starFilledSvg)}</span>
                            </span>
                        </div>
                    </span>
                `);
            }
        }

        formField.detach();
        setHtml(container, html`
            ${cancelBtnHtml}
            <div class="p-rating-items" style="display: flex; ${isVertical ? 'flex-direction: column;' : 'align-items: center;'} gap: 0.375rem;">
                ${itemsHtml}
            </div>
        `);
        formField.reattach();

        updateVisuals(rating);
        bindEvents();
    }

    // Zero-Flicker Visual Updater: updates star classes/SVGs incrementally WITHOUT wiping container.innerHTML
    function updateVisuals(activeVal: number) {
        const items = container.querySelectorAll<HTMLElement>('.p-rating-item');
        items.forEach((item) => {
            const starVal = Number(item.getAttribute('data-value'));
            const isFull = activeVal >= starVal;
            const isHalf = isAllowHalf && activeVal >= (starVal - 0.5) && activeVal < starVal;

            if (mode === 'stars') {
                const offIcon = item.querySelector<HTMLElement>('.p-rating-icon-off');
                const halfOverlay = item.querySelector<HTMLElement>('.p-rating-half-overlay');

                if (isFull) {
                    item.classList.add('p-rating-item-active');
                    if (offIcon) setHtml(offIcon, unsafe(starFilledSvg));
                    if (halfOverlay) halfOverlay.style.display = 'none';
                } else if (isHalf) {
                    item.classList.remove('p-rating-item-active');
                    if (offIcon) setHtml(offIcon, unsafe(starEmptySvg));
                    if (halfOverlay) halfOverlay.style.display = 'block';
                } else {
                    item.classList.remove('p-rating-item-active');
                    if (offIcon) setHtml(offIcon, unsafe(starEmptySvg));
                    if (halfOverlay) halfOverlay.style.display = 'none';
                }
            } else {
                item.classList.toggle('p-rating-item-active', isFull);
            }

            item.setAttribute('aria-checked', isFull || isHalf ? 'true' : 'false');
        });

        container.setAttribute('aria-label', `${activeVal} of ${totalStars} stars`);
    }

    function bindEvents() {
        if (isReadonly || isDisabled) return;

        const cancelBtn = container.querySelector<HTMLButtonElement>('.p-rating-cancel-item');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setRating(0);
                updateVisuals(0);
            }, { signal: ctx?.signal });
            cancelBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRating(0);
                    updateVisuals(0);
                }
            }, { signal: ctx?.signal });
        }

        const items = container.querySelectorAll<HTMLElement>('.p-rating-item');
        items.forEach((item) => {
            const starVal = Number(item.getAttribute('data-value'));

            // Mouse hover calculation (detect half vs full star)
            item.addEventListener('mousemove', (e) => {
                if (isAllowHalf && mode === 'stars') {
                    const rect = item.getBoundingClientRect();
                    hoverValue = isLowerHalfHit(e.clientX, rect.left, rect.width, locale.isRtl) ? (starVal - 0.5) : starVal;
                } else {
                    hoverValue = starVal;
                }
                updateVisuals(hoverValue);
            }, { signal: ctx?.signal });

            item.addEventListener('click', (e) => {
                let targetVal = starVal;
                if (isAllowHalf && mode === 'stars') {
                    const rect = item.getBoundingClientRect();
                    targetVal = isLowerHalfHit(e.clientX, rect.left, rect.width, locale.isRtl) ? (starVal - 0.5) : starVal;
                }

                // If clicking same value and cancel is enabled, unset to 0
                const current = getRating();
                const finalVal = (current === targetVal && isCancelAllowed) ? 0 : targetVal;
                setRating(finalVal);
                updateVisuals(finalVal);
            }, { signal: ctx?.signal });

            // ARIA Keyboard navigation
            item.addEventListener('keydown', (e) => {
                const current = getRating();
                const step = isAllowHalf ? 0.5 : 1;

                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const nextVal = Math.min(totalStars, current + step);
                    setRating(nextVal);
                    updateVisuals(nextVal);
                    focusStar(Math.ceil(nextVal));
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const prevVal = Math.max(0, current - step);
                    setRating(prevVal);
                    updateVisuals(prevVal);
                    focusStar(Math.ceil(prevVal));
                } else if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setRating(starVal);
                    updateVisuals(starVal);
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    setRating(0);
                    updateVisuals(0);
                }
            }, { signal: ctx?.signal });
        });

        // Mouse leave resets to current value
        container.addEventListener('mouseleave', () => {
            hoverValue = null;
            updateVisuals(getRating());
        }, { signal: ctx?.signal });
    }

    function focusStar(starNum: number) {
        const target = container.querySelector<HTMLElement>(`.p-rating-item[data-value="${Math.max(1, starNum)}"]`);
        target?.focus();
    }

    function syncValue(val: number) {
        formField.setValue(val);
        emitComponentEvent(container, 'rating', 'change', { value: val });
    }

    init();
    syncValue(getRating());
}

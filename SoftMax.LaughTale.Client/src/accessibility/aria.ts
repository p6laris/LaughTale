/**
 * SoftMax.LaughTale: WAI-ARIA 1.2 Attributes & Roving Tabindex Engine (LT-801)
 * 
 * Provides declarative ARIA attribute bindings, APG-compliant roving tabindex navigation,
 * and keyboard focus orchestration for composite widgets (menus, tabs, toolbars, grids).
 */

/**
 * Applies a dictionary of ARIA attributes to an HTML element.
 * Attributes with null/undefined values are removed.
 * @param element Target HTMLElement
 * @param attrs Key-value dictionary of ARIA attributes (e.g. { expanded: true, selected: false })
 */
export function applyAriaAttributes(
    element: HTMLElement,
    attrs: Record<string, string | boolean | number | null | undefined>
): void {
    if (!element || !attrs) return;

    for (const [key, value] of Object.entries(attrs)) {
        const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
        if (value === null || value === undefined) {
            element.removeAttribute(ariaKey);
        } else {
            element.setAttribute(ariaKey, String(value));
        }
    }
}

/**
 * Sets roving tabindex on a collection of elements, setting the active element to tabindex="0"
 * and all other elements to tabindex="-1".
 * @param elements Array of HTMLElements
 * @param activeIndex The currently active element index
 */
export function setRovingTabindex(elements: HTMLElement[], activeIndex: number): void {
    if (!elements || elements.length === 0) return;

    elements.forEach((el, index) => {
        if (!el) return;
        if (index === activeIndex) {
            el.setAttribute('tabindex', '0');
        } else {
            el.setAttribute('tabindex', '-1');
        }
    });
}

/**
 * Handles keyboard arrow navigation for roving tabindex composite widgets.
 * Supports ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Home, End with wrap-around.
 * @param event KeyboardEvent
 * @param elements Array of navigable HTMLElements
 * @param currentIndex Currently focused index
 * @param orientation 'horizontal' | 'vertical' | 'both'
 * @returns The newly focused index
 */
export function handleRovingKeydown(
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' | 'both' = 'both'
): number {
    if (!elements || elements.length === 0) return currentIndex;

    const count = elements.length;
    let nextIndex = currentIndex;
    let handled = false;

    const allowHorizontal = orientation === 'horizontal' || orientation === 'both';
    const allowVertical = orientation === 'vertical' || orientation === 'both';

    switch (event.key) {
        case 'ArrowRight':
            if (allowHorizontal) {
                nextIndex = (currentIndex + 1) % count;
                handled = true;
            }
            break;
        case 'ArrowLeft':
            if (allowHorizontal) {
                nextIndex = (currentIndex - 1 + count) % count;
                handled = true;
            }
            break;
        case 'ArrowDown':
            if (allowVertical) {
                nextIndex = (currentIndex + 1) % count;
                handled = true;
            }
            break;
        case 'ArrowUp':
            if (allowVertical) {
                nextIndex = (currentIndex - 1 + count) % count;
                handled = true;
            }
            break;
        case 'Home':
            nextIndex = 0;
            handled = true;
            break;
        case 'End':
            nextIndex = count - 1;
            handled = true;
            break;
    }

    if (handled) {
        event.preventDefault();
        setRovingTabindex(elements, nextIndex);
        elements[nextIndex]?.focus?.();
    }

    return nextIndex;
}

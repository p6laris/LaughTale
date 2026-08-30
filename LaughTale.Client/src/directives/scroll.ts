/**
 * LaughTale: Smooth Scroll Directive (l-scroll-to)
 * Smoothly scrolls page or container to target selector, top, or bottom.
 */

export function bindScrollToDirectives(element: HTMLElement): void {
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-scroll-to' || attr.name.startsWith('l-scroll-to.')) {
            const target = attr.value.trim();

            element.addEventListener('click', (e) => {
                e.preventDefault();

                if (target === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (target === 'bottom') {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                } else if (target) {
                    const targetEl = document.querySelector(target);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        }
    }
}

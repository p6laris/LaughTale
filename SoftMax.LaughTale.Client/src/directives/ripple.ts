/**
 * SoftMax.LaughTale: Material-style ripple effect directive (l-ripple)
 */
export function bindRippleDirectives(element: HTMLElement): void {
    if (!element.hasAttribute('l-ripple')) return;

    if ((element as any)._hasRipple) return;
    (element as any)._hasRipple = true;

    element.style.position = element.style.position || 'relative';
    element.style.overflow = 'hidden';

    element.addEventListener('pointerdown', (e: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        const isDark = element.closest('[data-theme="dark"]') || element.closest('.dark');
        circle.style.backgroundColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.12)';
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${x - radius}px`;
        circle.style.top = `${y - radius}px`;
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.transform = 'scale(0)';
        circle.style.transition = 'transform 500ms ease-out, opacity 300ms';
        circle.style.pointerEvents = 'none';

        element.appendChild(circle);

        // trigger reflow
        void circle.offsetWidth;
        
        circle.style.transform = 'scale(4)';

        const fadeOut = () => {
            circle.style.opacity = '0';
            setTimeout(() => circle.remove(), 300);
        };

        element.addEventListener('pointerup', fadeOut, { once: true });
        element.addEventListener('pointerleave', fadeOut, { once: true });
    });
}

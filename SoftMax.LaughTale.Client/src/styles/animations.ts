export function initAnimationStyles(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById('aura-animations')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'aura-animations';
    styleEl.textContent = `
/* Base Component */
.p-component {
    font-family: var(--p-font-family, inherit);
    font-size: 1rem;
    line-height: 1.5;
}

/* 1. Anchored Overlays */
.p-anchored-overlay-enter-active {
    animation: p-anchored-overlay-enter 200ms ease-out forwards;
}
.p-anchored-overlay-leave-active {
    animation: p-anchored-overlay-leave 150ms ease-in forwards;
}
@keyframes p-anchored-overlay-enter {
    from { opacity: 0; transform: translateY(5%); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes p-anchored-overlay-leave {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(5%); }
}

/* 2. Collapsibles */
.p-collapsible-enter-active {
    animation: p-collapsible-enter 300ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
.p-collapsible-leave-active {
    animation: p-collapsible-leave 300ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
@keyframes p-collapsible-enter {
    from { grid-template-rows: 0fr; opacity: 0; transform: scale(0.97); }
    to { grid-template-rows: 1fr; opacity: 1; transform: scale(1); }
}
@keyframes p-collapsible-leave {
    from { grid-template-rows: 1fr; opacity: 1; transform: scale(1); }
    to { grid-template-rows: 0fr; opacity: 0; transform: scale(0.97); }
}

/* 3. Dialog */
.p-dialog-enter-active {
    animation: p-dialog-enter 300ms ease-out forwards;
}
.p-dialog-leave-active {
    animation: p-dialog-leave 200ms ease-in forwards;
}
@keyframes p-dialog-enter {
    from { opacity: 0; transform: scale(0.95); filter: blur(8px); }
    to { opacity: 1; transform: scale(1); filter: blur(0); }
}
@keyframes p-dialog-leave {
    from { opacity: 1; transform: scale(1); filter: blur(0); }
    to { opacity: 0; transform: scale(0.95); filter: blur(4px); }
}

/* 4. Drawer */
.p-drawer-enter-active {
    animation: p-drawer-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
.p-drawer-leave-active {
    animation: p-drawer-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
@keyframes p-drawer-enter {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}
@keyframes p-drawer-leave {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
}

.p-drawer-right-enter-active { animation: p-drawer-right-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
.p-drawer-right-leave-active { animation: p-drawer-right-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
@keyframes p-drawer-right-enter { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes p-drawer-right-leave { from { transform: translateX(0); } to { transform: translateX(100%); } }

.p-drawer-top-enter-active { animation: p-drawer-top-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
.p-drawer-top-leave-active { animation: p-drawer-top-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
@keyframes p-drawer-top-enter { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes p-drawer-top-leave { from { transform: translateY(0); } to { transform: translateY(-100%); } }

.p-drawer-bottom-enter-active { animation: p-drawer-bottom-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
.p-drawer-bottom-leave-active { animation: p-drawer-bottom-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
@keyframes p-drawer-bottom-enter { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes p-drawer-bottom-leave { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* 5. Message/Toast */
.p-message-enter-active {
    animation: p-message-enter 300ms ease-out forwards;
}
.p-message-leave-active {
    animation: p-message-leave 200ms ease-in forwards;
}
@keyframes p-message-enter {
    from { opacity: 0; transform: translateY(-100%); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes p-message-leave {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateX(100%); }
}

/* 6. Overlay Mask */
.p-overlay-mask-enter-active {
    animation: p-overlay-mask-enter 200ms ease forwards;
}
.p-overlay-mask-leave-active {
    animation: p-overlay-mask-leave 150ms ease forwards;
}
@keyframes p-overlay-mask-enter {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes p-overlay-mask-leave {
    from { opacity: 1; }
    to { opacity: 0; }
}

/* 7. Ripple */
.p-ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: p-ripple-animation 600ms linear;
    pointer-events: none;
}
@keyframes p-ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* 8. Skeleton Shimmer */
.p-skeleton-animation {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
    background-size: 200% 100%;
    animation: p-skeleton-shimmer 1.5s infinite linear;
}
@keyframes p-skeleton-shimmer {
    from { background-position: -200% 0; }
    to { background-position: 200% 0; }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
        animation-duration: 0s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0s !important;
        scroll-behavior: auto !important;
    }
}
    `;
    document.head.appendChild(styleEl);
}

export function injectRipple(el: HTMLElement, event: PointerEvent): void {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.className = 'p-ripple-effect';
    ripple.style.width = \`\${size}px\`;
    ripple.style.height = \`\${size}px\`;
    ripple.style.left = \`\${x}px\`;
    ripple.style.top = \`\${y}px\`;
    
    el.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

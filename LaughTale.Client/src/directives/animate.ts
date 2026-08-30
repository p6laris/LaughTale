/**
 * LaughTale: AnimateOnScroll Directive (l-animate)
 */
const injectedAnimations = new Set<string>();

function injectAnimationKeyframes(name: string) {
    if (injectedAnimations.has(name) || typeof document === 'undefined') return;
    
    let keyframes = '';
    switch(name) {
        case 'fadeIn': keyframes = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`; break;
        case 'fadeInUp': keyframes = `@keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 100%, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`; break;
        case 'fadeInDown': keyframes = `@keyframes fadeInDown { from { opacity: 0; transform: translate3d(0, -100%, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`; break;
        case 'fadeInLeft': keyframes = `@keyframes fadeInLeft { from { opacity: 0; transform: translate3d(-100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`; break;
        case 'fadeInRight': keyframes = `@keyframes fadeInRight { from { opacity: 0; transform: translate3d(100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`; break;
        case 'slideInUp': keyframes = `@keyframes slideInUp { from { visibility: visible; transform: translate3d(0, 100%, 0); } to { transform: translate3d(0, 0, 0); } }`; break;
        case 'slideInDown': keyframes = `@keyframes slideInDown { from { visibility: visible; transform: translate3d(0, -100%, 0); } to { transform: translate3d(0, 0, 0); } }`; break;
        case 'slideInLeft': keyframes = `@keyframes slideInLeft { from { visibility: visible; transform: translate3d(-100%, 0, 0); } to { transform: translate3d(0, 0, 0); } }`; break;
        case 'slideInRight': keyframes = `@keyframes slideInRight { from { visibility: visible; transform: translate3d(100%, 0, 0); } to { transform: translate3d(0, 0, 0); } }`; break;
        case 'zoomIn': keyframes = `@keyframes zoomIn { from { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); } 50% { opacity: 1; } }`; break;
        case 'flipInX': keyframes = `@keyframes flipInX { from { transform: perspective(400px) rotate3d(1, 0, 0, 90deg); animation-timing-function: ease-in; opacity: 0; } 40% { transform: perspective(400px) rotate3d(1, 0, 0, -20deg); animation-timing-function: ease-in; } 60% { transform: perspective(400px) rotate3d(1, 0, 0, 10deg); opacity: 1; } 80% { transform: perspective(400px) rotate3d(1, 0, 0, -5deg); } to { transform: perspective(400px); } }`; break;
        case 'flipInY': keyframes = `@keyframes flipInY { from { transform: perspective(400px) rotate3d(0, 1, 0, 90deg); animation-timing-function: ease-in; opacity: 0; } 40% { transform: perspective(400px) rotate3d(0, 1, 0, -20deg); animation-timing-function: ease-in; } 60% { transform: perspective(400px) rotate3d(0, 1, 0, 10deg); opacity: 1; } 80% { transform: perspective(400px) rotate3d(0, 1, 0, -5deg); } to { transform: perspective(400px); } }`; break;
        case 'bounceIn': keyframes = `@keyframes bounceIn { from, 20%, 40%, 60%, 80%, to { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); } 0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); } 20% { transform: scale3d(1.1, 1.1, 1.1); } 40% { transform: scale3d(0.9, 0.9, 0.9); } 60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); } 80% { transform: scale3d(0.97, 0.97, 0.97); } to { opacity: 1; transform: scale3d(1, 1, 1); } }`; break;
        default: return;
    }

    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    injectedAnimations.add(name);
}

export function bindAnimateDirectives(element: HTMLElement): void {
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-animate' || attr.name.startsWith('l-animate.')) {
            const isOnce = attr.name.includes('.once');
            const animationName = attr.value;
            if (!animationName) continue;
            
            injectAnimationKeyframes(animationName);

            const delay = element.getAttribute('l-animate.delay') || '0';
            const duration = element.getAttribute('l-animate.duration') || '500';
            const thresholdAttr = element.getAttribute('l-animate.threshold');
            const threshold = thresholdAttr ? parseFloat(thresholdAttr) : 0.5;

            element.style.animationDuration = `${duration}ms`;
            element.style.animationDelay = `${delay}ms`;
            element.style.animationFillMode = 'both';

            const observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        element.style.animationName = animationName;
                        if (isOnce) {
                            observer.disconnect();
                        }
                    } else if (!isOnce) {
                        element.style.animationName = 'none'; // reset
                    }
                }
            }, { threshold });

            observer.observe(element);
        }
    }
}

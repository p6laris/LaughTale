/**
 * SoftMax.LaughTale Client Runtime 2.0
 */

export * from './runtime/hydrator';
export * from './runtime/registry';
export * from './runtime/events';
export * from './runtime/state';
export * from './runtime/slots';
export * from './runtime/styles';
export * from './runtime/router';

import { initIslands } from './runtime/hydrator';
import { enableViewTransitions } from './runtime/router';

// Auto-initialize hydration & view transitions in browser
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initIslands();
            enableViewTransitions();
        });
    } else {
        initIslands();
        enableViewTransitions();
    }
}

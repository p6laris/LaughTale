import { injectIslandStyle } from '../runtime/styles';
/**
 * SoftMax.LaughTale: Enterprise Toast Notification Dispatcher Component
 */

export interface ToastMessage {
    id?: string;
    title: string;
    description?: string;
    severity?: 'success' | 'info' | 'warn' | 'error';
    durationMs?: number;
}


const CSS = `
@keyframes toast-slideIn {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
}
@keyframes toast-slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
}
.laughtale-toast {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1.125rem;
    border-radius: var(--p-border-radius-lg, 0.75rem);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    width: 340px;
    animation: toast-slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.laughtale-toast.leaving {
    animation: toast-slideOut 0.3s ease forwards;
}
.toast-icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.75rem;
    flex-shrink: 0;
}
.toast-title { font-size: 0.875rem; font-weight: 600; color: var(--p-surface-900); }
.toast-desc { font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.15rem; }
.toast-close {
    background: none;
    border: none;
    font-size: 1rem;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0 0.25rem;
}
.toast-close:hover { color: var(--p-surface-600); }
[data-theme="dark"] .laughtale-toast {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
}
[data-theme="dark"] .toast-title { color: var(--p-surface-100); }
[data-theme="dark"] .toast-desc { color: var(--p-surface-400); }
[data-theme="dark"] .toast-close { color: var(--p-surface-400); }
`;

export default function ToastIsland(container: HTMLElement) {
    injectIslandStyle('toast', CSS);
    const toastThemes = {
        success: { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857', icon: '✓' },
        info: { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: 'ℹ' },
        warn: { bg: '#fffbeb', border: '#fde68a', color: '#b45309', icon: '⚠' },
        error: { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: '✕' }
    };

    container.style.position = 'fixed';
    container.style.top = '1.5rem';
    container.style.right = '1.5rem';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.75rem';
    container.style.pointerEvents = 'none';

    function addToast(msg: ToastMessage) {
        const severity = msg.severity || 'success';
        const theme = toastThemes[severity] || toastThemes.success;
        const duration = msg.durationMs || 4000;

        const toastEl = document.createElement('div');
        toastEl.className = 'laughtale-toast';

        toastEl.innerHTML =
            '<div class="toast-icon" style="background: ' + theme.bg + '; color: ' + theme.color + ';">' +
                theme.icon +
            '</div>' +
            '<div style="flex: 1;">' +
                '<div class="toast-title">' + msg.title + '</div>' +
                (msg.description ? '<div class="toast-desc">' + msg.description + '</div>' : '') +
            '</div>' +
            '<button type="button" class="toast-close">✕</button>';

        toastEl.querySelector('.toast-close')?.addEventListener('click', () => {
            toastEl.classList.add('leaving');
            setTimeout(() => toastEl.remove(), 300);
        });

        container.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.add('leaving');
            setTimeout(() => toastEl.remove(), 300);
        }, duration);
    }

    window.addEventListener('laughtale:toast', (e: any) => {
        if (e.detail) addToast(e.detail);
    });
}

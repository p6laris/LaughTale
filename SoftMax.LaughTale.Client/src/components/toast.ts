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

export default function ToastIsland(container: HTMLElement) {
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
        toastEl.style.pointerEvents = 'auto';
        toastEl.style.display = 'flex';
        toastEl.style.alignItems = 'flex-start';
        toastEl.style.gap = '0.75rem';
        toastEl.style.padding = '0.875rem 1.125rem';
        toastEl.style.borderRadius = 'var(--p-border-radius-lg)';
        toastEl.style.background = 'white';
        toastEl.style.border = `1px solid ${theme.border}`;
        toastEl.style.boxShadow = 'var(--p-shadow-lg)';
        toastEl.style.width = '340px';
        toastEl.style.animation = 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

        toastEl.innerHTML = `
            <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: ${theme.bg}; color: ${theme.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.75rem; flex-shrink: 0;">
                ${theme.icon}
            </div>
            <div style="flex: 1;">
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-900);">${msg.title}</div>
                ${msg.description ? `<div style="font-size: 0.75rem; color: var(--p-surface-600); margin-top: 0.15rem;">${msg.description}</div>` : ''}
            </div>
            <button type="button" style="background: none; border: none; font-size: 1rem; color: var(--p-surface-400); cursor: pointer; padding: 0 0.25rem;">✕</button>
        `;

        toastEl.querySelector('button')?.addEventListener('click', () => toastEl.remove());

        container.appendChild(toastEl);

        setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(100%)';
            toastEl.style.transition = 'all 0.3s ease';
            setTimeout(() => toastEl.remove(), 300);
        }, duration);
    }

    window.addEventListener('laughtale:toast', (e: any) => {
        if (e.detail) addToast(e.detail);
    });
}

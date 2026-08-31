import { useLocale } from '../composables/useLocale';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise InputPassword Component (Aura InputPassword)
 * High-fidelity password input with toggle visibility mask, live strength metering,
 * requirements checklist (chips & list modes), popover overlay panel with pointer,
 * clear action, left icon, filled/outlined variants, and dark mode tokens.
 */

import { injectIslandStyle } from '../runtime/styles';
import { getLucideIcon } from '../icons/lucide';

export interface InputPasswordProps {
    targetInputName?: string;
    inputId?: string;
    value?: string;
    placeholder?: string;
    toggleMask?: boolean | string;
    showMeter?: boolean | string;
    showRequirements?: boolean | string;
    requirementsMode?: 'chips' | 'list' | 'popover';
    feedback?: boolean | string; // Popover mode
    minLength?: number | string;
    icon?: string;
    showClear?: boolean | string;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean | string;
    disabled?: boolean | string;
    readonlyMode?: boolean | string;
    invalid?: boolean | string;
    inputClass?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-password,
.p-password {
    display: inline-flex;
    flex-direction: column;
    position: relative;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
    vertical-align: middle;
}

.p-password.p-password-fluid {
    display: flex;
    width: 100%;
}

/* Main Input Container Box */
.p-password-container {
    display: flex;
    align-items: center;
    position: relative;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    min-height: 2.5rem;
    overflow: hidden;
    width: 100%;
}

.p-password-container:hover:not(.is-disabled) {
    border-color: var(--lt-surface-400);
}

.p-password-container:focus-within:not(.is-disabled) {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
}

.p-password.is-disabled .p-password-container {
    background: var(--lt-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Variant: Filled */
.p-password.variant-filled .p-password-container {
    background: var(--lt-surface-100);
    border-color: transparent;
}
.p-password.variant-filled .p-password-container:focus-within {
    background: var(--lt-surface-0);
    border-color: var(--lt-primary-500) !important;
}

/* Invalid State */
.p-password.is-invalid .p-password-container {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-password.is-invalid .p-password-container:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Sizes */
.p-password.size-small .p-password-container {
    min-height: 2rem;
}
.p-password.size-small .p-password-input {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}
.p-password.size-large .p-password-container {
    min-height: 3rem;
}
.p-password.size-large .p-password-input {
    font-size: 1rem;
    padding: 0.75rem 1rem;
}

/* Left Icon */
.p-password-left-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-left: 0.75rem;
    color: var(--lt-surface-400);
    pointer-events: none;
    flex-shrink: 0;
}
.p-password-left-icon svg {
    width: 16px;
    height: 16px;
}

/* Native Input */
.p-password-input {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--lt-text-primary);
    background: transparent;
    border: none;
    outline: none;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    height: 100%;
}
.p-password-input:disabled {
    color: var(--p-text-muted);
    cursor: not-allowed;
}

/* Action Buttons (Clear / Toggle Mask) */
.p-password-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--lt-surface-400);
    cursor: pointer;
    padding: 0 0.625rem;
    height: 100%;
    transition: color 150ms ease;
    user-select: none;
}
.p-password-action-btn:hover:not(:disabled) {
    color: var(--lt-surface-700);
}
.p-password-action-btn svg {
    width: 16px;
    height: 16px;
}

/* ==================== DIRECT STRENGTH METER ==================== */
.p-password-meter-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.5rem;
    width: 100%;
}
.p-password-meter-track {
    height: 6px;
    background: var(--lt-surface-200);
    border-radius: 9999px;
    overflow: hidden;
    width: 100%;
}
.p-password-meter-bar {
    height: 100%;
    width: 0%;
    border-radius: 9999px;
    transition: width 300ms ease, background-color 300ms ease;
}
.p-password-meter-badge-row {
    display: flex;
    justify-content: flex-end;
}
.p-password-meter-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
}

/* ==================== REQUIREMENTS: CHIPS MODE ==================== */
.p-password-chips-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}
.p-password-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    border: 1px solid var(--lt-surface-200);
    background: var(--lt-surface-0);
    color: var(--lt-surface-600);
    transition: all 200ms ease;
}
.p-password-chip.is-met {
    background: var(--p-emerald-500, var(--lt-primary-500));
    border-color: var(--p-emerald-500, var(--lt-primary-500));
    color: var(--lt-surface-0, var(--lt-surface-0));
}
.p-password-chip svg {
    width: 12px;
    height: 12px;
}

/* ==================== REQUIREMENTS: LIST MODE ==================== */
.p-password-list-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.75rem;
}
.p-password-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--lt-surface-500);
    transition: color 200ms ease;
}
.p-password-list-item.is-met {
    color: var(--p-emerald-600, var(--lt-primary-600));
    font-weight: 600;
}
.p-password-list-item svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

/* ==================== POPOVER OVERLAY PANEL ==================== */
.p-password-popover {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 320px;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    padding: 1rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    animation: pPasswordFadeIn 150ms ease;
}
.p-password-popover::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 1.5rem;
    width: 8px;
    height: 8px;
    background: var(--lt-surface-0);
    border-left: 1px solid var(--lt-surface-200);
    border-top: 1px solid var(--lt-surface-200);
    transform: rotate(45deg);
}
@keyframes pPasswordFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.p-password-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--lt-text-primary);
}
.p-password-popover-header-title {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}
.p-password-popover-header-title svg {
    width: 16px;
    height: 16px;
    color: var(--lt-surface-600);
}
/* ==================== DARK MODE ==================== */
html.dark .p-password-container,
[data-theme="dark"] .p-password-container,
.dark .p-password-container {
    background: var(--p-surface-0, #090d16);
    border-color: var(--p-border-color, #334155);
}
html.dark .p-password-container:hover:not(.is-disabled),
[data-theme="dark"] .p-password-container:hover:not(.is-disabled),
.dark .p-password-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-400, #64748b);
}
html.dark .p-password.variant-filled .p-password-container,
[data-theme="dark"] .p-password.variant-filled .p-password-container,
.dark .p-password.variant-filled .p-password-container {
    background: var(--p-surface-100, #1e293b);
}
html.dark .p-password.variant-filled .p-password-container:focus-within,
[data-theme="dark"] .p-password.variant-filled .p-password-container:focus-within,
.dark .p-password.variant-filled .p-password-container:focus-within {
    background: var(--p-surface-0, #090d16);
}
html.dark .p-password-input,
[data-theme="dark"] .p-password-input,
.dark .p-password-input {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-password-action-btn,
[data-theme="dark"] .p-password-action-btn,
.dark .p-password-action-btn {
    color: var(--p-text-muted, #94a3b8);
}
html.dark .p-password-action-btn:hover:not(:disabled),
[data-theme="dark"] .p-password-action-btn:hover:not(:disabled),
.dark .p-password-action-btn:hover:not(:disabled) {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-password-meter-track,
[data-theme="dark"] .p-password-meter-track,
.dark .p-password-meter-track {
    background: var(--p-surface-100, #1e293b);
}
html.dark .p-password-chip,
[data-theme="dark"] .p-password-chip,
.dark .p-password-chip {
    background: var(--p-surface-100, #1e293b);
    border-color: var(--p-border-color, #334155);
    color: var(--p-text-muted, #94a3b8);
}
html.dark .p-password-chip.is-met,
[data-theme="dark"] .p-password-chip.is-met,
.dark .p-password-chip.is-met {
    background: var(--p-emerald-600, #059669);
    border-color: var(--p-emerald-600, #059669);
    color: #ffffff;
}
html.dark .p-password-list-item,
[data-theme="dark"] .p-password-list-item,
.dark .p-password-list-item {
    color: var(--p-text-muted, #94a3b8);
}
html.dark .p-password-list-item.is-met,
[data-theme="dark"] .p-password-list-item.is-met,
.dark .p-password-list-item.is-met {
    color: var(--p-emerald-400, #34d399);
}
html.dark .p-password-popover,
[data-theme="dark"] .p-password-popover,
.dark .p-password-popover {
    background: var(--p-surface-0, #090d16);
    border-color: var(--p-border-color, #334155);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
}
html.dark .p-password-popover::before,
[data-theme="dark"] .p-password-popover::before,
.dark .p-password-popover::before {
    background: var(--p-surface-0, #090d16);
    border-left-color: var(--p-border-color, #334155);
    border-top-color: var(--p-border-color, #334155);
}
html.dark .p-password-popover-header-title svg,
[data-theme="dark"] .p-password-popover-header-title svg,
.dark .p-password-popover-header-title svg {
    color: var(--p-text-muted, #94a3b8);
}
`;

export default function InputPasswordIsland(container: HTMLElement, props: InputPasswordProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-password', CSS);

    let isMasked = true;
    let currentVal = props.value || '';
    const minLength = Number(props.minLength) || 8;
    const isFilled = props.variant === 'filled';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const hasToggleMask = props.toggleMask !== false && String(props.toggleMask) !== 'false';
    const showClear = props.showClear === true || String(props.showClear) === 'true';
    const showMeter = props.showMeter === true || String(props.showMeter) === 'true';
    const showRequirements = props.showRequirements === true || String(props.showRequirements) === 'true';
    const isPopover = props.feedback === true || String(props.feedback) === 'true' || props.requirementsMode === 'popover';
    const requirementsMode = props.requirementsMode || (isPopover ? 'popover' : 'chips');

    // Rule definitions
    function checkRules(pwd: string) {
        return {
            length: pwd.length >= minLength,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[^A-Za-z0-9]/.test(pwd)
        };
    }

    function calculateStrength(pwd: string): { score: number; label: string; color: string; bgColor: string; width: string } {
        if (!pwd) return { score: 0, label: 'Empty', color: 'var(--lt-surface-400, var(--lt-surface-400))', bgColor: 'var(--lt-surface-100, var(--lt-surface-100))', width: '0%' };
        const rules = checkRules(pwd);
        const passed = Object.values(rules).filter(Boolean).length;

        if (passed <= 1) {
            return { score: 1, label: 'Too Weak', color: 'var(--lt-danger-500, var(--lt-danger-500))', bgColor: 'rgba(239, 68, 68, 0.15)', width: '25%' };
        } else if (passed <= 3) {
            return { score: 2, label: 'Medium', color: 'var(--lt-warn-500, var(--lt-warn-500))', bgColor: 'rgba(245, 158, 11, 0.15)', width: '60%' };
        } else {
            return { score: 3, label: 'Strong', color: 'var(--lt-primary-500, var(--lt-primary-500))', bgColor: 'rgba(16, 185, 129, 0.15)', width: '100%' };
        }
    }

    function render() {
        container.className = 'laughtale-password p-password';
        if (isFluid) container.classList.add('p-password-fluid');
        if (isFilled) container.classList.add('variant-filled');
        if (props.size) container.classList.add(`size-${props.size}`);
        if (isInvalid) container.classList.add('is-invalid');
        if (isDisabled) container.classList.add('is-disabled');

        const inputIdAttr = props.inputId ? `id="${props.inputId}"` : '';
        const placeholderAttr = props.placeholder ? `placeholder="${props.placeholder}"` : '';
        const disabledAttr = isDisabled ? 'disabled' : '';
        const roAttr = isReadonly ? 'readonly' : '';
        const inputType = isMasked ? 'password' : 'text';

        const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
        const clearIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        let leftIconHtml = '';
        if (props.icon) {
            const iconSvg = getLucideIcon(props.icon) || `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
            leftIconHtml = `<span class="p-password-left-icon">${iconSvg}</span>`;
        }

        let html = `
            <div class="p-password-container">
                ${leftIconHtml}
                <input type="${inputType}"
                       class="p-password-input ${props.inputClass || ''}"
                       ${inputIdAttr}
                       ${placeholderAttr}
                       ${disabledAttr}
                       ${roAttr}
                       value="${currentVal}"
                       autocomplete="off" />
                ${showClear ? `
                    <button type="button" class="p-password-action-btn p-password-clear-btn" aria-label="Clear password" style="${!currentVal ? 'display: none;' : ''}">
                        ${clearIcon}
                    </button>
                ` : ''}
                ${hasToggleMask ? `
                    <button type="button" class="p-password-action-btn p-password-toggle-btn" aria-label="Toggle password visibility" tabindex="-1">
                        ${isMasked ? eyeIcon : eyeOffIcon}
                    </button>
                ` : ''}
            </div>
        `;

        // Direct Strength Meter Mode
        if (showMeter && !isPopover) {
            const str = calculateStrength(currentVal);
            html += `
                <div class="p-password-meter-wrap" style="${!currentVal ? 'display: none;' : ''}">
                    <div class="p-password-meter-track">
                        <div class="p-password-meter-bar" style="width: ${str.width}; background-color: ${str.color};"></div>
                    </div>
                    <div class="p-password-meter-badge-row">
                        <span class="p-password-meter-badge" style="color: ${str.color}; background-color: ${str.bgColor};">${str.label}</span>
                    </div>
                </div>
            `;
        }

        // Requirements Chips Mode
        if (showRequirements && requirementsMode === 'chips' && !isPopover) {
            html += renderRequirementsChips(currentVal);
        }

        // Requirements List Mode
        if (showRequirements && requirementsMode === 'list' && !isPopover) {
            html += renderRequirementsList(currentVal);
        }

        // Popover Mode
        if (isPopover) {
            html += `
                <div class="p-password-popover" style="display: none;">
                    <div class="p-password-popover-header">
                        <span class="p-password-popover-header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                            Password Strength
                        </span>
                        <span class="p-password-popover-badge p-password-meter-badge"></span>
                    </div>
                    <div class="p-password-meter-track">
                        <div class="p-password-popover-bar p-password-meter-bar"></div>
                    </div>
                    <div class="p-password-popover-list p-password-list-wrap">
                        ${renderRequirementsListItems(currentVal)}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
        bindEvents();
    }

    function renderRequirementsChips(pwd: string): string {
        const r = checkRules(pwd);
        const checkIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
        const xIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        return `
            <div class="p-password-chips-wrap">
                <span class="p-password-chip ${r.length ? 'is-met' : ''}" data-rule="length">
                    ${r.length ? checkIcon : xIcon} ${minLength}+ characters
                </span>
                <span class="p-password-chip ${r.number ? 'is-met' : ''}" data-rule="number">
                    ${r.number ? checkIcon : xIcon} Number
                </span>
                <span class="p-password-chip ${r.uppercase ? 'is-met' : ''}" data-rule="uppercase">
                    ${r.uppercase ? checkIcon : xIcon} Uppercase letter
                </span>
                <span class="p-password-chip ${r.special ? 'is-met' : ''}" data-rule="special">
                    ${r.special ? checkIcon : xIcon} Special character
                </span>
            </div>
        `;
    }

    function renderRequirementsList(pwd: string): string {
        return `
            <div class="p-password-list-wrap">
                ${renderRequirementsListItems(pwd)}
            </div>
        `;
    }

    function renderRequirementsListItems(pwd: string): string {
        const r = checkRules(pwd);
        const checkIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
        const xIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        return `
            <div class="p-password-list-item ${r.length ? 'is-met' : ''}" data-rule="length">
                ${r.length ? checkIcon : xIcon} At least ${minLength} characters long
            </div>
            <div class="p-password-list-item ${r.uppercase ? 'is-met' : ''}" data-rule="uppercase">
                ${r.uppercase ? checkIcon : xIcon} Contains uppercase letter
            </div>
            <div class="p-password-list-item ${r.lowercase ? 'is-met' : ''}" data-rule="lowercase">
                ${r.lowercase ? checkIcon : xIcon} Contains lowercase letter
            </div>
            <div class="p-password-list-item ${r.number ? 'is-met' : ''}" data-rule="number">
                ${r.number ? checkIcon : xIcon} Contains number
            </div>
            <div class="p-password-list-item ${r.special ? 'is-met' : ''}" data-rule="special">
                ${r.special ? checkIcon : xIcon} Contains special character (!@#$...)
            </div>
        `;
    }

    function updateVisuals() {
        const r = checkRules(currentVal);
        const str = calculateStrength(currentVal);

        // Update clear button
        const clearBtn = container.querySelector<HTMLElement>('.p-password-clear-btn');
        if (clearBtn) {
            clearBtn.style.display = currentVal ? 'inline-flex' : 'none';
        }

        // Update direct meter
        const meterWrap = container.querySelector<HTMLElement>('.p-password-meter-wrap');
        const meterBar = container.querySelector<HTMLElement>('.p-password-meter-bar');
        const meterBadge = container.querySelector<HTMLElement>('.p-password-meter-badge');
        if (meterWrap && meterBar && meterBadge) {
            meterWrap.style.display = currentVal ? 'flex' : 'none';
            meterBar.style.width = str.width;
            meterBar.style.backgroundColor = str.color;
            meterBadge.textContent = str.label;
            meterBadge.style.color = str.color;
            meterBadge.style.backgroundColor = str.bgColor;
        }

        // Update chips
        const checkIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
        const xIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        container.querySelectorAll<HTMLElement>('.p-password-chip').forEach(chip => {
            const rule = chip.getAttribute('data-rule') as keyof typeof r;
            const isMet = r[rule];
            chip.classList.toggle('is-met', isMet);
            const text = chip.textContent?.trim().replace(/^[✔✕]\s*/, '') || '';
            chip.innerHTML = `${isMet ? checkIcon : xIcon} ${text}`;
        });

        // Update list items
        const listCheckIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
        const listXIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        container.querySelectorAll<HTMLElement>('.p-password-list-item').forEach(item => {
            const rule = item.getAttribute('data-rule') as keyof typeof r;
            const isMet = r[rule];
            item.classList.toggle('is-met', isMet);
            const text = item.textContent?.trim().replace(/^[✔✕]\s*/, '') || '';
            item.innerHTML = `${isMet ? listCheckIcon : listXIcon} ${text}`;
        });

        // Update popover header bar & badge
        const popoverBar = container.querySelector<HTMLElement>('.p-password-popover-bar');
        const popoverBadge = container.querySelector<HTMLElement>('.p-password-popover-badge');
        if (popoverBar && popoverBadge) {
            popoverBar.style.width = str.width;
            popoverBar.style.backgroundColor = str.color;
            popoverBadge.textContent = str.label;
            popoverBadge.style.color = str.color;
            popoverBadge.style.backgroundColor = str.bgColor;
        }
    }

    function bindEvents() {
        const inputEl = container.querySelector<HTMLInputElement>('.p-password-input')!;
        const toggleBtn = container.querySelector<HTMLButtonElement>('.p-password-toggle-btn');
        const clearBtn = container.querySelector<HTMLButtonElement>('.p-password-clear-btn');
        const popoverEl = container.querySelector<HTMLElement>('.p-password-popover');

        const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;

        // Input typing
        inputEl.addEventListener('input', () => {
            currentVal = inputEl.value;
            updateVisuals();
            syncTargetInput();
        });

        // Popover focus & blur handling
        if (popoverEl) {
            inputEl.addEventListener('focus', () => {
                popoverEl.style.display = 'flex';
                updateVisuals();
            });

            document.addEventListener('click', (e) => {
                if (!container.contains(e.target as Node)) {
                    popoverEl.style.display = 'none';
                }
            });

            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    popoverEl.style.display = 'none';
                }
            });
        }

        // Toggle mask
        toggleBtn?.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        toggleBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            isMasked = !isMasked;
            inputEl.type = isMasked ? 'password' : 'text';
            toggleBtn.innerHTML = isMasked ? eyeIcon : eyeOffIcon;
            inputEl.focus();
        });

        // Clear action
        clearBtn?.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        clearBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            currentVal = '';
            inputEl.value = '';
            updateVisuals();
            syncTargetInput();
            inputEl.focus();
        });
    }

    function syncTargetInput() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = currentVal;
        }

        container.dispatchEvent(new CustomEvent('password:change', {
            bubbles: true,
            detail: {
                value: currentVal,
                strength: calculateStrength(currentVal).label,
                rules: checkRules(currentVal)
            }
        }));
    }

    render();
    updateVisuals();
    syncTargetInput();
}

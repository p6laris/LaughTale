import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/sidebar.ts
var SIDEBAR_CSS = `
/* ==========================================================================
   1. PrimeVue 4 Aura Compound Sidebar Layout & Components (Silky Smooth 60fps)
   ========================================================================== */
.p-sidebar-app-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 270px;
    min-width: 270px;
    background: var(--p-surface-0, #ffffff);
    border-right: 1px solid var(--p-border-color, #e2e8f0);
    position: sticky;
    top: 0;
    left: 0;
    transition: width 280ms cubic-bezier(0.16, 1, 0.3, 1), min-width 280ms cubic-bezier(0.16, 1, 0.3, 1);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    z-index: 40;
    overflow: hidden;
    will-change: width, min-width;
}

.p-sidebar-app-shell.p-collapsed {
    width: 64px;
    min-width: 64px;
}

.p-sidebar-header-dock {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    height: 60px;
    box-sizing: border-box;
    flex-shrink: 0;
    transition: padding 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-header-dock {
    padding: 0.85rem 0.5rem;
    justify-content: center;
}

.p-sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    text-decoration: none;
    color: var(--p-text-color, #0f172a);
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-brand {
    justify-content: center;
    width: auto;
}

.p-sidebar-brand-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--p-primary-600, #10b981), #047857);
    color: #ffffff;
    flex-shrink: 0;
    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-brand-logo:hover {
    transform: scale(1.05);
}

.p-sidebar-brand-text {
    font-size: 0.9375rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--p-text-color, #0f172a);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 1;
    max-width: 200px;
    transform: translateX(0);
    transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1), max-width 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-brand-text {
    opacity: 0;
    max-width: 0;
    transform: translateX(-10px);
    pointer-events: none;
}

/* Search Dock Smooth Collapse */
.p-sidebar-search-dock {
    padding: 0.65rem 0.85rem 0.35rem;
    flex-shrink: 0;
    max-height: 56px;
    opacity: 1;
    overflow: hidden;
    transition: max-height 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease, padding 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-search-dock {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    pointer-events: none;
}

.p-sidebar-search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--p-surface-50, #f8fafc);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    padding: 0.35rem 0.65rem;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.p-sidebar-search-box:focus-within {
    border-color: var(--p-primary-500, #10b981);
    background: var(--p-surface-0, #ffffff);
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981);
}

.p-sidebar-search-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.8125rem;
    color: var(--p-text-color, #0f172a);
    font-family: inherit;
}

.p-sidebar-content-dock {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0.65rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface-300) transparent;
    transition: padding 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-content-dock {
    padding: 0.5rem 0.35rem;
    align-items: center;
}

.p-sidebar-content-dock::-webkit-scrollbar {
    width: 4px;
}
.p-sidebar-content-dock::-webkit-scrollbar-thumb {
    background: var(--p-surface-300);
    border-radius: 4px;
}

.p-sidebar-group {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    width: 100%;
}

.p-sidebar-group-header-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.4rem 0.5rem;
    background: transparent;
    border: none;
    color: var(--p-surface-500, #64748b);
    font-size: 0.725rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    border-radius: var(--p-border-radius, 6px);
    transition: background-color 0.15s ease, color 0.15s ease, padding 280ms cubic-bezier(0.16, 1, 0.3, 1);
    text-align: left;
    box-sizing: border-box;
    overflow: hidden;
}

.p-sidebar-group-header-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-content-dock {
    padding: 0.5rem 0 !important;
    align-items: center !important;
    width: 64px !important;
    box-sizing: border-box !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-group {
    align-items: center !important;
    width: 100% !important;
    margin: 0 auto !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-group-header-btn {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 44px !important;
    height: 44px !important;
    margin: 0.15rem auto !important;
    padding: 0 !important;
    border-radius: var(--p-border-radius, 8px) !important;
    box-sizing: border-box !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-group-header-btn > div {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    gap: 0 !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-group-header-btn span.p-sidebar-menu-button-icon {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 22px !important;
    height: 22px !important;
    margin: 0 auto !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-menu {
    align-items: center !important;
    width: 100% !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-menu-item {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-menu-button {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 44px !important;
    height: 44px !important;
    margin: 0.1rem auto !important;
    padding: 0 !important;
    gap: 0 !important;
    border-radius: var(--p-border-radius, 8px) !important;
    box-sizing: border-box !important;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-menu-button span.p-sidebar-menu-button-icon {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 22px !important;
    height: 22px !important;
    margin: 0 auto !important;
}

.p-sidebar-group-header-label {
    opacity: 1;
    max-width: 200px;
    transform: translateX(0);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1), max-width 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-group-header-label {
    opacity: 0;
    max-width: 0;
    transform: translateX(-10px);
    pointer-events: none;
}

.p-sidebar-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    width: 100%;
}

.p-sidebar-menu-item {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
}

.p-sidebar-menu-button {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.45rem 0.65rem;
    border-radius: var(--p-border-radius, 6px);
    color: var(--p-sidebar-menu-button-color, var(--p-text-color, #0f172a));
    text-decoration: none;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: background-color 0.15s ease, color 0.15s ease, padding 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 0.15s ease;
    box-sizing: border-box;
    text-align: left;
    outline: none;
    position: relative;
    overflow: hidden;
}

.p-sidebar-menu-button:hover,
.p-sidebar-menu-button.p-hover {
    background: var(--p-sidebar-menu-button-focus-background, var(--p-surface-100, #f1f5f9));
}

.p-sidebar-menu-button.p-active {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 700;
    border-color: var(--p-primary-200, #a7f3d0);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-menu-button {
    justify-content: center;
    padding: 0.5rem 0;
    gap: 0;
}

.p-sidebar-menu-button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    color: var(--p-surface-500, #64748b);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease;
}

.p-sidebar-menu-button:hover .p-sidebar-menu-button-icon {
    transform: scale(1.08);
}

.p-sidebar-menu-button.p-active .p-sidebar-menu-button-icon {
    color: var(--p-primary-600, #10b981);
}

.p-sidebar-item-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 1;
    max-width: 200px;
    transform: translateX(0);
    transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1), max-width 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-item-label {
    opacity: 0;
    max-width: 0;
    transform: translateX(-10px);
    pointer-events: none;
}

.p-sidebar-menu-badge {
    margin-left: auto;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    flex-shrink: 0;
    opacity: 1;
    transform: scale(1);
    transition: opacity 180ms ease, transform 180ms ease;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-menu-badge {
    opacity: 0;
    transform: scale(0.6);
    pointer-events: none;
}

.p-sidebar-submenu-chevron {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease;
    flex-shrink: 0;
    opacity: 1;
}

.p-sidebar-submenu-chevron.p-expanded {
    transform: rotate(180deg);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-submenu-chevron {
    opacity: 0;
    pointer-events: none;
}

/* Fluid CSS Grid Submenu Expand/Collapse Animation */
.p-sidebar-menu-sub-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;
    opacity: 0;
}

.p-sidebar-menu-sub-wrapper.p-expanded {
    grid-template-rows: 1fr;
    opacity: 1;
}

.p-sidebar-menu-sub {
    overflow: hidden;
    min-height: 0;
    list-style: none;
    margin: 0.15rem 0 0.25rem 1.15rem;
    padding: 0 0 0 0.65rem;
    border-left: 1px solid var(--p-border-color, #e2e8f0);
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-menu-sub-wrapper {
    display: none;
}

.p-sidebar-menu-sub-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.35rem 0.5rem;
    border-radius: var(--p-border-radius, 4px);
    font-size: 0.8125rem;
    color: var(--p-surface-600, #475569);
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
    border: none;
    background: transparent;
    text-align: left;
}

.p-sidebar-menu-sub-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-sidebar-menu-sub-button.p-active {
    font-weight: 700;
    color: var(--p-primary-600, #10b981);
    background: var(--p-primary-50, #ecfdf5);
}

.p-sidebar-footer-dock {
    padding: 0.65rem 0.85rem;
    border-top: 1px solid var(--p-border-color, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-sizing: border-box;
    transition: padding 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-footer-dock {
    justify-content: center;
    padding: 0.65rem 0;
}

.p-sidebar-footer-text {
    opacity: 1;
    max-width: 200px;
    transform: translateX(0);
    transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1), max-width 280ms cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    white-space: nowrap;
}

.p-sidebar-app-shell.p-collapsed .p-sidebar-footer-text {
    opacity: 0;
    max-width: 0;
    transform: translateX(-10px);
    pointer-events: none;
}

/* Dark Mode Tokens for App Shell */
.dark .p-sidebar-app-shell,
[data-theme="dark"] .p-sidebar-app-shell {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-header-dock,
[data-theme="dark"] .p-sidebar-header-dock,
.dark .p-sidebar-footer-dock,
[data-theme="dark"] .p-sidebar-footer-dock {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-search-box,
[data-theme="dark"] .p-sidebar-search-box {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-menu-button,
[data-theme="dark"] .p-sidebar-menu-button {
    color: var(--p-surface-200, #e2e8f0);
}

.dark .p-sidebar-menu-button:hover,
[data-theme="dark"] .p-sidebar-menu-button:hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sidebar-menu-button.p-active,
[data-theme="dark"] .p-sidebar-menu-button.p-active {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
    border-color: rgba(16, 185, 129, 0.3);
}

.dark .p-sidebar-menu-badge,
[data-theme="dark"] .p-sidebar-menu-badge {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-sidebar-menu-sub,
[data-theme="dark"] .p-sidebar-menu-sub {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-menu-sub-button,
[data-theme="dark"] .p-sidebar-menu-sub-button {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-sidebar-menu-sub-button:hover,
[data-theme="dark"] .p-sidebar-menu-sub-button:hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sidebar-menu-sub-button.p-active,
[data-theme="dark"] .p-sidebar-menu-sub-button.p-active {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}

/* ==========================================================================
   2. PrimeVue 4 Aura Compound Playground & Demo Layouts
   ========================================================================== */
.p-sidebar-playground-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
}

.p-sidebar-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1.25rem;
    padding: 0.85rem 1.15rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-sizing: border-box;
}

.p-sidebar-toolbar-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    position: relative;
}

.p-sidebar-toolbar-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--p-surface-600, #475569);
    letter-spacing: 0.01em;
}

.p-sb-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.45rem 0.85rem;
    min-width: 9rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-border-color, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
}

.p-sb-select-trigger:focus,
.p-sb-select-trigger.p-active {
    border-color: var(--p-primary-500, #3b82f6);
    box-shadow: 0 0 0 1px var(--p-primary-500, #3b82f6);
}

.p-sb-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.25rem;
    min-width: 100%;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    padding: 0.35rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    box-sizing: border-box;
    animation: p-sb-popup-pop 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

@keyframes p-sb-popup-pop {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(-4px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.p-sb-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.45rem 0.65rem;
    border-radius: 5px;
    font-size: 0.8125rem;
    color: var(--p-text-color, #0f172a);
    cursor: pointer;
    transition: background-color 0.12s ease;
}

.p-sb-select-option:hover {
    background: var(--p-surface-100, #f1f5f9);
}

.p-sb-select-option.p-selected {
    background: var(--p-primary-50, #eff6ff);
    color: var(--p-primary-600, #2563eb);
    font-weight: 600;
}

.p-sb-segmented {
    display: inline-flex;
    background: var(--p-surface-100, #f1f5f9);
    padding: 2px;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-border-color, #cbd5e1);
    gap: 2px;
}

.p-sb-seg-btn {
    padding: 0.35rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border: none;
    background: transparent;
    color: var(--p-surface-600, #475569);
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.p-sb-seg-btn.p-active {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.p-sb-switch-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    padding-bottom: 0.25rem;
}

.p-sb-switch {
    width: 2.5rem;
    height: 1.35rem;
    background: var(--p-surface-300, #cbd5e1);
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.2s ease;
    cursor: pointer;
    flex-shrink: 0;
}

.p-sb-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.1rem;
    height: 1.1rem;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sb-switch.p-checked {
    background: var(--p-primary-600, #2563eb);
}

.p-sb-switch.p-checked::after {
    transform: translateX(1.15rem);
}

.p-sidebar-layout {
    display: flex;
    position: relative;
    width: 100%;
    min-height: 32rem;
    height: 32rem;
    background: var(--p-sidebar-layout-background, var(--p-surface-0, #ffffff));
    overflow: hidden;
    box-sizing: border-box;
    font-family: inherit;
    border-radius: var(--p-border-radius, 8px);
    border: 1px solid var(--p-border-color, #e2e8f0);
}

.p-sidebar-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 90;
    transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 100;
    box-sizing: border-box;
    transition: width 280ms cubic-bezier(0.16, 1, 0.3, 1), transform 280ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 280ms ease;
    flex-shrink: 0;
    overflow: hidden;
    will-change: width, transform;
}

.p-sidebar-aside {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}

.p-sidebar-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--p-sidebar-panel-background, var(--p-surface-0, #ffffff));
    color: var(--p-sidebar-panel-color, var(--p-text-color, #0f172a));
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
}

.p-sidebar-variant-sidebar {
    border-right: 1px solid var(--p-sidebar-border-color, var(--p-border-color, #e2e8f0));
}
.p-sidebar-side-right.p-sidebar-variant-sidebar {
    border-right: none;
    border-left: 1px solid var(--p-sidebar-border-color, var(--p-border-color, #e2e8f0));
}

.p-sidebar-variant-floating {
    padding: 0.5rem;
}
.p-sidebar-variant-floating .p-sidebar-panel {
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-sidebar-panel-floating-border-radius, 10px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

.p-sidebar-variant-inset {
    background: var(--p-surface-50, #f8fafc);
    padding: 0.5rem;
}
.p-sidebar-variant-inset .p-sidebar-panel {
    background: transparent;
}

.p-sidebar.p-sidebar-overlay {
    position: absolute !important;
    top: 0;
    bottom: 0;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    z-index: 100;
}
.p-sidebar-side-left.p-sidebar-overlay {
    left: 0;
}
.p-sidebar-side-right.p-sidebar-overlay {
    right: 0;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed {
    width: 3.5rem !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-item-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-group-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-badge,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-submenu-chevron,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-header-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-footer-label {
    opacity: 0;
    transform: translateX(-6px);
    pointer-events: none;
    display: none;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-sub-wrapper,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-action {
    display: none !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-button {
    justify-content: center !important;
    padding: 0.5rem 0 !important;
}

.p-sidebar-collapsible-offcanvas.p-sidebar-collapsed {
    width: 0 !important;
    transform: translateX(-100%);
}
.p-sidebar-side-right.p-sidebar-collapsible-offcanvas.p-sidebar-collapsed {
    transform: translateX(100%);
}

.p-sidebar-header {
    padding: var(--p-sidebar-header-padding, 0.65rem 0.75rem);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    box-sizing: border-box;
}

.p-sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.35rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface-300) transparent;
}

.p-sidebar-content::-webkit-scrollbar {
    width: 4px;
}
.p-sidebar-content::-webkit-scrollbar-thumb {
    background: var(--p-surface-300);
    border-radius: 4px;
}

.p-sidebar-footer {
    padding: var(--p-sidebar-footer-padding, 0.65rem 0.75rem);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    box-sizing: border-box;
}

.p-sidebar-group-label {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--p-sidebar-group-label-color, var(--p-surface-400, #94a3b8));
    padding: 0.25rem 0.5rem 0.15rem;
    user-select: none;
    letter-spacing: 0.02em;
}

.p-sidebar-menu-action {
    position: absolute;
    right: 0.35rem;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 4px;
    color: var(--p-surface-500, #64748b);
    cursor: pointer;
    background: var(--p-surface-200, #e2e8f0);
    border: none;
    transition: background-color 0.12s ease, color 0.12s ease, transform 0.12s ease;
    z-index: 10;
}

.p-sidebar-menu-item:hover .p-sidebar-menu-action {
    display: inline-flex;
}

.p-sidebar-menu-action:hover {
    background: #fee2e2;
    color: #dc2626;
    transform: translateY(-50%) scale(1.08);
}

.p-sidebar-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    background: var(--p-surface-50, #f8fafc);
    overflow: hidden;
    position: relative;
}

.p-sidebar-main-header {
    height: 3rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1rem;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    flex-shrink: 0;
}

.p-sidebar-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-border-color, #cbd5e1);
    background: transparent;
    color: var(--p-surface-600, #475569);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.12s ease;
}

.p-sidebar-trigger:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-sidebar-trigger:active {
    transform: scale(0.94);
}

.p-sb-popup-menu {
    position: absolute;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05);
    padding: 0.35rem;
    z-index: 1000;
    min-width: 13rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    animation: p-sb-popup-pop 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

.p-sb-popup-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    border-radius: 6px;
    font-size: 0.8125rem;
    color: var(--p-text-color, #0f172a);
    cursor: pointer;
    transition: background-color 0.12s ease;
}

.p-sb-popup-item:hover {
    background: var(--p-surface-100, #f1f5f9);
}

/* Chat Application Styling */
.p-sb-chat-conversation {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: var(--p-surface-0, #ffffff);
}

.p-sb-chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.p-sb-msg-user {
    display: flex;
    align-self: flex-end;
    max-width: 80%;
    background: var(--p-surface-100, #f1f5f9);
    padding: 0.75rem 1rem;
    border-radius: 16px 16px 4px 16px;
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    line-height: 1.45;
}

.p-sb-msg-ai {
    display: flex;
    gap: 0.85rem;
    max-width: 90%;
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    line-height: 1.5;
}

.p-sb-ai-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: #10a37f;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.p-sb-code-block {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-100, #f1f5f9);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.775rem;
    line-height: 1.5;
    margin-top: 0.5rem;
    overflow-x: auto;
}

.p-sb-chat-input-container {
    padding: 0.75rem 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: var(--p-surface-0, #ffffff);
}

.p-sb-chat-input-pill {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    background: var(--p-surface-50, #f8fafc);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 9999px;
    padding: 0.5rem 0.85rem 0.5rem 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.p-sb-chat-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
}

.p-sb-chat-send-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #ffffff);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.12s ease, opacity 0.12s ease;
}

.p-sb-chat-send-btn:hover {
    opacity: 0.9;
    transform: scale(1.05);
}
`;
function SidebarIsland(container, props) {
  injectIslandStyle("sidebar", SIDEBAR_CSS);
  const hasAppItems = Array.isArray(props.items) && props.items.length > 0 && !props.groups;
  if (hasAppItems) {
    renderAppNavigationSidebar(container, props);
  } else {
    renderCompoundSidebar(container, props);
  }
}
function renderAppNavigationSidebar(container, props) {
  let isCollapsed = props.collapsed || false;
  let searchQuery = "";
  const items = props.items || [];
  const title = props.title || "SoftMax Aura";
  const searchable = props.searchable !== false;
  const expandedMap = {};
  function initExpanded(itemList) {
    itemList.forEach((item) => {
      const label = item.label || item.Label || "";
      const isExpanded = item.expanded !== false && item.Expanded !== false;
      if (label && expandedMap[label] === void 0) {
        expandedMap[label] = isExpanded;
      }
      const children = item.items || item.Items;
      if (Array.isArray(children)) {
        initExpanded(children);
      }
    });
  }
  initExpanded(items);
  function getIconSvg(iconName) {
    if (!iconName) return "";
    if (iconName.startsWith("<svg")) return iconName;
    if (LucideIcons[iconName]) return LucideIcons[iconName];
    return "";
  }
  function renderNode(item, level = 0) {
    const label = item.label || item.Label || item.title || item.Title || "";
    const url = item.url || item.Url || "#";
    const icon = item.icon || item.Icon || "";
    const active = item.active || item.Active || false;
    const badge = item.badge || item.Badge || "";
    const children = item.items || item.Items;
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isExpanded = expandedMap[label] ?? true;
    const iconSvg = getIconSvg(icon);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSelf = label.toLowerCase().includes(q);
      const matchesChild = hasChildren && children.some((c) => (c.label || c.Label || "").toLowerCase().includes(q));
      if (!matchesSelf && !matchesChild) return "";
    }
    if (hasChildren) {
      const childrenHtml = children.map((child) => renderNode(child, level + 1)).join("");
      return `
                <div class="p-sidebar-group" data-label="${label}">
                    <button type="button" class="p-sidebar-group-header-btn" data-group-toggle="${label}" title="${label}">
                        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
                            ${iconSvg ? `<span class="p-sidebar-menu-button-icon" style="color: var(--p-primary-600);">${iconSvg}</span>` : ""}
                            <span class="p-sidebar-group-header-label">${label}</span>
                        </div>
                        <svg class="p-sidebar-submenu-chevron ${isExpanded ? "p-expanded" : ""}" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <div class="p-sidebar-menu-sub-wrapper ${isExpanded ? "p-expanded" : ""}">
                        <ul class="p-sidebar-menu-sub" style="margin-left: 0.85rem;">
                            ${childrenHtml}
                        </ul>
                    </div>
                </div>
            `;
    }
    return `
            <li class="p-sidebar-menu-item">
                <a href="${url}" class="p-sidebar-menu-button ${active ? "p-active" : ""}" data-sidebar-link="${url}" title="${label}">
                    ${iconSvg ? `<span class="p-sidebar-menu-button-icon">${iconSvg}</span>` : ""}
                    <span class="p-sidebar-item-label">${label}</span>
                    ${badge ? `<span class="p-sidebar-menu-badge">${badge}</span>` : ""}
                </a>
            </li>
        `;
  }
  function toggleCollapse() {
    isCollapsed = !isCollapsed;
    const shell = container.querySelector(".p-sidebar-app-shell");
    if (shell) {
      shell.classList.toggle("p-collapsed", isCollapsed);
    }
  }
  function render() {
    const searchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
    container.innerHTML = `
            <aside class="p-sidebar-app-shell ${isCollapsed ? "p-collapsed" : ""}" data-app-sidebar-root>
                <!-- Header Dock -->
                <div class="p-sidebar-header-dock">
                    <a href="/" class="p-sidebar-brand" title="${title}">
                        <div class="p-sidebar-brand-logo">
                            ${LucideIcons.layers || '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>'}
                        </div>
                        <span class="p-sidebar-brand-text">${title}</span>
                    </a>
                </div>

                <!-- Search Input with Smooth Height Transition -->
                ${searchable ? `
                    <div class="p-sidebar-search-dock">
                        <div class="p-sidebar-search-box">
                            <span style="color: var(--p-surface-400); display: flex; align-items: center;">${searchIconSvg}</span>
                            <input type="text" class="p-sidebar-search-input" placeholder="Search navigation..." value="${searchQuery}" />
                        </div>
                    </div>
                ` : ""}

                <!-- Navigation Groups Content -->
                <div class="p-sidebar-content-dock">
                    ${items.map((item) => renderNode(item)).join("")}
                </div>

                <!-- Footer Dock -->
                <div class="p-sidebar-footer-dock">
                    <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                        <div style="width: 1.5rem; height: 1.5rem; border-radius: 9999px; background: var(--p-surface-200); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: var(--p-surface-700); flex-shrink: 0;">LT</div>
                        <span class="p-sidebar-footer-text" style="font-size: 0.775rem; font-weight: 600; color: var(--p-text-muted); white-space: nowrap;">SoftMax LaughTale</span>
                    </div>
                    <span class="p-sidebar-footer-text aura-tag tag-emerald" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">v3.0</span>
                </div>
            </aside>
        `;
    bindEvents();
  }
  function bindEvents() {
    const onGlobalToggle = () => {
      toggleCollapse();
    };
    document.removeEventListener("app-sidebar:toggle", window.__appSidebarHandler);
    window.__appSidebarHandler = onGlobalToggle;
    document.addEventListener("app-sidebar:toggle", onGlobalToggle);
    const searchInput = container.querySelector(".p-sidebar-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        const contentEl = container.querySelector(".p-sidebar-content-dock");
        if (contentEl) {
          contentEl.innerHTML = items.map((item) => renderNode(item)).join("");
          bindGroupToggles();
          bindLinkClicks();
        }
      });
    }
    bindGroupToggles();
    bindLinkClicks();
  }
  function bindGroupToggles() {
    container.querySelectorAll("[data-group-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const groupLabel = btn.getAttribute("data-group-toggle");
        if (groupLabel) {
          expandedMap[groupLabel] = !expandedMap[groupLabel];
          const isExp = expandedMap[groupLabel];
          const groupEl = btn.closest(".p-sidebar-group");
          if (groupEl) {
            const wrapper = groupEl.querySelector(".p-sidebar-menu-sub-wrapper");
            const chevron = btn.querySelector(".p-sidebar-submenu-chevron");
            if (wrapper) {
              wrapper.classList.toggle("p-expanded", isExp);
            }
            if (chevron) {
              chevron.classList.toggle("p-expanded", isExp);
            }
          }
        }
      });
    });
  }
  function bindLinkClicks() {
    container.querySelectorAll("a[data-sidebar-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";
        const hashIndex = href.indexOf("#");
        if (hashIndex >= 0 && (href.startsWith("#") || href.startsWith(window.location.pathname))) {
          const targetId = href.substring(hashIndex + 1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            container.querySelectorAll(".p-sidebar-menu-button").forEach((el) => el.classList.remove("p-active"));
            link.classList.add("p-active");
            window.history.pushState(null, "", href);
          }
        }
      });
    });
  }
  render();
}
function renderCompoundSidebar(container, props) {
  const demoType = props.demoType || props.DemoType || "variants";
  const showControls = props.showControls !== false && demoType === "variants";
  let variant = props.variant || props.Variant || "sidebar";
  let collapsible = props.collapsible || props.Collapsible || "icon";
  let side = props.side || props.Side || "left";
  let overlay = props.overlay || props.Overlay || false;
  let openOnHover = props.openOnHover || props.OpenOnHover || false;
  let backdrop = props.backdrop || props.Backdrop || false;
  let isOpen = props.open !== void 0 ? props.open : props.Open !== void 0 ? props.Open : true;
  let width = props.width || props.Width || (demoType === "chat" ? "18rem" : "16rem");
  let isAiOpen = true;
  let openSelectDropdown = null;
  let activeCompany = { name: "Acme Inc", logo: "A", color: "linear-gradient(135deg, #8b5cf6, #4f46e5)" };
  let showCompanyPopup = false;
  let showUserPopup = false;
  const expandedSubmenus = {};
  function getIconSvg(iconName) {
    if (!iconName) return "";
    if (iconName.startsWith("<svg")) return iconName;
    if (LucideIcons[iconName]) return LucideIcons[iconName];
    return "";
  }
  const defaultNavGroups = [
    {
      label: "Navigation",
      items: [
        { icon: "home", label: "Home", isActive: true },
        { icon: "mail", label: "Inbox", badge: "12" },
        { icon: "search", label: "Search" },
        { icon: "bell", label: "Notifications", badge: "3" }
      ]
    },
    {
      label: "Projects",
      items: [
        {
          icon: "barChart3",
          label: "Analytics",
          defaultOpen: true,
          subItems: [
            { label: "Overview", isActive: true },
            { label: "Reports" },
            { label: "Real-time" }
          ]
        },
        { icon: "users", label: "Team" },
        { icon: "calendar", label: "Calendar" },
        {
          icon: "folder",
          label: "Documents",
          subItems: [
            { label: "Shared" },
            { label: "Private" },
            { label: "Archived" }
          ]
        }
      ]
    },
    {
      label: "Billing",
      items: [
        { icon: "creditCard", label: "Payments" },
        { icon: "shoppingCart", label: "Orders" },
        { icon: "star", label: "Subscriptions" }
      ]
    }
  ];
  const groups = props.groups || defaultNavGroups;
  function renderGroupsHtml(groupList) {
    return groupList.map((g, gIdx) => {
      const itemsHtml = g.items.map((it, iIdx) => {
        const subKey = `${gIdx}_${iIdx}`;
        if (it.defaultOpen && expandedSubmenus[subKey] === void 0) {
          expandedSubmenus[subKey] = true;
        }
        const isSubExpanded = !!expandedSubmenus[subKey];
        const hasSubs = Array.isArray(it.subItems) && it.subItems.length > 0;
        const iconSvg = demoType === "chat" ? "" : getIconSvg(it.icon);
        let subTreeHtml = "";
        if (hasSubs) {
          const subListHtml = it.subItems.map((sub) => `
                        <li class="p-sidebar-menu-sub-item">
                            <button type="button" class="p-sidebar-menu-sub-button ${sub.isActive ? "p-active" : ""}">
                                <span>${sub.label}</span>
                            </button>
                        </li>
                    `).join("");
          subTreeHtml = `
                        <div class="p-sidebar-menu-sub-wrapper ${isSubExpanded ? "p-expanded" : ""}">
                            <ul class="p-sidebar-menu-sub">${subListHtml}</ul>
                        </div>
                    `;
        }
        const chevronSvg = `<svg class="p-sidebar-submenu-chevron ${isSubExpanded ? "p-expanded" : ""}" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
        const ellipsisSvg = `<svg class="p-sidebar-menu-action" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
        const trashSvg = `<button type="button" class="p-sidebar-menu-action" title="Delete conversation" style="border:none;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>`;
        const actionButton = demoType === "chat" ? trashSvg : it.badge === void 0 ? ellipsisSvg : "";
        return `
                    <li class="p-sidebar-menu-item" data-subkey="${subKey}">
                        <button type="button" class="p-sidebar-menu-button ${it.isActive ? "p-active" : ""}" data-has-subs="${hasSubs}">
                            ${iconSvg ? `<span class="p-sidebar-menu-button-icon">${iconSvg}</span>` : ""}
                            <span class="p-sidebar-item-label">${it.label}</span>
                            ${it.badge !== void 0 ? `<span class="p-sidebar-menu-badge">${it.badge}</span>` : ""}
                            ${hasSubs ? chevronSvg : actionButton}
                        </button>
                        ${subTreeHtml}
                    </li>
                `;
      }).join("");
      return `
                <div class="p-sidebar-group">
                    <div class="p-sidebar-group-label">${g.label}</div>
                    <ul class="p-sidebar-menu">${itemsHtml}</ul>
                </div>
            `;
    }).join("");
  }
  function renderControlsHtml() {
    const variantLabel = variant === "sidebar" ? "Sidebar" : variant === "floating" ? "Floating" : "Inset";
    const collapsibleLabel = collapsible === "icon" ? "Icon" : collapsible === "offcanvas" ? "Offcanvas" : "None";
    return `
            <div class="p-sidebar-toolbar">
                <div class="p-sidebar-toolbar-field">
                    <label class="p-sidebar-toolbar-label">Variant</label>
                    <div class="p-sb-select-trigger ${openSelectDropdown === "variant" ? "p-active" : ""}" data-select-trigger="variant" tabindex="0">
                        <span>${variantLabel}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                    ${openSelectDropdown === "variant" ? `
                        <div class="p-sb-select-dropdown">
                            <div class="p-sb-select-option ${variant === "sidebar" ? "p-selected" : ""}" data-select-option="variant:sidebar">
                                <span>Sidebar</span>
                                ${variant === "sidebar" ? '<span style="font-weight:700;">&#10003;</span>' : ""}
                            </div>
                            <div class="p-sb-select-option ${variant === "floating" ? "p-selected" : ""}" data-select-option="variant:floating">
                                <span>Floating</span>
                                ${variant === "floating" ? '<span style="font-weight:700;">&#10003;</span>' : ""}
                            </div>
                            <div class="p-sb-select-option ${variant === "inset" ? "p-selected" : ""}" data-select-option="variant:inset">
                                <span>Inset</span>
                                ${variant === "inset" ? '<span style="font-weight:700;">&#10003;</span>' : ""}
                            </div>
                        </div>
                    ` : ""}
                </div>

                <div class="p-sidebar-toolbar-field">
                    <label class="p-sidebar-toolbar-label">Collapsible</label>
                    <div class="p-sb-select-trigger ${openSelectDropdown === "collapsible" ? "p-active" : ""}" data-select-trigger="collapsible" tabindex="0">
                        <span>${collapsibleLabel}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                    ${openSelectDropdown === "collapsible" ? `
                        <div class="p-sb-select-dropdown">
                            <div class="p-sb-select-option ${collapsible === "icon" ? "p-selected" : ""}" data-select-option="collapsible:icon">
                                <span>Icon</span>
                                ${collapsible === "icon" ? '<span style="font-weight:700;">&#10003;</span>' : ""}
                            </div>
                            <div class="p-sb-select-option ${collapsible === "offcanvas" ? "p-selected" : ""}" data-select-option="collapsible:offcanvas">
                                <span>Offcanvas</span>
                                ${collapsible === "offcanvas" ? '<span style="font-weight:700;">&#10003;</span>' : ""}
                            </div>
                            <div class="p-sb-select-option ${collapsible === "none" ? "p-selected" : ""}" data-select-option="collapsible:none">
                                <span>None</span>
                                ${collapsible === "none" ? '<span style="font-weight:700;">&#10003;</span>' : ""}
                            </div>
                        </div>
                    ` : ""}
                </div>

                <div class="p-sidebar-toolbar-field">
                    <label class="p-sidebar-toolbar-label">Side</label>
                    <div class="p-sb-segmented">
                        <button type="button" class="p-sb-seg-btn ${side === "left" ? "p-active" : ""}" data-sb-side="left">Left</button>
                        <button type="button" class="p-sb-seg-btn ${side === "right" ? "p-active" : ""}" data-sb-side="right">Right</button>
                    </div>
                </div>

                <div class="p-sidebar-toolbar-field">
                    <label class="p-sidebar-toolbar-label">Overlay</label>
                    <div class="p-sb-switch-container" data-sb-toggle="overlay">
                        <div class="p-sb-switch ${overlay ? "p-checked" : ""}"></div>
                    </div>
                </div>

                <div class="p-sidebar-toolbar-field">
                    <label class="p-sidebar-toolbar-label">Open on Hover</label>
                    <div class="p-sb-switch-container" data-sb-toggle="hover">
                        <div class="p-sb-switch ${openOnHover ? "p-checked" : ""}"></div>
                    </div>
                </div>

                <div class="p-sidebar-toolbar-field">
                    <label class="p-sidebar-toolbar-label">Backdrop</label>
                    <div class="p-sb-switch-container" data-sb-toggle="backdrop">
                        <div class="p-sb-switch ${backdrop ? "p-checked" : ""}"></div>
                    </div>
                </div>
            </div>
        `;
  }
  function renderHeaderContent() {
    if (demoType === "chat") {
      const chatGptSparkleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
      const newChatPenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>`;
      return `
                <ul class="p-sidebar-menu">
                    <li class="p-sidebar-menu-item">
                        <button type="button" class="p-sidebar-menu-button" style="padding: 0.35rem 0.5rem;">
                            <div style="display:flex; width:1.6rem; height:1.6rem; border-radius:9999px; background: #10a37f; color:#ffffff; align-items:center; justify-content:center; flex-shrink:0;">
                                ${chatGptSparkleIcon}
                            </div>
                            <span class="p-sidebar-item-label p-sidebar-header-label" style="font-weight: 700; font-size: 0.9rem;">ChatGPT</span>
                            <svg class="p-sidebar-submenu-chevron" style="margin-left: auto;" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                    </li>
                </ul>
                <ul class="p-sidebar-menu" style="margin-top: 0.45rem; border-bottom: 1px solid var(--p-border-color); padding-bottom: 0.45rem;">
                    <li class="p-sidebar-menu-item">
                        <button type="button" class="p-sidebar-menu-button">
                            <span class="p-sidebar-menu-button-icon">${LucideIcons.search}</span>
                            <span class="p-sidebar-item-label">Search</span>
                        </button>
                    </li>
                    <li class="p-sidebar-menu-item">
                        <button type="button" class="p-sidebar-menu-button">
                            <span class="p-sidebar-menu-button-icon">${newChatPenIcon}</span>
                            <span class="p-sidebar-item-label">New chat</span>
                        </button>
                    </li>
                    <li class="p-sidebar-menu-item">
                        <button type="button" class="p-sidebar-menu-button">
                            <span class="p-sidebar-menu-button-icon">${LucideIcons.globe}</span>
                            <span class="p-sidebar-item-label">Browse web</span>
                        </button>
                    </li>
                </ul>
            `;
    }
    if (demoType === "menu") {
      return `
                <div style="position: relative;">
                    <ul class="p-sidebar-menu">
                        <li class="p-sidebar-menu-item">
                            <button type="button" class="p-sidebar-menu-button" data-company-trigger style="padding: 0.35rem 0.5rem;">
                                <div style="display:flex; width:1.5rem; height:1.5rem; border-radius:6px; background: ${activeCompany.color}; color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.75rem; flex-shrink:0;">${activeCompany.logo}</div>
                                <span class="p-sidebar-item-label p-sidebar-header-label" style="font-weight: 700; font-size: 0.875rem;">${activeCompany.name}</span>
                                <svg class="p-sidebar-submenu-chevron" style="margin-left: auto;" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                        </li>
                    </ul>
                    ${showCompanyPopup ? `
                        <div class="p-sb-popup-menu" style="top: 100%; left: 0; margin-top: 0.25rem;">
                            <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-text-muted); padding: 0.25rem 0.5rem;">Companies</div>
                            <div class="p-sb-popup-item" data-select-company="Acme Inc|A|linear-gradient(135deg, #8b5cf6, #4f46e5)">
                                <div style="display:flex; width:1.25rem; height:1.25rem; border-radius:4px; background: linear-gradient(135deg, #8b5cf6, #4f46e5); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.65rem;">A</div>
                                <span>Acme Inc</span>
                                ${activeCompany.name === "Acme Inc" ? '<span style="margin-left:auto; color:var(--p-primary-600); font-weight:700;">&#10003;</span>' : ""}
                            </div>
                            <div class="p-sb-popup-item" data-select-company="Globex Corp|G|linear-gradient(135deg, #10b981, #0d9488)">
                                <div style="display:flex; width:1.25rem; height:1.25rem; border-radius:4px; background: linear-gradient(135deg, #10b981, #0d9488); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.65rem;">G</div>
                                <span>Globex Corp</span>
                                ${activeCompany.name === "Globex Corp" ? '<span style="margin-left:auto; color:var(--p-primary-600); font-weight:700;">&#10003;</span>' : ""}
                            </div>
                            <div class="p-sb-popup-item" data-select-company="Initech|I|linear-gradient(135deg, #f97316, #dc2626)">
                                <div style="display:flex; width:1.25rem; height:1.25rem; border-radius:4px; background: linear-gradient(135deg, #f97316, #dc2626); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.65rem;">I</div>
                                <span>Initech</span>
                                ${activeCompany.name === "Initech" ? '<span style="margin-left:auto; color:var(--p-primary-600); font-weight:700;">&#10003;</span>' : ""}
                            </div>
                            <div style="border-top: 1px solid var(--p-border-color); margin: 0.25rem 0;"></div>
                            <div class="p-sb-popup-item" style="color: var(--p-text-muted);">
                                <span class="p-sidebar-menu-button-icon">${LucideIcons.plus}</span>
                                <span>Add company</span>
                            </div>
                        </div>
                    ` : ""}
                </div>
            `;
    }
    if (demoType === "nested") {
      return `
                <ul class="p-sidebar-menu">
                    <li class="p-sidebar-menu-item">
                        <button type="button" class="p-sidebar-menu-button" style="padding: 0.35rem 0.5rem;">
                            <div style="display:flex; width:1.5rem; height:1.5rem; border-radius:6px; background: linear-gradient(135deg, #10b981, #0d9488); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.75rem; flex-shrink:0;">F</div>
                            <span class="p-sidebar-item-label p-sidebar-header-label" style="font-weight: 700; font-size: 0.875rem;">File Manager</span>
                        </button>
                    </li>
                </ul>
            `;
    }
    return `
            <ul class="p-sidebar-menu">
                <li class="p-sidebar-menu-item">
                    <button type="button" class="p-sidebar-menu-button" style="padding: 0.35rem 0.5rem;">
                        <div style="display:flex; width:1.5rem; height:1.5rem; border-radius:6px; background: linear-gradient(135deg, #8b5cf6, #4f46e5); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.75rem; flex-shrink:0;">A</div>
                        <span class="p-sidebar-item-label p-sidebar-header-label" style="font-weight: 700; font-size: 0.875rem;">Acme Inc</span>
                    </button>
                </li>
            </ul>
        `;
  }
  function renderFooterContent() {
    if (demoType === "menu") {
      return `
                <div style="position: relative;">
                    <ul class="p-sidebar-menu">
                        <li class="p-sidebar-menu-item">
                            <button type="button" class="p-sidebar-menu-button" data-user-trigger style="padding: 0.35rem 0.5rem;">
                                <div style="display:flex; width:1.5rem; height:1.5rem; border-radius:9999px; background: var(--p-surface-300); color:var(--p-surface-800); align-items:center; justify-content:center; font-weight:700; font-size:0.65rem; flex-shrink:0;">JD</div>
                                <span class="p-sidebar-item-label p-sidebar-footer-label" style="font-weight: 600; font-size: 0.8125rem;">John Doe</span>
                                <svg class="p-sidebar-submenu-chevron" style="margin-left: auto;" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                        </li>
                    </ul>
                    ${showUserPopup ? `
                        <div class="p-sb-popup-menu" style="bottom: 100%; left: 0; margin-bottom: 0.25rem;">
                            <div style="font-size: 0.725rem; font-weight: 600; color: var(--p-text-muted); padding: 0.25rem 0.5rem;">john@acme.com</div>
                            <div class="p-sb-popup-item">
                                <span class="p-sidebar-menu-button-icon">${LucideIcons.settings}</span>
                                <span>Settings</span>
                            </div>
                            <div class="p-sb-popup-item">
                                <span class="p-sidebar-menu-button-icon">${LucideIcons.bell}</span>
                                <span>Notifications</span>
                            </div>
                            <div style="border-top: 1px solid var(--p-border-color); margin: 0.25rem 0;"></div>
                            <div class="p-sb-popup-item" style="color: #ef4444;">
                                <span class="p-sidebar-menu-button-icon">${LucideIcons.logOut}</span>
                                <span>Sign out</span>
                            </div>
                        </div>
                    ` : ""}
                </div>
            `;
    }
    return `
            <ul class="p-sidebar-menu">
                <li class="p-sidebar-menu-item">
                    <button type="button" class="p-sidebar-menu-button" style="padding: 0.35rem 0.5rem;">
                        <div style="display:flex; width:1.5rem; height:1.5rem; border-radius:9999px; background: var(--p-surface-300, #cbd5e1); color:var(--p-surface-800, #1e293b); align-items:center; justify-content:center; font-weight:700; font-size:0.65rem; flex-shrink:0;">JD</div>
                        <span class="p-sidebar-item-label p-sidebar-footer-label" style="font-weight: 600; font-size: 0.8125rem;">John Doe</span>
                    </button>
                </li>
            </ul>
        `;
  }
  function renderMainContent() {
    const triggerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`;
    const chatIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
    if (demoType === "chat") {
      const chatGptSparkle = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
      const arrowUpSend = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`;
      const paperclipIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;
      const newChatPenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>`;
      return `
                <div class="p-sidebar-main">
                    <header class="p-sidebar-main-header" style="justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <button type="button" class="p-sidebar-trigger" data-sidebar-toggle aria-label="Toggle sidebar">
                                ${triggerIconSvg}
                            </button>
                            <div style="display: flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.6rem; border-radius: 8px; background: var(--p-surface-100); font-weight: 600; font-size: 0.8125rem; color: var(--p-text-color); cursor: pointer;">
                                <span>ChatGPT 4o</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                        <button type="button" class="p-sidebar-trigger" title="New chat">
                            ${newChatPenIcon}
                        </button>
                    </header>

                    <div class="p-sb-chat-conversation">
                        <div class="p-sb-chat-history">
                            <div class="p-sb-msg-user">
                                How do I build a collapsible compound sidebar in Vue with smooth animations?
                            </div>

                            <div class="p-sb-msg-ai">
                                <div class="p-sb-ai-avatar">${chatGptSparkle}</div>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                                    <p style="margin: 0;">You can create a compound sidebar with PrimeVue's <code>Sidebar</code> component by pairing collapsible icon modes with CSS grid height transitions:</p>
                                    <div class="p-sb-code-block">&lt;Sidebar :collapsible="'icon'" :variant="'sidebar'"&gt;
  &lt;SidebarHeader&gt;...&lt;/SidebarHeader&gt;
  &lt;SidebarContent&gt;...&lt;/SidebarContent&gt;
&lt;/Sidebar&gt;</div>
                                    <p style="margin: 0; color: var(--p-text-muted); font-size: 0.8125rem;">This keeps your application navigation compact without triggering cumulative layout shift.</p>
                                </div>
                            </div>
                        </div>

                        <div class="p-sb-chat-input-container">
                            <div class="p-sb-chat-input-pill">
                                <button type="button" style="background:transparent; border:none; color:var(--p-text-muted); cursor:pointer; display:flex; align-items:center;" title="Attach file">
                                    ${paperclipIcon}
                                </button>
                                <input type="text" class="p-sb-chat-input-field" placeholder="Message ChatGPT..." />
                                <button type="button" class="p-sb-chat-send-btn" title="Send prompt">
                                    ${arrowUpSend}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }
    if (demoType === "nested") {
      return `
                <div class="p-sidebar-main">
                    <header class="p-sidebar-main-header">
                        <button type="button" class="p-sidebar-trigger" data-sidebar-toggle aria-label="Toggle navigation">
                            ${triggerIconSvg}
                        </button>
                        <span style="font-size: 0.875rem; font-weight: 600; color: var(--p-text-color);">File Manager</span>
                    </header>
                    <div style="flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                        <h1 style="font-size: 1.35rem; font-weight: 700; color: var(--p-text-color); margin: 0;">Q1 Report</h1>
                        <p style="font-size: 0.8125rem; color: var(--p-text-muted); margin: 0;">Documents &gt; Work &gt; Projects &gt; Q1 Report</p>
                    </div>
                </div>
            `;
    }
    if (demoType === "dual") {
      return `
                <div class="p-sidebar-main">
                    <header class="p-sidebar-main-header">
                        <button type="button" class="p-sidebar-trigger" data-sidebar-toggle aria-label="Toggle navigation">
                            ${triggerIconSvg}
                        </button>
                        <span style="font-size: 0.875rem; font-weight: 600; color: var(--p-text-color);">Dashboard</span>
                        <button type="button" class="p-sidebar-trigger" data-ai-toggle style="margin-left: auto;" aria-label="Toggle AI chat panel">
                            ${chatIconSvg}
                        </button>
                    </header>
                    <div style="flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
                        <div style="height: 6rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Main Content View</div>
                        <div style="flex: 1; min-height: 8rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Analytics &amp; Data Area</div>
                    </div>
                </div>
            `;
    }
    return `
            <div class="p-sidebar-main">
                <header class="p-sidebar-main-header">
                    <button type="button" class="p-sidebar-trigger" data-sidebar-toggle aria-label="Toggle navigation">
                        ${triggerIconSvg}
                    </button>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--p-text-color);">Dashboard</span>
                    ${demoType === "responsive" ? `<span style="margin-left: auto; font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--p-surface-100); color: var(--p-text-muted);">Desktop</span>` : ""}
                </header>
                <div style="flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
                    <div style="height: 6rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Main Content View</div>
                    <div style="flex: 1; min-height: 8rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Analytics &amp; Data Area</div>
                </div>
            </div>
        `;
  }
  function updateSidebarClasses() {
    const aside = container.querySelector("[data-sidebar-root]");
    if (!aside) return;
    aside.className = [
      "p-sidebar",
      `p-sidebar-variant-${variant}`,
      `p-sidebar-collapsible-${collapsible}`,
      `p-sidebar-side-${side}`,
      overlay ? "p-sidebar-overlay" : "",
      !isOpen ? "p-sidebar-collapsed" : ""
    ].filter(Boolean).join(" ");
    const sidebarWidth = isOpen ? width : collapsible === "icon" ? "3.5rem" : "0rem";
    aside.style.width = sidebarWidth;
    const backdropEl = container.querySelector("[data-sidebar-backdrop]");
    if (backdropEl) {
      backdropEl.style.display = backdrop && isOpen ? "block" : "none";
    }
  }
  function renderComponent() {
    const sidebarClasses = [
      "p-sidebar",
      `p-sidebar-variant-${variant}`,
      `p-sidebar-collapsible-${collapsible}`,
      `p-sidebar-side-${side}`,
      overlay ? "p-sidebar-overlay" : "",
      !isOpen ? "p-sidebar-collapsed" : ""
    ].filter(Boolean).join(" ");
    const sidebarWidth = isOpen ? width : collapsible === "icon" ? "3.5rem" : "0rem";
    const sidebarHtml = `
            <aside class="${sidebarClasses}" style="width: ${sidebarWidth};" data-sidebar-root>
                <div class="p-sidebar-aside">
                    <div class="p-sidebar-panel">
                        <div class="p-sidebar-header">
                            ${renderHeaderContent()}
                        </div>
                        <div class="p-sidebar-content">
                            ${renderGroupsHtml(groups)}
                        </div>
                        <div class="p-sidebar-footer">
                            ${renderFooterContent()}
                        </div>
                    </div>
                </div>
            </aside>
        `;
    const mainHtml = renderMainContent();
    const backdropHtml = `<div class="p-sidebar-backdrop" data-sidebar-backdrop style="display: ${backdrop && isOpen ? "block" : "none"};"></div>`;
    const innerContent = side === "right" ? mainHtml + sidebarHtml : sidebarHtml + mainHtml;
    const layoutHtml = `
            <div class="p-sidebar-layout">
                ${backdropHtml}
                ${innerContent}
            </div>
        `;
    if (showControls) {
      return `
                <div class="p-sidebar-playground-wrapper">
                    ${renderControlsHtml()}
                    ${layoutHtml}
                </div>
            `;
    }
    return layoutHtml;
  }
  function wireEvents() {
    container.querySelectorAll("[data-sidebar-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        updateSidebarClasses();
      });
    });
    container.querySelectorAll("[data-sidebar-backdrop]").forEach((bd) => {
      bd.addEventListener("click", () => {
        isOpen = false;
        updateSidebarClasses();
      });
    });
    const mainEl = container.querySelector(".p-sidebar-main");
    if (mainEl) {
      mainEl.addEventListener("click", (e) => {
        if (overlay && isOpen && !e.target.closest("[data-sidebar-toggle]")) {
          isOpen = false;
          updateSidebarClasses();
        }
      });
    }
    container.querySelectorAll('.p-sidebar-menu-button[data-has-subs="true"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const li = btn.closest(".p-sidebar-menu-item");
        const subKey = li?.getAttribute("data-subkey");
        if (subKey) {
          expandedSubmenus[subKey] = !expandedSubmenus[subKey];
          const wrapper = li?.querySelector(".p-sidebar-menu-sub-wrapper");
          const chevron = li?.querySelector(".p-sidebar-submenu-chevron");
          if (wrapper) {
            wrapper.classList.toggle("p-expanded", expandedSubmenus[subKey]);
          }
          if (chevron) {
            chevron.classList.toggle("p-expanded", expandedSubmenus[subKey]);
          }
        }
      });
    });
    const compTrigger = container.querySelector("[data-company-trigger]");
    if (compTrigger) {
      compTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        showCompanyPopup = !showCompanyPopup;
        showUserPopup = false;
        render();
      });
    }
    container.querySelectorAll("[data-select-company]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const raw = item.getAttribute("data-select-company") || "";
        const parts = raw.split("|");
        if (parts.length >= 3) {
          activeCompany = { name: parts[0], logo: parts[1], color: parts[2] };
        }
        showCompanyPopup = false;
        render();
      });
    });
    const userTrigger = container.querySelector("[data-user-trigger]");
    if (userTrigger) {
      userTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        showUserPopup = !showUserPopup;
        showCompanyPopup = false;
        render();
      });
    }
    container.querySelectorAll("[data-select-trigger]").forEach((trig) => {
      trig.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = trig.getAttribute("data-select-trigger");
        openSelectDropdown = openSelectDropdown === key ? null : key;
        render();
      });
    });
    container.querySelectorAll("[data-select-option]").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        const [category, val] = (opt.getAttribute("data-select-option") || "").split(":");
        if (category === "variant") {
          variant = val;
        } else if (category === "collapsible") {
          collapsible = val;
        }
        openSelectDropdown = null;
        render();
      });
    });
    container.querySelectorAll("[data-sb-side]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        side = btn.getAttribute("data-sb-side");
        render();
      });
    });
    const overlayToggle = container.querySelector('[data-sb-toggle="overlay"]');
    if (overlayToggle) {
      overlayToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay = !overlay;
        render();
      });
    }
    const hoverToggle = container.querySelector('[data-sb-toggle="hover"]');
    if (hoverToggle) {
      hoverToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        openOnHover = !openOnHover;
        render();
      });
    }
    const backdropToggle = container.querySelector('[data-sb-toggle="backdrop"]');
    if (backdropToggle) {
      backdropToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        backdrop = !backdrop;
        render();
      });
    }
    if (openOnHover) {
      const aside = container.querySelector("[data-sidebar-root]");
      if (aside) {
        aside.addEventListener("mouseenter", () => {
          if (!isOpen) {
            isOpen = true;
            updateSidebarClasses();
          }
        });
        aside.addEventListener("mouseleave", () => {
          if (isOpen) {
            isOpen = false;
            updateSidebarClasses();
          }
        });
      }
    }
    const onDocClick = () => {
      if (openSelectDropdown || showCompanyPopup || showUserPopup) {
        openSelectDropdown = null;
        showCompanyPopup = false;
        showUserPopup = false;
        render();
      }
    };
    document.addEventListener("click", onDocClick, { once: true });
  }
  function render() {
    container.innerHTML = renderComponent();
    wireEvents();
  }
  render();
}
export {
  SidebarIsland as default
};
//# sourceMappingURL=sidebar-EN23IIAV.js.map

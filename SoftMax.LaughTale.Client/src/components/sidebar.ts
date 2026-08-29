/**
 * SoftMax.LaughTale: Enterprise Sidebar Component Suite (PrimeVue 4 Aura Design System)
 * Complete compound navigation panel system matching PrimeVue 4 Aura specifications:
 * 1. App-Level Navigation Sidebar (Showcase & Docs) powered by the 100% unified Compound Sidebar Engine
 * 2. Variants Interactive Playground with Aura custom Select, SelectButton, and ToggleSwitch controls
 * 3. With Menu (Interactive Workspace Switcher + User Profile Popup Dropdown)
 * 4. Responsive (Mobile offcanvas overlay vs Desktop icon collapsible)
 * 5. Dual Sidebar (Left Navigation + Right Claude-style AI Chat Panel)
 * 6. Nested Menu (Deep multi-level file hierarchy with CSS grid smooth expansion)
 * 7. Chat Application (ChatGPT-style history with pinned shortcuts, clean conversation groups, hover trash, and realistic conversation UI)
 */

import { SidebarItem } from '../types/models';
import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

const SIDEBAR_CSS = `
/* ==========================================================================
   PrimeVue 4 Aura Compound Sidebar Layout & Components
   ========================================================================== */

/* Main Layout Container */
.p-sidebar-layout {
    display: flex;
    position: relative;
    width: 100%;
    min-height: 32rem;
    height: 32rem;
    background: var(--p-sidebar-layout-background, var(--p-surface-0, #ffffff));
    overflow: hidden;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
    border-radius: var(--p-border-radius, 8px);
    border: 1px solid var(--p-border-color, #e2e8f0);
    isolation: isolate;
    z-index: 1;
}

.p-sidebar-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 90;
    transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Base Sidebar Element */
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
    font-family: var(--p-font-family, inherit);
}

.p-sidebar-app-dock {
    height: 100vh !important;
    position: sticky !important;
    top: 0 !important;
    left: 0 !important;
    border-radius: 0 !important;
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

/* Sidebar Variants */
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

/* Overlay Mode */
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

/* Header Dock */
.p-sidebar-header {
    padding: 0.75rem 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    box-sizing: border-box;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    min-height: 60px;
    justify-content: center;
}

/* Search Box */
.p-sidebar-search-container {
    padding: 0.5rem 0.85rem 0.25rem;
    flex-shrink: 0;
    max-height: 52px;
    opacity: 1;
    overflow: hidden;
    transition: max-height 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease, padding 260ms ease;
}

.p-sidebar-collapsed .p-sidebar-search-container {
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

/* Content Area */
.p-sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface-300) transparent;
}

.p-sidebar-collapsed .p-sidebar-content {
    padding: 0.5rem 0.35rem;
    align-items: center;
}

.p-sidebar-content::-webkit-scrollbar {
    width: 4px;
}
.p-sidebar-content::-webkit-scrollbar-thumb {
    background: var(--p-surface-300);
    border-radius: 4px;
}

/* Footer Area */
.p-sidebar-footer {
    padding: 0.65rem 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    box-sizing: border-box;
    border-top: 1px solid var(--p-border-color, #e2e8f0);
}

.p-sidebar-collapsed .p-sidebar-footer {
    padding: 0.65rem 0.35rem;
    align-items: center;
}

/* Group & Menu Items */
.p-sidebar-group {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    width: 100%;
}

.p-sidebar-group-label {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--p-sidebar-group-label-color, var(--p-surface-400, #94a3b8));
    padding: 0.25rem 0.5rem 0.15rem;
    user-select: none;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 1;
    max-width: 200px;
    transform: translateX(0);
    transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1), max-width 260ms ease;
    overflow: hidden;
    text-overflow: ellipsis;
}

.p-sidebar-collapsed .p-sidebar-group-label {
    opacity: 0;
    max-width: 0;
    transform: translateX(-8px);
    pointer-events: none;
    display: none;
}

.p-sidebar-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    width: 100%;
}

.p-sidebar-menu-item {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.p-sidebar-menu-button {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    min-height: 2.25rem;
    padding: 0.45rem 0.65rem;
    border-radius: var(--p-border-radius, 6px);
    color: var(--p-sidebar-menu-button-color, var(--p-text-color, #0f172a));
    text-decoration: none;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease, padding 260ms ease, border-color 0.12s ease;
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

.p-sidebar-menu-button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    color: var(--p-surface-500, #64748b);
    transition: transform 0.15s ease, color 0.12s ease;
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
    transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1), max-width 260ms ease;
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

.p-sidebar-submenu-chevron {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
    flex-shrink: 0;
}

.p-sidebar-submenu-chevron.p-expanded {
    transform: rotate(180deg);
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

/* Fluid CSS Grid Submenu Expand/Collapse Animation */
.p-sidebar-menu-sub-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease;
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

/* ==========================================================================
   Collapsed Icon Mode Rules (Applies to both App Shell and Demos)
   ========================================================================== */
.p-sidebar-collapsible-icon.p-sidebar-collapsed {
    width: 3.5rem !important; /* 56px compact icon dock */
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-header {
    padding: 0.75rem 0 !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-header > div {
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
    margin: 0 auto !important;
    gap: 0 !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-header a {
    margin: 0 auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-content {
    padding: 0.5rem 0 !important;
    align-items: center !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-group {
    align-items: center !important;
    width: 100% !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu {
    align-items: center !important;
    width: 100% !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-item {
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-item-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-group-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-badge,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-submenu-chevron,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-header-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-footer-label {
    opacity: 0 !important;
    max-width: 0 !important;
    transform: translateX(-8px) !important;
    pointer-events: none !important;
    display: none !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-sub-wrapper,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-action {
    display: none !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-button {
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important;
    width: 2.5rem !important;
    height: 2.5rem !important;
    margin: 0.15rem auto !important;
    border-radius: var(--p-border-radius, 8px) !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-button-icon {
    margin: 0 auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-footer {
    padding: 0.65rem 0 !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-footer > div {
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
    margin: 0 auto !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-footer > div > div {
    justify-content: center !important;
    align-items: center !important;
    margin: 0 auto !important;
    gap: 0 !important;
}

/* Offcanvas Collapsed Mode */
.p-sidebar-collapsible-offcanvas.p-sidebar-collapsed {
    width: 0 !important;
    transform: translateX(-100%);
}
.p-sidebar-side-right.p-sidebar-collapsible-offcanvas.p-sidebar-collapsed {
    transform: translateX(100%);
}

/* Trigger Button */
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

/* Controls Toolbar */
.p-sidebar-playground-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
    isolation: isolate;
    position: relative;
    z-index: 1;
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

/* Dark Mode Tokens */
.dark .p-sidebar-layout,
[data-theme="dark"] .p-sidebar-layout {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-panel,
[data-theme="dark"] .p-sidebar-panel {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sidebar-header,
[data-theme="dark"] .p-sidebar-header,
.dark .p-sidebar-footer,
[data-theme="dark"] .p-sidebar-footer {
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

.dark .p-sidebar-main,
[data-theme="dark"] .p-sidebar-main {
    background: var(--p-surface-950, #020617);
}

.dark .p-sidebar-main-header,
[data-theme="dark"] .p-sidebar-main-header {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-800, #1e293b);
}
`;

export interface SidebarSubItem {
    label: string;
    isActive?: boolean;
    url?: string;
    subItems?: SidebarSubItem[];
}

export interface SidebarItemModel {
    label: string;
    icon?: string;
    badge?: string | number;
    isActive?: boolean;
    url?: string;
    subItems?: SidebarSubItem[];
    defaultOpen?: boolean;
}

export interface SidebarGroupModel {
    label: string;
    items: SidebarItemModel[];
}

export interface SidebarProps {
    items?: SidebarItem[];
    title?: string;
    searchable?: boolean;
    position?: 'left' | 'right';
    collapsed?: boolean;

    id?: string;
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'none' | 'offcanvas' | 'icon';
    side?: 'left' | 'right';
    overlay?: boolean;
    openOnHover?: boolean;
    backdrop?: boolean;
    open?: boolean;
    width?: string;
    iconWidth?: string;
    demoType?: 'variants' | 'menu' | 'responsive' | 'dual' | 'multi' | 'nested' | 'chat' | 'app';
    groups?: SidebarGroupModel[];
    headerTitle?: string;
    headerLogo?: string;
    headerColor?: string;
    showControls?: boolean;
    class?: string;
    style?: string;
}

export default function SidebarIsland(container: HTMLElement, props: SidebarProps) {
    injectIslandStyle('sidebar', SIDEBAR_CSS);

    const hasAppItems = Array.isArray(props.items) && props.items.length > 0 && !props.groups;

    if (hasAppItems) {
        // Convert hierarchical SidebarItem[] into SidebarGroupModel[] for the unified engine
        const appGroups: SidebarGroupModel[] = [];
        props.items!.forEach(topItem => {
            const groupLabel = (topItem as any).label || (topItem as any).Label || '';
            const subList = (topItem as any).items || (topItem as any).Items;
            if (Array.isArray(subList) && subList.length > 0) {
                const groupItems: SidebarItemModel[] = subList.map((sub: any) => ({
                    label: sub.label || sub.Label || '',
                    icon: sub.icon || sub.Icon || topItem.icon || (topItem as any).Icon || 'folder',
                    url: sub.url || sub.Url,
                    isActive: sub.active || sub.Active || false,
                    badge: sub.badge || sub.Badge,
                    defaultOpen: sub.expanded || sub.Expanded || false
                }));
                appGroups.push({ label: groupLabel, items: groupItems });
            } else {
                appGroups.push({
                    label: '',
                    items: [{
                        label: groupLabel,
                        icon: topItem.icon || (topItem as any).Icon || 'folder',
                        url: topItem.url || (topItem as any).Url,
                        isActive: topItem.active || (topItem as any).Active || false,
                        badge: topItem.badge || (topItem as any).Badge
                    }]
                });
            }
        });

        renderCompoundSidebar(container, {
            ...props,
            groups: appGroups,
            demoType: 'app',
            headerTitle: props.title || 'SoftMax Aura',
            collapsible: 'icon',
            variant: 'sidebar',
            width: '16.5rem',
            open: !props.collapsed
        });
    } else {
        renderCompoundSidebar(container, props);
    }
}

/**
 * Render PrimeVue 4 Aura Compound Sidebar Component
 */
function renderCompoundSidebar(container: HTMLElement, props: SidebarProps) {
    const demoType = props.demoType || (props as any).DemoType || 'variants';
    const isAppMode = demoType === 'app';
    const showControls = props.showControls !== false && demoType === 'variants';

    let variant = props.variant || (props as any).Variant || 'sidebar';
    let collapsible = props.collapsible || (props as any).Collapsible || 'icon';
    let side = props.side || (props as any).Side || 'left';
    let overlay = props.overlay || (props as any).Overlay || false;
    let openOnHover = props.openOnHover || (props as any).OpenOnHover || false;
    let backdrop = props.backdrop || (props as any).Backdrop || false;
    let isOpen = props.open !== undefined ? props.open : ((props as any).Open !== undefined ? (props as any).Open : true);
    let width = props.width || (props as any).Width || (demoType === 'chat' ? '18rem' : '16.5rem');
    let searchQuery = '';

    let openSelectDropdown: 'variant' | 'collapsible' | null = null;
    let activeCompany = { name: 'Acme Inc', logo: 'A', color: 'linear-gradient(135deg, #8b5cf6, #4f46e5)' };
    let showCompanyPopup = false;
    let showUserPopup = false;

    const expandedSubmenus: Record<string, boolean> = {};

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        if ((LucideIcons as any)[iconName]) return (LucideIcons as any)[iconName];
        return '';
    }

    const defaultNavGroups: SidebarGroupModel[] = [
        {
            label: 'Navigation',
            items: [
                { icon: 'home', label: 'Home', isActive: true },
                { icon: 'mail', label: 'Inbox', badge: '12' },
                { icon: 'search', label: 'Search' },
                { icon: 'bell', label: 'Notifications', badge: '3' }
            ]
        },
        {
            label: 'Projects',
            items: [
                {
                    icon: 'barChart3',
                    label: 'Analytics',
                    defaultOpen: true,
                    subItems: [
                        { label: 'Overview', isActive: true },
                        { label: 'Reports' },
                        { label: 'Real-time' }
                    ]
                },
                { icon: 'users', label: 'Team' },
                { icon: 'calendar', label: 'Calendar' },
                {
                    icon: 'folder',
                    label: 'Documents',
                    subItems: [
                        { label: 'Shared' },
                        { label: 'Private' },
                        { label: 'Archived' }
                    ]
                }
            ]
        },
        {
            label: 'Billing',
            items: [
                { icon: 'creditCard', label: 'Payments' },
                { icon: 'shoppingCart', label: 'Orders' },
                { icon: 'star', label: 'Subscriptions' }
            ]
        }
    ];

    const groups: SidebarGroupModel[] = props.groups || defaultNavGroups;

    function renderGroupsHtml(groupList: SidebarGroupModel[]): string {
        return groupList.map((g, gIdx) => {
            const filteredItems = searchQuery 
                ? g.items.filter(it => it.label.toLowerCase().includes(searchQuery.toLowerCase()))
                : g.items;

            if (filteredItems.length === 0 && searchQuery) return '';

            const itemsHtml = filteredItems.map((it, iIdx) => {
                const subKey = `${gIdx}_${iIdx}`;
                if (it.defaultOpen && expandedSubmenus[subKey] === undefined) {
                    expandedSubmenus[subKey] = true;
                }
                const isSubExpanded = !!expandedSubmenus[subKey];
                const hasSubs = Array.isArray(it.subItems) && it.subItems.length > 0;
                const iconSvg = demoType === 'chat' ? '' : getIconSvg(it.icon);

                let subTreeHtml = '';
                if (hasSubs) {
                    const subListHtml = it.subItems!.map(sub => `
                        <li class="p-sidebar-menu-sub-item">
                            <button type="button" class="p-sidebar-menu-sub-button ${sub.isActive ? 'p-active' : ''}">
                                <span>${sub.label}</span>
                            </button>
                        </li>
                    `).join('');
                    subTreeHtml = `
                        <div class="p-sidebar-menu-sub-wrapper ${isSubExpanded ? 'p-expanded' : ''}">
                            <ul class="p-sidebar-menu-sub">${subListHtml}</ul>
                        </div>
                    `;
                }

                const chevronSvg = `<svg class="p-sidebar-submenu-chevron ${isSubExpanded ? 'p-expanded' : ''}" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
                const ellipsisSvg = `<svg class="p-sidebar-menu-action" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
                const trashSvg = `<button type="button" class="p-sidebar-menu-action" title="Delete conversation" style="border:none;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>`;

                const actionButton = demoType === 'chat' ? trashSvg : (it.badge === undefined ? ellipsisSvg : '');

                const tagOrLink = it.url 
                    ? `<a href="${it.url}" class="p-sidebar-menu-button ${it.isActive ? 'p-active' : ''}" data-sidebar-link="${it.url}" title="${it.label}">` 
                    : `<button type="button" class="p-sidebar-menu-button ${it.isActive ? 'p-active' : ''}" data-has-subs="${hasSubs}" title="${it.label}">`;

                const closeTag = it.url ? '</a>' : '</button>';

                return `
                    <li class="p-sidebar-menu-item" data-subkey="${subKey}">
                        ${tagOrLink}
                            ${iconSvg ? `<span class="p-sidebar-menu-button-icon">${iconSvg}</span>` : ''}
                            <span class="p-sidebar-item-label">${it.label}</span>
                            ${it.badge !== undefined ? `<span class="p-sidebar-menu-badge">${it.badge}</span>` : ''}
                            ${hasSubs ? chevronSvg : (isAppMode ? '' : actionButton)}
                        ${closeTag}
                        ${subTreeHtml}
                    </li>
                `;
            }).join('');

            return `
                <div class="p-sidebar-group">
                    ${g.label ? `<div class="p-sidebar-group-label">${g.label}</div>` : ''}
                    <ul class="p-sidebar-menu">${itemsHtml}</ul>
                </div>
            `;
        }).join('');
    }

    function renderHeaderContent(): string {
        const headerTitle = props.headerTitle || 'SoftMax Aura';

        if (isAppMode) {
            return `
                <div style="display: flex; align-items: center; gap: 0.65rem; width: 100%; overflow: hidden;">
                    <a href="/" style="display: flex; width: 2.1rem; height: 2.1rem; border-radius: 8px; background: linear-gradient(135deg, #10b981, #047857); color: #ffffff; align-items: center; justify-content: center; flex-shrink: 0; text-decoration: none;" title="${headerTitle}">
                        ${LucideIcons.layers || '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>'}
                    </a>
                    <span class="p-sidebar-item-label p-sidebar-header-label" style="font-weight: 800; font-size: 0.9375rem; color: var(--p-text-color);">${headerTitle}</span>
                </div>
            `;
        }

        if (demoType === 'chat') {
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

        if (demoType === 'menu') {
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
                                ${activeCompany.name === 'Acme Inc' ? '<span style="margin-left:auto; color:var(--p-primary-600); font-weight:700;">&#10003;</span>' : ''}
                            </div>
                            <div class="p-sb-popup-item" data-select-company="Globex Corp|G|linear-gradient(135deg, #10b981, #0d9488)">
                                <div style="display:flex; width:1.25rem; height:1.25rem; border-radius:4px; background: linear-gradient(135deg, #10b981, #0d9488); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.65rem;">G</div>
                                <span>Globex Corp</span>
                                ${activeCompany.name === 'Globex Corp' ? '<span style="margin-left:auto; color:var(--p-primary-600); font-weight:700;">&#10003;</span>' : ''}
                            </div>
                            <div class="p-sb-popup-item" data-select-company="Initech|I|linear-gradient(135deg, #f97316, #dc2626)">
                                <div style="display:flex; width:1.25rem; height:1.25rem; border-radius:4px; background: linear-gradient(135deg, #f97316, #dc2626); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.65rem;">I</div>
                                <span>Initech</span>
                                ${activeCompany.name === 'Initech' ? '<span style="margin-left:auto; color:var(--p-primary-600); font-weight:700;">&#10003;</span>' : ''}
                            </div>
                            <div style="border-top: 1px solid var(--p-border-color); margin: 0.25rem 0;"></div>
                            <div class="p-sb-popup-item" style="color: var(--p-text-muted);">
                                <span class="p-sidebar-menu-button-icon">${LucideIcons.plus}</span>
                                <span>Add company</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
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

    function renderFooterContent(): string {
        if (isAppMode) {
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; overflow: hidden;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 1.6rem; height: 1.6rem; border-radius: 9999px; background: var(--p-surface-200); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: var(--p-surface-700); flex-shrink: 0;">LT</div>
                        <span class="p-sidebar-item-label p-sidebar-footer-label" style="font-size: 0.775rem; font-weight: 600; color: var(--p-text-muted);">SoftMax LaughTale</span>
                    </div>
                    <span class="p-sidebar-menu-badge aura-tag tag-emerald" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">v3.0</span>
                </div>
            `;
        }

        if (demoType === 'menu') {
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
                    ` : ''}
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

    function renderMainContent(): string {
        const triggerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`;
        const chatIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;

        if (demoType === 'chat') {
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

        if (demoType === 'nested') {
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

        if (demoType === 'dual') {
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
                    ${demoType === 'responsive' ? `<span style="margin-left: auto; font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--p-surface-100); color: var(--p-text-muted);">Desktop</span>` : ''}
                </header>
                <div style="flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
                    <div style="height: 6rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Main Content View</div>
                    <div style="flex: 1; min-height: 8rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Analytics &amp; Data Area</div>
                </div>
            </div>
        `;
    }

    function updateSidebarClasses() {
        const aside = container.querySelector<HTMLElement>('[data-sidebar-root]');
        if (!aside) return;

        aside.className = [
            'p-sidebar',
            isAppMode ? 'p-sidebar-app-dock' : '',
            `p-sidebar-variant-${variant}`,
            `p-sidebar-collapsible-${collapsible}`,
            `p-sidebar-side-${side}`,
            overlay ? 'p-sidebar-overlay' : '',
            !isOpen ? 'p-sidebar-collapsed' : ''
        ].filter(Boolean).join(' ');

        const sidebarWidth = isOpen ? width : (collapsible === 'icon' ? '3.5rem' : '0rem');
        aside.style.width = sidebarWidth;

        const backdropEl = container.querySelector<HTMLElement>('[data-sidebar-backdrop]');
        if (backdropEl) {
            backdropEl.style.display = (backdrop && isOpen) ? 'block' : 'none';
        }
    }

    function renderComponent(): string {
        const searchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;

        const sidebarClasses = [
            'p-sidebar',
            isAppMode ? 'p-sidebar-app-dock' : '',
            `p-sidebar-variant-${variant}`,
            `p-sidebar-collapsible-${collapsible}`,
            `p-sidebar-side-${side}`,
            overlay ? 'p-sidebar-overlay' : '',
            !isOpen ? 'p-sidebar-collapsed' : ''
        ].filter(Boolean).join(' ');

        const sidebarWidth = isOpen ? width : (collapsible === 'icon' ? '3.5rem' : '0rem');

        const sidebarHtml = `
            <aside class="${sidebarClasses}" style="width: ${sidebarWidth};" data-sidebar-root>
                <div class="p-sidebar-aside">
                    <div class="p-sidebar-panel">
                        <div class="p-sidebar-header">
                            ${renderHeaderContent()}
                        </div>
                        ${isAppMode ? `
                            <div class="p-sidebar-search-container">
                                <div class="p-sidebar-search-box">
                                    <span style="color: var(--p-surface-400); display: flex; align-items: center;">${searchIconSvg}</span>
                                    <input type="text" class="p-sidebar-search-input" placeholder="Filter navigation..." value="${searchQuery}" />
                                </div>
                            </div>
                        ` : ''}
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

        if (isAppMode) {
            return sidebarHtml;
        }

        const mainHtml = renderMainContent();
        const backdropHtml = `<div class="p-sidebar-backdrop" data-sidebar-backdrop style="display: ${backdrop && isOpen ? 'block' : 'none'};"></div>`;
        
        const innerContent = side === 'right' ? (mainHtml + sidebarHtml) : (sidebarHtml + mainHtml);

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
        // Main Trigger Button (Smooth non-destructive transition)
        container.querySelectorAll('[data-sidebar-toggle]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                isOpen = !isOpen;
                updateSidebarClasses();
            });
        });

        // Global Event Hook for App Shell Trigger Button
        if (isAppMode) {
            const onAppToggle = () => {
                isOpen = !isOpen;
                updateSidebarClasses();
            };
            document.removeEventListener('app-sidebar:toggle', (window as any).__appSidebarUnifiedHandler);
            (window as any).__appSidebarUnifiedHandler = onAppToggle;
            document.addEventListener('app-sidebar:toggle', onAppToggle);

            // Filter search input
            const searchInput = container.querySelector<HTMLInputElement>('.p-sidebar-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    searchQuery = (e.target as HTMLInputElement).value;
                    const contentEl = container.querySelector('.p-sidebar-content');
                    if (contentEl) {
                        contentEl.innerHTML = renderGroupsHtml(groups);
                        wireSubmenuAndLinks();
                    }
                });
            }
        }

        // Backdrop click dismisses smoothly
        container.querySelectorAll('[data-sidebar-backdrop]').forEach(bd => {
            bd.addEventListener('click', () => {
                isOpen = false;
                updateSidebarClasses();
            });
        });

        // Click outside on main area closes overlay smoothly
        const mainEl = container.querySelector('.p-sidebar-main');
        if (mainEl) {
            mainEl.addEventListener('click', (e) => {
                if (overlay && isOpen && !(e.target as HTMLElement).closest('[data-sidebar-toggle]')) {
                    isOpen = false;
                    updateSidebarClasses();
                }
            });
        }

        wireSubmenuAndLinks();

        // Interactive company switcher popup
        const compTrigger = container.querySelector('[data-company-trigger]');
        if (compTrigger) {
            compTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                showCompanyPopup = !showCompanyPopup;
                showUserPopup = false;
                render();
            });
        }

        container.querySelectorAll('[data-select-company]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const raw = item.getAttribute('data-select-company') || '';
                const parts = raw.split('|');
                if (parts.length >= 3) {
                    activeCompany = { name: parts[0], logo: parts[1], color: parts[2] };
                }
                showCompanyPopup = false;
                render();
            });
        });

        // Interactive user profile popup
        const userTrigger = container.querySelector('[data-user-trigger]');
        if (userTrigger) {
            userTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                showUserPopup = !showUserPopup;
                showCompanyPopup = false;
                render();
            });
        }

        // Controls: Aura Select dropdown triggers
        container.querySelectorAll('[data-select-trigger]').forEach(trig => {
            trig.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = trig.getAttribute('data-select-trigger') as any;
                openSelectDropdown = openSelectDropdown === key ? null : key;
                render();
            });
        });

        // Controls: Aura Select option selections
        container.querySelectorAll('[data-select-option]').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const [category, val] = (opt.getAttribute('data-select-option') || '').split(':');
                if (category === 'variant') {
                    variant = val as any;
                } else if (category === 'collapsible') {
                    collapsible = val as any;
                }
                openSelectDropdown = null;
                render();
            });
        });

        // Controls: Side segmented buttons
        container.querySelectorAll<HTMLButtonElement>('[data-sb-side]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                side = btn.getAttribute('data-sb-side') as any;
                render();
            });
        });

        // Controls: ToggleSwitches with immediate visual feedback
        const overlayToggle = container.querySelector('[data-sb-toggle="overlay"]');
        if (overlayToggle) {
            overlayToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                overlay = !overlay;
                render();
            });
        }

        const hoverToggle = container.querySelector('[data-sb-toggle="hover"]');
        if (hoverToggle) {
            hoverToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                openOnHover = !openOnHover;
                render();
            });
        }

        const backdropToggle = container.querySelector('[data-sb-toggle="backdrop"]');
        if (backdropToggle) {
            backdropToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                backdrop = !backdrop;
                render();
            });
        }

        // Open on hover logic with smooth delay
        if (openOnHover) {
            const aside = container.querySelector('[data-sidebar-root]');
            if (aside) {
                aside.addEventListener('mouseenter', () => {
                    if (!isOpen) {
                        isOpen = true;
                        updateSidebarClasses();
                    }
                });
                aside.addEventListener('mouseleave', () => {
                    if (isOpen) {
                        isOpen = false;
                        updateSidebarClasses();
                    }
                });
            }
        }

        // Global dismiss for open popups/dropdowns on outside click
        const onDocClick = () => {
            if (openSelectDropdown || showCompanyPopup || showUserPopup) {
                openSelectDropdown = null;
                showCompanyPopup = false;
                showUserPopup = false;
                render();
            }
        };
        document.addEventListener('click', onDocClick, { once: true });
    }

    function wireSubmenuAndLinks() {
        // Submenu collapse / expand with animated CSS grid and chevrons
        container.querySelectorAll('.p-sidebar-menu-button[data-has-subs="true"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const li = btn.closest('.p-sidebar-menu-item');
                const subKey = li?.getAttribute('data-subkey');
                if (subKey) {
                    expandedSubmenus[subKey] = !expandedSubmenus[subKey];
                    const wrapper = li?.querySelector('.p-sidebar-menu-sub-wrapper');
                    const chevron = li?.querySelector('.p-sidebar-submenu-chevron');
                    if (wrapper) {
                        wrapper.classList.toggle('p-expanded', expandedSubmenus[subKey]);
                    }
                    if (chevron) {
                        chevron.classList.toggle('p-expanded', expandedSubmenus[subKey]);
                    }
                }
            });
        });

        // Smooth in-page anchor navigation
        container.querySelectorAll<HTMLAnchorElement>('a[data-sidebar-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href') || '';
                const hashIndex = href.indexOf('#');
                if (hashIndex >= 0 && (href.startsWith('#') || href.startsWith(window.location.pathname))) {
                    const targetId = href.substring(hashIndex + 1);
                    const targetEl = document.getElementById(targetId);

                    if (targetEl) {
                        e.preventDefault();
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

                        container.querySelectorAll('.p-sidebar-menu-button').forEach(el => el.classList.remove('p-active'));
                        link.classList.add('p-active');

                        window.history.pushState(null, '', href);
                    }
                }
            });
        });
    }

    function render() {
        container.innerHTML = renderComponent();
        wireEvents();
    }

    render();
}

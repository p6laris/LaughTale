import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/sidebar.ts
var SIDEBAR_CSS = `
/* ==========================================================================
   1. App-Level Navigation Tree Sidebar (App Shell)
   ========================================================================== */
.laughtale-sidebar {
    display: flex;
    flex-direction: column;
    background: var(--p-surface-0);
    border-right: 1px solid var(--p-border-color);
    width: 270px;
    min-width: 270px;
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    transition: width 240ms cubic-bezier(0.16, 1, 0.3, 1), min-width 240ms cubic-bezier(0.16, 1, 0.3, 1);
    font-family: var(--p-font-family, inherit);
    overflow: hidden;
    border-radius: 0;
    box-shadow: none;
    z-index: 40;
}
.laughtale-sidebar.collapsed {
    width: 68px;
    min-width: 68px;
}
.laughtale-sidebar.right {
    border-right: none;
    border-left: 1px solid var(--p-border-color);
}
.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.125rem;
    border-bottom: 1px solid var(--p-border-color);
    gap: 0.5rem;
    height: 60px;
    box-sizing: border-box;
    flex-shrink: 0;
}
.sidebar-search-box {
    padding: 0.625rem 0.875rem 0.25rem;
    flex-shrink: 0;
}
.sidebar-search-input {
    width: 100%;
    background: var(--p-surface-50);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    padding: 0.4rem 0.65rem;
    font-size: 0.775rem;
    color: var(--p-text-color);
    outline: none;
    transition: border-color 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
}
.sidebar-search-input:focus {
    border-color: var(--p-primary-500);
    background: var(--p-surface-0);
}
.sidebar-toggle {
    background: transparent;
    border: none;
    color: var(--p-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--p-border-radius);
    width: 1.85rem;
    height: 1.85rem;
    transition: background 150ms ease, color 150ms ease;
    flex-shrink: 0;
}
.sidebar-toggle:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
.sidebar-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface-300) transparent;
}
.sidebar-body::-webkit-scrollbar {
    width: 4px;
}
.sidebar-body::-webkit-scrollbar-track {
    background: transparent;
}
.sidebar-body::-webkit-scrollbar-thumb {
    background: var(--p-surface-300);
    border-radius: 4px;
}
.sidebar-tree-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    width: 100%;
}
.sidebar-item {
    display: flex;
    align-items: center;
    padding: 0.45rem 0.65rem;
    color: var(--p-text-color);
    text-decoration: none;
    border-radius: var(--p-border-radius);
    transition: background 150ms ease, color 150ms ease;
    gap: 0.6rem;
    font-size: 0.8125rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    border: 1px solid transparent;
    box-sizing: border-box;
}
.sidebar-item:hover {
    background: var(--p-surface-100);
}
.sidebar-item.active {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 700;
    border-color: var(--p-primary-200);
}
.dark .sidebar-item.active {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
    border-color: rgba(16, 185, 129, 0.3);
}
.sidebar-group-container {
    width: 100%;
    list-style: none;
}
.sidebar-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.65rem;
    color: var(--p-text-muted);
    font-size: 0.725rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    border-radius: var(--p-border-radius);
    transition: background 150ms ease, color 150ms ease;
    box-sizing: border-box;
}
.sidebar-group-header:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
.sidebar-group-chevron {
    display: flex;
    align-items: center;
    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--p-text-muted);
}
.sidebar-group-chevron.expanded {
    transform: rotate(90deg);
}
.sidebar-sub-tree {
    list-style: none;
    padding: 0 0 0 0.75rem;
    margin: 0.15rem 0 0.35rem 0.35rem;
    border-left: 1px solid var(--p-border-color);
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.sidebar-badge {
    margin-left: auto;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    background: var(--p-surface-200);
    color: var(--p-text-color);
}
.collapsed .sidebar-body {
    padding: 0.5rem 0 !important;
    align-items: center;
}
.collapsed .sidebar-tree-menu {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.collapsed .sidebar-group-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.collapsed .sidebar-item-label, 
.collapsed .sidebar-header-title,
.collapsed .sidebar-search-box,
.collapsed .sidebar-badge,
.collapsed .sidebar-group-chevron {
    display: none !important;
}
.collapsed .sidebar-header {
    justify-content: center;
    padding: 0;
}
.collapsed .sidebar-header .sidebar-brand-group {
    display: none !important;
}
.collapsed .sidebar-header .sidebar-toggle {
    margin: 0 auto;
}
.collapsed .sidebar-group-header {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 44px;
    height: 38px;
    margin: 0.5rem auto 0.25rem;
    padding: 0.5rem 0 0 !important;
    border-top: 1px solid var(--p-border-color);
    cursor: pointer;
    box-sizing: border-box;
}
.collapsed .sidebar-group-header > div {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0 !important;
    width: 100% !important;
}
.collapsed .sidebar-group-header span.sidebar-group-icon {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 20px !important;
    height: 20px !important;
}
.collapsed .sidebar-sub-tree {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    border-left: none !important;
    list-style: none !important;
    gap: 0.2rem;
}
.collapsed .sidebar-sub-tree > li {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
}
.collapsed .sidebar-item {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important;
    width: 44px !important;
    height: 44px !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
    border-radius: var(--p-border-radius);
}
.collapsed .sidebar-item span.sidebar-icon {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 20px !important;
    height: 20px !important;
}
.collapsed .sidebar-item:hover {
    background: var(--p-surface-100);
}

/* ==========================================================================
   2. PrimeVue 4 Aura Compound Sidebar Layout & Components
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

/* Aura Custom Floating Select */
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

/* Layout Container */
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
    transition: opacity 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 100;
    box-sizing: border-box;
    transition: width 240ms cubic-bezier(0.16, 1, 0.3, 1), transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms ease;
    flex-shrink: 0;
    overflow: hidden;
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

/* Variants */
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

/* Collapsed Icon Mode Smooth Fade */
.p-sidebar-item-label,
.p-sidebar-group-label,
.p-sidebar-menu-badge,
.p-sidebar-submenu-chevron,
.p-sidebar-header-label,
.p-sidebar-footer-label {
    transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
    opacity: 1;
    transform: translateX(0);
    white-space: nowrap;
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

/* Offcanvas Collapsed Mode */
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
    padding: 0.5rem 0.65rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    box-sizing: border-box;
    scrollbar-width: thin;
}

.p-sidebar-footer {
    padding: var(--p-sidebar-footer-padding, 0.65rem 0.75rem);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    box-sizing: border-box;
}

.p-sidebar-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.p-sidebar-group-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--p-sidebar-group-label-color, var(--p-surface-400, #94a3b8));
    padding: 0.35rem 0.5rem;
    user-select: none;
    letter-spacing: 0.02em;
}

.p-sidebar-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.p-sidebar-menu-item {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
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
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease, transform 0.12s ease;
    box-sizing: border-box;
    text-align: left;
    outline: none;
    position: relative;
}

.p-sidebar-menu-button:hover,
.p-sidebar-menu-button.p-hover {
    background: var(--p-sidebar-menu-button-focus-background, var(--p-surface-100, #f1f5f9));
}

.p-sidebar-menu-button.p-active {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-primary-600, #2563eb);
    font-weight: 600;
}

.p-sidebar-menu-button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
    color: var(--p-surface-500, #64748b);
    transition: transform 0.15s ease;
}

.p-sidebar-menu-button.p-active .p-sidebar-menu-button-icon {
    color: var(--p-primary-600, #2563eb);
}

.p-sidebar-menu-badge {
    margin-left: auto;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
}

.p-sidebar-submenu-chevron {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-sidebar-submenu-chevron.p-expanded {
    transform: rotate(180deg);
}

.p-sidebar-menu-action {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 4px;
    color: var(--p-surface-400, #94a3b8);
    cursor: pointer;
    background: transparent;
    border: none;
    transition: background-color 0.12s ease, color 0.12s ease, transform 0.12s ease;
}

.p-sidebar-menu-item:hover .p-sidebar-menu-action {
    display: inline-flex;
}

.p-sidebar-menu-action:hover {
    background: var(--p-surface-200, #e2e8f0);
    color: #ef4444;
    transform: translateY(-50%) scale(1.1);
}

/* Fluid CSS Grid Submenu Expand/Collapse Animation */
.p-sidebar-menu-sub-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease;
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
    font-weight: 600;
    color: var(--p-primary-600, #2563eb);
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
    width: 2rem;
    height: 2rem;
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

/* Interactive Popup Menu in Demo */
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

/* Dual Sidebar Claude AI Chat Panel */
.p-sb-chat-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.75rem;
    gap: 0.75rem;
}

.p-sb-chat-bubble {
    background: var(--p-surface-100, #f1f5f9);
    border-radius: 12px;
    padding: 0.65rem 0.85rem;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--p-text-color);
}

.p-sb-chat-metrics {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    font-size: 0.8125rem;
}

.p-sb-chat-metrics-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--p-text-muted);
}

.p-sb-chat-metrics-val {
    font-weight: 600;
    color: var(--p-text-color);
}

.p-sb-chat-input-box {
    margin-top: auto;
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 12px;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-0);
}

.p-sb-chat-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.8125rem;
    color: var(--p-text-color);
}

/* Dark Mode Tokens */
.dark .p-sidebar-toolbar,
[data-theme="dark"] .p-sidebar-toolbar {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-toolbar-label,
[data-theme="dark"] .p-sidebar-toolbar-label {
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-sb-select-trigger,
[data-theme="dark"] .p-sb-select-trigger {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-sb-select-dropdown,
[data-theme="dark"] .p-sb-select-dropdown {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-sb-select-option,
[data-theme="dark"] .p-sb-select-option {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-sb-select-option:hover,
[data-theme="dark"] .p-sb-select-option:hover {
    background: var(--p-surface-800, #1e293b);
}

.dark .p-sb-select-option.p-selected,
[data-theme="dark"] .p-sb-select-option.p-selected {
    background: var(--p-surface-800, #1e293b);
    color: #60a5fa;
}

.dark .p-sb-segmented,
[data-theme="dark"] .p-sb-segmented {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sb-seg-btn,
[data-theme="dark"] .p-sb-seg-btn {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-sb-seg-btn.p-active,
[data-theme="dark"] .p-sb-seg-btn.p-active {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sb-switch,
[data-theme="dark"] .p-sb-switch {
    background: var(--p-surface-700, #334155);
}

.dark .p-sb-switch.p-checked,
[data-theme="dark"] .p-sb-switch.p-checked {
    background: var(--p-primary-600, #2563eb);
}

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

.dark .p-sidebar-variant-sidebar,
[data-theme="dark"] .p-sidebar-variant-sidebar {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-variant-floating .p-sidebar-panel,
[data-theme="dark"] .p-sidebar-variant-floating .p-sidebar-panel {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-variant-inset,
[data-theme="dark"] .p-sidebar-variant-inset {
    background: var(--p-surface-950, #020617);
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

.dark .p-sidebar-menu-button,
[data-theme="dark"] .p-sidebar-menu-button {
    color: var(--p-surface-200, #e2e8f0);
}

.dark .p-sidebar-menu-button:hover,
.dark .p-sidebar-menu-button.p-hover,
[data-theme="dark"] .p-sidebar-menu-button:hover,
[data-theme="dark"] .p-sidebar-menu-button.p-hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sidebar-menu-button.p-active,
[data-theme="dark"] .p-sidebar-menu-button.p-active {
    background: var(--p-surface-800, #1e293b);
    color: #60a5fa;
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
    color: #60a5fa;
}

.dark .p-sb-popup-menu,
[data-theme="dark"] .p-sb-popup-menu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-sb-popup-item,
[data-theme="dark"] .p-sb-popup-item {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-sb-popup-item:hover,
[data-theme="dark"] .p-sb-popup-item:hover {
    background: var(--p-surface-800, #1e293b);
}

.dark .p-sb-chat-conversation,
[data-theme="dark"] .p-sb-chat-conversation {
    background: var(--p-surface-950, #020617);
}

.dark .p-sb-msg-user,
[data-theme="dark"] .p-sb-msg-user {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sb-chat-input-container,
[data-theme="dark"] .p-sb-chat-input-container {
    background: var(--p-surface-950, #020617);
}

.dark .p-sb-chat-input-pill,
[data-theme="dark"] .p-sb-chat-input-pill {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-sb-chat-send-btn,
[data-theme="dark"] .p-sb-chat-send-btn {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.dark .p-sb-chat-bubble,
[data-theme="dark"] .p-sb-chat-bubble {
    background: var(--p-surface-800, #1e293b);
}

.dark .p-sb-chat-input-box,
[data-theme="dark"] .p-sb-chat-input-box {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
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
  let collapsed = props.collapsed || false;
  let searchQuery = "";
  const items = props.items || [];
  const position = props.position || "left";
  const title = props.title || "Navigation";
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
  function renderNode(item, level = 0) {
    const label = item.label || item.Label || item.title || item.Title || "";
    const url = item.url || item.Url || "#";
    const icon = item.icon || item.Icon || "";
    const active = item.active || item.Active || false;
    const badge = item.badge || item.Badge || "";
    const children = item.items || item.Items;
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isExpanded = expandedMap[label] ?? true;
    const iconSvg = icon && LucideIcons[icon] ? LucideIcons[icon] : icon.startsWith("<svg") ? icon : "";
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSelf = label.toLowerCase().includes(q);
      const matchesChild = hasChildren && children.some((c) => (c.label || c.Label || "").toLowerCase().includes(q));
      if (!matchesSelf && !matchesChild) return "";
    }
    if (hasChildren) {
      return `
                <li class="sidebar-group-container" data-label="${label}">
                    <div class="sidebar-group-header" data-group-toggle="${label}" title="${label}">
                        <div style="display: flex; align-items: center; gap: 0.45rem;">
                            ${iconSvg ? `<span class="sidebar-group-icon" style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600);">${iconSvg}</span>` : ""}
                            <span class="sidebar-item-label">${label}</span>
                        </div>
                        <span class="sidebar-group-chevron ${isExpanded ? "expanded" : ""}">
                            ${LucideIcons.chevronRight}
                        </span>
                    </div>
                    <ul class="sidebar-sub-tree" style="display: ${isExpanded ? "flex" : "none"};">
                        ${children.map((child) => renderNode(child, level + 1)).join("")}
                    </ul>
                </li>
            `;
    }
    return `
            <li>
                <a href="${url}" class="sidebar-item ${active ? "active" : ""}" data-sidebar-link="${url}" title="${label}">
                    ${iconSvg ? `<span class="sidebar-icon" style="display: flex; width: 18px; height: 18px; color: ${active ? "var(--p-primary-600)" : "var(--p-text-muted)"}; flex-shrink: 0;">${iconSvg}</span>` : ""}
                    <span class="sidebar-item-label">${label}</span>
                    ${badge ? `<span class="sidebar-badge">${badge}</span>` : ""}
                </a>
            </li>
        `;
  }
  function render() {
    container.innerHTML = `
            <div class="laughtale-sidebar ${collapsed ? "collapsed" : ""} ${position}">
                <div class="sidebar-header">
                    <div class="sidebar-brand-group" style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden;">
                        <span style="color: var(--p-primary-600); display: flex; flex-shrink: 0;">${LucideIcons.layers}</span>
                        <span class="sidebar-header-title" style="font-weight: 800; font-size: 0.9rem; color: var(--p-text-color); white-space: nowrap;">${title}</span>
                    </div>
                    <button class="sidebar-toggle" aria-label="Toggle Sidebar" title="Collapse / Expand Sidebar">
                        ${collapsed ? LucideIcons.chevronRight : LucideIcons.chevronLeft}
                    </button>
                </div>

                ${searchable && !collapsed ? `
                    <div class="sidebar-search-box">
                        <input type="text" class="sidebar-search-input" placeholder="Filter components..." value="${searchQuery}" />
                    </div>
                ` : ""}

                <div class="sidebar-body">
                    <ul class="sidebar-tree-menu">
                        ${items.map((item) => renderNode(item)).join("")}
                    </ul>
                </div>
            </div>
        `;
    bindEvents();
  }
  function bindEvents() {
    container.querySelector(".sidebar-toggle")?.addEventListener("click", () => {
      collapsed = !collapsed;
      render();
    });
    const searchInput = container.querySelector(".sidebar-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        const menuEl = container.querySelector(".sidebar-tree-menu");
        if (menuEl) {
          menuEl.innerHTML = items.map((item) => renderNode(item)).join("");
          bindGroupToggles();
          bindLinkClicks();
        }
      });
    }
    bindGroupToggles();
    bindLinkClicks();
  }
  function bindGroupToggles() {
    container.querySelectorAll("[data-group-toggle]").forEach((header) => {
      header.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const groupLabel = header.getAttribute("data-group-toggle");
        if (groupLabel) {
          expandedMap[groupLabel] = !expandedMap[groupLabel];
          const groupContainer = container.querySelector(`[data-label="${groupLabel}"]`);
          if (groupContainer) {
            const subTree = groupContainer.querySelector(".sidebar-sub-tree");
            const chevron = groupContainer.querySelector(".sidebar-group-chevron");
            if (subTree) {
              subTree.style.display = expandedMap[groupLabel] ? "flex" : "none";
            }
            if (chevron) {
              chevron.classList.toggle("expanded", expandedMap[groupLabel]);
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
        if (hashIndex >= 0) {
          const targetId = href.substring(hashIndex + 1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            container.querySelectorAll(".sidebar-item").forEach((el) => el.classList.remove("active"));
            link.classList.add("active");
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
  let width = props.width || props.Width || (demoType === "chat" ? "16.5rem" : "16rem");
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
        let iconSvg = getIconSvg(it.icon);
        if (demoType === "chat" && !iconSvg) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
        }
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
        const trashSvg = `<button type="button" class="p-sidebar-menu-action" title="Delete chat" style="border:none;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>`;
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
  function renderAiRightPanel() {
    if (demoType !== "dual") return "";
    const aiWidth = isAiOpen ? "18rem" : "0rem";
    return `
            <aside class="p-sidebar p-sidebar-collapsible-offcanvas p-sidebar-side-right ${!isAiOpen ? "p-sidebar-collapsed" : ""}" style="width: ${aiWidth}; border-left: 1px solid var(--p-border-color);" data-ai-sidebar-root>
                <div class="p-sidebar-aside">
                    <div class="p-sidebar-panel">
                        <div class="p-sidebar-header">
                            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-surface-500);">Weekly metrics overview</span>
                        </div>
                        <div class="p-sidebar-content">
                            <div class="p-sb-chat-panel">
                                <div class="p-sb-chat-bubble">Show me this week's metrics</div>
                                <div class="p-sb-chat-metrics">
                                    <p style="margin: 0; font-weight: 600; color: var(--p-text-color);">Here are your key metrics for this week:</p>
                                    <div class="p-sb-chat-metrics-row">
                                        <span>Page views</span>
                                        <span class="p-sb-chat-metrics-val">12,482</span>
                                    </div>
                                    <div class="p-sb-chat-metrics-row">
                                        <span>New users</span>
                                        <span class="p-sb-chat-metrics-val">342</span>
                                    </div>
                                    <div class="p-sb-chat-metrics-row">
                                        <span>Bounce rate</span>
                                        <span class="p-sb-chat-metrics-val">34%</span>
                                    </div>
                                </div>
                                <div class="p-sb-chat-input-box">
                                    <input type="text" class="p-sb-chat-input" placeholder="Reply to Claude..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
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
    const aiRightPanelHtml = renderAiRightPanel();
    const backdropHtml = `<div class="p-sidebar-backdrop" data-sidebar-backdrop style="display: ${backdrop && isOpen ? "block" : "none"};"></div>`;
    let innerContent = "";
    if (demoType === "dual") {
      innerContent = sidebarHtml + mainHtml + aiRightPanelHtml;
    } else {
      innerContent = side === "right" ? mainHtml + sidebarHtml : sidebarHtml + mainHtml;
    }
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
    container.querySelectorAll("[data-ai-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        isAiOpen = !isAiOpen;
        const aiAside = container.querySelector("[data-ai-sidebar-root]");
        if (aiAside) {
          aiAside.classList.toggle("p-sidebar-collapsed", !isAiOpen);
          aiAside.style.width = isAiOpen ? "18rem" : "0rem";
        }
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
//# sourceMappingURL=sidebar-DIMCGX6E.js.map

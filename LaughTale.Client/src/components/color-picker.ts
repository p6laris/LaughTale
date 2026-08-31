import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise ColorPicker Component (Aura ColorPicker inspired)
 * Pixel-perfect popover with preset swatches, hex input, and native color spectrum picker.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface ColorPickerProps {
    value?: string; // Hex color e.g. 'var(--lt-primary-500, var(--lt-primary-500))'
    targetInputName?: string;
    disabled?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const DEFAULT_PRESETS = [
    'var(--lt-primary-500, var(--lt-primary-500))', 'var(--lt-primary-600, var(--lt-primary-600))', 'var(--lt-info-500, var(--lt-info-500))', 'var(--lt-info-600, var(--lt-info-600))', 'var(--lt-info-500, var(--lt-info-500))',
    'var(--lt-primary-500, var(--lt-primary-500))', 'var(--lt-primary-500)', 'var(--lt-danger-500, var(--lt-danger-500))', 'var(--lt-danger-500, var(--lt-danger-500))', 'var(--lt-warn-500, var(--lt-warn-500))',
    'var(--lt-primary-500)', 'var(--lt-info-500)', 'var(--lt-surface-500, var(--lt-surface-500))', 'var(--lt-surface-800, var(--lt-surface-800))', 'var(--lt-surface-950, var(--lt-surface-950))'
];


const CSS = `
html.dark .colorpicker-hex-label,
[data-theme="dark"] .colorpicker-hex-label,
.dark .colorpicker-hex-label {
    color: var(--p-text-color, #f8fafc) !important;
}
html.dark .colorpicker-palette-overlay,
[data-theme="dark"] .colorpicker-palette-overlay,
.dark .colorpicker-palette-overlay {
    background: var(--p-surface-0, #090d16) !important;
    color: var(--p-text-color, #f8fafc) !important;
    border-color: var(--p-border-color, #334155) !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}
html.dark .color-hex-input,
[data-theme="dark"] .color-hex-input,
.dark .color-hex-input {
    background: transparent !important;
    color: var(--p-text-color, #f8fafc) !important;
    border-color: var(--p-border-color, #334155) !important;
}
`;

export default function ColorPickerIsland(container: HTMLElement, props: ColorPickerProps, ctx?: IslandContext) {
    injectIslandStyle('color-picker', CSS);
    let currentColor = props.value || 'var(--lt-primary-500, var(--lt-primary-500))';
    let isOpen = false;

    const swatchesHtml = DEFAULT_PRESETS.map(c => `
        <button type="button" 
                class="color-swatch-btn" 
                data-color="${c}" 
                title="${c}"
                style="width: 1.75rem; height: 1.75rem; border-radius: 4px; border: ${c.toLowerCase() === currentColor.toLowerCase() ? '2px solid var(--lt-surface-0, var(--lt-surface-0))' : '1px solid rgba(0,0,0,0.15)'}; background: ${c}; cursor: pointer; box-shadow: ${c.toLowerCase() === currentColor.toLowerCase() ? '0 0 0 2px var(--lt-primary-600)' : 'none'}; transition: transform 0.15s ease, box-shadow 0.15s ease;">
        </button>
    `).join('');

    // Static DOM skeleton built once
    container.innerHTML = `
        <div class="laughtale-colorpicker" style="position: relative; display: inline-flex; align-items: center; gap: 0.625rem; font-family: var(--p-font-family, inherit);">
            <!-- Color Swatch Trigger Button -->
            <button type="button" 
                    class="colorpicker-trigger-btn" 
                    ${props.disabled ? 'disabled' : ''} 
                    style="width: 2.25rem; height: 2.25rem; border-radius: var(--lt-radius); border: 2px solid var(--lt-surface-200); background: ${currentColor}; cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; box-shadow: var(--p-shadow-sm); transition: transform 0.15s ease, border-color 0.15s ease; padding: 0; outline: none;">
            </button>
            <span class="colorpicker-hex-label" style="font-family: monospace; font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">${currentColor.toUpperCase()}</span>

            <!-- Palette Popover -->
            <div class="colorpicker-palette-overlay" style="display: none; position: absolute; top: calc(100% + 8px); left: 0; z-index: 600; background: var(--lt-surface-0); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.875rem; width: 220px; box-sizing: border-box;">
                <div style="font-size: 0.6875rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem;">Palette Swatches</div>
                
                <!-- 5-Column Swatch Grid -->
                <div class="colorpicker-swatches-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 0.875rem; justify-items: center;">
                    ${swatchesHtml}
                </div>

                <!-- Custom Hex & Native Spectrum Picker -->
                <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%; box-sizing: border-box;">
                    <!-- Stylized Native Color Picker Button -->
                    <div style="position: relative; width: 2rem; height: 2rem; flex-shrink: 0; border-radius: var(--lt-radius); border: 1px solid var(--lt-surface-200); overflow: hidden; background: ${currentColor}; cursor: pointer;">
                        <input type="color" class="color-native-input" value="${currentColor}" style="position: absolute; inset: -4px; width: 200%; height: 200%; opacity: 0; cursor: pointer; border: none; padding: 0;" />
                    </div>

                    <!-- Hex Text Input -->
                    <div style="flex: 1; min-width: 0; display: flex; align-items: center; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); padding: 0 0.5rem; box-sizing: border-box;">
                        <span style="font-size: 0.75rem; color: var(--lt-surface-400); font-family: monospace; user-select: none;">#</span>
                        <input type="text" 
                               class="color-hex-input" 
                               value="${currentColor.replace('#', '')}" 
                               maxlength="6" 
                               placeholder="10b981"
                               style="width: 100%; min-width: 0; padding: 0.35rem 0.25rem; font-family: monospace; font-size: 0.8125rem; color: var(--lt-text-primary); border: none; outline: none; background: transparent; box-sizing: border-box;" />
                    </div>
                </div>
            </div>
        </div>
    `;

    const triggerBtn = container.querySelector<HTMLButtonElement>('.colorpicker-trigger-btn')!;
    const hexLabel = container.querySelector<HTMLElement>('.colorpicker-hex-label')!;
    const overlay = container.querySelector<HTMLElement>('.colorpicker-palette-overlay')!;
    const nativeInput = container.querySelector<HTMLInputElement>('.color-native-input')!;
    const hexInput = container.querySelector<HTMLInputElement>('.color-hex-input')!;
    const nativePreview = nativeInput.parentElement as HTMLElement;

    function applyColor(newColor: string, fromHexInput = false) {
        currentColor = newColor.startsWith('#') ? newColor : `#${newColor}`;
        triggerBtn.style.backgroundColor = currentColor;
        nativePreview.style.backgroundColor = currentColor;
        hexLabel.textContent = currentColor.toUpperCase();
        nativeInput.value = currentColor;

        if (!fromHexInput) {
            hexInput.value = currentColor.replace('#', '');
        }

        // Update swatch selection outlines
        container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn').forEach(btn => {
            const btnColor = btn.getAttribute('data-color') || '';
            const isMatch = btnColor.toLowerCase() === currentColor.toLowerCase();
            btn.style.border = isMatch ? '2px solid var(--lt-surface-0, var(--lt-surface-0))' : '1px solid rgba(0,0,0,0.15)';
            btn.style.boxShadow = isMatch ? '0 0 0 2px var(--lt-primary-600)' : 'none';
        });

        syncValue();
    }

    function toggleOverlay(show?: boolean) {
        isOpen = show !== undefined ? show : !isOpen;
        overlay.style.display = isOpen ? 'block' : 'none';
    }

    if (!props.disabled) {
        triggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleOverlay();
        });

        container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const color = btn.getAttribute('data-color')!;
                applyColor(color);
                toggleOverlay(false);
            });
        });

        nativeInput.addEventListener('input', () => {
            applyColor(nativeInput.value);
        });

        hexInput.addEventListener('input', () => {
            const raw = hexInput.value.trim().replace('#', '');
            if (/^[0-9A-Fa-f]{6}$/.test(raw) || /^[0-9A-Fa-f]{3}$/.test(raw)) {
                applyColor(`#${raw}`, true);
            }
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target as Node)) {
                toggleOverlay(false);
            }
        });
    }

    function syncValue() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = currentColor;
        }

        container.dispatchEvent(new CustomEvent('color:change', {
            bubbles: true,
            detail: { value: currentColor }
        }));
    }

    syncValue();
}

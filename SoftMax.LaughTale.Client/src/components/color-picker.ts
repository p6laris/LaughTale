/**
 * SoftMax.LaughTale: Enterprise ColorPicker Component (Aura ColorPicker inspired)
 */

import { LucideIcons } from '../icons/lucide';

export interface ColorPickerProps {
    value?: string; // Hex color e.g. '#10b981'
    targetInputName?: string;
    disabled?: boolean;
}

const DEFAULT_PRESETS = [
    '#10b981', '#059669', '#3b82f6', '#2563eb', '#6366f1',
    '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b',
    '#14b8a6', '#06b6d4', '#64748b', '#1e293b', '#000000'
];

export default function ColorPickerIsland(container: HTMLElement, props: ColorPickerProps) {
    let currentColor = props.value || '#10b981';
    let isOpen = false;

    function render() {
        const swatches = DEFAULT_PRESETS.map(c => `
            <button type="button" 
                    class="color-swatch-btn" 
                    data-color="${c}" 
                    style="width: 1.5rem; height: 1.5rem; border-radius: 4px; border: ${c === currentColor ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.1)'}; background: ${c}; cursor: pointer; box-shadow: ${c === currentColor ? '0 0 0 2px var(--p-primary-600)' : 'none'}; transition: transform 0.15s ease;">
            </button>
        `).join('');

        container.innerHTML = `
            <div class="laughtale-colorpicker" style="position: relative; display: inline-flex; align-items: center; gap: 0.5rem;">
                <!-- Color Swatch Trigger -->
                <button type="button" 
                        class="colorpicker-trigger-btn" 
                        ${props.disabled ? 'disabled' : ''} 
                        style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius); border: 2px solid var(--p-surface-200); background: ${currentColor}; cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; box-shadow: var(--p-shadow-sm); transition: transform 0.15s ease, border-color 0.15s ease;">
                </button>
                <span style="font-family: monospace; font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">${currentColor.toUpperCase()}</span>

                <!-- Palette Popover -->
                <div class="colorpicker-palette-overlay" style="display: ${isOpen ? 'block' : 'none'}; position: absolute; top: calc(100% + 6px); left: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.875rem; width: 180px;">
                    <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; margin-bottom: 0.5rem;">Palette Swatches</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 0.75rem;">
                        ${swatches}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <input type="color" class="color-native-input" value="${currentColor}" style="width: 2rem; height: 1.75rem; border: none; padding: 0; background: transparent; cursor: pointer;" />
                        <input type="text" class="color-hex-input" value="${currentColor}" maxlength="7" style="flex: 1; padding: 0.25rem 0.5rem; font-family: monospace; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius);" />
                    </div>
                </div>
            </div>
        `;

        container.querySelector('.colorpicker-trigger-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            render();
        });

        container.querySelectorAll('.color-swatch-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentColor = btn.getAttribute('data-color')!;
                isOpen = false;
                render();
                syncValue();
            });
        });

        const nativeInput = container.querySelector<HTMLInputElement>('.color-native-input');
        nativeInput?.addEventListener('input', (e) => {
            currentColor = (e.target as HTMLInputElement).value;
            render();
            syncValue();
        });

        const hexInput = container.querySelector<HTMLInputElement>('.color-hex-input');
        hexInput?.addEventListener('change', (e) => {
            const val = (e.target as HTMLInputElement).value;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                currentColor = val;
                render();
                syncValue();
            }
        });
    }

    function syncValue() {
        if (props.targetInputName) {
            let hidden = document.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
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

    render();
    syncValue();
}

import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { useFloatingPosition } from '../composables/useFloatingPosition';
import { useFormField } from '../composables/useFormField';
import { useLocale } from '../composables/useLocale';
import { useDisclosure } from '../composables/useDisclosure';
import { html, setHtml, attr, type Raw } from '../runtime/html';
import { announce } from '../accessibility/announcer';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'input'
};

export interface ColorPickerProps {
    name?: string;
    value?: string; // Hex color e.g. 'var(--lt-primary-500, var(--lt-primary-500))'
    targetInputName?: string;
    disabled?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

// Palette entries are user-pickable colors, so each one needs a literal #rrggbb behind it: the value
// the picker emits must be a real color (<input type="color"> only accepts #rrggbb). The earlier
// hex-to-token migration replaced them with bare `var(--token, var(--token))` strings, which
// applyColor then turned into e.g. "#var(--lt-primary-500, ...)" - an invalid color - and collapsed
// 15 distinct colors into 11. Each entry is now `var(--token, #hex)`: the token keeps it themeable,
// the fallback keeps it resolvable. Colors with no design token get a component-scoped hook.
const DEFAULT_PRESETS = [
    'var(--lt-primary-500, #10b981)', 'var(--lt-primary-600, #059669)', 'var(--lt-info-500, #3b82f6)', 'var(--lt-info-600, #2563eb)', 'var(--p-colorpicker-swatch-indigo, #6366f1)',
    'var(--p-colorpicker-swatch-violet, #8b5cf6)', 'var(--p-colorpicker-swatch-pink, #ec4899)', 'var(--p-colorpicker-swatch-rose, #f43f5e)', 'var(--lt-danger-500, #ef4444)', 'var(--lt-warn-500, #f59e0b)',
    'var(--p-colorpicker-swatch-teal, #14b8a6)', 'var(--p-colorpicker-swatch-cyan, #06b6d4)', 'var(--lt-surface-500, #64748b)', 'var(--lt-surface-800, #1e293b)', 'var(--p-colorpicker-swatch-black, #000000)'
];

function rgbToHex(rgb: string): string | null {
    const m = rgb.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return null;
    return '#' + [m[1], m[2], m[3]].map(n => Number(n).toString(16).padStart(2, '0')).join('');
}

/**
 * Resolves a palette entry to the concrete #rrggbb the user actually sees - through the cascade, so a
 * theme override of the token is honored - falling back to the literal hex inside `var(--x, #hex)`
 * when the browser can't resolve it (e.g. a detached element).
 */
function resolveColor(value: string): string {
    if (value.startsWith('#')) return value.toLowerCase();
    if (typeof document !== 'undefined' && document.body) {
        const probe = document.createElement('span');
        probe.style.color = value;
        document.body.appendChild(probe);
        const hex = rgbToHex(window.getComputedStyle(probe).color);
        probe.remove();
        if (hex) return hex;
    }
    const fallback = value.match(/#[0-9a-fA-F]{6}\b/);
    return fallback ? fallback[0].toLowerCase() : value;
}


const CSS = `
html.dark .colorpicker-hex-label,
[data-theme="dark"] .colorpicker-hex-label,
.dark .colorpicker-hex-label {
    color: var(--p-text-color) !important;
}
html.dark .colorpicker-palette-overlay,
[data-theme="dark"] .colorpicker-palette-overlay,
.dark .colorpicker-palette-overlay {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}
html.dark .color-hex-input,
[data-theme="dark"] .color-hex-input,
.dark .color-hex-input {
    background: transparent !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
`;

export default function ColorPickerIsland(container: HTMLElement, props: ColorPickerProps, ctx?: IslandContext) {
    injectIslandStyle('color-picker', CSS);
    const locale = useLocale(ctx);

    const formField = useFormField(container, ctx, {
        cardinality: 'Single',
        fieldKind: 'Hidden',
        name: props.name || props.targetInputName || (props as any).targetInput
    });

    let currentColor = resolveColor(props.value || formField.field?.value || DEFAULT_PRESETS[0]);

    // Swatch hex values, labels and the selected outline are filled in by refreshSwatches() when the
    // palette opens: resolving a color forces a style recalc, and the palette is hidden until then.
    const swatches = DEFAULT_PRESETS.map(c => {
        const styleVal = `width: 1.75rem; height: 1.75rem; border-radius: 4px; border: 1px solid rgba(0,0,0,0.15); background: ${c}; cursor: pointer; box-shadow: none; transition: transform 0.15s ease, box-shadow 0.15s ease;`;

        return html`
            <button type="button"
                    class="color-swatch-btn" data-part="root"
                    data-color="${c}"
                    style="${styleVal}">
            </button>
        `;
    });

    // Static DOM skeleton built once
    formField.detach();
    setHtml(container, html`
        <div class="laughtale-colorpicker" style="position: relative; display: inline-flex; align-items: center; gap: 0.625rem; font-family: var(--p-font-family, inherit);">
            <!-- Color Swatch Trigger Button -->
            <button type="button" 
                    class="colorpicker-trigger-btn" 
                    ${attr('disabled', props.disabled)} 
                    style="width: 2.25rem; height: 2.25rem; border-radius: var(--lt-radius); border: 2px solid var(--lt-surface-200); background: ${currentColor}; cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; box-shadow: var(--p-shadow-sm); transition: transform 0.15s ease, border-color 0.15s ease; padding: 0; outline: none;">
            </button>
            <span class="colorpicker-hex-label" style="font-family: monospace; font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">${currentColor.toUpperCase()}</span>

            <!-- Palette Popover -->
            <div class="colorpicker-palette-overlay" style="display: none; z-index: 600; background: var(--lt-surface-0); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.875rem; width: 220px; box-sizing: border-box;">
                <div style="font-size: 0.6875rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem;">Palette Swatches</div>
                
                <!-- 5-Column Swatch Grid -->
                <div class="colorpicker-swatches-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 0.875rem; justify-items: center;">
                    ${swatches}
                </div>

                <!-- Custom Hex & Native Spectrum Picker -->
                <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%; box-sizing: border-box;">
                    <!-- Stylized Native Color Picker Button -->
                    <div style="position: relative; width: 2rem; height: 2rem; flex-shrink: 0; border-radius: var(--lt-radius); border: 1px solid var(--lt-surface-200); overflow: hidden; background: ${currentColor}; cursor: pointer;">
                        <input type="color" class="color-native-input" value="${currentColor}" aria-label="Color spectrum" style="position: absolute; inset: -4px; width: 200%; height: 200%; opacity: 0; cursor: pointer; border: none; padding: 0;" />
                    </div>

                    <!-- Hex Text Input -->
                    <div style="flex: 1; min-width: 0; display: flex; align-items: center; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); padding: 0 0.5rem; box-sizing: border-box;">
                        <span style="font-size: 0.75rem; color: var(--lt-surface-400); font-family: monospace; user-select: none;">#</span>
                        <input type="text" 
                                class="color-hex-input" 
                                value="${currentColor.replace('#', '')}" 
                                maxlength="6" 
                                placeholder="10b981"
                                aria-label="Hex color value"
                                style="width: 100%; min-width: 0; padding: 0.35rem 0.25rem; font-family: monospace; font-size: 0.8125rem; color: var(--lt-text-primary); border: none; outline: none; background: transparent; box-sizing: border-box;" />
                    </div>
                </div>
            </div>
        </div>
    `);
    formField.reattach();

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

        highlightSelected();
        syncValue();
    }

    function highlightSelected() {
        container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn').forEach(btn => {
            const isMatch = btn.getAttribute('data-hex') === currentColor.toLowerCase();
            btn.style.border = isMatch ? '2px solid var(--lt-surface-0, var(--lt-surface-0))' : '1px solid rgba(0,0,0,0.15)';
            btn.style.boxShadow = isMatch ? '0 0 0 2px var(--lt-primary-600)' : 'none';
        });
    }

    // Resolving forces a style recalc, far too costly to do per applyColor() (which runs on every hex
    // keystroke and native-spectrum drag event) or at mount (the palette is hidden). Running it on
    // open also picks up a theme change that happened while the palette was closed.
    function refreshSwatches() {
        container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn').forEach(btn => {
            const hex = resolveColor(btn.getAttribute('data-color') || '');
            btn.setAttribute('data-hex', hex);
            btn.setAttribute('title', hex.toUpperCase());
            btn.setAttribute('aria-label', `Select color ${hex.toUpperCase()}`);
        });
        highlightSelected();
    }

    // ROADMAP.v5.md Part M "Adopt - State machine": closing used to just null this reference without
    // calling destroy(). With `reposition: 'follow'`, each controller binds window scroll/resize
    // listeners plus a ResizeObserver, scoped to the island's own signal - so they outlived the close.
    // Every open added another set, all repositioning the hidden overlay on every scroll for the
    // island's whole lifetime. Now onClose destroys the controller.
    let floatingHandle: { update: () => void; destroy: () => void } | null = null;

    const overlayDisclosure = useDisclosure({
        disabled: () => !!props.disabled,
        onOpen: () => {
            refreshSwatches();
            overlay.style.display = 'block';
            floatingHandle = useFloatingPosition(triggerBtn, overlay, {
                placement: 'bottom-start',
                reposition: 'follow',
                signal: ctx?.signal,
                offset: 8,
                isRtl: locale.isRtl
            });
        },
        onClose: () => {
            overlay.style.display = 'none';
            floatingHandle?.destroy();
            floatingHandle = null;
        }
    });

    function toggleOverlay(show?: boolean) {
        if (show === undefined) overlayDisclosure.toggle();
        else overlayDisclosure.setOpen(show);
    }

    if (!props.disabled) {
        triggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleOverlay();
        }, { signal: ctx?.signal });

        container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                applyColor(btn.getAttribute('data-hex')!);
                toggleOverlay(false);
            }, { signal: ctx?.signal });
        });

        nativeInput.addEventListener('input', () => {
            applyColor(nativeInput.value);
        }, { signal: ctx?.signal });

        hexInput.addEventListener('input', () => {
            const raw = hexInput.value.trim().replace('#', '');
            if (/^[0-9A-Fa-f]{6}$/.test(raw) || /^[0-9A-Fa-f]{3}$/.test(raw)) {
                applyColor(`#${raw}`, true);
            }
        }, { signal: ctx?.signal });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target as Node)) {
                toggleOverlay(false);
            }
        }, { signal: ctx?.signal });

        // The palette previously had no keyboard dismissal at all.
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlayDisclosure.isOpen) {
                e.preventDefault();
                toggleOverlay(false);
                triggerBtn.focus();
            }
        }, { signal: ctx?.signal });
    }

    function syncValue() {
        formField.setValue(currentColor);

        emitComponentEvent(container, 'color-picker', 'change', {
            value: currentColor
        });
        announce(`Color selected: ${currentColor}`, 'polite');
    }

    syncValue();
}

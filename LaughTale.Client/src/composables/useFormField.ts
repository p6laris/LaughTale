/**
 * LaughTale: Headless useFormField Composable
 * Contract C5: Manages server-rendered form fields, non-destructive hydration adoption,
 * detach-and-reattach lifecycle across renders, and cardinality-aware value serialization (C2).
 */

import type { IslandContext } from '../runtime/registry';

export type FormCardinality = 'Single' | 'Multiple' | 'Boolean';
export type FormFieldKind = 'Hidden' | 'Native';

export interface UseFormFieldOptions {
    /**
     * Value cardinality wire shape: Single, Multiple, or Boolean.
     * Default is 'Single'.
     */
    cardinality?: FormCardinality;

    /**
     * Element kind: Hidden (client-drawn widget) or Native (control is native input/textarea/select).
     * Default is 'Hidden'.
     */
    fieldKind?: FormFieldKind;

    /**
     * Optional explicit field name. If omitted, uses name from adopted field.
     */
    name?: string;
}

export interface UseFormFieldReturn {
    /**
     * The primary adopted field element.
     */
    field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;

    /**
     * The boolean companion field element (value="false"), if present.
     */
    companion: HTMLInputElement | null;

    /**
     * Updates the form field's serialized value according to declared cardinality.
     */
    setValue: (val: any) => void;

    /**
     * Reads the current value from the adopted field(s).
     */
    getValue: () => any;

    /**
     * Detaches the field and companion from the container (to protect them before innerHTML replacement).
     */
    detach: () => void;

    /**
     * Re-attaches the adopted field and companion to the container after rendering.
     */
    reattach: () => void;

    /**
     * Tears down observers and cleanup.
     */
    destroy: () => void;
}

export function useFormField(
    container: HTMLElement,
    ctx?: IslandContext,
    options: UseFormFieldOptions = {}
): UseFormFieldReturn {
    const cardinality = options.cardinality ?? 'Single';

    // Contract C5: Find server-rendered field by [data-lt-field] strictly within the container
    const initialField = container.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        ':scope [data-lt-field]'
    );
    const initialCompanion = container.querySelector<HTMLInputElement>(
        ':scope [data-lt-field-companion]'
    );

    if (!initialField) {
        // Contract C5: Diagnostic warning & no-op when no server-rendered field is found
        if (typeof console !== 'undefined' && console.warn) {
            console.warn(
                '[LaughTale] useFormField: No server-rendered field with [data-lt-field] found in container.',
                container
            );
        }

        return {
            field: null,
            companion: null,
            setValue: () => {},
            getValue: () => undefined,
            detach: () => {},
            reattach: () => {},
            destroy: () => {}
        };
    }

    const field = initialField;
    const companion = initialCompanion;
    field.setAttribute('data-lt-ssr-hydrated', 'true');
    if (companion) {
        companion.setAttribute('data-lt-ssr-hydrated', 'true');
    }
    const fieldName = options.name || field.name;

    // Track multiple fields for 'Multiple' cardinality
    const multipleFields: HTMLInputElement[] = [];
    if (cardinality === 'Multiple') {
        const existing = Array.from(
            container.querySelectorAll<HTMLInputElement>(':scope input[data-lt-field]')
        );
        for (const f of existing) {
            f.setAttribute('data-lt-ssr-hydrated', 'true');
        }
        multipleFields.push(...existing);
    }

    // Capture initial value for form reset handling
    const initialFieldValue = field.value;
    const initialMultipleValues = multipleFields.map(f => f.value);
    const initialFieldDisabled = field.disabled;

    function detach() {
        if (companion && companion.parentElement) {
            companion.remove();
        }
        if (cardinality === 'Multiple') {
            for (const f of multipleFields) {
                if (f.parentElement) f.remove();
            }
        } else if (field.parentElement) {
            field.remove();
        }
    }

    function reattach() {
        if (companion && !container.contains(companion)) {
            container.appendChild(companion);
        }
        if (cardinality === 'Multiple') {
            for (const f of multipleFields) {
                if (!container.contains(f)) {
                    container.appendChild(f);
                }
            }
        } else if (!container.contains(field)) {
            container.appendChild(field);
        }
    }

    function setValue(val: any) {
        if (cardinality === 'Boolean') {
            const isChecked = val === true || val === 'true' || val === 1 || val === '1' || (typeof val === 'string' && val.length > 0 && val !== 'false');
            if (field instanceof HTMLInputElement && field.type === 'checkbox') {
                field.checked = isChecked;
                field.disabled = false;
            } else {
                if (typeof val === 'string' && val !== 'true' && val !== 'false') {
                    field.value = val;
                } else if (!field.value || field.value === 'false') {
                    field.value = 'true';
                }
                // When unchecked, field is disabled so native POST submits only the companion (value="false")
                field.disabled = !isChecked;
            }
            if (companion) {
                companion.disabled = false;
            }
        } else if (cardinality === 'Multiple') {
            const values = Array.isArray(val)
                ? val.map(v => (v == null ? '' : String(v)))
                : (val == null || val === '' ? [] : [String(val)]);

            if (values.length === 0) {
                // Contract C2: Empty selection submits no field for that name
                for (const f of multipleFields) {
                    f.disabled = true;
                }
            } else {
                // Match required field count using cloneNode (NEVER document.createElement)
                while (multipleFields.length < values.length) {
                    const cloned = field.cloneNode(true) as HTMLInputElement;
                    cloned.name = fieldName;
                    cloned.setAttribute('data-lt-field', '');
                    cloned.setAttribute('data-lt-ssr-hydrated', 'true');
                    multipleFields.push(cloned);
                    if (container.contains(field)) {
                        container.appendChild(cloned);
                    }
                }

                for (let i = 0; i < multipleFields.length; i++) {
                    const f = multipleFields[i];
                    if (i < values.length) {
                        f.value = values[i];
                        f.disabled = false;
                    } else {
                        f.disabled = true;
                    }
                }
            }
        } else {
            // Single cardinality: empty value submitted as value=""
            const serialized = val == null ? '' : String(val);
            field.value = serialized;
            field.disabled = false;
        }
    }

    function getValue(): any {
        if (cardinality === 'Boolean') {
            if (field instanceof HTMLInputElement && field.type === 'checkbox') {
                return field.checked;
            }
            return !field.disabled && field.value === 'true';
        } else if (cardinality === 'Multiple') {
            return multipleFields.filter(f => !f.disabled).map(f => f.value);
        } else {
            return field.value;
        }
    }

    // Auto-reattach observer to ensure field survives setHtml innerHTML replacements
    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(() => {
            reattach();
        });
        observer.observe(container, { childList: true });
    }

    // Native form reset listener (Contract C6, Scenario 4)
    const enclosingForm = container.closest('form');
    if (enclosingForm) {
        enclosingForm.addEventListener(
            'reset',
            () => {
                if (cardinality === 'Boolean') {
                    field.disabled = initialFieldDisabled;
                    if (field instanceof HTMLInputElement && field.type === 'checkbox') {
                        field.checked = !initialFieldDisabled;
                    }
                } else if (cardinality === 'Multiple') {
                    for (let i = 0; i < multipleFields.length; i++) {
                        if (i < initialMultipleValues.length) {
                            multipleFields[i].value = initialMultipleValues[i];
                            multipleFields[i].disabled = false;
                        } else {
                            multipleFields[i].disabled = true;
                        }
                    }
                } else {
                    field.value = initialFieldValue;
                    field.disabled = initialFieldDisabled;
                }
            },
            { signal: ctx?.signal }
        );
    }

    function destroy() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    if (ctx?.signal) {
        ctx.signal.addEventListener('abort', destroy, { once: true });
    }
    if (ctx?.onCleanup) {
        ctx.onCleanup(destroy);
    }

    return {
        field,
        companion,
        setValue,
        getValue,
        detach,
        reattach,
        destroy
    };
}

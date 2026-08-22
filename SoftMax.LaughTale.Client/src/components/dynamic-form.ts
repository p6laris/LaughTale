/**
 * SoftMax.LaughTale: Enterprise Dynamic Form Generator Component
 * Strongly-typed auto-generated form from C# DynamicFormSchema.
 */

import { DynamicFormSchema, FormFieldMetadata } from '../types/models';
import { LucideIcons } from '../icons/lucide';

export interface DynamicFormProps<T = Record<string, any>> {
    schema?: DynamicFormSchema<T>;
    schemaJson?: string;
    targetAction?: string;
}

export default function DynamicFormIsland<T = Record<string, any>>(container: HTMLElement, props: DynamicFormProps<T>) {
    let schema: DynamicFormSchema<T> | null = props.schema || null;

    if (!schema && props.schemaJson) {
        try {
            schema = JSON.parse(props.schemaJson);
        } catch (err) {
            console.error('[SoftMax.LaughTale DynamicForm] Failed to parse schemaJson:', err);
        }
    }

    if (!schema) {
        container.innerHTML = `<div style="color: var(--p-surface-400); font-size: 0.875rem;">No Form Schema provided.</div>`;
        return;
    }

    const formData: Record<string, any> = {};
    const errors: Record<string, string> = {};

    // Initialize default values
    schema.fields.forEach(f => {
        formData[f.name] = f.defaultValue !== undefined && f.defaultValue !== null ? f.defaultValue : '';
    });

    function renderField(f: FormFieldMetadata): string {
        const val = formData[f.name] ?? '';
        const error = errors[f.name];

        let controlHtml = '';

        switch (f.fieldType) {
            case 'Password':
                controlHtml = `
                    <div style="position: relative;">
                        <input type="password" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" placeholder="${f.placeholder || ''}" ${f.isRequired ? 'required' : ''} style="width: 100%;" />
                    </div>
                `;
                break;
            case 'Multiline':
                controlHtml = `
                    <textarea name="${f.name}" class="p-input form-field-input" data-field="${f.name}" rows="3" placeholder="${f.placeholder || ''}" ${f.isRequired ? 'required' : ''} style="width: 100%; resize: vertical;">${val}</textarea>
                `;
                break;
            case 'Number':
            case 'Currency':
                controlHtml = `
                    <input type="number" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" min="${f.min ?? ''}" max="${f.max ?? ''}" placeholder="${f.placeholder || ''}" ${f.isRequired ? 'required' : ''} style="width: 100%;" />
                `;
                break;
            case 'Switch':
                const checked = Boolean(val);
                controlHtml = `
                    <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" name="${f.name}" class="form-field-checkbox" data-field="${f.name}" ${checked ? 'checked' : ''} style="width: 1.25rem; height: 1.25rem; accent-color: var(--p-primary-600);" />
                        <span style="font-size: 0.875rem; color: var(--p-surface-700);">${f.label}</span>
                    </label>
                `;
                break;
            case 'Select':
                const options = (f.options || []).map(opt => `<option value="${opt.value}" ${opt.value === val ? 'selected' : ''}>${opt.label}</option>`).join('');
                controlHtml = `
                    <select name="${f.name}" class="p-input form-field-select" data-field="${f.name}" style="width: 100%;">
                        ${options}
                    </select>
                `;
                break;
            case 'DatePicker':
                controlHtml = `
                    <input type="date" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" style="width: 100%;" />
                `;
                break;
            default: // Text, Email
                controlHtml = `
                    <input type="${f.fieldType === 'Email' ? 'email' : 'text'}" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" placeholder="${f.placeholder || ''}" ${f.isRequired ? 'required' : ''} style="width: 100%;" />
                `;
                break;
        }

        return `
            <div class="form-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
                ${f.fieldType !== 'Switch' ? `
                    <label style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800); display: flex; align-items: center; gap: 0.25rem;">
                        ${f.label}
                        ${f.isRequired ? '<span style="color: #ef4444;">*</span>' : ''}
                    </label>
                ` : ''}
                ${controlHtml}
                ${f.helpText ? `<span style="font-size: 0.75rem; color: var(--p-surface-400);">${f.helpText}</span>` : ''}
                ${error ? `<span style="font-size: 0.75rem; color: #ef4444; font-weight: 500;">${error}</span>` : ''}
            </div>
        `;
    }

    function render() {
        const fieldsHtml = schema!.fields.map(renderField).join('');

        container.innerHTML = `
            <form class="laughtale-dynamic-form" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.75rem; display: flex; flex-direction: column; gap: 1.25rem;">
                <!-- Form Header -->
                <div style="border-bottom: 1px solid var(--p-border-color); padding-bottom: 0.875rem;">
                    <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900); margin-bottom: 0.25rem;">${schema!.title}</h3>
                    ${schema!.description ? `<p style="font-size: 0.8125rem; color: var(--p-surface-500);">${schema!.description}</p>` : ''}
                </div>

                <!-- Form Fields Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
                    ${fieldsHtml}
                </div>

                <!-- Submit Button -->
                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--p-border-color); padding-top: 1rem; margin-top: 0.5rem;">
                    <button type="submit" class="p-button p-button-primary" style="padding: 0.5rem 1.25rem; font-size: 0.875rem;">
                        ${schema!.submitLabel || 'Submit'}
                    </button>
                </div>
            </form>
        `;

        bindEvents();
    }

    function validate(): boolean {
        let valid = true;
        Object.keys(errors).forEach(k => delete errors[k]);

        schema!.fields.forEach(f => {
            const val = formData[f.name];
            if (f.isRequired && (val === undefined || val === null || val === '')) {
                errors[f.name] = `${f.label} is required.`;
                valid = false;
            } else if (f.fieldType === 'Email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) {
                errors[f.name] = `Invalid email address.`;
                valid = false;
            }
        });

        return valid;
    }

    function bindEvents() {
        const form = container.querySelector<HTMLFormElement>('.laughtale-dynamic-form')!;

        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('.form-field-input, .form-field-select').forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const fieldName = target.getAttribute('data-field')!;
                formData[fieldName] = target.value;
            });
        });

        form.querySelectorAll<HTMLInputElement>('.form-field-checkbox').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const fieldName = target.getAttribute('data-field')!;
                formData[fieldName] = target.checked;
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validate()) {
                container.dispatchEvent(new CustomEvent('form:submit', {
                    bubbles: true,
                    detail: { data: formData }
                }));

                const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `${LucideIcons.check} Submitted Successfully!`;
                submitBtn.style.backgroundColor = '#059669';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                }, 2500);
            } else {
                render();
            }
        });
    }

    render();
}

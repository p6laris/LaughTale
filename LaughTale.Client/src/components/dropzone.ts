import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { announce } from '../accessibility/announcer';
import type { PatternDeclaration } from '../accessibility/patterns';
import { useFormField } from '../composables/useFormField';

// Native <input type="file"> is server-rendered and adopted via useFormField({ fieldKind: 'Native' })
export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'input'
};

export interface DropzoneProps {
    name?: string;
    targetInputName?: string;
    allowedExtensions?: string;
    maxSizeMb?: number;
    dropPrompt?: string;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
island-dropzone,
p-dropzone {
    display: block !important;
    width: 100%;
}

.dropzone-box {
    border: 2px dashed var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 8px);
    padding: 2.5rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    background-color: var(--p-surface-50, #f8fafc);
    box-sizing: border-box;
}

.dropzone-box:hover {
    border-color: var(--p-primary-500, #10b981);
    background-color: var(--p-surface-100, #f1f5f9);
}

.dropzone-icon {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: var(--p-primary-500, #10b981);
    transition: transform 0.2s ease;
}

.dropzone-box:hover .dropzone-icon {
    transform: scale(1.08);
}

.dropzone-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-text-color, #1e293b);
}

.dropzone-subtitle {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
    margin-top: 0.35rem;
}

/* Dark Mode Tokens */
html.dark .dropzone-box,
[data-theme="dark"] .dropzone-box,
.dark .dropzone-box {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-700, #334155);
}

html.dark .dropzone-box:hover,
[data-theme="dark"] .dropzone-box:hover,
.dark .dropzone-box:hover {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-primary-500, #10b981);
}

html.dark .dropzone-icon,
[data-theme="dark"] .dropzone-icon,
.dark .dropzone-icon {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-primary-400, #34d399);
}

html.dark .dropzone-title,
[data-theme="dark"] .dropzone-title,
.dark .dropzone-title {
    color: var(--p-text-color, #f8fafc);
}

html.dark .dropzone-subtitle,
[data-theme="dark"] .dropzone-subtitle,
.dark .dropzone-subtitle {
    color: var(--p-text-muted, #94a3b8);
}
`;

export default function DropzoneIsland(container: HTMLElement, props: DropzoneProps, ctx?: IslandContext) {
    injectIslandStyle('dropzone', CSS);

    const formField = useFormField(container, ctx, {
        cardinality: 'Multiple',
        fieldKind: 'Native',
        name: props.name || props.targetInputName
    });

    formField.detach();
    setHtml(container, html`
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-text-muted, #64748b);">Secure Document Vault</span>
                <span class="p-tag p-tag-info" style="font-size: 0.6875rem;">Client Dropzone</span>
            </div>

            <div class="dropzone-box" tabindex="0" aria-label="${props.dropPrompt || 'Drag and drop files here to upload'}">
                <div class="dropzone-icon">
                    ${unsafe(getLucideIcon('cloud-upload', 24, 2))}
                </div>
                
                <div class="dropzone-title">${props.dropPrompt || 'Drag and drop files here to upload'}</div>
                <div class="dropzone-subtitle">
                    Supported: ${props.allowedExtensions || 'All files'} &bull; Max Size: ${props.maxSizeMb || 10} MB
                </div>

                <div class="preview-area" style="display: none; margin-top: 1rem;"></div>
            </div>
        </div>
    `);
    formField.reattach();

    const box = container.querySelector('.dropzone-box') as HTMLElement;
    const input = (formField.field as HTMLInputElement) || (container.querySelector('.file-input') as HTMLInputElement);
    const preview = container.querySelector('.preview-area') as HTMLElement;

    if (input) {
        input.classList.add('file-input');
        input.style.display = 'none';
        if (props.allowedExtensions) {
            input.accept = props.allowedExtensions;
        }
        if (props.dropPrompt) {
            input.setAttribute('aria-label', props.dropPrompt);
        }
        if (box && !box.contains(input)) {
            box.insertBefore(input, box.firstChild);
        }
    }

    if (box && input) {
        box.addEventListener('click', () => input.click(), { signal: ctx?.signal });
        box.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                input.click();
            }
        }, { signal: ctx?.signal });

        box.addEventListener('dragover', (e) => {
            e.preventDefault();
            box.style.borderColor = 'var(--p-primary-500, #10b981)';
        }, { signal: ctx?.signal });

        box.addEventListener('dragleave', () => {
            box.style.borderColor = '';
        }, { signal: ctx?.signal });

        box.addEventListener('drop', (e) => {
            e.preventDefault();
            box.style.borderColor = '';
            if (e.dataTransfer?.files.length) {
                input.files = e.dataTransfer.files;
                handleFiles(input.files[0]);
            }
        }, { signal: ctx?.signal });

        input.addEventListener('change', () => {
            if (input.files?.length) {
                handleFiles(input.files[0]);
            }
        }, { signal: ctx?.signal });
    }

    function handleFiles(file: File) {
        const sizeMb = file.size / (1024 * 1024);
        if (props.maxSizeMb && sizeMb > props.maxSizeMb) {
            alert(`File exceeds size limit of ${props.maxSizeMb} MB.`);
            input.value = '';
            return;
        }

        preview.style.display = 'block';
        setHtml(preview, html`
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.875rem; background: color-mix(in srgb, var(--p-primary-color, #10b981) 10%, transparent); border: 1px solid var(--p-primary-500, #10b981); border-radius: var(--p-border-radius, 6px); font-size: 0.8125rem; color: var(--p-text-color);">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span style="color: var(--p-primary-500); display: inline-flex;">${unsafe(getLucideIcon('file', 16, 2))}</span>
                    <strong style="overflow: hidden; text-overflow: ellipsis;">${file.name}</strong>
                    <span style="font-size: 0.75rem; color: var(--p-text-muted);">(${sizeMb.toFixed(2)} MB)</span>
                </div>
                <span class="p-tag p-tag-success" style="font-size: 0.6875rem;">Verified</span>
            </div>
        `);
        announce(`File uploaded: ${file.name}`, 'polite');
    }

    container.setAttribute('data-part', 'root');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}


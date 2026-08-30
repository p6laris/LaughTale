import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
export interface DropzoneProps {
    targetInputName: string;
    allowedExtensions: string;
    maxSizeMb: number;
    dropPrompt: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
[data-theme="dark"] .dropzone-box {
    background: var(--lt-surface-900) !important;
    color: var(--lt-surface-100) !important;
    border-color: var(--lt-surface-700) !important;
}
[data-theme="dark"] .file-input {
    background: var(--lt-surface-900) !important;
    color: var(--lt-surface-100) !important;
    border-color: var(--lt-surface-700) !important;
}
`;

export default function DropzoneIsland(container: HTMLElement, props: DropzoneProps, ctx?: IslandContext) {
    injectIslandStyle('dropzone', CSS);
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-600);">Document Vault</span>
                <span class="aura-tag tag-cyan">Hydrate: Visible</span>
            </div>

            <div class="dropzone-box" style="border: 2px dashed var(--lt-surface-200); border-radius: var(--lt-radius-lg); padding: 2rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease; background-color: var(--lt-surface-50);">
                <input type="file" class="file-input" name="${props.targetInputName}" accept="${props.allowedExtensions}" style="display: none;" />
                
                <div style="width: 2.75rem; height: 2.75rem; border-radius: 50%; background: var(--lt-surface-100); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; font-size: 1.25rem;">
                    ☁️
                </div>
                
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--lt-surface-800);">${props.dropPrompt}</div>
                <div style="font-size: 0.75rem; color: var(--lt-surface-500); margin-top: 0.25rem;">
                    Supported: ${props.allowedExtensions} &bull; Max Size: ${props.maxSizeMb} MB
                </div>

                <div class="preview-area" style="display: none; margin-top: 1rem;"></div>
            </div>
        </div>
    `;

    const box = container.querySelector('.dropzone-box') as HTMLElement;
    const input = container.querySelector('.file-input') as HTMLInputElement;
    const preview = container.querySelector('.preview-area') as HTMLElement;

    box.addEventListener('click', () => input.click());

    box.addEventListener('dragover', (e) => {
        e.preventDefault();
        box.style.borderColor = 'var(--lt-primary-500)';
        box.style.backgroundColor = 'var(--lt-primary-50)';
    });

    box.addEventListener('dragleave', () => {
        box.style.borderColor = 'var(--lt-surface-200)';
        box.style.backgroundColor = 'var(--lt-surface-50)';
    });

    box.addEventListener('drop', (e) => {
        e.preventDefault();
        box.style.borderColor = 'var(--lt-surface-200)';
        box.style.backgroundColor = 'var(--lt-surface-50)';
        if (e.dataTransfer?.files.length) {
            input.files = e.dataTransfer.files;
            handleFiles(input.files[0]);
        }
    });

    input.addEventListener('change', () => {
        if (input.files?.length) {
            handleFiles(input.files[0]);
        }
    });

    function handleFiles(file: File) {
        const sizeMb = file.size / (1024 * 1024);
        if (sizeMb > props.maxSizeMb) {
            alert(`File exceeds size limit of ${props.maxSizeMb} MB.`);
            input.value = '';
            return;
        }

        preview.style.display = 'block';
        preview.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--lt-primary-50); border: 1px solid var(--lt-primary-200); border-radius: var(--lt-radius); font-size: 0.8125rem; color: var(--lt-primary-700);">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span>📄</span>
                    <strong style="overflow: hidden; text-overflow: ellipsis;">${file.name}</strong>
                    <span style="font-size: 0.75rem; opacity: 0.8;">(${sizeMb.toFixed(2)} MB)</span>
                </div>
                <span class="aura-tag tag-emerald" style="font-size: 0.6875rem;">Verified</span>
            </div>
        `;
    }
}

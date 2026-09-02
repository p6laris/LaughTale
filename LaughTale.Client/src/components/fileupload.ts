import { useLocale } from '../composables/useLocale';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';

/**
 * LaughTale: Enterprise FileUpload Component (Aura Design System compliant)
 * Implements Basic, Auto, Advanced, InputGroup, Custom Upload, Dropzone Template, and Image Preview Grid.
 */

const FILEUPLOAD_CSS = `
island-fileupload,
p-fileupload {
    display: block !important;
    width: 100%;
}

.p-fileupload {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    font-family: var(--p-font-family, inherit);
}

/* Basic Mode */
.p-fileupload-basic {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.p-fileupload-choose {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0.5rem 1.15rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-primary-color, #10b981);
    border: 1px solid var(--p-primary-color, #10b981);
    color: var(--p-primary-contrast-color, #ffffff);
    transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    gap: 0.45rem;
    user-select: none;
    line-height: 1;
}

.p-fileupload-choose:hover {
    background: var(--p-primary-hover-color, #059669);
    border-color: var(--p-primary-hover-color, #059669);
}

.p-fileupload-choose:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--p-surface-0, #ffffff), 0 0 0 4px var(--p-primary-500, #10b981);
}

.p-fileupload-choose input[type="file"] {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    opacity: 0;
    min-height: 100%;
    min-width: 100%;
    font-size: 100px;
    text-align: right;
    cursor: pointer;
    z-index: 1;
}

.p-fileupload-filename {
    font-size: 0.875rem;
    color: var(--p-text-muted, #64748b);
    max-width: 16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Advanced Mode Container */
.p-fileupload-advanced {
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
}

.p-fileupload-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-border-color, #cbd5e1);
    flex-wrap: wrap;
}

.p-fileupload-header .p-button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--p-border-radius, 6px);
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
}

.p-fileupload-header .p-button-outlined {
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #cbd5e1);
    color: var(--p-text-color, #1e293b);
}

.p-fileupload-header .p-button-outlined:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    border-color: var(--p-border-color, #94a3b8);
}

.p-fileupload-header .p-button-outlined:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.p-fileupload-content {
    padding: 1.25rem;
    min-height: 9rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--p-surface-0, #ffffff);
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.p-fileupload-content.p-fileupload-highlight {
    background: color-mix(in srgb, var(--p-primary-color, #10b981) 6%, transparent);
    outline: 2px dashed var(--p-primary-500, #10b981);
    outline-offset: -4px;
}

/* Empty Dropzone State */
.p-fileupload-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2.25rem 1.5rem;
    color: var(--p-text-muted, #64748b);
    text-align: center;
    border: 2px dashed var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-50, #f8fafc);
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    width: 100%;
    box-sizing: border-box;
}

.p-fileupload-empty:hover {
    border-color: var(--p-primary-500, #10b981);
    background: var(--p-surface-100, #f1f5f9);
}

.p-fileupload-empty-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted, #64748b);
    margin-bottom: 0.25rem;
}

.p-fileupload-empty-title {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--p-text-color, #1e293b);
}

.p-fileupload-empty-subtitle {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
    font-weight: 500;
}

/* File Queue List */
.p-fileupload-file-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
}

.p-fileupload-file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    gap: 1rem;
}

.p-fileupload-file-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
}

.p-fileupload-thumbnail {
    width: 3rem;
    height: 3rem;
    border-radius: var(--p-border-radius, 6px);
    object-fit: cover;
    background: var(--p-surface-100, #f1f5f9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid var(--p-border-color, #cbd5e1);
}

.p-fileupload-file-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.p-fileupload-file-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color, #1e293b);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-fileupload-file-size {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
}

.p-fileupload-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    line-height: 1.2;
}

.p-fileupload-badge-pending {
    background: rgba(245, 158, 11, 0.12);
    color: var(--p-warn-700, #b45309);
}

.p-fileupload-badge-completed {
    background: color-mix(in srgb, var(--p-primary-color, #10b981) 15%, transparent);
    color: var(--p-primary-700, #047857);
}

.p-fileupload-badge-uploading {
    background: rgba(59, 130, 246, 0.12);
    color: var(--p-info-700, #1d4ed8);
}

.p-fileupload-progressbar {
    height: 0.35rem;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 9999px;
    overflow: hidden;
    margin: 0.5rem 1rem;
    position: relative;
}

.p-fileupload-progressbar-value {
    height: 100%;
    background: var(--p-primary-color, #10b981);
    border-radius: 9999px;
    transition: width 0.25s ease;
}

/* Image Grid Preview */
.p-fileupload-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
    gap: 1rem;
    width: 100%;
    box-sizing: border-box;
}

.p-fileupload-image-card {
    position: relative;
    aspect-ratio: 1;
    border-radius: var(--p-border-radius, 6px);
    overflow: hidden;
    border: 1px solid var(--p-border-color, #cbd5e1);
    background: var(--p-surface-100, #f1f5f9);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.p-fileupload-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.p-fileupload-image-card .p-fileupload-image-remove {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.8);
    color: #ffffff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.p-fileupload-image-card:hover .p-fileupload-image-remove {
    opacity: 1;
}

/* Single Big Preview Image for Custom Demo */
.p-fileupload-custom-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.25rem;
}

.p-fileupload-custom-preview img {
    max-width: 18rem;
    max-height: 22rem;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--p-border-color, #cbd5e1);
}

/* Dark Mode Tokens */
html.dark .p-fileupload-advanced,
[data-theme="dark"] .p-fileupload-advanced,
.dark .p-fileupload-advanced {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-fileupload-header,
[data-theme="dark"] .p-fileupload-header,
.dark .p-fileupload-header {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-fileupload-content,
[data-theme="dark"] .p-fileupload-content,
.dark .p-fileupload-content {
    background: var(--p-surface-900, #0f172a);
}

html.dark .p-fileupload-header .p-button-outlined,
[data-theme="dark"] .p-fileupload-header .p-button-outlined,
.dark .p-fileupload-header .p-button-outlined {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f1f5f9);
}

html.dark .p-fileupload-header .p-button-outlined:hover:not(:disabled),
[data-theme="dark"] .p-fileupload-header .p-button-outlined:hover:not(:disabled),
.dark .p-fileupload-header .p-button-outlined:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-600, #475569);
}

html.dark .p-fileupload-empty,
[data-theme="dark"] .p-fileupload-empty,
.dark .p-fileupload-empty {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-text-muted, #94a3b8);
}

html.dark .p-fileupload-empty:hover,
[data-theme="dark"] .p-fileupload-empty,
.dark .p-fileupload-empty {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-primary-500, #10b981);
}

html.dark .p-fileupload-empty-icon,
[data-theme="dark"] .p-fileupload-empty-icon,
.dark .p-fileupload-empty-icon {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-200, #e2e8f0);
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-fileupload-empty-title,
[data-theme="dark"] .p-fileupload-empty-title,
.dark .p-fileupload-empty-title {
    color: var(--p-text-color, #f8fafc);
}

html.dark .p-fileupload-file-item,
[data-theme="dark"] .p-fileupload-file-item,
.dark .p-fileupload-file-item {
    background: var(--p-surface-950, #020617);
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-fileupload-file-name,
[data-theme="dark"] .p-fileupload-file-name,
.dark .p-fileupload-file-name {
    color: var(--p-text-color, #f8fafc);
}

html.dark .p-fileupload-thumbnail,
[data-theme="dark"] .p-fileupload-thumbnail,
.dark .p-fileupload-thumbnail {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-fileupload-image-card,
[data-theme="dark"] .p-fileupload-image-card,
.dark .p-fileupload-image-card {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`;

export interface FileUploadProps {
    id?: string;
    mode?: 'basic' | 'advanced' | 'custom';
    name?: string;
    url?: string;
    accept?: string;
    maxFileSize?: number;
    multiple?: boolean;
    auto?: boolean;
    customUpload?: boolean;
    chooseLabel?: string;
    uploadLabel?: string;
    cancelLabel?: string;
    previewImages?: boolean;
    emptyTitle?: string;
    emptySubtitle?: string;
    initialFile?: {
        name: string;
        size: number;
        previewUrl?: string;
        status?: 'pending' | 'completed' | 'uploading';
    };
    initialImages?: Array<{
        id: string;
        name: string;
        previewUrl: string;
    }>;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

interface UploadedFileItem {
    id: string;
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
}

export default function FileUploadIsland(container: HTMLElement, props: FileUploadProps, ctx?: IslandContext) {
    injectIslandStyle('fileupload', FILEUPLOAD_CSS);

    const mode = props.mode || 'basic';
    const accept = props.accept || '*/*';
    const multiple = props.multiple || false;
    const auto = props.auto || false;
    const chooseLabel = props.chooseLabel || (mode === 'basic' ? 'Choose' : 'Choose');
    const uploadLabel = props.uploadLabel || 'Upload';
    const cancelLabel = props.cancelLabel || 'Cancel';
    const previewImages = props.previewImages || false;
    const emptyTitle = props.emptyTitle || 'Drag and drop files to here to upload.';
    const emptySubtitle = props.emptySubtitle || 'MAX. 1MB';

    // Instance-isolated state
    let fileQueue: UploadedFileItem[] = [];
    let isUploading = false;

    if (props.initialFile) {
        fileQueue.push({
            id: 'init-1',
            name: props.initialFile.name,
            size: props.initialFile.size,
            type: 'image/jpeg',
            previewUrl: props.initialFile.previewUrl,
            progress: props.initialFile.status === 'completed' ? 100 : 0,
            status: props.initialFile.status || 'pending'
        });
    } else if (props.initialImages && props.initialImages.length > 0) {
        props.initialImages.forEach(img => {
            fileQueue.push({
                id: img.id,
                name: img.name,
                size: 245000,
                type: 'image/jpeg',
                previewUrl: img.previewUrl,
                progress: 0,
                status: 'pending'
            });
        });
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function addFiles(files: FileList | File[]) {
        Array.from(files).forEach((file) => {
            if (props.maxFileSize && file.size > props.maxFileSize) {
                alert(`File "${file.name}" exceeds maximum allowed size of ${formatFileSize(props.maxFileSize)}`);
                return;
            }

            const item: UploadedFileItem = {
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0,
                status: 'pending'
            };

            if (file.type.startsWith('image/')) {
                item.previewUrl = URL.createObjectURL(file);
            }

            fileQueue.push(item);
        });

        if (auto) {
            render();
            startUpload();
        } else {
            render();
        }
    }

    function startUpload() {
        if (fileQueue.length === 0 || isUploading) return;
        isUploading = true;
        render();

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 20;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                isUploading = false;
                fileQueue.forEach(f => {
                    f.progress = 100;
                    f.status = 'completed';
                });
                render();
            } else {
                fileQueue.forEach(f => {
                    f.progress = currentProgress;
                    f.status = 'uploading';
                });
                render();
            }
        }, 100);
    }

    function cancelAll() {
        fileQueue = [];
        isUploading = false;
        render();
    }

    function removeFile(id: string) {
        fileQueue = fileQueue.filter(f => f.id !== id);
        render();
    }

    function render() {
        // Custom Mode
        if (mode === 'custom') {
            const hasFile = fileQueue.length > 0;
            const currentFile = hasFile ? fileQueue[0] : null;

            setHtml(container, html`
                <div class="p-fileupload p-fileupload-custom" data-part="root" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <span class="p-fileupload-choose">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span>${chooseLabel}</span>
                        <input type="file" accept="${accept}" class="p-fileupload-input" />
                    </span>

                    ${currentFile ? html`
                        <div class="p-fileupload-custom-preview">
                            <img src="${safeUrl(currentFile.previewUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80')}" alt="${currentFile.name}" />
                            <div style="font-size: 0.8125rem; font-weight: 600; color: var(--p-text-muted); margin-top: 0.5rem;">${currentFile.name}</div>
                        </div>
                    ` : ''}
                </div>
            `);

            const input = container.querySelector<HTMLInputElement>('.p-fileupload-input');
            input?.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                    fileQueue = [];
                    addFiles(target.files);
                }
            }, { signal: ctx?.signal });
            return;
        }

        // Basic Mode
        if (mode === 'basic') {
            const hasFile = fileQueue.length > 0;
            const fileName = hasFile 
                ? (fileQueue.length === 1 ? fileQueue[0].name : `${fileQueue.length} files selected`) 
                : 'No file chosen';
            
            if (auto) {
                setHtml(container, html`
                    <div class="p-fileupload p-fileupload-basic" style="justify-content: center; width: 100%;">
                        <span class="p-fileupload-choose">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span>${chooseLabel}</span>
                            <input type="file" accept="${accept}" ${attr('multiple', multiple)} class="p-fileupload-input" />
                        </span>
                        ${hasFile ? html`<span class="p-fileupload-filename">${fileName}</span>` : ''}
                    </div>
                `);
            } else {
                setHtml(container, html`
                    <div class="p-fileupload p-fileupload-basic" style="justify-content: center; width: 100%;">
                        <span class="p-fileupload-choose">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span>${chooseLabel}</span>
                            <input type="file" accept="${accept}" ${attr('multiple', multiple)} class="p-fileupload-input" />
                        </span>
                        <span class="p-fileupload-filename" style="margin-left: 0.5rem; margin-right: 0.5rem;">${fileName}</span>
                        <button type="button" class="p-button p-button-outlined p-fileupload-upload-btn" ${!hasFile || isUploading ? 'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"' : ''}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span>${uploadLabel}</span>
                        </button>
                    </div>
                `);
            }

            const input = container.querySelector<HTMLInputElement>('.p-fileupload-input');
            input?.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                    addFiles(target.files);
                }
            }, { signal: ctx?.signal });

            const uploadBtn = container.querySelector<HTMLButtonElement>('.p-fileupload-upload-btn');
            uploadBtn?.addEventListener('click', () => {
                startUpload();
            }, { signal: ctx?.signal });
            return;
        }

        // Advanced Mode
        const hasFiles = fileQueue.length > 0;
        const progressAverage = hasFiles ? Math.round(fileQueue.reduce((acc, f) => acc + f.progress, 0) / fileQueue.length) : 0;

        setHtml(container, html`
            <div class="p-fileupload p-fileupload-advanced">
                <!-- Toolbar Header -->
                <div class="p-fileupload-header">
                    <span class="p-fileupload-choose">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                        <span>${chooseLabel}</span>
                        <input type="file" accept="${accept}" ${attr('multiple', multiple)} class="p-fileupload-input" />
                    </span>
                    <button type="button" class="p-button p-button-outlined p-fileupload-upload-btn" ${!hasFiles || isUploading ? 'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"' : ''}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span>${uploadLabel}</span>
                    </button>
                    <button type="button" class="p-button p-button-outlined p-fileupload-cancel-btn" ${!hasFiles || isUploading ? 'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"' : ''}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>${cancelLabel}</span>
                    </button>
                </div>

                ${isUploading ? html`
                    <div class="p-fileupload-progressbar">
                        <div class="p-fileupload-progressbar-value" style="width: ${progressAverage}%;"></div>
                    </div>
                ` : ''}

                <!-- Content / Drop Area -->
                <div class="p-fileupload-content">
                    ${!hasFiles ? html`
                        <div class="p-fileupload-empty" data-click-trigger>
                            <div class="p-fileupload-empty-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><polyline points="12 13 12 9 10 11"/><polyline points="12 9 14 11"/></svg>
                            </div>
                            <div class="p-fileupload-empty-title">${emptyTitle}</div>
                            <div class="p-fileupload-empty-subtitle">${emptySubtitle}</div>
                        </div>
                    ` : (previewImages ? html`
                        <div class="p-fileupload-image-grid">
                            ${fileQueue.map(f => html`
                                <div class="p-fileupload-image-card">
                                    <img src="${safeUrl(f.previewUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80')}" alt="${f.name}" />
                                    <button type="button" class="p-fileupload-image-remove" data-remove-id="${f.id}" title="Remove image">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            `)}
                        </div>
                    ` : html`
                        <div class="p-fileupload-file-list">
                            ${fileQueue.map(f => html`
                                <div class="p-fileupload-file-item">
                                    <div class="p-fileupload-file-info">
                                        ${f.previewUrl ? html`
                                            <img src="${safeUrl(f.previewUrl)}" alt="${f.name}" class="p-fileupload-thumbnail" />
                                        ` : html`
                                            <div class="p-fileupload-thumbnail">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--p-text-muted);"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            </div>
                                        `}
                                        <div class="p-fileupload-file-details">
                                            <span class="p-fileupload-file-name">${f.name}</span>
                                            <span class="p-fileupload-file-size">${formatFileSize(f.size)}</span>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <span class="p-fileupload-badge p-fileupload-badge-${f.status === 'completed' ? 'completed' : (f.status === 'uploading' ? 'uploading' : 'pending')}">
                                            ${f.status === 'completed' ? 'Uploaded' : (f.status === 'uploading' ? `${f.progress}%` : 'Pending')}
                                        </span>
                                        <button type="button" class="p-button p-button-text p-button-danger p-button-sm" data-remove-id="${f.id}" style="border: none; background: transparent; color: var(--p-red-500, #ef4444); cursor: pointer; padding: 0.35rem; display: flex; align-items: center; border-radius: 9999px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                </div>
                            `)}
                        </div>
                    `)}
                </div>
            </div>
        `);

        // Event listeners
        const input = container.querySelector<HTMLInputElement>('.p-fileupload-input');
        input?.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                addFiles(target.files);
            }
        }, { signal: ctx?.signal });

        const uploadBtn = container.querySelector<HTMLButtonElement>('.p-fileupload-upload-btn');
        uploadBtn?.addEventListener('click', () => {
            startUpload();
        }, { signal: ctx?.signal });

        const cancelBtn = container.querySelector<HTMLButtonElement>('.p-fileupload-cancel-btn');
        cancelBtn?.addEventListener('click', () => {
            cancelAll();
        }, { signal: ctx?.signal });

        const emptyClick = container.querySelector<HTMLElement>('[data-click-trigger]');
        emptyClick?.addEventListener('click', () => {
            input?.click();
        }, { signal: ctx?.signal });

        // Drop handling
        const contentArea = container.querySelector<HTMLElement>('.p-fileupload-content');
        if (contentArea) {
            contentArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                contentArea.classList.add('p-fileupload-highlight');
            }, { signal: ctx?.signal });
            contentArea.addEventListener('dragleave', () => {
                contentArea.classList.remove('p-fileupload-highlight');
            }, { signal: ctx?.signal });
            contentArea.addEventListener('drop', (e) => {
                e.preventDefault();
                contentArea.classList.remove('p-fileupload-highlight');
                if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                    addFiles(e.dataTransfer.files);
                }
            }, { signal: ctx?.signal });
        }

        // Individual remove buttons
        container.querySelectorAll<HTMLElement>('[data-remove-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-remove-id');
                if (id) removeFile(id);
            }, { signal: ctx?.signal });
        });
    }

    render();
}

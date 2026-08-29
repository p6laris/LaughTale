import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/fileupload.ts
var FILEUPLOAD_CSS = `
.p-fileupload {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
}

/* Basic Mode Container */
.p-fileupload-basic-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-0, #ffffff);
    width: 100%;
    max-width: 32rem;
    box-sizing: border-box;
}

.p-fileupload-basic-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
    flex: 1;
}

.p-fileupload-choose {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Advanced Mode Container */
.p-fileupload-advanced {
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
    width: 100%;
}

.p-fileupload-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    flex-wrap: wrap;
}

.p-fileupload-content {
    padding: 1.5rem;
    min-height: 10rem;
    box-sizing: border-box;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.p-fileupload-content.p-fileupload-highlight {
    background: rgba(59, 130, 246, 0.04);
    outline: 2px dashed var(--p-primary-500, #3b82f6);
    outline-offset: -4px;
}

.p-fileupload-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2.5rem 1.5rem;
    color: var(--p-surface-500, #64748b);
    text-align: center;
    border: 2px dashed var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-50, #f8fafc);
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.p-fileupload-empty:hover {
    border-color: var(--p-primary-500, #3b82f6);
    background: var(--p-surface-0, #ffffff);
}

.p-fileupload-file-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.p-fileupload-file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
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
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 6px;
    object-fit: cover;
    background: var(--p-surface-100, #f1f5f9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.p-fileupload-file-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.p-fileupload-file-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color, #0f172a);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-fileupload-file-size {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
}

.p-fileupload-progressbar {
    height: 0.35rem;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 9999px;
    overflow: hidden;
    margin-top: 0.75rem;
    position: relative;
}

.p-fileupload-progressbar-value {
    height: 100%;
    background: var(--p-primary-500, #3b82f6);
    border-radius: 9999px;
    transition: width 0.25s ease;
}

/* Image Grid Preview */
.p-fileupload-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
    gap: 0.875rem;
    padding: 0.5rem 0;
}

.p-fileupload-image-card {
    position: relative;
    aspect-ratio: 1;
    border-radius: var(--p-border-radius, 8px);
    overflow: hidden;
    border: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-100, #f1f5f9);
}

.p-fileupload-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.p-fileupload-image-card .p-fileupload-image-remove {
    position: absolute;
    top: 0.35rem;
    right: 0.35rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    background: rgba(15, 23, 42, 0.75);
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

/* Dark Mode Tokens */
.dark .p-fileupload-basic-wrapper,
[data-theme="dark"] .p-fileupload-basic-wrapper {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-advanced,
[data-theme="dark"] .p-fileupload-advanced {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-header,
[data-theme="dark"] .p-fileupload-header {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-empty,
[data-theme="dark"] .p-fileupload-empty {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-fileupload-file-item,
[data-theme="dark"] .p-fileupload-file-item {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-file-name,
[data-theme="dark"] .p-fileupload-file-name {
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-fileupload-image-card,
[data-theme="dark"] .p-fileupload-image-card {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}
`;
function FileUploadIsland(container, props) {
  injectIslandStyle("fileupload", FILEUPLOAD_CSS);
  const mode = props.mode || "basic";
  const accept = props.accept || "*/*";
  const multiple = props.multiple || false;
  const auto = props.auto || false;
  const chooseLabel = props.chooseLabel || (mode === "basic" ? "Choose" : "Choose");
  const uploadLabel = props.uploadLabel || "Upload";
  const cancelLabel = props.cancelLabel || "Cancel";
  const previewImages = props.previewImages || false;
  let fileQueue = [];
  let isUploading = false;
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
  function addFiles(files) {
    Array.from(files).forEach((file) => {
      if (props.maxFileSize && file.size > props.maxFileSize) {
        alert(`File "${file.name}" exceeds maximum allowed size of ${formatFileSize(props.maxFileSize)}`);
        return;
      }
      const item = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "pending"
      };
      if (file.type.startsWith("image/")) {
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
        fileQueue.forEach((f) => {
          f.progress = 100;
          f.status = "completed";
        });
        render();
      } else {
        fileQueue.forEach((f) => {
          f.progress = currentProgress;
          f.status = "uploading";
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
  function removeFile(id) {
    fileQueue = fileQueue.filter((f) => f.id !== id);
    render();
  }
  function render() {
    if (mode === "basic") {
      const hasFile = fileQueue.length > 0;
      const fileName = hasFile ? fileQueue.length === 1 ? fileQueue[0].name : `${fileQueue.length} files selected` : "No file chosen";
      if (auto) {
        container.innerHTML = `
                    <div class="p-fileupload-basic-wrapper" style="justify-content: center; width: auto; min-width: 14rem;">
                        <span class="p-button p-button-primary p-fileupload-choose" style="padding: 0.55rem 1.35rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff; display: inline-flex; align-items: center; gap: 0.45rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span>${chooseLabel}</span>
                            <input type="file" accept="${accept}" ${multiple ? "multiple" : ""} class="p-fileupload-input" />
                        </span>
                        ${hasFile ? `<span class="p-fileupload-filename" style="margin-left: 0.5rem;">${fileName}</span>` : ""}
                    </div>
                `;
      } else {
        container.innerHTML = `
                    <div class="p-fileupload-basic-wrapper">
                        <div class="p-fileupload-basic-left">
                            <span class="p-button p-button-primary p-fileupload-choose" style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff; display: inline-flex; align-items: center; gap: 0.45rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                                <span>${chooseLabel}</span>
                                <input type="file" accept="${accept}" ${multiple ? "multiple" : ""} class="p-fileupload-input" />
                            </span>
                            <span class="p-fileupload-filename">${fileName}</span>
                        </div>
                        <button type="button" class="p-button p-button-outlined p-button-secondary p-fileupload-upload-btn" ${!hasFile || isUploading ? 'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"' : ""} style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer;">
                            ${uploadLabel}
                        </button>
                    </div>
                `;
      }
      const input2 = container.querySelector(".p-fileupload-input");
      input2?.addEventListener("change", (e) => {
        const target = e.target;
        if (target.files && target.files.length > 0) {
          addFiles(target.files);
        }
      });
      const uploadBtn2 = container.querySelector(".p-fileupload-upload-btn");
      uploadBtn2?.addEventListener("click", () => {
        startUpload();
      });
      return;
    }
    const hasFiles = fileQueue.length > 0;
    const progressAverage = hasFiles ? Math.round(fileQueue.reduce((acc, f) => acc + f.progress, 0) / fileQueue.length) : 0;
    container.innerHTML = `
            <div class="p-fileupload p-fileupload-advanced">
                <!-- Toolbar Header -->
                <div class="p-fileupload-header">
                    <span class="p-button p-button-primary p-fileupload-choose" style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff; display: inline-flex; align-items: center; gap: 0.45rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                        <span>${chooseLabel}</span>
                        <input type="file" accept="${accept}" ${multiple ? "multiple" : ""} class="p-fileupload-input" />
                    </span>
                    <button type="button" class="p-button p-button-outlined p-button-secondary p-fileupload-upload-btn" ${!hasFiles || isUploading ? 'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"' : ""} style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span>${uploadLabel}</span>
                    </button>
                    <button type="button" class="p-button p-button-outlined p-button-secondary p-fileupload-cancel-btn" ${!hasFiles || isUploading ? 'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"' : ""} style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>${cancelLabel}</span>
                    </button>
                </div>

                ${isUploading ? `
                    <div style="padding: 0 1rem;">
                        <div class="p-fileupload-progressbar">
                            <div class="p-fileupload-progressbar-value" style="width: ${progressAverage}%;"></div>
                        </div>
                    </div>
                ` : ""}

                <!-- Content / Drop Area -->
                <div class="p-fileupload-content">
                    ${!hasFiles ? `
                        <div class="p-fileupload-empty" data-click-trigger>
                            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="color: var(--p-surface-400);"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><polyline points="12 13 12 9 10 11"/><polyline points="12 9 14 11"/></svg>
                            <div style="font-weight: 600; font-size: 0.95rem; color: var(--p-text-color);">Drag and drop files to here to upload.</div>
                            <div style="font-size: 0.75rem; color: var(--p-text-muted); font-weight: 500;">MAX. 1MB</div>
                        </div>
                    ` : previewImages ? `
                        <div class="p-fileupload-image-grid">
                            ${fileQueue.map((f) => `
                                <div class="p-fileupload-image-card">
                                    <img src="${f.previewUrl || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80"}" alt="${f.name}" />
                                    <button type="button" class="p-fileupload-image-remove" data-remove-id="${f.id}" title="Remove image">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            `).join("")}
                        </div>
                    ` : `
                        <div class="p-fileupload-file-list">
                            ${fileQueue.map((f) => `
                                <div class="p-fileupload-file-item">
                                    <div class="p-fileupload-file-info">
                                        ${f.previewUrl ? `
                                            <img src="${f.previewUrl}" alt="${f.name}" class="p-fileupload-thumbnail" />
                                        ` : `
                                            <div class="p-fileupload-thumbnail">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--p-surface-500);"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            </div>
                                        `}
                                        <div class="p-fileupload-file-details">
                                            <span class="p-fileupload-file-name">${f.name}</span>
                                            <span class="p-fileupload-file-size">${formatFileSize(f.size)}</span>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <span style="font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 9999px; ${f.status === "completed" ? "background: rgba(16, 185, 129, 0.12); color: #10b981;" : "background: var(--p-surface-100); color: var(--p-surface-700);"}">
                                            ${f.status === "completed" ? "Uploaded" : f.status === "uploading" ? `${f.progress}%` : "Pending"}
                                        </span>
                                        <button type="button" class="p-button p-button-text p-button-danger p-button-sm" data-remove-id="${f.id}" style="border: none; background: transparent; color: #ef4444; cursor: pointer; padding: 0.35rem; display: flex; align-items: center; border-radius: 9999px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `}
                </div>
            </div>
        `;
    const input = container.querySelector(".p-fileupload-input");
    input?.addEventListener("change", (e) => {
      const target = e.target;
      if (target.files && target.files.length > 0) {
        addFiles(target.files);
      }
    });
    const uploadBtn = container.querySelector(".p-fileupload-upload-btn");
    uploadBtn?.addEventListener("click", () => {
      startUpload();
    });
    const cancelBtn = container.querySelector(".p-fileupload-cancel-btn");
    cancelBtn?.addEventListener("click", () => {
      cancelAll();
    });
    const emptyClick = container.querySelector("[data-click-trigger]");
    emptyClick?.addEventListener("click", () => {
      input?.click();
    });
    const contentArea = container.querySelector(".p-fileupload-content");
    if (contentArea) {
      contentArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        contentArea.classList.add("p-fileupload-highlight");
      });
      contentArea.addEventListener("dragleave", () => {
        contentArea.classList.remove("p-fileupload-highlight");
      });
      contentArea.addEventListener("drop", (e) => {
        e.preventDefault();
        contentArea.classList.remove("p-fileupload-highlight");
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          addFiles(e.dataTransfer.files);
        }
      });
    }
    container.querySelectorAll("[data-remove-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove-id");
        if (id) removeFile(id);
      });
    });
  }
  render();
}
export {
  FileUploadIsland as default
};
//# sourceMappingURL=fileupload-XT6S2ITL.js.map

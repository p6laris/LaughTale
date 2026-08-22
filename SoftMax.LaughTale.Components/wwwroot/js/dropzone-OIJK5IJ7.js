// Scripts/islands/dropzone.ts
function DropzoneIsland(container, props) {
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Document Vault</span>
                <span class="aura-tag tag-cyan">Hydrate: Visible</span>
            </div>

            <div class="dropzone-box" style="border: 2px dashed var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 2rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease; background-color: var(--p-surface-50);">
                <input type="file" class="file-input" name="${props.targetInputName}" accept="${props.allowedExtensions}" style="display: none;" />
                
                <div style="width: 2.75rem; height: 2.75rem; border-radius: 50%; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; font-size: 1.25rem;">
                    \u2601\uFE0F
                </div>
                
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-800);">${props.dropPrompt}</div>
                <div style="font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.25rem;">
                    Supported: ${props.allowedExtensions} &bull; Max Size: ${props.maxSizeMb} MB
                </div>

                <div class="preview-area" style="display: none; margin-top: 1rem;"></div>
            </div>
        </div>
    `;
  const box = container.querySelector(".dropzone-box");
  const input = container.querySelector(".file-input");
  const preview = container.querySelector(".preview-area");
  box.addEventListener("click", () => input.click());
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.style.borderColor = "var(--p-primary-500)";
    box.style.backgroundColor = "var(--p-primary-50)";
  });
  box.addEventListener("dragleave", () => {
    box.style.borderColor = "var(--p-border-color)";
    box.style.backgroundColor = "var(--p-surface-50)";
  });
  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.style.borderColor = "var(--p-border-color)";
    box.style.backgroundColor = "var(--p-surface-50)";
    if (e.dataTransfer?.files.length) {
      input.files = e.dataTransfer.files;
      handleFiles(input.files[0]);
    }
  });
  input.addEventListener("change", () => {
    if (input.files?.length) {
      handleFiles(input.files[0]);
    }
  });
  function handleFiles(file) {
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > props.maxSizeMb) {
      alert(`File exceeds size limit of ${props.maxSizeMb} MB.`);
      input.value = "";
      return;
    }
    preview.style.display = "block";
    preview.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--p-primary-50); border: 1px solid var(--p-primary-200); border-radius: var(--p-border-radius); font-size: 0.8125rem; color: var(--p-primary-700);">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span>\u{1F4C4}</span>
                    <strong style="overflow: hidden; text-overflow: ellipsis;">${file.name}</strong>
                    <span style="font-size: 0.75rem; opacity: 0.8;">(${sizeMb.toFixed(2)} MB)</span>
                </div>
                <span class="aura-tag tag-emerald" style="font-size: 0.6875rem;">Verified</span>
            </div>
        `;
  }
}
export {
  DropzoneIsland as default
};
//# sourceMappingURL=dropzone-OIJK5IJ7.js.map

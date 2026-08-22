// Scripts/islands/dropzone.ts
function DropzoneIsland(container, props) {
  container.innerHTML = `
        <div class="dropzone-box p-8 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl bg-slate-50 transition-colors text-center cursor-pointer">
            <input type="file" class="hidden file-input" name="${props.targetInputName}" accept="${props.allowedExtensions}" />
            <div class="upload-icon mb-3 text-amber-600 text-3xl">\u{1F4C1}</div>
            <p class="text-sm font-semibold text-slate-800">${props.dropPrompt}</p>
            <p class="text-xs text-slate-500 mt-1">Allowed: ${props.allowedExtensions} &bull; Max: ${props.maxSizeMb} MB</p>
            <div class="preview-area mt-4 hidden"></div>
            <div class="mt-3">
                <span class="text-[11px] text-indigo-600 font-medium inline-flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Hydrated on Scroll via <code>HydrateStrategy.Visible</code>
                </span>
            </div>
        </div>
    `;
  const box = container.querySelector(".dropzone-box");
  const input = container.querySelector(".file-input");
  const preview = container.querySelector(".preview-area");
  box.addEventListener("click", () => input.click());
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.classList.add("border-amber-500", "bg-amber-50");
  });
  box.addEventListener("dragleave", () => {
    box.classList.remove("border-amber-500", "bg-amber-50");
  });
  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.classList.remove("border-amber-500", "bg-amber-50");
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
      alert(`File is too large (${sizeMb.toFixed(1)} MB). Maximum allowed is ${props.maxSizeMb} MB.`);
      input.value = "";
      return;
    }
    preview.classList.remove("hidden");
    preview.innerHTML = `
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left flex items-center justify-between text-xs text-emerald-900">
                <div class="flex items-center gap-2 truncate">
                    <span>\u{1F4C4}</span>
                    <span class="font-bold truncate">${file.name}</span>
                    <span class="text-slate-500">(${sizeMb.toFixed(2)} MB)</span>
                </div>
                <span class="text-emerald-700 font-bold">\u2713 Ready</span>
            </div>
        `;
  }
}
export {
  DropzoneIsland as default
};
//# sourceMappingURL=dropzone-XNIGWQJJ.js.map

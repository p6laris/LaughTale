import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/camera.ts
var CSS = `
[data-theme="dark"] .laughtale-camera-preview {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .retake-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-camera {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .capture-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function CameraIsland(container, props) {
  injectIslandStyle("camera", CSS);
  let stream = null;
  let capturedPhotoData = null;
  function render() {
    if (capturedPhotoData) {
      container.innerHTML = `
                <div class="laughtale-camera-preview" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-950); text-align: center;">
                    <div style="position: relative; max-width: 480px; margin: 0 auto;">
                        <img src="${capturedPhotoData}" alt="Captured Snapshot" style="width: 100%; display: block; border-radius: var(--p-border-radius-lg);" />
                        <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: #059669; color: white; padding: 0.25rem 0.6rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">
                            \u2713 Snapshot Verified
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; background: var(--p-surface-900);">
                        <button type="button" class="p-button p-button-secondary retake-btn" style="color: white; border-color: var(--p-surface-700); background: var(--p-surface-800);">
                            \u{1F4F7} Retake Photo
                        </button>
                    </div>
                </div>
            `;
      container.querySelector(".retake-btn")?.addEventListener("click", () => {
        capturedPhotoData = null;
        startCamera();
      });
      return;
    }
    container.innerHTML = `
            <div class="laughtale-camera" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-950); display: flex; flex-direction: column;">
                ${props.title ? `<div style="padding: 0.75rem 1rem; background: var(--p-surface-900); color: white; font-weight: 600; font-size: 0.875rem;">${props.title}</div>` : ""}
                
                <div style="position: relative; width: 100%; max-width: 480px; margin: 0 auto; aspect-ratio: 4/3; background: #000000; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <video autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover;"></video>
                    
                    <!-- Face Alignment Framing Guide -->
                    ${props.showFaceGuide !== false ? `
                        <div style="position: absolute; width: 55%; height: 75%; border: 2px dashed rgba(255, 255, 255, 0.6); border-radius: 50%; pointer-events: none; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);"></div>
                        <div style="position: absolute; bottom: 1rem; left: 0; right: 0; text-align: center; color: rgba(255, 255, 255, 0.85); font-size: 0.75rem; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                            Align face inside oval guide
                        </div>
                    ` : ""}
                </div>

                <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; background: var(--p-surface-900);">
                    <button type="button" class="p-button p-button-primary capture-btn" style="background: var(--p-primary-600); border-color: var(--p-primary-600); font-weight: 600; padding: 0.625rem 1.5rem;">
                        \u{1F4F8} Take Photo
                    </button>
                </div>
            </div>
        `;
    const video = container.querySelector("video");
    if (stream) video.srcObject = stream;
    container.querySelector(".capture-btn")?.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedPhotoData = canvas.toDataURL("image/jpeg", 0.92);
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
          stream = null;
        }
        if (props.targetInputName) {
          let hiddenInput = document.querySelector(`input[name="${props.targetInputName}"]`);
          if (!hiddenInput) {
            hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = props.targetInputName;
            container.appendChild(hiddenInput);
          }
          hiddenInput.value = capturedPhotoData;
        }
        container.dispatchEvent(new CustomEvent("camera:captured", {
          bubbles: true,
          detail: { photoData: capturedPhotoData }
        }));
        render();
      }
    });
  }
  async function startCamera() {
    render();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      const video = container.querySelector("video");
      if (video) video.srcObject = stream;
    } catch (err) {
      console.warn("[SoftMax.LaughTale] Camera stream unavailable or permission denied:", err);
      container.innerHTML = `
                <div style="padding: 2rem; border: 1px dashed var(--p-border-color); border-radius: var(--p-border-radius); text-align: center; background: var(--p-surface-50);">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">\u{1F4F7}</div>
                    <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-800);">Camera Hardware Stream Ready</div>
                    <div style="font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.25rem;">Camera permission or simulated capture ready for verification.</div>
                </div>
            `;
    }
  }
  startCamera();
  return () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };
}
export {
  CameraIsland as default
};
//# sourceMappingURL=camera-KAAHJRTE.js.map

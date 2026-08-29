import {
  getLucideIcon
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/camera.ts
var CAMERA_CSS = `
.laughtale-camera-preview,
.laughtale-camera {
    position: relative;
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 8px);
    overflow: hidden;
    background: var(--p-surface-950, #020617);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 32rem;
    margin: 0 auto;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.laughtale-camera-header {
    padding: 0.75rem 1rem;
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #ffffff);
    font-weight: 600;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--p-surface-800, #1e293b);
}

.laughtale-camera-viewport {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    background: #000000;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.laughtale-camera-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.laughtale-camera-guide {
    position: absolute;
    width: 55%;
    height: 75%;
    border: 2px dashed rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    pointer-events: none;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
}

.laughtale-camera-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--p-surface-900, #0f172a);
    border-top: 1px solid var(--p-surface-800, #1e293b);
}

.laughtale-camera-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: #059669;
    color: #ffffff;
    padding: 0.3rem 0.65rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}

/* Dark theme overrides */
[data-theme="dark"] .laughtale-camera-preview,
[data-theme="dark"] .laughtale-camera {
    border-color: var(--p-surface-800, #1e293b);
}
`;
function CameraIsland(container, props) {
  injectIslandStyle("camera", CAMERA_CSS);
  let stream = null;
  let capturedPhotoData = null;
  let isSimulated = false;
  function render() {
    if (capturedPhotoData) {
      container.innerHTML = `
                <div class="laughtale-camera-preview">
                    <div class="laughtale-camera-header">
                        <span>${props.title || "Captured Snapshot"}</span>
                        <span class="laughtale-camera-badge">
                            ${getLucideIcon("check", 14)} Verified
                        </span>
                    </div>
                    <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #000; overflow: hidden;">
                        <img src="${capturedPhotoData}" alt="Captured Snapshot" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div class="laughtale-camera-controls">
                        <button type="button" class="p-button p-button-secondary retake-btn" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); background: var(--p-surface-800); border: 1px solid var(--p-surface-700); color: #ffffff; cursor: pointer;">
                            ${getLucideIcon("refresh-cw", 16)} Retake Photo
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
            <div class="laughtale-camera">
                <div class="laughtale-camera-header">
                    <span>${props.title || "Live Camera Capture"}</span>
                    <span style="font-size: 0.75rem; color: var(--p-surface-400); display: flex; align-items: center; gap: 0.35rem;">
                        ${getLucideIcon("camera", 14)} ${isSimulated ? "Simulation Mode" : "Hardware Stream"}
                    </span>
                </div>
                
                <div class="laughtale-camera-viewport">
                    ${isSimulated ? `
                        <canvas class="laughtale-sim-canvas" width="640" height="480" style="width: 100%; height: 100%; object-fit: cover;"></canvas>
                    ` : `
                        <video class="laughtale-camera-video" autoplay playsinline muted></video>
                    `}
                    
                    ${props.showFaceGuide !== false ? `
                        <div class="laughtale-camera-guide"></div>
                        <div style="position: absolute; bottom: 1rem; left: 0; right: 0; text-align: center; color: rgba(255, 255, 255, 0.85); font-size: 0.75rem; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                            Align subject inside oval guide
                        </div>
                    ` : ""}
                </div>

                <div class="laughtale-camera-controls">
                    <button type="button" class="p-button p-button-primary capture-btn" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.5rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); background: var(--p-primary-500, #10b981); border: 1px solid var(--p-primary-500, #10b981); color: #ffffff; cursor: pointer;">
                        ${getLucideIcon("camera", 18)} Take Snapshot
                    </button>
                </div>
            </div>
        `;
    if (isSimulated) {
      drawSimulatedFeed();
    } else {
      const video = container.querySelector("video");
      if (video && stream) video.srcObject = stream;
    }
    container.querySelector(".capture-btn")?.addEventListener("click", () => {
      if (isSimulated) {
        const simCanvas = container.querySelector(".laughtale-sim-canvas");
        if (simCanvas) {
          capturedPhotoData = simCanvas.toDataURL("image/jpeg", 0.92);
          dispatchCaptureEvent();
          render();
        }
      } else {
        const video = container.querySelector("video");
        if (video) {
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
            dispatchCaptureEvent();
            render();
          }
        }
      }
    });
  }
  function dispatchCaptureEvent() {
    if (props.targetInputName) {
      let hiddenInput = document.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hiddenInput) {
        hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = props.targetInputName;
        container.appendChild(hiddenInput);
      }
      hiddenInput.value = capturedPhotoData || "";
    }
    container.dispatchEvent(new CustomEvent("camera:captured", {
      bubbles: true,
      detail: { photoData: capturedPhotoData }
    }));
  }
  function drawSimulatedFeed() {
    const canvas = container.querySelector(".laughtale-sim-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#1e293b");
    grad.addColorStop(0.5, "#0f172a");
    grad.addColorStop(1, "#020617");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 20, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 + 130, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.font = "14px monospace";
    ctx.fillText(`LAUGHTALE HD CAPTURE \u2022 ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`, 20, canvas.height - 20);
  }
  async function startCamera() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        isSimulated = false;
      } else {
        isSimulated = true;
      }
    } catch (err) {
      console.warn("[SoftMax.LaughTale] Hardware camera stream denied or unavailable. Fallback to simulation mode:", err);
      isSimulated = true;
    }
    render();
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
//# sourceMappingURL=camera-P2UEMHVO.js.map

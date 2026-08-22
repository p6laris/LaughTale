import {
  defineIsland,
  enableViewTransitions,
  initIslands
} from "./chunk-RFELO55V.js";

// Scripts/main.ts
defineIsland("interactive-counter", () => import("./counter-HSNA7JH4.js"));
defineIsland("file-dropzone", () => import("./dropzone-OIJK5IJ7.js"));
defineIsland("cascade-tree", () => import("./cascade-tree-K6NUHXUW.js"));
defineIsland("event-broadcaster", () => import("./broadcaster-RCRIXWRP.js"));
defineIsland("event-receiver", () => import("./receiver-CDILBIW3.js"));
defineIsland("modal-dialog", () => import("./modal-dialog-BJ7CZAR4.js"));
defineIsland("persistent-telemetry", () => import("./persistent-player-NCRVWT4M.js"));
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initIslands();
    enableViewTransitions();
  });
} else {
  initIslands();
  enableViewTransitions();
}
console.log("[SoftMax.LaughTale] Showcase initialized.");
//# sourceMappingURL=main.js.map

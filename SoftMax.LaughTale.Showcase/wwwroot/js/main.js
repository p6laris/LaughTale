import {
  defineIsland,
  enableViewTransitions,
  initDirectives,
  initIslands
} from "./chunk-A2ZP5Q6Z.js";
import "./chunk-AVQWSCJA.js";
import "./chunk-ZZO6ZCC7.js";
import "./chunk-QV6AVE4Z.js";
import "./chunk-GF6QLZVT.js";

// Scripts/main.ts
defineIsland("interactive-counter", () => import("./counter-HSNA7JH4.js"));
defineIsland("file-dropzone", () => import("./dropzone-OIJK5IJ7.js"));
defineIsland("cascade-tree", () => import("./cascade-tree-K6NUHXUW.js"));
defineIsland("event-broadcaster", () => import("./broadcaster-RCRIXWRP.js"));
defineIsland("event-receiver", () => import("./receiver-CDILBIW3.js"));
defineIsland("modal-dialog", () => import("./modal-dialog-5KZX5CSD.js"));
defineIsland("persistent-telemetry", () => import("./persistent-player-NCRVWT4M.js"));
function initialize() {
  initIslands();
  initDirectives();
  enableViewTransitions();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
console.log("[SoftMax.LaughTale] Showcase initialized.");
//# sourceMappingURL=main.js.map

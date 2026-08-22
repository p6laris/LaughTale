import {
  defineIsland,
  enableViewTransitions,
  initDirectives,
  initIslands
} from "./chunk-FQPEQQ7G.js";
import "./chunk-T4EPW24S.js";
import "./chunk-AVQWSCJA.js";
import "./chunk-I7ZAYNYP.js";
import "./chunk-KEONGXN5.js";
import "./chunk-J7IJRT66.js";
import "./chunk-QV6AVE4Z.js";
import "./chunk-GF6QLZVT.js";

// Scripts/main.ts
defineIsland("interactive-counter", () => import("./counter-HSNA7JH4.js"));
defineIsland("file-dropzone", () => import("./dropzone-OIJK5IJ7.js"));
defineIsland("cascade-tree", () => import("./cascade-tree-K6NUHXUW.js"));
defineIsland("event-broadcaster", () => import("./broadcaster-RCRIXWRP.js"));
defineIsland("event-receiver", () => import("./receiver-CDILBIW3.js"));
defineIsland("modal-dialog", () => import("./modal-dialog-RCZHJSSY.js"));
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
console.log("[SoftMax.LaughTale] Docs client runtime initialized.");
//# sourceMappingURL=main.js.map

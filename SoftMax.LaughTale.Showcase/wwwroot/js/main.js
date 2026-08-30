import {
  defineIsland,
  enableViewTransitions,
  initDirectives,
  initIslands
} from "./chunk-UO2U4QGO.js";
import "./chunk-SNYGSZHS.js";
import "./chunk-YSGXRJIU.js";
import "./chunk-IOCYPXM4.js";
import "./chunk-RBI7CHCL.js";
import "./chunk-X4BCDK2N.js";
import "./chunk-5EJRX4PB.js";
import "./chunk-3ZMZT2PZ.js";
import "./chunk-OKWR2G6H.js";
import "./chunk-T4EPW24S.js";
import "./chunk-KEONGXN5.js";
import "./chunk-XHF3KYSF.js";
import "./chunk-3TFPN5JM.js";

// Scripts/main.ts
defineIsland("interactive-counter", () => import("./counter-HSNA7JH4.js"));
defineIsland("file-dropzone", () => import("./dropzone-OIJK5IJ7.js"));
defineIsland("cascade-tree", () => import("./cascade-tree-K6NUHXUW.js"));
defineIsland("event-broadcaster", () => import("./broadcaster-RCRIXWRP.js"));
defineIsland("event-receiver", () => import("./receiver-CDILBIW3.js"));
defineIsland("modal-dialog", () => import("./modal-dialog-VPACDZAL.js"));
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

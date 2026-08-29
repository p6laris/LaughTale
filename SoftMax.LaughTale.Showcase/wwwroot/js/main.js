import {
  defineIsland,
  enableViewTransitions,
  initDirectives,
  initIslands
} from "./chunk-HEUG4SYN.js";
import "./chunk-YSGXRJIU.js";
import "./chunk-SNYGSZHS.js";
import "./chunk-RBI7CHCL.js";
import "./chunk-I7ZAYNYP.js";
import "./chunk-Y4YSQNFD.js";
import "./chunk-IOCYPXM4.js";
import "./chunk-5EJRX4PB.js";
import "./chunk-3ZMZT2PZ.js";
import "./chunk-T4EPW24S.js";
import "./chunk-KEONGXN5.js";
import "./chunk-XHF3KYSF.js";
import "./chunk-RQ5UXIGU.js";
import "./chunk-3TFPN5JM.js";

// Scripts/main.ts
defineIsland("interactive-counter", () => import("./counter-HSNA7JH4.js"));
defineIsland("file-dropzone", () => import("./dropzone-OIJK5IJ7.js"));
defineIsland("cascade-tree", () => import("./cascade-tree-K6NUHXUW.js"));
defineIsland("event-broadcaster", () => import("./broadcaster-RCRIXWRP.js"));
defineIsland("event-receiver", () => import("./receiver-CDILBIW3.js"));
defineIsland("modal-dialog", () => import("./modal-dialog-COBJ6PSS.js"));
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

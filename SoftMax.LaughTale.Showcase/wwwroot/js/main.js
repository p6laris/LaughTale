import {
  defineIsland,
  enableViewTransitions,
  initDirectives,
  initIslands
} from "./chunk-YWXUYAMG.js";
import "./chunk-EZGX7NJI.js";
import "./chunk-ZFSVXRXK.js";
import "./chunk-Y4YSQNFD.js";
import "./chunk-I7ZAYNYP.js";
import "./chunk-J7IJRT66.js";
import "./chunk-VDYWG2PC.js";
import "./chunk-3ZMZT2PZ.js";
import "./chunk-P6OQD35U.js";
import "./chunk-RBI7CHCL.js";
import "./chunk-RQ5UXIGU.js";
import "./chunk-IOCYPXM4.js";
import "./chunk-5EJRX4PB.js";
import "./chunk-T4EPW24S.js";
import "./chunk-KEONGXN5.js";
import "./chunk-W3Q4G23D.js";
import "./chunk-3TFPN5JM.js";

// Scripts/main.ts
defineIsland("interactive-counter", () => import("./counter-HSNA7JH4.js"));
defineIsland("file-dropzone", () => import("./dropzone-OIJK5IJ7.js"));
defineIsland("cascade-tree", () => import("./cascade-tree-K6NUHXUW.js"));
defineIsland("event-broadcaster", () => import("./broadcaster-RCRIXWRP.js"));
defineIsland("event-receiver", () => import("./receiver-CDILBIW3.js"));
defineIsland("modal-dialog", () => import("./modal-dialog-54B34USP.js"));
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

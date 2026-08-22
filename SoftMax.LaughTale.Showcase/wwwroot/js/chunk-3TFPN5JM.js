// ../SoftMax.LaughTale.Client/src/directives/csp.ts
function getCspNonce() {
  if (typeof document === "undefined") return null;
  const meta = document.querySelector('meta[name="csp-nonce"]');
  return meta ? meta.content : null;
}
function applyNonceToStyle(style) {
  const nonce = getCspNonce();
  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}

// ../SoftMax.LaughTale.Client/src/runtime/styles.ts
var injectedStyles = /* @__PURE__ */ new Set();
function injectIslandStyle(islandName, css) {
  if (injectedStyles.has(islandName) || typeof document === "undefined") {
    return;
  }
  injectedStyles.add(islandName);
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-island-style", islandName);
  styleEl.textContent = css;
  applyNonceToStyle(styleEl);
  document.head.appendChild(styleEl);
}

export {
  injectIslandStyle
};
//# sourceMappingURL=chunk-3TFPN5JM.js.map

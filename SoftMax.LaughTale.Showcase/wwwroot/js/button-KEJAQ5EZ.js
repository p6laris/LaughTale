import {
  getLucideIcon
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/button.ts
var CSS = `
/* CSS is provided globally in site.css / theme */
`;
function ButtonIsland(container, props) {
  injectIslandStyle("laughtale-button", CSS);
  let isLoading = props.loading === true || String(props.loading) === "true";
  let isDisabled = props.disabled === true || String(props.disabled) === "true";
  const btnEl = container.tagName.toLowerCase() === "button" || container.tagName.toLowerCase() === "a" ? container : container.querySelector("button, a") || container;
  function renderLoading() {
    if (isLoading) {
      btnEl.classList.add("p-button-loading", "p-disabled");
      btnEl.setAttribute("aria-busy", "true");
      let spinner = btnEl.querySelector(".p-button-loading-icon");
      if (!spinner) {
        spinner = document.createElement("span");
        spinner.className = "p-button-loading-icon p-button-icon";
        spinner.innerHTML = getLucideIcon(props.loadingIcon || "spinner", 16);
        btnEl.prepend(spinner);
      }
    } else {
      btnEl.classList.remove("p-button-loading");
      btnEl.removeAttribute("aria-busy");
      if (!isDisabled) {
        btnEl.classList.remove("p-disabled");
      }
      btnEl.querySelector(".p-button-loading-icon")?.remove();
    }
  }
  btnEl.addEventListener("click", (e) => {
    if (isLoading || isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    container.dispatchEvent(new CustomEvent("button:click", {
      bubbles: true,
      detail: { label: props.label }
    }));
  });
  renderLoading();
}
export {
  ButtonIsland as default
};
//# sourceMappingURL=button-KEJAQ5EZ.js.map

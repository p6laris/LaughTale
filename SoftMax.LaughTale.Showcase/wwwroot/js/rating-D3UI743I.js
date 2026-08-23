import {
  LucideIcons
} from "./chunk-W3Q4G23D.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/rating.ts
var CSS = `
[data-theme="dark"] .rating-star {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-rating {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .rating-cancel-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function RatingIsland(container, props) {
  injectIslandStyle("rating", CSS);
  const totalStars = props.stars || 5;
  let currentRating = props.value || 0;
  let hoverRating = 0;
  function render() {
    const starElements = Array.from({ length: totalStars }, (_, i) => {
      const starNum = i + 1;
      const isFilled = (hoverRating || currentRating) >= starNum;
      const color = isFilled ? "#f59e0b" : "var(--p-surface-300)";
      return `
                <span class="rating-star" data-star="${starNum}" style="cursor: ${props.disabled ? "default" : "pointer"}; color: ${color}; transition: transform 0.15s ease, color 0.15s ease; display: inline-flex;">
                    ${isFilled ? LucideIcons.star : LucideIcons.starEmpty}
                </span>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-rating" style="display: inline-flex; align-items: center; gap: 0.35rem; user-select: none;">
                ${props.allowCancel !== false ? `
                    <button type="button" class="rating-cancel-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0 0.25rem;">
                        ${LucideIcons.x}
                    </button>
                ` : ""}
                ${starElements}
            </div>
        `;
    if (props.disabled) return;
    container.querySelectorAll(".rating-star").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        hoverRating = parseInt(el.getAttribute("data-star"), 10);
        render();
      });
      el.addEventListener("click", () => {
        currentRating = parseInt(el.getAttribute("data-star"), 10);
        hoverRating = 0;
        render();
        syncValue();
      });
    });
    container.querySelector(".laughtale-rating")?.addEventListener("mouseleave", () => {
      hoverRating = 0;
      render();
    });
    container.querySelector(".rating-cancel-btn")?.addEventListener("click", () => {
      currentRating = 0;
      hoverRating = 0;
      render();
      syncValue();
    });
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentRating.toString();
    }
    container.dispatchEvent(new CustomEvent("rating:change", {
      bubbles: true,
      detail: { value: currentRating }
    }));
  }
  render();
  syncValue();
}
export {
  RatingIsland as default
};
//# sourceMappingURL=rating-D3UI743I.js.map

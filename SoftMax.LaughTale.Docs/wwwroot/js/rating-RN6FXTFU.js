import {
  useControllableState
} from "./chunk-3ZMZT2PZ.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/rating.ts
var CSS = `
.laughtale-rating,
.p-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--p-font-family, inherit);
    user-select: none;
    box-sizing: border-box;
}

.p-rating.p-rating-vertical {
    flex-direction: column;
}

/* Rating Items (Stars / Icons) */
.p-rating-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 9999px;
    padding: 0.125rem;
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease, opacity 150ms ease;
    color: var(--p-surface-300);
    outline: none;
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:hover {
    transform: scale(1.15);
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:focus-visible {
    box-shadow: 0 0 0 2px var(--p-primary-500);
}

.p-rating-item.p-rating-item-active {
    color: var(--p-primary-500, #f59e0b);
}

.p-rating-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: color 150ms ease, fill 150ms ease;
}

.p-rating-icon svg {
    width: 100%;
    height: 100%;
}

/* Sizes */
.p-rating.size-small .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Half Stars Overlay */
.p-rating-half-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.p-rating-half-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    color: var(--p-primary-500, #f59e0b);
    pointer-events: none;
}
.p-rating-half-overlay .p-rating-icon {
    width: 20px;
    height: 20px;
}
.p-rating.size-small .p-rating-half-overlay .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-half-overlay .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Cancel Button */
.p-rating-cancel-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.125rem;
    margin-right: 0.25rem;
    color: var(--p-surface-400);
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease, transform 150ms ease;
    outline: none;
}
.p-rating-vertical .p-rating-cancel-item {
    margin-right: 0;
    margin-bottom: 0.25rem;
}
.p-rating-cancel-item:hover {
    color: var(--p-red-500, #ef4444);
    transform: scale(1.1);
}
.p-rating-cancel-item:focus-visible {
    box-shadow: 0 0 0 2px var(--p-red-500);
}
.p-rating-cancel-item svg {
    width: 16px;
    height: 16px;
}

/* Emoji / Template Mode */
.p-rating-emoji-item {
    font-size: 1.5rem;
    line-height: 1;
    filter: grayscale(100%);
    opacity: 0.5;
    transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}
.p-rating-emoji-item.p-rating-item-active,
.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-emoji-item:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.25);
}

/* Text Template Mode (e.g. A A A A A) */
.p-rating-text-item {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--p-surface-300);
    transition: color 150ms ease, transform 150ms ease;
}
.p-rating-text-item.p-rating-item-active {
    color: var(--p-primary-500);
}

/* States */
.p-rating.p-readonly .p-rating-item,
.p-rating.p-readonly .p-rating-cancel-item {
    cursor: default;
}
.p-rating.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.p-rating.p-disabled .p-rating-item,
.p-rating.p-disabled .p-rating-cancel-item {
    cursor: not-allowed;
    pointer-events: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-rating-item {
    color: var(--p-surface-600);
}
.dark .p-rating-item.p-rating-item-active,
.dark .p-rating-half-overlay {
    color: var(--p-primary-400, #fbbf24);
}
.dark .p-rating-cancel-item {
    color: var(--p-surface-500);
}
.dark .p-rating-cancel-item:hover {
    color: var(--p-red-400);
}
.dark .p-rating-text-item {
    color: var(--p-surface-700);
}
.dark .p-rating-text-item.p-rating-item-active {
    color: var(--p-primary-400);
}
`;
var starFilledSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
var starEmptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
var cancelSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
function RatingIsland(container, props) {
  injectIslandStyle("laughtale-rating", CSS);
  const totalStars = props.stars ? Number(props.stars) : 5;
  const isAllowHalf = props.allowHalf === true || String(props.allowHalf) === "true";
  const isCancelAllowed = props.cancel !== false && props.allowCancel !== false && String(props.cancel) !== "false" && String(props.allowCancel) !== "false";
  const isVertical = props.orientation === "vertical";
  const isReadonly = props.readonlyMode === true || props.readonly === true || String(props.readonlyMode) === "true" || String(props.readonly) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const mode = props.mode || "stars";
  let emojiList = ["\u{1F621}", "\u{1F641}", "\u{1F610}", "\u{1F60A}", "\u{1F929}"];
  if (props.emojis) {
    if (Array.isArray(props.emojis)) emojiList = props.emojis;
    else if (typeof props.emojis === "string") {
      try {
        const parsed = JSON.parse(props.emojis);
        if (Array.isArray(parsed)) emojiList = parsed;
        else emojiList = props.emojis.split(",").map((s) => s.trim()).filter(Boolean);
      } catch {
        emojiList = props.emojis.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
  }
  const [getRating, setRating] = useControllableState({
    defaultValue: props.value ? Number(props.value) : 0,
    onChange: (val) => {
      syncValue(val);
    }
  });
  let hoverValue = null;
  function init() {
    const rating = getRating();
    const rootClasses = [
      "laughtale-rating",
      "p-rating",
      isVertical ? "p-rating-vertical" : "",
      props.size ? `size-${props.size}` : "",
      isReadonly ? "p-readonly" : "",
      isDisabled ? "p-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.setAttribute("role", "radiogroup");
    container.setAttribute("aria-label", `${rating} of ${totalStars} stars`);
    let cancelBtnHtml = "";
    if (isCancelAllowed && !isReadonly && !isDisabled) {
      cancelBtnHtml = `
                <button type="button" class="p-rating-cancel-item" aria-label="Clear rating" tabindex="0">
                    ${cancelSvg}
                </button>
            `;
    }
    let itemsHtml = "";
    for (let i = 1; i <= totalStars; i++) {
      if (mode === "emoji") {
        const emoji = emojiList[(i - 1) % emojiList.length] || "\u2B50";
        itemsHtml += `
                    <span class="p-rating-item p-rating-emoji-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? "true" : "false"}" aria-label="${i} Star" tabindex="${isReadonly || isDisabled ? "-1" : "0"}">
                        ${emoji}
                    </span>
                `;
      } else if (mode === "template") {
        itemsHtml += `
                    <span class="p-rating-item p-rating-text-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? "true" : "false"}" aria-label="${i} Star" tabindex="${isReadonly || isDisabled ? "-1" : "0"}">
                        A
                    </span>
                `;
      } else {
        itemsHtml += `
                    <span class="p-rating-item p-rating-star-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? "true" : "false"}" aria-label="${i} Stars" tabindex="${isReadonly || isDisabled ? "-1" : "0"}">
                        <div class="p-rating-half-wrapper">
                            <span class="p-rating-icon p-rating-icon-off">${starEmptySvg}</span>
                            <span class="p-rating-half-overlay" style="display: none;">
                                <span class="p-rating-icon p-rating-icon-half">${starFilledSvg}</span>
                            </span>
                        </div>
                    </span>
                `;
      }
    }
    container.innerHTML = `
            ${cancelBtnHtml}
            <div class="p-rating-items" style="display: flex; ${isVertical ? "flex-direction: column;" : "align-items: center;"} gap: 0.375rem;">
                ${itemsHtml}
            </div>
        `;
    updateVisuals(rating);
    bindEvents();
  }
  function updateVisuals(activeVal) {
    const items = container.querySelectorAll(".p-rating-item");
    items.forEach((item) => {
      const starVal = Number(item.getAttribute("data-value"));
      const isFull = activeVal >= starVal;
      const isHalf = isAllowHalf && activeVal >= starVal - 0.5 && activeVal < starVal;
      if (mode === "stars") {
        const offIcon = item.querySelector(".p-rating-icon-off");
        const halfOverlay = item.querySelector(".p-rating-half-overlay");
        if (isFull) {
          item.classList.add("p-rating-item-active");
          if (offIcon) offIcon.innerHTML = starFilledSvg;
          if (halfOverlay) halfOverlay.style.display = "none";
        } else if (isHalf) {
          item.classList.remove("p-rating-item-active");
          if (offIcon) offIcon.innerHTML = starEmptySvg;
          if (halfOverlay) halfOverlay.style.display = "block";
        } else {
          item.classList.remove("p-rating-item-active");
          if (offIcon) offIcon.innerHTML = starEmptySvg;
          if (halfOverlay) halfOverlay.style.display = "none";
        }
      } else {
        item.classList.toggle("p-rating-item-active", isFull);
      }
      item.setAttribute("aria-checked", isFull || isHalf ? "true" : "false");
    });
    container.setAttribute("aria-label", `${activeVal} of ${totalStars} stars`);
  }
  function bindEvents() {
    if (isReadonly || isDisabled) return;
    const cancelBtn = container.querySelector(".p-rating-cancel-item");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setRating(0);
        updateVisuals(0);
      });
      cancelBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setRating(0);
          updateVisuals(0);
        }
      });
    }
    const items = container.querySelectorAll(".p-rating-item");
    items.forEach((item) => {
      const starVal = Number(item.getAttribute("data-value"));
      item.addEventListener("mousemove", (e) => {
        if (isAllowHalf && mode === "stars") {
          const rect = item.getBoundingClientRect();
          const isLeftHalf = e.clientX - rect.left < rect.width / 2;
          hoverValue = isLeftHalf ? starVal - 0.5 : starVal;
        } else {
          hoverValue = starVal;
        }
        updateVisuals(hoverValue);
      });
      item.addEventListener("click", (e) => {
        let targetVal = starVal;
        if (isAllowHalf && mode === "stars") {
          const rect = item.getBoundingClientRect();
          const isLeftHalf = e.clientX - rect.left < rect.width / 2;
          targetVal = isLeftHalf ? starVal - 0.5 : starVal;
        }
        const current = getRating();
        const finalVal = current === targetVal && isCancelAllowed ? 0 : targetVal;
        setRating(finalVal);
        updateVisuals(finalVal);
      });
      item.addEventListener("keydown", (e) => {
        const current = getRating();
        const step = isAllowHalf ? 0.5 : 1;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          const nextVal = Math.min(totalStars, current + step);
          setRating(nextVal);
          updateVisuals(nextVal);
          focusStar(Math.ceil(nextVal));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          const prevVal = Math.max(0, current - step);
          setRating(prevVal);
          updateVisuals(prevVal);
          focusStar(Math.ceil(prevVal));
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setRating(starVal);
          updateVisuals(starVal);
        } else if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          setRating(0);
          updateVisuals(0);
        }
      });
    });
    container.addEventListener("mouseleave", () => {
      hoverValue = null;
      updateVisuals(getRating());
    });
  }
  function focusStar(starNum) {
    const target = container.querySelector(`.p-rating-item[data-value="${Math.max(1, starNum)}"]`);
    target?.focus();
  }
  function syncValue(val) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = String(val);
    }
    container.dispatchEvent(new CustomEvent("rating:change", {
      bubbles: true,
      detail: { value: val }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: val }
    }));
  }
  init();
}
export {
  RatingIsland as default
};
//# sourceMappingURL=rating-RN6FXTFU.js.map

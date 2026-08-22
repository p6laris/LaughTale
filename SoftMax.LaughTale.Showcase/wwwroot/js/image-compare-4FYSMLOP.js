// ../SoftMax.LaughTale.Client/src/components/image-compare.ts
function ImageCompareIsland(container, props) {
  let splitPercent = 50;
  function render() {
    container.innerHTML = `
            <div class="laughtale-image-compare" style="position: relative; width: 100%; max-width: 600px; height: 340px; border-radius: var(--p-border-radius-lg); overflow: hidden; user-select: none; border: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-md);">
                <!-- After Image (Bottom) -->
                <img src="${props.afterImage}" alt="After" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
                ${props.afterLabel ? `<span style="position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">${props.afterLabel}</span>` : ""}

                <!-- Before Image (Top Clipped) -->
                <div class="compare-clip" style="position: absolute; inset: 0; width: ${splitPercent}%; height: 100%; overflow: hidden;">
                    <img src="${props.beforeImage}" alt="Before" style="position: absolute; top: 0; left: 0; width: 600px; max-width: 600px; height: 340px; object-fit: cover;" />
                    ${props.beforeLabel ? `<span style="position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">${props.beforeLabel}</span>` : ""}
                </div>

                <!-- Divider Line & Handle -->
                <div class="compare-handle-line" style="position: absolute; top: 0; bottom: 0; left: ${splitPercent}%; width: 2px; background: #ffffff; box-shadow: 0 0 4px rgba(0,0,0,0.5); cursor: ew-resize;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2rem; height: 2rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700; color: var(--p-primary-600);">
                        \u25C0\u25B6
                    </div>
                </div>
            </div>
        `;
    const compareBox = container.querySelector(".laughtale-image-compare");
    const onMove = (e) => {
      const rect = compareBox.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      let p = (clientX - rect.left) / rect.width * 100;
      splitPercent = Math.max(0, Math.min(100, p));
      render();
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    compareBox.querySelector(".compare-handle-line")?.addEventListener("mousedown", () => {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
    compareBox.querySelector(".compare-handle-line")?.addEventListener("touchstart", () => {
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onUp);
    });
  }
  render();
}
export {
  ImageCompareIsland as default
};
//# sourceMappingURL=image-compare-4FYSMLOP.js.map

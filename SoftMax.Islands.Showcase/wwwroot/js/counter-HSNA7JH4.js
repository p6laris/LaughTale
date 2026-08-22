// Scripts/islands/counter.ts
function CounterIsland(container, props) {
  let count = props.initialCount || 0;
  const step = props.step || 1;
  container.innerHTML = `
        <div class="p-input-group" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">${props.label}</span>
                <span class="aura-tag tag-emerald">Hydrate: Load</span>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg);">
                <button type="button" class="p-button p-button-secondary decrement-btn" style="width: 2.25rem; height: 2.25rem; padding: 0; font-size: 1.125rem;">\u2212</button>
                <div class="count-display" style="font-family: var(--p-font-mono); font-size: 1.75rem; font-weight: 700; color: var(--p-surface-950);">${count}</div>
                <button type="button" class="p-button p-button-primary increment-btn" style="width: 2.25rem; height: 2.25rem; padding: 0; font-size: 1.125rem;">+</button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between;">
                <button type="button" class="reset-btn" style="background: none; border: none; font-size: 0.75rem; color: var(--p-surface-500); cursor: pointer; text-decoration: underline;">Reset to default</button>
                <span style="font-size: 0.75rem; color: var(--p-primary-600); font-weight: 500;">Step: \xB1${step}</span>
            </div>
        </div>
    `;
  const display = container.querySelector(".count-display");
  const update = () => {
    display.textContent = count.toString();
  };
  container.querySelector(".increment-btn")?.addEventListener("click", () => {
    count += step;
    update();
  });
  container.querySelector(".decrement-btn")?.addEventListener("click", () => {
    count -= step;
    update();
  });
  container.querySelector(".reset-btn")?.addEventListener("click", () => {
    count = props.initialCount;
    update();
  });
}
export {
  CounterIsland as default
};
//# sourceMappingURL=counter-HSNA7JH4.js.map

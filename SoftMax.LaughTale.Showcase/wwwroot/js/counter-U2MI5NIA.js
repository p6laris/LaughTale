// Scripts/islands/counter.ts
function CounterIsland(container, props) {
  let count = props.initialCount || 0;
  const step = props.step || 1;
  container.innerHTML = `
        <div class="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center gap-4">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">${props.label}</span>
            <div class="text-4xl font-extrabold font-mono text-slate-900 count-display">${count}</div>
            <div class="flex items-center gap-3">
                <button class="decrement-btn px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition">- ${step}</button>
                <button class="reset-btn px-3 py-2 text-xs text-slate-500 hover:text-slate-700 underline">Reset</button>
                <button class="increment-btn px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition shadow-sm">+ ${step}</button>
            </div>
            <span class="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Hydrated via <code>HydrateStrategy.Load</code>
            </span>
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
//# sourceMappingURL=counter-U2MI5NIA.js.map

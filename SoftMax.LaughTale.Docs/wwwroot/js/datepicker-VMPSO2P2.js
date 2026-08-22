import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/datepicker.ts
function DatePickerIsland(container, props) {
  let selectedDate = props.value ? new Date(props.value) : null;
  let viewYear = selectedDate ? selectedDate.getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
  let viewMonth = selectedDate ? selectedDate.getMonth() : (/* @__PURE__ */ new Date()).getMonth();
  let isOpen = false;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  function formatDate(d) {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function render() {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const dayCells = [];
    for (let i = 0; i < firstDay; i++) {
      dayCells.push("<div></div>");
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === day;
      dayCells.push(`
                <button type="button" 
                        class="calendar-day-btn" 
                        data-day="${day}" 
                        style="width: 2rem; height: 2rem; border-radius: 50%; border: none; background: ${isSelected ? "var(--p-primary-600)" : "transparent"}; color: ${isSelected ? "#ffffff" : "var(--p-surface-800)"}; font-weight: ${isSelected ? "700" : "500"}; font-size: 0.8125rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease;">
                    ${day}
                </button>
            `);
    }
    container.innerHTML = `
            <div class="laughtale-datepicker" style="position: relative; width: 100%; max-width: 260px; user-select: none;">
                <!-- Input trigger -->
                <div class="dp-trigger" style="display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); padding: 0.5rem 0.75rem; cursor: ${props.disabled ? "not-allowed" : "pointer"};">
                    <span style="font-size: 0.875rem; color: ${selectedDate ? "var(--p-text-color)" : "var(--p-surface-400)"};">
                        ${selectedDate ? formatDate(selectedDate) : props.placeholder || "Select date..."}
                    </span>
                    <span style="color: var(--p-surface-500); display: flex; align-items: center;">${LucideIcons.calendar}</span>
                </div>

                <!-- Calendar Popup Overlay -->
                <div class="dp-overlay" style="display: ${isOpen ? "block" : "none"}; position: absolute; top: calc(100% + 4px); left: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 1rem; width: 280px;">
                    <!-- Calendar Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <button type="button" class="btn-prev-month" style="border: none; background: transparent; color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${LucideIcons.chevronLeft}
                        </button>
                        <div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900);">
                            ${monthNames[viewMonth]} ${viewYear}
                        </div>
                        <button type="button" class="btn-next-month" style="border: none; background: transparent; color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${LucideIcons.chevronRight}
                        </button>
                    </div>

                    <!-- Day Names -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); margin-bottom: 0.35rem;">
                        ${dayNames.map((d) => `<div>${d}</div>`).join("")}
                    </div>

                    <!-- Day Grid -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; justify-items: center;">
                        ${dayCells.join("")}
                    </div>
                </div>
            </div>
        `;
    if (props.disabled) return;
    container.querySelector(".dp-trigger")?.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      render();
    });
    container.querySelector(".btn-prev-month")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (viewMonth === 0) {
        viewMonth = 11;
        viewYear--;
      } else {
        viewMonth--;
      }
      render();
    });
    container.querySelector(".btn-next-month")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (viewMonth === 11) {
        viewMonth = 0;
        viewYear++;
      } else {
        viewMonth++;
      }
      render();
    });
    container.querySelectorAll(".calendar-day-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const day = parseInt(btn.getAttribute("data-day"), 10);
        selectedDate = new Date(viewYear, viewMonth, day);
        isOpen = false;
        render();
        syncValue();
      });
    });
  }
  function syncValue() {
    const valStr = formatDate(selectedDate);
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = valStr;
    }
    container.dispatchEvent(new CustomEvent("date:change", {
      bubbles: true,
      detail: { date: valStr }
    }));
  }
  document.addEventListener("click", () => {
    if (isOpen) {
      isOpen = false;
      render();
    }
  });
  render();
}
export {
  DatePickerIsland as default
};
//# sourceMappingURL=datepicker-VMPSO2P2.js.map

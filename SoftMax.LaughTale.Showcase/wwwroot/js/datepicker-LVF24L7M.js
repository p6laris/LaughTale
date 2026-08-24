import {
  useClickOutside
} from "./chunk-T4EPW24S.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/datepicker.ts
var CSS = `
.laughtale-datepicker {
    position: relative;
    display: inline-flex;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-datepicker.fluid {
    width: 100%;
}
.laughtale-datepicker:not(.fluid) {
    width: 100%;
    max-width: 280px;
}
.laughtale-datepicker.inline {
    display: inline-block;
    width: auto;
    max-width: none;
}

.dp-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    gap: 0.5rem;
}
.dp-trigger.variant-filled {
    background: var(--p-surface-50);
}
.dp-trigger.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.dp-trigger.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.dp-trigger.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.dp-trigger.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.dp-trigger.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.dp-trigger.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.dp-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--p-text-color);
}
.dp-label.placeholder {
    color: var(--p-text-muted);
}
.dp-icon {
    display: flex;
    align-items: center;
    color: var(--p-text-muted);
}

/* Overlay & Panel */
.dp-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    display: none;
}
.dp-panel {
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    padding: 0.875rem;
    width: 19rem;
    box-sizing: border-box;
}
.laughtale-datepicker.inline .dp-panel {
    box-shadow: var(--p-shadow-sm);
    display: block !important;
}

/* Header */
.dp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}
.dp-nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-nav-btn:hover {
    background: var(--p-surface-100);
}
.dp-title-btn {
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--p-text-color);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    transition: background 150ms ease;
}
.dp-title-btn:hover {
    background: var(--p-surface-100);
}

/* Calendar Grid */
.dp-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-text-muted);
    margin-bottom: 0.5rem;
}
.dp-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
}
.dp-day-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    width: 100%;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--p-text-color);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    box-sizing: border-box;
    user-select: none;
}
.dp-day-cell:hover:not(.disabled):not(.selected) {
    background: var(--p-surface-100);
}
.dp-day-cell.other-month {
    color: var(--p-text-muted);
    opacity: 0.4;
}
.dp-day-cell.today:not(.selected) {
    border: 1px solid var(--p-primary-500);
    font-weight: 700;
}
.dp-day-cell.selected {
    background: var(--p-primary-500) !important;
    color: #ffffff !important;
    font-weight: 700;
}
.dp-day-cell.in-range {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    border-radius: 0;
}
.dp-day-cell.range-start {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.dp-day-cell.range-end {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.dp-day-cell.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
}

/* Month / Year Grid */
.dp-month-grid, .dp-year-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.5rem 0;
}
.dp-view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    border: none;
    background: transparent;
    color: var(--p-text-color);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-view-btn:hover {
    background: var(--p-surface-100);
}
.dp-view-btn.selected {
    background: var(--p-primary-500);
    color: #ffffff;
    font-weight: 700;
}

/* Time Picker Section */
.dp-timepicker {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-top: 1px solid var(--p-border-color);
    padding-top: 0.75rem;
    margin-top: 0.75rem;
}
.dp-time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}
.dp-time-val {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-text-color);
    min-width: 2rem;
    text-align: center;
}
.dp-time-btn {
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.15rem;
    border-radius: 4px;
}
.dp-time-btn:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
.dp-ampm-btn {
    border: 1px solid var(--p-border-color);
    background: var(--p-surface-50);
    color: var(--p-text-color);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
}

/* Button Bar */
.dp-buttonbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--p-border-color);
    padding-top: 0.65rem;
    margin-top: 0.75rem;
}
.dp-bar-btn {
    border: none;
    background: transparent;
    color: var(--p-primary-600);
    font-weight: 600;
    font-size: 0.8125rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 150ms ease;
}
.dp-bar-btn:hover {
    background: var(--p-primary-50);
}

/* Dark Mode Tokens */
.dark .dp-trigger {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .dp-trigger.variant-filled {
    background: var(--p-surface-800);
}
.dark .dp-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .dp-nav-btn:hover, .dark .dp-title-btn:hover, .dark .dp-day-cell:hover:not(.disabled):not(.selected), .dark .dp-view-btn:hover {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .dp-day-cell.in-range {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
.dark .dp-day-cell.selected, .dark .dp-view-btn.selected {
    background: var(--p-primary-500) !important;
    color: var(--p-surface-950) !important;
}
.dark .dp-timepicker, .dark .dp-buttonbar {
    border-color: var(--p-surface-700);
}
.dark .dp-ampm-btn {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
}
.dark .dp-bar-btn {
    color: #6ee7b7;
}
.dark .dp-bar-btn:hover {
    background: rgba(16, 185, 129, 0.15);
}
`;
var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function DatePickerIsland(container, props) {
  injectIslandStyle("datepicker", CSS);
  const selectionMode = props.selectionMode || "single";
  let currentView = props.view || "date";
  const isInline = props.inline === true;
  const isTimeOnly = props.timeOnly === true;
  const showTime = props.showTime === true || isTimeOnly;
  const hour12 = props.hourFormat === "12";
  let selectedDates = parseInitialValue(props.value);
  let viewDate = selectedDates.length > 0 ? new Date(selectedDates[0]) : /* @__PURE__ */ new Date();
  let selectedHour = selectedDates.length > 0 ? selectedDates[0].getHours() : (/* @__PURE__ */ new Date()).getHours();
  let selectedMinute = selectedDates.length > 0 ? selectedDates[0].getMinutes() : (/* @__PURE__ */ new Date()).getMinutes();
  let isPM = selectedHour >= 12;
  const minD = props.minDate ? new Date(props.minDate) : null;
  const maxD = props.maxDate ? new Date(props.maxDate) : null;
  function parseInitialValue(val) {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map((v) => new Date(v)).filter((d2) => !isNaN(d2.getTime()));
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? [] : [d];
  }
  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    let res = `${y}-${m}-${day}`;
    if (showTime) {
      const h = hour12 ? d.getHours() % 12 || 12 : d.getHours();
      const min = String(d.getMinutes()).padStart(2, "0");
      const ampm = d.getHours() >= 12 ? " PM" : " AM";
      res += ` ${String(h).padStart(2, "0")}:${min}${hour12 ? ampm : ""}`;
    }
    return res;
  }
  function getDisplayText() {
    if (selectedDates.length === 0) return "";
    if (selectionMode === "range") {
      if (selectedDates.length === 1) return formatDate(selectedDates[0]) + " - ...";
      return `${formatDate(selectedDates[0])} - ${formatDate(selectedDates[1])}`;
    }
    if (selectionMode === "multiple") {
      return selectedDates.map((d) => formatDate(d)).join(", ");
    }
    return formatDate(selectedDates[0]);
  }
  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }
  function isDateDisabled(d) {
    if (minD && d < new Date(minD.getFullYear(), minD.getMonth(), minD.getDate())) return true;
    if (maxD && d > new Date(maxD.getFullYear(), maxD.getMonth(), maxD.getDate(), 23, 59, 59)) return true;
    return false;
  }
  function renderComponent() {
    const displayText = getDisplayText();
    const size = props.size || "normal";
    const variant = props.variant || "outlined";
    if (isInline) {
      container.innerHTML = `
                <div class="laughtale-datepicker inline">
                    <div class="dp-panel">
                        ${renderPanelContent()}
                    </div>
                </div>
            `;
      bindPanelEvents(container.querySelector(".dp-panel"));
      return;
    }
    container.innerHTML = `
            <div class="laughtale-datepicker ${props.fluid ? "fluid" : ""}">
                <div class="dp-trigger size-${size} variant-${variant} ${props.invalid ? "invalid" : ""} ${props.disabled ? "disabled" : ""}" 
                     tabindex="${props.disabled ? -1 : 0}" 
                     role="combobox" 
                     aria-expanded="false">
                    <span class="dp-label ${displayText ? "" : "placeholder"}">
                        ${displayText || props.placeholder || "Select Date..."}
                    </span>
                    ${props.showIcon !== false ? `
                        <span class="dp-icon">
                            ${LucideIcons.calendar}
                        </span>
                    ` : ""}
                </div>

                <div class="dp-overlay">
                    <div class="dp-panel">
                        ${renderPanelContent()}
                    </div>
                </div>
            </div>
        `;
    const trigger = container.querySelector(".dp-trigger");
    const overlay = container.querySelector(".dp-overlay");
    const panel = container.querySelector(".dp-panel");
    const disclosure = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        overlay.style.display = "block";
        trigger.classList.add("focused");
        trigger.setAttribute("aria-expanded", "true");
      },
      onClose: () => {
        overlay.style.display = "none";
        trigger.classList.remove("focused");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
    useClickOutside(container, () => disclosure.close());
    trigger.addEventListener("click", () => {
      if (props.disabled) return;
      disclosure.toggle();
    });
    trigger.addEventListener("keydown", (e) => {
      if (props.disabled) return;
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        disclosure.open();
      } else if (e.key === "Escape") {
        disclosure.close();
      }
    });
    bindPanelEvents(panel, disclosure);
  }
  function renderPanelContent() {
    if (isTimeOnly) {
      return renderTimePicker();
    }
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    let mainViewHtml = "";
    if (currentView === "date") {
      mainViewHtml = renderDateView(year, month);
    } else if (currentView === "month") {
      mainViewHtml = renderMonthView(year);
    } else {
      mainViewHtml = renderYearView(year);
    }
    return `
            <div class="dp-header">
                <button type="button" class="dp-nav-btn btn-prev" aria-label="Previous">
                    ${LucideIcons.chevronLeft}
                </button>
                <button type="button" class="dp-title-btn btn-title">
                    ${currentView === "date" ? `${MONTH_NAMES[month]} ${year}` : currentView === "month" ? `${year}` : `${Math.floor(year / 10) * 10} - ${Math.floor(year / 10) * 10 + 9}`}
                </button>
                <button type="button" class="dp-nav-btn btn-next" aria-label="Next">
                    ${LucideIcons.chevronRight}
                </button>
            </div>

            ${mainViewHtml}

            ${showTime ? renderTimePicker() : ""}

            ${props.showButtonBar ? `
                <div class="dp-buttonbar">
                    <button type="button" class="dp-bar-btn btn-today">Today</button>
                    <button type="button" class="dp-bar-btn btn-clear">Clear</button>
                </div>
            ` : ""}
        `;
  }
  function renderDateView(year, month) {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = /* @__PURE__ */ new Date();
    let cellsHtml = "";
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const d = new Date(year, month - 1, day);
      cellsHtml += `<button type="button" class="dp-day-cell other-month disabled" disabled>${day}</button>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = isSameDay(d, today);
      const isDisabled = isDateDisabled(d);
      let isSelected = false;
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      if (selectionMode === "range" && selectedDates.length > 0) {
        const start = selectedDates[0];
        const end = selectedDates[1];
        if (isSameDay(d, start)) {
          isSelected = true;
          isRangeStart = true;
        } else if (end && isSameDay(d, end)) {
          isSelected = true;
          isRangeEnd = true;
        } else if (end && d > start && d < end) {
          isInRange = true;
        }
      } else {
        isSelected = selectedDates.some((sd) => isSameDay(sd, d));
      }
      const classes = [
        "dp-day-cell",
        isToday ? "today" : "",
        isSelected ? "selected" : "",
        isInRange ? "in-range" : "",
        isRangeStart ? "range-start" : "",
        isRangeEnd ? "range-end" : "",
        isDisabled ? "disabled" : ""
      ].filter(Boolean).join(" ");
      cellsHtml += `<button type="button" class="${classes}" data-day="${day}">${day}</button>`;
    }
    return `
            <div class="dp-weekdays">
                ${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}
            </div>
            <div class="dp-days-grid">
                ${cellsHtml}
            </div>
        `;
  }
  function renderMonthView(year) {
    return `
            <div class="dp-month-grid">
                ${SHORT_MONTHS.map((m, idx) => {
      const isSelected = selectedDates.some((d) => d.getFullYear() === year && d.getMonth() === idx);
      return `<button type="button" class="dp-view-btn ${isSelected ? "selected" : ""}" data-month="${idx}">${m}</button>`;
    }).join("")}
            </div>
        `;
  }
  function renderYearView(year) {
    const startYear = Math.floor(year / 10) * 10;
    const years = [];
    for (let y = startYear - 1; y <= startYear + 10; y++) {
      years.push(y);
    }
    return `
            <div class="dp-year-grid">
                ${years.map((y) => {
      const isSelected = selectedDates.some((d) => d.getFullYear() === y);
      return `<button type="button" class="dp-view-btn ${isSelected ? "selected" : ""}" data-year="${y}">${y}</button>`;
    }).join("")}
            </div>
        `;
  }
  function renderTimePicker() {
    const displayH = hour12 ? selectedHour % 12 || 12 : selectedHour;
    return `
            <div class="dp-timepicker">
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-hour-up">${LucideIcons.chevronUp}</button>
                    <span class="dp-time-val">${String(displayH).padStart(2, "0")}</span>
                    <button type="button" class="dp-time-btn btn-hour-down">${LucideIcons.chevronDown}</button>
                </div>
                <span style="font-weight: 700; color: var(--p-text-muted);">:</span>
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-min-up">${LucideIcons.chevronUp}</button>
                    <span class="dp-time-val">${String(selectedMinute).padStart(2, "0")}</span>
                    <button type="button" class="dp-time-btn btn-min-down">${LucideIcons.chevronDown}</button>
                </div>
                ${hour12 ? `
                    <button type="button" class="dp-ampm-btn btn-ampm">${isPM ? "PM" : "AM"}</button>
                ` : ""}
            </div>
        `;
  }
  function bindPanelEvents(panel, disclosure) {
    panel.querySelector(".btn-prev")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentView === "date") {
        viewDate.setMonth(viewDate.getMonth() - 1);
      } else if (currentView === "month") {
        viewDate.setFullYear(viewDate.getFullYear() - 1);
      } else {
        viewDate.setFullYear(viewDate.getFullYear() - 10);
      }
      renderComponent();
    });
    panel.querySelector(".btn-next")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentView === "date") {
        viewDate.setMonth(viewDate.getMonth() + 1);
      } else if (currentView === "month") {
        viewDate.setFullYear(viewDate.getFullYear() + 1);
      } else {
        viewDate.setFullYear(viewDate.getFullYear() + 10);
      }
      renderComponent();
    });
    panel.querySelector(".btn-title")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentView === "date") currentView = "month";
      else if (currentView === "month") currentView = "year";
      else currentView = "date";
      renderComponent();
    });
    panel.querySelectorAll(".dp-day-cell:not(.disabled):not(.other-month)").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const day = parseInt(btn.dataset.day || "1", 10);
        const target = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, selectedHour, selectedMinute);
        if (selectionMode === "range") {
          if (selectedDates.length === 0 || selectedDates.length === 2) {
            selectedDates = [target];
          } else {
            if (target < selectedDates[0]) {
              selectedDates = [target, selectedDates[0]];
            } else {
              selectedDates.push(target);
            }
            if (!isInline && !showTime && disclosure) disclosure.close();
          }
        } else if (selectionMode === "multiple") {
          const existingIdx = selectedDates.findIndex((d) => isSameDay(d, target));
          if (existingIdx >= 0) selectedDates.splice(existingIdx, 1);
          else selectedDates.push(target);
        } else {
          selectedDates = [target];
          if (!isInline && !showTime && disclosure) disclosure.close();
        }
        syncAndDispatch();
        renderComponent();
      });
    });
    panel.querySelectorAll(".dp-month-grid .dp-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const m = parseInt(btn.dataset.month || "0", 10);
        viewDate.setMonth(m);
        currentView = "date";
        renderComponent();
      });
    });
    panel.querySelectorAll(".dp-year-grid .dp-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const y = parseInt(btn.dataset.year || "2026", 10);
        viewDate.setFullYear(y);
        currentView = "month";
        renderComponent();
      });
    });
    panel.querySelector(".btn-hour-up")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedHour = (selectedHour + 1) % 24;
      updateSelectedTime();
    });
    panel.querySelector(".btn-hour-down")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedHour = (selectedHour - 1 + 24) % 24;
      updateSelectedTime();
    });
    panel.querySelector(".btn-min-up")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedMinute = (selectedMinute + 1) % 60;
      updateSelectedTime();
    });
    panel.querySelector(".btn-min-down")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedMinute = (selectedMinute - 1 + 60) % 60;
      updateSelectedTime();
    });
    panel.querySelector(".btn-ampm")?.addEventListener("click", (e) => {
      e.stopPropagation();
      isPM = !isPM;
      selectedHour = isPM ? selectedHour % 12 + 12 : selectedHour % 12;
      updateSelectedTime();
    });
    panel.querySelector(".btn-today")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const now = /* @__PURE__ */ new Date();
      selectedDates = [now];
      viewDate = new Date(now);
      syncAndDispatch();
      if (!isInline && !showTime && disclosure) disclosure.close();
      renderComponent();
    });
    panel.querySelector(".btn-clear")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedDates = [];
      syncAndDispatch();
      renderComponent();
    });
  }
  function updateSelectedTime() {
    if (selectedDates.length > 0) {
      selectedDates.forEach((d) => {
        d.setHours(selectedHour);
        d.setMinutes(selectedMinute);
      });
    }
    syncAndDispatch();
    renderComponent();
  }
  function syncAndDispatch() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = selectedDates.map((d) => formatDate(d)).join(",");
    }
    container.dispatchEvent(new CustomEvent("datepicker:change", {
      bubbles: true,
      detail: {
        dates: selectedDates,
        value: selectedDates.map((d) => formatDate(d)),
        formatted: getDisplayText()
      }
    }));
  }
  renderComponent();
}
export {
  DatePickerIsland as default
};
//# sourceMappingURL=datepicker-LVF24L7M.js.map

/**
 * LaughTale: Enterprise DatePicker Component (Aura DatePicker)
 * Accessible, theme-aware calendar & time picker with Single/Range/Multiple selection,
 * Month/Year views, Button Bar, and full Theme Studio token scaling.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';
import { useLocale } from '../composables/useLocale';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';

export interface DatePickerProps {
    targetInputName?: string;
    value?: string | string[]; // 'YYYY-MM-DD' or array
    placeholder?: string;
    dateFormat?: string; // default 'yy-mm-dd'
    selectionMode?: 'single' | 'multiple' | 'range';
    view?: 'date' | 'month' | 'year';
    minDate?: string;
    maxDate?: string;
    showButtonBar?: boolean;
    showTime?: boolean;
    timeOnly?: boolean;
    hourFormat?: '12' | '24';
    inline?: boolean;
    showIcon?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    fluid?: boolean;
    size?: 'small' | 'normal' | 'large';
    variant?: 'outlined' | 'filled';
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
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
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    color: var(--lt-text-primary);
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    gap: 0.5rem;
}
.dp-trigger.variant-filled {
    background: var(--lt-surface-50);
}
.dp-trigger.focused {
    border-color: var(--lt-primary-500);
    box-shadow: 0 0 0 1px var(--lt-primary-500);
}
.dp-trigger.invalid {
    border-color: var(--lt-danger-500, var(--lt-danger-500)) !important;
    box-shadow: 0 0 0 1px var(--lt-danger-500, var(--lt-danger-500)) !important;
}
.dp-trigger.disabled {
    background: var(--lt-surface-100);
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
    color: var(--lt-text-primary);
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
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
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
    color: var(--lt-text-primary);
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-nav-btn:hover {
    background: var(--lt-surface-100);
}
.dp-title-btn {
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--lt-text-primary);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: calc(var(--lt-radius) - 2px);
    transition: background 150ms ease;
}
.dp-title-btn:hover {
    background: var(--lt-surface-100);
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
    color: var(--lt-text-primary);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    box-sizing: border-box;
    user-select: none;
}
.dp-day-cell:hover:not(.disabled):not(.selected) {
    background: var(--lt-surface-100);
}
.dp-day-cell.other-month {
    color: var(--p-text-muted);
    opacity: 0.4;
}
.dp-day-cell.today:not(.selected) {
    border: 1px solid var(--lt-primary-500);
    font-weight: 700;
}
.dp-day-cell.selected {
    background: var(--lt-primary-500) !important;
    color: var(--lt-surface-0, var(--lt-surface-0)) !important;
    font-weight: 700;
}
.dp-day-cell.in-range {
    background: var(--lt-primary-50);
    color: var(--lt-primary-700);
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
    border-radius: calc(var(--lt-radius) - 2px);
    border: none;
    background: transparent;
    color: var(--lt-text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-view-btn:hover {
    background: var(--lt-surface-100);
}
.dp-view-btn.selected {
    background: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
    font-weight: 700;
}

/* Time Picker Section */
.dp-timepicker {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-top: 1px solid var(--lt-surface-200);
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
    color: var(--lt-text-primary);
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
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
}
.dp-ampm-btn {
    border: 1px solid var(--lt-surface-200);
    background: var(--lt-surface-50);
    color: var(--lt-text-primary);
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
    border-top: 1px solid var(--lt-surface-200);
    padding-top: 0.65rem;
    margin-top: 0.75rem;
}
.dp-bar-btn {
    border: none;
    background: transparent;
    color: var(--lt-primary-600);
    font-weight: 600;
    font-size: 0.8125rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 150ms ease;
}
.dp-bar-btn:hover {
    background: var(--lt-primary-50);
}

/* Dark Mode Tokens */
html.dark .dp-trigger,
[data-theme="dark"] .dp-trigger,
.dark .dp-trigger {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .dp-trigger:hover:not(.disabled),
[data-theme="dark"] .dp-trigger:hover:not(.disabled),
.dark .dp-trigger:hover:not(.disabled) {
    border-color: var(--p-surface-400);
}
html.dark .dp-trigger.variant-filled,
[data-theme="dark"] .dp-trigger.variant-filled,
.dark .dp-trigger.variant-filled {
    background: var(--p-surface-100);
}
html.dark .dp-panel,
[data-theme="dark"] .dp-panel,
.dark .dp-panel {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
html.dark .dp-nav-btn:hover,
html.dark .dp-title-btn:hover,
html.dark .dp-day-cell:hover:not(.disabled):not(.selected),
html.dark .dp-view-btn:hover,
[data-theme="dark"] .dp-nav-btn:hover,
[data-theme="dark"] .dp-title-btn:hover,
[data-theme="dark"] .dp-day-cell:hover:not(.disabled):not(.selected),
[data-theme="dark"] .dp-view-btn:hover,
.dark .dp-nav-btn:hover,
.dark .dp-title-btn:hover,
.dark .dp-day-cell:hover:not(.disabled):not(.selected),
.dark .dp-view-btn:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
html.dark .dp-day-cell.in-range,
[data-theme="dark"] .dp-day-cell.in-range,
.dark .dp-day-cell.in-range {
    background: rgba(16, 185, 129, 0.15);
    color: var(--p-primary-300);
}
html.dark .dp-day-cell.selected,
html.dark .dp-view-btn.selected,
[data-theme="dark"] .dp-day-cell.selected,
[data-theme="dark"] .dp-view-btn.selected,
.dark .dp-day-cell.selected,
.dark .dp-view-btn.selected {
    background: var(--p-primary-500) !important;
    color: var(--p-surface-0) !important;
}
html.dark .dp-timepicker,
html.dark .dp-buttonbar,
[data-theme="dark"] .dp-timepicker,
[data-theme="dark"] .dp-buttonbar,
.dark .dp-timepicker,
.dark .dp-buttonbar {
    border-color: var(--p-border-color);
}
html.dark .dp-ampm-btn,
[data-theme="dark"] .dp-ampm-btn,
.dark .dp-ampm-btn {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .dp-bar-btn,
[data-theme="dark"] .dp-bar-btn,
.dark .dp-bar-btn {
    color: var(--p-primary-300);
}
html.dark .dp-bar-btn:hover,
[data-theme="dark"] .dp-bar-btn:hover,
.dark .dp-bar-btn:hover {
    background: rgba(16, 185, 129, 0.15);
}
`;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePickerIsland(container: HTMLElement, props: DatePickerProps, ctx?: IslandContext) {
    injectIslandStyle('datepicker', CSS);

    const locale = useLocale(ctx);
    const monthNames = locale.dictionary?.monthNames || MONTH_NAMES;
    const shortMonths = locale.dictionary?.monthNamesShort || SHORT_MONTHS;
    const firstDayOfWeek = locale.dictionary?.firstDayOfWeek ?? 0;
    const dayNamesMin = locale.dictionary?.dayNamesMin || WEEKDAYS;

    const orderedWeekdays: string[] = [];
    for (let i = 0; i < 7; i++) {
        orderedWeekdays.push(dayNamesMin[(firstDayOfWeek + i) % 7]);
    }

    const selectionMode = props.selectionMode || 'single';
    let currentView: 'date' | 'month' | 'year' = props.view || 'date';
    const isInline = props.inline === true;
    const isTimeOnly = props.timeOnly === true;
    const showTime = props.showTime === true || isTimeOnly;
    const hour12 = props.hourFormat === '12';

    // State
    let selectedDates: Date[] = parseInitialValue(props.value);
    let viewDate = selectedDates.length > 0 ? new Date(selectedDates[0]) : new Date();
    let selectedHour = selectedDates.length > 0 ? selectedDates[0].getHours() : new Date().getHours();
    let selectedMinute = selectedDates.length > 0 ? selectedDates[0].getMinutes() : new Date().getMinutes();
    let isPM = selectedHour >= 12;

    const minD = props.minDate ? new Date(props.minDate) : null;
    const maxD = props.maxDate ? new Date(props.maxDate) : null;

    function parseInitialValue(val?: string | string[]): Date[] {
        if (!val) return [];
        if (Array.isArray(val)) {
            return val.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
        }
        const d = new Date(val);
        return isNaN(d.getTime()) ? [] : [d];
    }

    function formatDate(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        let res = `${y}-${m}-${day}`;
        if (showTime) {
            const h = hour12 ? (d.getHours() % 12 || 12) : d.getHours();
            const min = String(d.getMinutes()).padStart(2, '0');
            const ampm = d.getHours() >= 12 ? ' PM' : ' AM';
            res += ` ${String(h).padStart(2, '0')}:${min}${hour12 ? ampm : ''}`;
        }
        return res;
    }

    function getDisplayText(): string {
        if (selectedDates.length === 0) return '';
        if (selectionMode === 'range') {
            if (selectedDates.length === 1) return formatDate(selectedDates[0]) + ' - ...';
            return `${formatDate(selectedDates[0])} - ${formatDate(selectedDates[1])}`;
        }
        if (selectionMode === 'multiple') {
            return selectedDates.map(d => formatDate(d)).join(', ');
        }
        return formatDate(selectedDates[0]);
    }

    function isSameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    function isDateDisabled(d: Date): boolean {
        if (minD && d < new Date(minD.getFullYear(), minD.getMonth(), minD.getDate())) return true;
        if (maxD && d > new Date(maxD.getFullYear(), maxD.getMonth(), maxD.getDate(), 23, 59, 59)) return true;
        return false;
    }

    function renderComponent() {
        const displayText = getDisplayText();
        const size = props.size || 'normal';
        const variant = props.variant || 'outlined';

        applyPart(container, 'root', `laughtale-datepicker ${props.fluid ? 'fluid' : ''} ${isInline ? 'inline' : ''}`, props.pt, props.studioOverrides);

        if (isInline) {
            setHtml(container, html`
                <div class="dp-panel" data-part="panel">
                    ${renderPanelContent()}
                </div>
            `);
            bindPanelEvents(container.querySelector('.dp-panel')!);
            return;
        }

        setHtml(container, html`
            <div class="dp-trigger size-${size} variant-${variant} ${props.invalid ? 'invalid' : ''} ${props.disabled ? 'disabled' : ''}" 
                 data-part="trigger"
                 tabindex="${props.disabled ? -1 : 0}" 
                 role="combobox" 
                 aria-expanded="false">
                <span class="dp-label ${displayText ? '' : 'placeholder'}" data-part="label">
                    ${displayText || props.placeholder || 'Select Date...'}
                </span>
                ${props.showIcon !== false ? html`
                    <span class="dp-icon" data-part="icon">
                        ${unsafe(LucideIcons.calendar)}
                    </span>
                ` : ''}
            </div>

            <div class="dp-overlay" data-part="overlay">
                <div class="dp-panel" data-part="panel">
                    ${renderPanelContent()}
                </div>
            </div>
        `);

        const trigger = container.querySelector<HTMLElement>('.dp-trigger')!;
        const overlay = container.querySelector<HTMLElement>('.dp-overlay')!;
        const panel = container.querySelector<HTMLElement>('.dp-panel')!;

        const disclosure = useDisclosure({
            defaultIsOpen: false,
            onOpen: () => {
                overlay.style.display = 'block';
                trigger.classList.add('focused');
                trigger.setAttribute('aria-expanded', 'true');
            },
            onClose: () => {
                overlay.style.display = 'none';
                trigger.classList.remove('focused');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        useClickOutside(container, () => disclosure.close(), { signal: ctx?.signal });

        trigger.addEventListener('click', () => {
            if (props.disabled) return;
            disclosure.toggle();
        }, { signal: ctx?.signal });

        trigger.addEventListener('keydown', (e) => {
            if (props.disabled) return;
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
                e.preventDefault();
                disclosure.open();
            } else if (e.key === 'Escape') {
                disclosure.close();
            }
        }, { signal: ctx?.signal });

        bindPanelEvents(panel, disclosure);
    }

    function renderPanelContent(): Raw {
        if (isTimeOnly) {
            return renderTimePicker();
        }

        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        let mainViewHtml: Raw;
        if (currentView === 'date') {
            mainViewHtml = renderDateView(year, month);
        } else if (currentView === 'month') {
            mainViewHtml = renderMonthView(year);
        } else {
            mainViewHtml = renderYearView(year);
        }

        return html`
            <div class="dp-header">
                <button type="button" class="dp-nav-btn btn-prev" aria-label="Previous">
                    ${unsafe(LucideIcons.chevronLeft)}
                </button>
                <button type="button" class="dp-title-btn btn-title">
                    ${currentView === 'date' ? `${monthNames[month]} ${locale.formatDigits(year)}` : (currentView === 'month' ? `${locale.formatDigits(year)}` : `${locale.formatDigits(Math.floor(year / 10) * 10)} - ${locale.formatDigits(Math.floor(year / 10) * 10 + 9)}`)}
                </button>
                <button type="button" class="dp-nav-btn btn-next" aria-label="Next">
                    ${unsafe(LucideIcons.chevronRight)}
                </button>
            </div>

            ${mainViewHtml}

            ${showTime ? renderTimePicker() : ''}

            ${props.showButtonBar ? html`
                <div class="dp-buttonbar">
                    <button type="button" class="dp-bar-btn btn-today">${locale.t('today') || 'Today'}</button>
                    <button type="button" class="dp-bar-btn btn-clear">${locale.t('clear') || 'Clear'}</button>
                </div>
            ` : ''}
        `;
    }

    function renderDateView(year: number, month: number): Raw {
        const firstDayIndex = (new Date(year, month, 1).getDay() - firstDayOfWeek + 7) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const today = new Date();

        const cellsHtml: Raw[] = [];

        // Previous month filler days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            cellsHtml.push(html`<button type="button" class="dp-day-cell other-month disabled" disabled>${locale.formatDigits(day)}</button>`);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(year, month, day);
            const isToday = isSameDay(d, today);
            const isDisabled = isDateDisabled(d);

            let isSelected = false;
            let isInRange = false;
            let isRangeStart = false;
            let isRangeEnd = false;

            if (selectionMode === 'range' && selectedDates.length > 0) {
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
                isSelected = selectedDates.some(sd => isSameDay(sd, d));
            }

            const classes = [
                'dp-day-cell',
                isToday ? 'today' : '',
                isSelected ? 'selected' : '',
                isInRange ? 'in-range' : '',
                isRangeStart ? 'range-start' : '',
                isRangeEnd ? 'range-end' : '',
                isDisabled ? 'disabled' : ''
            ].filter(Boolean).join(' ');

            cellsHtml.push(html`<button type="button" class="${classes}" data-day="${day}">${locale.formatDigits(day)}</button>`);
        }

        return html`
            <div class="dp-weekdays">
                ${orderedWeekdays.map(w => html`<span>${w}</span>`)}
            </div>
            <div class="dp-days-grid">
                ${cellsHtml}
            </div>
        `;
    }

    function renderMonthView(year: number): Raw {
        return html`
            <div class="dp-month-grid">
                ${shortMonths.map((m, idx) => {
                    const isSelected = selectedDates.some(d => d.getFullYear() === year && d.getMonth() === idx);
                    return html`<button type="button" class="dp-view-btn ${isSelected ? 'selected' : ''}" data-month="${idx}">${m}</button>`;
                })}
            </div>
        `;
    }

    function renderYearView(year: number): Raw {
        const startYear = Math.floor(year / 10) * 10;
        const years: number[] = [];
        for (let y = startYear - 1; y <= startYear + 10; y++) {
            years.push(y);
        }

        return html`
            <div class="dp-year-grid">
                ${years.map(y => {
                    const isSelected = selectedDates.some(d => d.getFullYear() === y);
                    return html`<button type="button" class="dp-view-btn ${isSelected ? 'selected' : ''}" data-year="${y}">${locale.formatDigits(y)}</button>`;
                })}
            </div>
        `;
    }

    function renderTimePicker(): Raw {
        const displayH = hour12 ? (selectedHour % 12 || 12) : selectedHour;
        return html`
            <div class="dp-timepicker">
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-hour-up">${unsafe(LucideIcons.chevronUp)}</button>
                    <span class="dp-time-val">${String(displayH).padStart(2, '0')}</span>
                    <button type="button" class="dp-time-btn btn-hour-down">${unsafe(LucideIcons.chevronDown)}</button>
                </div>
                <span style="font-weight: 700; color: var(--p-text-muted);">:</span>
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-min-up">${unsafe(LucideIcons.chevronUp)}</button>
                    <span class="dp-time-val">${String(selectedMinute).padStart(2, '0')}</span>
                    <button type="button" class="dp-time-btn btn-min-down">${unsafe(LucideIcons.chevronDown)}</button>
                </div>
                ${hour12 ? html`
                    <button type="button" class="dp-ampm-btn btn-ampm">${isPM ? 'PM' : 'AM'}</button>
                ` : ''}
            </div>
        `;
    }

    function bindPanelEvents(panel: HTMLElement, disclosure?: any) {
        // Prev button
        panel.querySelector('.btn-prev')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentView === 'date') {
                viewDate.setMonth(viewDate.getMonth() - 1);
            } else if (currentView === 'month') {
                viewDate.setFullYear(viewDate.getFullYear() - 1);
            } else {
                viewDate.setFullYear(viewDate.getFullYear() - 10);
            }
            renderComponent();
        }, { signal: ctx?.signal });

        // Next button
        panel.querySelector('.btn-next')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentView === 'date') {
                viewDate.setMonth(viewDate.getMonth() + 1);
            } else if (currentView === 'month') {
                viewDate.setFullYear(viewDate.getFullYear() + 1);
            } else {
                viewDate.setFullYear(viewDate.getFullYear() + 10);
            }
            renderComponent();
        }, { signal: ctx?.signal });

        // Title button (switch view)
        panel.querySelector('.btn-title')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentView === 'date') currentView = 'month';
            else if (currentView === 'month') currentView = 'year';
            else currentView = 'date';
            renderComponent();
        }, { signal: ctx?.signal });

        // Day click
        panel.querySelectorAll<HTMLButtonElement>('.dp-day-cell:not(.disabled):not(.other-month)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const day = parseInt(btn.dataset.day || '1', 10);
                const target = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, selectedHour, selectedMinute);

                if (selectionMode === 'range') {
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
                } else if (selectionMode === 'multiple') {
                    const existingIdx = selectedDates.findIndex(d => isSameDay(d, target));
                    if (existingIdx >= 0) selectedDates.splice(existingIdx, 1);
                    else selectedDates.push(target);
                } else {
                    selectedDates = [target];
                    if (!isInline && !showTime && disclosure) disclosure.close();
                }

                syncAndDispatch();
                renderComponent();
            }, { signal: ctx?.signal });
        });

        // Month click
        panel.querySelectorAll<HTMLButtonElement>('.dp-month-grid .dp-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const m = parseInt(btn.dataset.month || '0', 10);
                viewDate.setMonth(m);
                currentView = 'date';
                renderComponent();
            }, { signal: ctx?.signal });
        });

        // Year click
        panel.querySelectorAll<HTMLButtonElement>('.dp-year-grid .dp-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const y = parseInt(btn.dataset.year || '2026', 10);
                viewDate.setFullYear(y);
                currentView = 'month';
                renderComponent();
            }, { signal: ctx?.signal });
        });

        // Time controls
        panel.querySelector('.btn-hour-up')?.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedHour = (selectedHour + 1) % 24;
            updateSelectedTime();
        }, { signal: ctx?.signal });
        panel.querySelector('.btn-hour-down')?.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedHour = (selectedHour - 1 + 24) % 24;
            updateSelectedTime();
        }, { signal: ctx?.signal });
        panel.querySelector('.btn-min-up')?.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedMinute = (selectedMinute + 1) % 60;
            updateSelectedTime();
        }, { signal: ctx?.signal });
        panel.querySelector('.btn-min-down')?.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedMinute = (selectedMinute - 1 + 60) % 60;
            updateSelectedTime();
        }, { signal: ctx?.signal });
        panel.querySelector('.btn-ampm')?.addEventListener('click', (e) => {
            e.stopPropagation();
            isPM = !isPM;
            selectedHour = isPM ? (selectedHour % 12) + 12 : (selectedHour % 12);
            updateSelectedTime();
        }, { signal: ctx?.signal });

        // Button bar
        panel.querySelector('.btn-today')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const now = new Date();
            selectedDates = [now];
            viewDate = new Date(now);
            syncAndDispatch();
            if (!isInline && !showTime && disclosure) disclosure.close();
            renderComponent();
        }, { signal: ctx?.signal });
        panel.querySelector('.btn-clear')?.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedDates = [];
            syncAndDispatch();
            renderComponent();
        }, { signal: ctx?.signal });
    }

    function updateSelectedTime() {
        if (selectedDates.length > 0) {
            selectedDates.forEach(d => {
                d.setHours(selectedHour);
                d.setMinutes(selectedMinute);
            });
        }
        syncAndDispatch();
        renderComponent();
    }

    function syncAndDispatch() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = selectedDates.map(d => formatDate(d)).join(',');
        }

        container.dispatchEvent(new CustomEvent('datepicker:change', {
            bubbles: true,
            detail: {
                dates: selectedDates,
                value: selectedDates.map(d => formatDate(d)),
                formatted: getDisplayText()
            }
        }));
    }

    renderComponent();
}

/**
 * SoftMax.LaughTale: Enterprise Radial Knob / Dial Component (Aura Knob inspired)
 */

export interface KnobProps {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    size?: number; // px, default 100
    color?: string; // default var(--p-primary-600)
    valueTemplate?: string; // e.g. '{value}%'
    targetInputName?: string;
    disabled?: boolean;
}

export default function KnobIsland(container: HTMLElement, props: KnobProps) {
    const min = props.min !== undefined ? props.min : 0;
    const max = props.max !== undefined ? props.max : 100;
    const step = props.step || 1;
    const size = props.size || 96;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let currentValue = props.value !== undefined ? props.value : min;

    function render() {
        const pct = Math.max(0, Math.min(1, (currentValue - min) / (max - min)));
        const strokeDashoffset = circumference * (1 - pct);
        const template = props.valueTemplate || '{value}%';
        const displayValue = template.replace('{value}', currentValue.toString());

        container.innerHTML = `
            <div class="laughtale-knob" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; user-select: none; cursor: ${props.disabled ? 'not-allowed' : 'pointer'};">
                <svg width="${size}" height="${size}" style="transform: rotate(-90deg);">
                    <!-- Background Circle -->
                    <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="var(--p-surface-200)" stroke-width="${strokeWidth}" />
                    <!-- Progress Arc -->
                    <circle class="knob-progress-circle" cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="${props.color || 'var(--p-primary-600)'}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" style="transition: stroke-dashoffset 0.15s ease;" />
                </svg>
                <span style="position: absolute; font-size: ${size * 0.2}px; font-weight: 700; color: var(--p-surface-900);">
                    ${displayValue}
                </span>
            </div>
        `;

        if (props.disabled) return;

        let isDragging = false;

        const updateFromPointer = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
            const normalizedAngle = angle < 0 ? angle + 360 : angle;
            const ratio = Math.min(1, Math.max(0, normalizedAngle / 360));
            const rawVal = min + ratio * (max - min);
            currentValue = Math.round(rawVal / step) * step;
            render();
            syncValue();
        };

        const knobEl = container.querySelector('.laughtale-knob')!;
        knobEl.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateFromPointer(e as MouseEvent);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) updateFromPointer(e);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function syncValue() {
        if (props.targetInputName) {
            let hidden = document.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = currentValue.toString();
        }

        container.dispatchEvent(new CustomEvent('knob:change', {
            bubbles: true,
            detail: { value: currentValue }
        }));
    }

    render();
    syncValue();
}

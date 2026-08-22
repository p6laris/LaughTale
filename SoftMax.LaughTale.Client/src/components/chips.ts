/**
 * SoftMax.LaughTale: Enterprise Chips / Tag Input Component
 * Integrated with useAutoAnimate for FLIP-based smooth tag insertions and removals.
 */

import { LucideIcons } from '../icons/lucide';
import { useAutoAnimate } from '../composables/animation/useAutoAnimate';
import { useControllableState } from '../composables/useControllableState';

export interface ChipsProps {
    targetInputName?: string;
    values?: string[];
    placeholder?: string;
    max?: number;
    disabled?: boolean;
}

export default function ChipsIsland(container: HTMLElement, props: ChipsProps) {
    const [getChips, setChips] = useControllableState<string[]>({
        defaultValue: props.values ? [...props.values] : [],
        onChange: (val) => {
            syncValue(val);
        }
    });

    function render() {
        const chips = getChips();
        const chipTags = chips.map((c, idx) => `
            <span class="chip-item" data-val="${c}" style="display: inline-flex; align-items: center; gap: 0.35rem; background: var(--p-surface-100); color: var(--p-surface-800); border: 1px solid var(--p-surface-200); padding: 0.2rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.8125rem; font-weight: 500; transition: all 0.15s ease;">
                <span>${c}</span>
                ${!props.disabled ? `
                    <button type="button" class="remove-chip-btn" data-index="${idx}" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0;">
                        ${LucideIcons.x}
                    </button>
                ` : ''}
            </span>
        `).join('');

        container.innerHTML = `
            <div class="laughtale-chips" style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; padding: 0.35rem 0.5rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); min-height: 2.5rem; max-width: 400px; cursor: text;">
                ${chipTags}
                <input type="text" class="chip-text-input" placeholder="${chips.length === 0 ? (props.placeholder || 'Add tag...') : ''}" ${props.disabled ? 'disabled' : ''} style="flex: 1; min-width: 80px; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color); padding: 0.25rem 0;" />
            </div>
        `;

        const wrapper = container.querySelector<HTMLElement>('.laughtale-chips')!;
        useAutoAnimate(wrapper, { duration: 200 });

        if (props.disabled) return;

        const input = container.querySelector<HTMLInputElement>('.chip-text-input')!;

        input.addEventListener('keydown', (e) => {
            const current = getChips();
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const val = input.value.trim().replace(/,$/, '');
                if (val && !current.includes(val) && (!props.max || current.length < props.max)) {
                    setChips([...current, val]);
                    render();
                    const nextInput = container.querySelector<HTMLInputElement>('.chip-text-input')!;
                    nextInput.focus();
                }
            } else if (e.key === 'Backspace' && !input.value && current.length > 0) {
                setChips(current.slice(0, -1));
                render();
                const nextInput = container.querySelector<HTMLInputElement>('.chip-text-input')!;
                nextInput.focus();
            }
        });

        container.querySelectorAll('.remove-chip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = Number(btn.getAttribute('data-index'));
                const current = getChips();
                setChips(current.filter((_, i) => i !== idx));
                render();
            });
        });

        wrapper.addEventListener('click', () => input.focus());
    }

    function syncValue(current: string[]) {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = JSON.stringify(current);
        }

        container.dispatchEvent(new CustomEvent('chips:change', {
            bubbles: true,
            detail: { values: current }
        }));
    }

    render();
    syncValue(getChips());
}

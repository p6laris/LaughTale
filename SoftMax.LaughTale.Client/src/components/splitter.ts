/**
 * SoftMax.LaughTale: Enterprise Splitter Component (Aura Splitter inspired)
 * Resizable multi-panel layout with pointer-capture dragging and size constraints.
 */

import { SplitterPanel, Orientation } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { useDragGesture } from '../composables/useDragGesture';

export interface SplitterProps {
    layout?: Orientation | 'horizontal' | 'vertical';
    panels?: SplitterPanel[];
    gutterSize?: number;
}


const CSS = `
[data-theme="dark"] .laughtale-splitter {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitter-panel-1 {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitter-gutter {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitter-panel-2 {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function SplitterIsland(container: HTMLElement, props: SplitterProps) {
    injectIslandStyle('splitter', CSS);
    const layout = props.layout || 'horizontal';
    const isHorizontal = layout === 'horizontal';
    const panels = props.panels && props.panels.length >= 2 ? props.panels : [
        { id: 'p1', size: 50, content: 'Panel 1 (Left)' },
        { id: 'p2', size: 50, content: 'Panel 2 (Right)' }
    ];

    let leftPercent = panels[0].size ?? 50;

    container.innerHTML = `
        <div class="laughtale-splitter" style="display: flex; flex-direction: ${isHorizontal ? 'row' : 'column'}; width: 100%; height: 320px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-0);">
            <!-- Panel 1 -->
            <div class="splitter-panel-1" style="flex: 0 0 ${leftPercent}%; overflow: auto; padding: 1.25rem; background: var(--p-surface-50);">
                ${panels[0].content || ''}
            </div>

            <!-- Gutter Divider Handle -->
            <div class="splitter-gutter" style="flex: 0 0 8px; background: var(--p-surface-200); cursor: ${isHorizontal ? 'col-resize' : 'row-resize'}; display: flex; align-items: center; justify-content: center; user-select: none; transition: background 0.15s ease;">
                <div style="width: ${isHorizontal ? '2px' : '16px'}; height: ${isHorizontal ? '16px' : '2px'}; background: var(--p-surface-400); border-radius: 1px;"></div>
            </div>

            <!-- Panel 2 -->
            <div class="splitter-panel-2" style="flex: 1; overflow: auto; padding: 1.25rem; background: var(--p-surface-0);">
                ${panels[1].content || ''}
            </div>
        </div>
    `;

    const panel1 = container.querySelector<HTMLElement>('.splitter-panel-1')!;
    const gutter = container.querySelector<HTMLElement>('.splitter-gutter')!;

    useDragGesture(gutter, {
        axis: isHorizontal ? 'x' : 'y',
        onDrag: (state) => {
            const containerRect = container.querySelector('.laughtale-splitter')!.getBoundingClientRect();
            let newPercent = isHorizontal 
                ? ((state.clientX - containerRect.left) / containerRect.width) * 100
                : ((state.clientY - containerRect.top) / containerRect.height) * 100;

            newPercent = Math.max(10, Math.min(90, newPercent));
            leftPercent = newPercent;
            panel1.style.flex = `0 0 ${newPercent}%`;

            container.dispatchEvent(new CustomEvent('splitter:resize', {
                bubbles: true,
                detail: { leftPercent: newPercent, rightPercent: 100 - newPercent }
            }));
        }
    });
}

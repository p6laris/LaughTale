/**
 * SoftMax.LaughTale: Enterprise Multi-Step Stepper Wizard Component
 */

export interface StepperStep {
    id: string;
    title: string;
    description?: string;
    icon?: string;
}

export interface StepperProps {
    steps: StepperStep[];
    initialStep?: number;
    linear?: boolean;
}

export default function StepperIsland(container: HTMLElement, props: StepperProps) {
    let currentStep = props.initialStep || 0;
    const totalSteps = props.steps.length;

    function render() {
        const stepItems = props.steps.map((s, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isPending = idx > currentStep;

            const badgeBg = isActive ? 'var(--p-surface-950)' : isCompleted ? 'var(--p-primary-600)' : 'var(--p-surface-200)';
            const badgeColor = isActive || isCompleted ? '#ffffff' : 'var(--p-surface-600)';

            return `
                <div class="stepper-item" data-step-idx="${idx}" style="display: flex; align-items: center; gap: 0.75rem; cursor: ${props.linear ? 'default' : 'pointer'};">
                    <div style="width: 2.25rem; height: 2.25rem; border-radius: 50%; background: ${badgeBg}; color: ${badgeColor}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; transition: all 0.2s ease;">
                        ${isCompleted ? '✓' : (s.icon || (idx + 1))}
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; font-weight: ${isActive ? '700' : '500'}; color: ${isActive ? 'var(--p-surface-950)' : 'var(--p-surface-600)'};">${s.title}</div>
                        ${s.description ? `<div style="font-size: 0.75rem; color: var(--p-surface-400);">${s.description}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('<div style="flex: 1; height: 2px; background: var(--p-surface-200); margin: 0 0.5rem;"></div>');

        container.innerHTML = `
            <div class="laughtale-stepper" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Step Header Progress Bar -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.25rem; border-bottom: 1px solid var(--p-border-color);">
                    ${stepItems}
                </div>

                <!-- Step Content Container (Shows active slot) -->
                <div class="stepper-body" style="min-height: 120px;">
                    <div class="stepper-slot-container"></div>
                </div>

                <!-- Step Navigation Footer -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--p-border-color);">
                    <button type="button" class="p-button p-button-secondary step-prev-btn" ${currentStep === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        &larr; Previous
                    </button>
                    <div style="font-size: 0.8125rem; color: var(--p-surface-500); font-family: var(--p-font-mono);">
                        Step ${currentStep + 1} of ${totalSteps}
                    </div>
                    <button type="button" class="p-button p-button-primary step-next-btn">
                        ${currentStep === totalSteps - 1 ? 'Complete & Submit ✓' : 'Next Step &rarr;'}
                    </button>
                </div>
            </div>
        `;

        // Update slot projection visibility
        const slotEl = container.querySelector('[data-slot="default"]') || container.querySelector('.island-slot');
        const slotContainer = container.querySelector('.stepper-slot-container')!;

        if (slotEl) {
            slotContainer.appendChild(slotEl);
            const stepPanels = slotEl.querySelectorAll<HTMLElement>('[data-step]');
            if (stepPanels.length > 0) {
                stepPanels.forEach((panel, i) => {
                    panel.style.display = i === currentStep ? 'block' : 'none';
                });
            }
        }

        // Attach buttons
        container.querySelector('.step-prev-btn')?.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                render();
            }
        });

        container.querySelector('.step-next-btn')?.addEventListener('click', () => {
            if (currentStep < totalSteps - 1) {
                currentStep++;
                render();
            } else {
                container.dispatchEvent(new CustomEvent('stepper:completed', { bubbles: true }));
            }
        });
    }

    render();
}

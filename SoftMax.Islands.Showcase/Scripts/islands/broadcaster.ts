export interface EventBroadcasterProps {
    channelName: string;
    buttonLabel: string;
}

export default function EventBroadcasterIsland(container: HTMLElement, props: EventBroadcasterProps) {
    let clickCount = 0;

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Event Bus Emitter</span>
                <span class="aura-tag tag-purple">Hydrate: Interaction</span>
            </div>

            <button type="button" class="p-button p-button-secondary broadcast-btn" style="justify-content: flex-start;">
                <span>📡</span>
                ${props.buttonLabel}
            </button>
        </div>
    `;

    container.querySelector('.broadcast-btn')?.addEventListener('click', () => {
        clickCount++;
        const message = `Telemetry pulse #${clickCount} dispatched`;
        
        window.dispatchEvent(new CustomEvent(`island:${props.channelName}`, {
            detail: { message, count: clickCount, timestamp: new Date().toLocaleTimeString() },
            bubbles: true
        }));
    });
}

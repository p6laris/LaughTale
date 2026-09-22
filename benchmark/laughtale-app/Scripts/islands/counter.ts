export interface CounterProps {
    initialCount: number;
}

/**
 * ROADMAP.v5.md Part J benchmark: deliberately matches Blazor's default Counter.razor exactly
 * (same markup shape, same single-click increment-by-1 behavior) for a fair comparison.
 */
export default function CounterIsland(container: HTMLElement, props: CounterProps) {
    let count = props.initialCount || 0;

    container.innerHTML = `
        <p role="status">Current count: <span class="count">${count}</span></p>
        <button type="button" class="btn btn-primary">Click me</button>
    `;

    const display = container.querySelector('.count')!;
    container.querySelector('button')?.addEventListener('click', () => {
        count++;
        display.textContent = count.toString();
    });
}

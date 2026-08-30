---
title: "Live Updates & Streaming Push"
description: "Stateless polling and single-island Server-Sent Events (SSE) without full-page SignalR"
order: 54
section: "Advanced Architecture"
---

# Live Updates & Streaming Push

LaughTale is built around **stateless HTTP architecture** with zero default WebSocket overhead. When real-time data or background progress updates are needed, LaughTale offers two patterns that keep your application scalable and lightweight.

---

## 1. Declarative Polling (`l-poll`)

For notification counters, status badges, or job progress bars, declarative polling via the `l-poll` directive provides simple, stateless live updates:

```html
<!-- Re-evaluates every 5 seconds -->
<div l-poll.5s="fetchUnreadCount()">
    <span class="badge" l-text="unreadCount">0</span>
</div>
```

The directive automatically pauses when the browser tab is hidden and resumes when active, conserving server bandwidth and battery life.

---

## 2. Server-Sent Events (SSE) in a Single Island

When true server push is required (such as real-time chat or a live telemetry stream), a single island can open a standard HTML5 `EventSource` connection without forcing the entire page into a stateful connection:

```typescript
import { IslandContext } from 'laughtale';

export default function LiveFeedIsland(container: HTMLElement, props: any, ctx?: IslandContext) {
    const sse = new EventSource('/api/live-feed');
    
    sse.onmessage = (event) => {
        const item = JSON.parse(event.data);
        const li = document.createElement('li');
        li.textContent = item.message;
        container.querySelector('ul')?.appendChild(li);
    };

    // Automatically close the connection when the island unmounts
    ctx?.signal.addEventListener('abort', () => {
        sse.close();
    });
}
```

### Why this is better than Blazor Server SignalR:
- **Zero Global Memory Leak**: The server does not maintain circuit UI state for every visitor.
- **Isolated Failure**: If an SSE connection drops, only that specific island re-negotiates; the rest of the page remains fully interactive.
- **CDN Friendly**: The rest of your SSR HTML can be cached normally.

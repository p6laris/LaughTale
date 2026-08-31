---
title: Real-Time Server Push & WebSockets
description: Connect LaughTale islands to ASP.NET Core SignalR hubs, Server-Sent Events (SSE), and WebSockets for real-time live data updates.
order: 52
icon: radio
category: Framework Architecture
---

# 📡 Real-Time Server Push & WebSockets

You can easily pair LaughTale with ASP.NET Core **SignalR** or **Server-Sent Events (SSE)** to push live telemetry and notifications directly to client islands.

---

## ⚡ 1. Connecting an Island to a SignalR Hub

```typescript
import * as signalR from '@microsoft/signalr';
import { IslandContext } from '@softmax/laughtale-client';

export default async function LiveTelemetryIsland(container: HTMLElement, props: any, ctx?: IslandContext) {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/telemetry')
        .withAutomaticReconnect()
        .build();

    connection.on('MetricUpdate', (data) => {
        container.querySelector('.metric-val')!.textContent = data.value;
    });

    await connection.start();

    // Clean teardown on page navigation
    ctx?.onCleanup(() => {
        connection.stop();
    });
}
```

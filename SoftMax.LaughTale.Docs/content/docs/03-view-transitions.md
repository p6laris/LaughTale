---
title: "View Transitions & Persistent Islands"
description: "Seamless SPA navigation without full page reloads or audio/state resets"
order: 3
section: "Advanced Architecture"
---

# View Transitions & Persistent Islands

SoftMax.LaughTale features a built-in router powered by the native HTML5 **View Transitions API**.

When users navigate between pages, the HTML is smoothly morphed in place without jarring white flashes, while elements marked with `persist="id"` are preserved across page boundaries without losing their active state!

---

## ⚡ Persistent Telemetry Widget

The telemetry widget in the top right navbar is marked with `persist="telemetry-widget"`. As you click through the documentation links, notice how the request counter and latency monitor never stop or reset!

---

## 🛠️ How to Enable Persistent Elements

In your C# Razor layout or page:

```razor
<island name="persistent-telemetry" 
        props="@(new SystemTelemetryProps("Global Gateway", 3))" 
        persist="telemetry-widget" 
        hydrate="Load" />
```

In your main TypeScript bootstrap file:

```typescript
import { initIslands, enableViewTransitions } from '@softmax/laughtale';

// Enables seamless link click interception and state morphing
enableViewTransitions();
initIslands();
```

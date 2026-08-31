---
title: Server-Driven Refresh & DOM Morphing
description: Dynamically update and re-render server islands on demand with Idiomorph DOM morphing that preserves focus, cursor positions, and client state.
order: 5
icon: refresh-cw
category: Framework Architecture
---

# 🔄 Server Refresh & DOM Morphing

Sometimes you need to update an individual UI component with fresh server-rendered data without reloading the whole page or writing complex client-side fetch glue.

LaughTale provides **Server-Driven Island Refresh** powered by **Idiomorph DOM Morphing**.

---

## 💡 How It Works

1. **User Action**: Triggered by an event or button click.
2. **Trigger Refresh**: Client sends a lightweight request to `POST /_laughtale/island/{name}`.
3. **Server Renders Island**: ASP.NET Core Razor re-executes the island markup with fresh data.
4. **Idiomorph DOM Morphing**: The client morphs only the changed DOM attributes and child nodes without losing active input focus, scroll offsets, or CSS transitions.

Unlike crude `element.innerHTML = newHtml` replacements that destroy input focus, cancel animations, and reset scroll offsets, LaughTale **morphs the DOM in-place**:
- Active input fields **retain focus and cursor positions**.
- Unaffected sibling elements and CSS transitions **continue uninterrupted**.
- Form states and scroll positions **are preserved 100%**.

---

## 🛠️ 1. Enabling Server Refresh Endpoints

In your `Program.cs`, map the island refresh endpoint:

```csharp
// Program.cs
using LaughTale.Core.Endpoints;

var app = builder.Build();

// Enables POST /_laughtale/island/{name}
app.MapLaughTaleIslandRefresh();
```

---

## ⚡ 2. Triggering an Island Refresh from Client

You can invoke an island refresh using the client JavaScript runtime:

```typescript
import { refreshIsland } from 'laughtale';

// Re-render the 'sales-stats' island with new parameters
await refreshIsland('sales-stats', {
    period: 'Q3-2025',
    region: 'EMEA'
});
```

---

## 🎯 3. Declarative HTML Trigger via Directives

You can also trigger a server refresh directly in your HTML using LaughTale's `l-on` directive:

```html
<button l-on:click="$refresh('customer-card', { customerId: 42 })" 
        class="p-button p-button-primary">
    Reload Customer Data
</button>
```

---

## 🛡️ 4. Anti-Forgery Token Integration

All server-driven refresh calls automatically discover and append ASP.NET Core `__RequestVerificationToken` headers (`X-CSRF-TOKEN`), protecting your application against Cross-Site Request Forgery out-of-the-box.

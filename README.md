# 🏝️ SoftMax.Islands 2.0

A high-performance, Astro-grade **Islands Architecture framework for ASP.NET Core & Blazor SSR (.NET 9/10 + TypeScript)**.

---

## ⚡ Key Features

- 🚀 **Sub-20ms First Paint**: 90% of the page is static SSR HTML.
- 💤 **6 Hydration Strategies**: `Load`, `Idle`, `Visible` (scroll), `Media`, `Interaction`, `Never`.
- 📥 **C# Server Slot Projection**: Pass arbitrary server-rendered HTML into client TypeScript islands.
- 🚀 **Seamless View Transitions**: Instant SPA-like page morphing via native HTML5 View Transitions API.
- 🔄 **Persistent Islands (`persist="id"`)**: Preserve island state (e.g. audio player, draft status) across page navigations.
- 🎨 **On-Demand Scoped CSS**: Stylesheets injected dynamically only when an island hydrates.
- 🔍 **Roslyn Compile-Time Diagnostics**: `SMI001` (invalid names) and `SMI002` (non-serializable types) caught at compile-time.
- ⚡ **Zero SignalR / Server Memory**: 100% stateless HTTP.

---

## 🏛️ Projects in this Toolkit

| Project | Purpose | Target |
|---|---|---|
| **`SoftMax.Islands.Core`** | Core runtime: `HydrateStrategy`, `<Island />` component, TagHelpers, Slots, and JSON serializer. | `net10.0` |
| **`SoftMax.Islands.Generators`** | Roslyn Source Generator & Diagnostic Analyzer (`SMI001`, `SMI002`). | `netstandard2.0` |
| **`SoftMax.Islands.Client`** | Sub-2 KB TypeScript hydration engine, View Transitions router & event bus. | `@softmax/islands` |
| **`SoftMax.Islands.Showcase`** | Live demo application showcasing all 6 hydration modes, slots, and persistent islands. | `net10.0` Web App |

---

## 🚀 Astro-Inspired Capabilities in Action

### 1. C# Server Slot Projection
```razor
<!-- C# renders server content inside the Island slot -->
<island name="modal-dialog" 
        props="@(new ModalDialogProps("Open Citizen Agreement", "Legal Marriage Agreement"))" 
        hydrate="Interaction">
    <!-- Server-rendered slot content -->
    <div class="p-4 bg-amber-50 rounded-2xl">
        <h4>📜 Official Legal Disclaimer</h4>
        <p>Verified under Law No. 15 of 2008 &bull; @DateTime.UtcNow.ToString("yyyy-MM-dd")</p>
    </div>
</island>
```

In TypeScript (`modal-dialog.ts`):
```typescript
import { getSlot, injectIslandStyle } from '@softmax/islands';

export default function ModalDialogIsland(container: HTMLElement, props: ModalDialogProps) {
    const slotEl = getSlot(container); // Queries server-rendered slot without wiping it out
    // ... wrap with animated modal dialog ...
}
```

---

### 2. Persistent Islands Across View Transitions
```razor
<!-- Layout header widget that never resets or stops when navigating between pages -->
<island name="persistent-player" 
        props="@(new PersistentPlayerProps("KRG Live Stream", 120))" 
        persist="global-player" 
        hydrate="Load" />
```

---

### 3. Roslyn Compile-Time Diagnostics
```csharp
// ❌ Compile Error SMI001: Name must be lowercase kebab-case
[Island("Invalid_Name_123")]
public record BadNameProps(string Label);

// ⚠️ Compile Warning SMI002: CancellationToken cannot be serialized across client boundary
[Island("task-runner")]
public record TaskRunnerProps(CancellationToken Token);
```

---

## ⏱️ Hydration Strategies Reference

| Strategy | Usage | How It Works |
|---|---|---|
| `Load` | `hydrate="Load"` | Hydrates immediately on `DOMContentLoaded`. |
| `Idle` | `hydrate="Idle"` | Hydrates when browser CPU is idle (`requestIdleCallback`). |
| `Visible` | `hydrate="Visible"` | Hydrates **only when scrolled into the viewport** (`IntersectionObserver`). |
| `Media` | `hydrate="Media" media="(max-width: 768px)"` | Hydrates only when matching CSS media query. |
| `Interaction` | `hydrate="Interaction"` | Hydrates on first `mouseenter`, `focusin`, or `click`. |
| `Never` | `hydrate="Never"` | Pure SSR markup, zero client JS. |

---

## 🏃 Running the Showcase App

```powershell
dotnet run --project SoftMax.Islands/SoftMax.Islands.Showcase/SoftMax.Islands.Showcase.csproj
```
Open **`https://localhost:5001`** and navigate between the **Showcase Hub** and **Architecture Docs** to see View Transitions and persistent islands in action!

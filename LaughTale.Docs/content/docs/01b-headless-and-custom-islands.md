---
title: Standalone Core & Headless Mode
description: Using LaughTale as a lightweight headless Islands framework with your own custom design system, Tailwind CSS, or custom React/Vue/Svelte components without the Aura UI library.
order: 3
icon: box
category: Framework Architecture
---

# 📦 Standalone Core & Headless Mode

While LaughTale includes an enterprise-grade suite of 76+ UI components (`LaughTale.Components`), the core framework is **completely decoupled and UI-agnostic**.

You can use **`LaughTale.Core` independently** as a high-performance Islands Architecture engine for ASP.NET Core with:
- Your own custom CSS / Tailwind CSS / Bootstrap design system.
- Your own proprietary React, Vue, Svelte, or Preact components.
- Zero dependency on any built-in UI stylesheets or pre-packaged widgets.

---

## 🏗️ Architecture: Two Independent Layers

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LaughTale.Components                            │
│                 (Optional UI Component Library)                        │
│  76+ Pre-built Aura Controls: <island-datatable>, <island-datepicker>, │
│  <island-stepper>, <island-fileupload>, <island-theme-studio>, etc.    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Optional layer)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          LaughTale.Core                                │
│                   (The Foundation Framework)                           │
│  • Generic <island name="..." hydrate="..." /> TagHelper               │
│  • 5 Progressive Hydration Triggers (Load, Idle, Visible, Media, ...)   │
│  • Declarative Directives Engine (l-model, l-on, l-show, l-bind, ...)  │
│  • Native View Transitions & Persistent Island State across Pages      │
│  • Multi-Framework Polyglot Engine (React, Vue, Svelte, Preact, TS)    │
│  • Server Data Contracts & EF Core Query Extensions (100k+ Grids)      │
│  • Server-Driven Refresh & Idiomorph DOM Morphing                      │
│  • Inter-Island Event Bus (emitIslandEvent / onIslandEvent)            │
│  • Strict CSP & AST Sandbox with Zero eval()                           │
│  • Kurdish / English i18n & RTL Engine                                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 1. Headless Installation

Install **only** the core package:

```bash
dotnet add package SoftMax.LaughTale.Core
```

In `_ViewImports.cshtml`:
```razor
@addTagHelper *, LaughTale.Core
```

---

## 🎨 2. Building Custom Islands with Tailwind CSS

You can mount your own custom components and style them with Tailwind CSS or any design system:

```razor
<!-- Index.cshtml -->
<island name="order-calculator" 
        props="@Model.CalculatorData" 
        hydrate="Visible" />
```

In your TypeScript island (`src/islands/order-calculator.ts`):

```typescript
import { IslandContext } from '@softmax/laughtale-client';

export default function OrderCalculator(container: HTMLElement, props: any, ctx?: IslandContext) {
    let quantity = props.initialQty || 1;
    const unitPrice = props.unitPrice || 49.99;

    function render() {
        container.innerHTML = `
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Order Summary</h3>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-slate-600 dark:text-slate-400">Total:</span>
                    <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        $${(quantity * unitPrice).toFixed(2)}
                    </span>
                </div>
                <div class="mt-6 flex gap-3">
                    <button class="btn-dec px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold">-</button>
                    <span class="px-4 py-2 font-mono font-bold">${quantity}</span>
                    <button class="btn-inc px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold">+</button>
                </div>
            </div>
        `;

        container.querySelector('.btn-dec')?.addEventListener('click', () => {
            if (quantity > 1) { quantity--; render(); }
        }, { signal: ctx?.signal });

        container.querySelector('.btn-inc')?.addEventListener('click', () => {
            quantity++; render();
        }, { signal: ctx?.signal });
    }

    render();
}
```

---

## ⚛️ 3. Mounting Custom React / Vue / Svelte Islands

Pass your own React/Vue/Svelte components directly to `<island>`:

```razor
<!-- Custom React Component -->
<island name="analytics-dashboard" 
        framework="React" 
        props="@Model.Telemetry" 
        hydrate="Load" />

<!-- Custom Vue Component -->
<island name="shopping-cart-drawer" 
        framework="Vue" 
        props="@Model.Cart" 
        hydrate="Interaction" />
```

---

## 🪄 4. Using Declarative Directives (`l-*`) Without Any JavaScript Library

Use LaughTale's built-in `l-*` directives directly on standard HTML tags:

```html
<div data-island="search-filter" class="p-4 bg-slate-50 rounded-lg">
    <input type="text" l-model="filterText" placeholder="Filter records..." class="w-full border px-3 py-2 rounded" />
    <p class="text-sm mt-2" l-show="filterText.length > 0">
        Filtering by: <strong l-text="filterText"></strong>
    </p>
</div>
```

---

## 📊 Feature Comparison

| Capability | `LaughTale.Core` (Headless) | `LaughTale.Components` (Full Suite) |
| :--- | :--- | :--- |
| **Islands Engine (`<island>`)** | ✅ Yes | ✅ Yes |
| **5 Hydration Triggers** | ✅ Yes | ✅ Yes |
| **Directives (`l-model`, `l-on`, etc.)** | ✅ Yes | ✅ Yes |
| **View Transitions & Persistence** | ✅ Yes | ✅ Yes |
| **Multi-Framework Polyglot Engine** | ✅ Yes | ✅ Yes |
| **EF Core Data Contracts Engine** | ✅ Yes | ✅ Yes |
| **76+ Pre-built Aura UI Controls** | ❌ No (Bring your own) | ✅ Yes (Ready to use) |
| **Built-in Theme Studio** | ❌ No | ✅ Yes |

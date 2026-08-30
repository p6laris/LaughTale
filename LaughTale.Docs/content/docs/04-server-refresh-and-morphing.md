---
title: "Server-Driven Refresh & DOM Morphing"
description: "Re-render isolated server islands on demand and morph the DOM in-place while preserving input focus, cursor selection, and scroll positions."
order: 4
section: "Core Concepts"
---

# Server-Driven Refresh & DOM Morphing

LaughTale provides a powerful server-driven re-rendering mechanism (`island.refresh()`) that combines the power of C# server rendering with instant client DOM morphing.

Rather than reloading the entire page or building complex JSON API endpoints with client-side templating, you can instruct LaughTale to re-render **a single island on the server** and morph the updated HTML into the live document in-place.

---

## 🎯 Key Benefits

- 🔄 **Preserves User Focus**: Active `<input>`, `<textarea>`, or dropdown focus is maintained during the morph.
- ✍️ **Preserves Text Selection & Cursor**: Cursor character positions (`setSelectionRange`) are restored seamlessly.
- 🛡️ **Carries CSRF Tokens Automatically**: Antiforgery tokens are automatically resolved and attached to the refresh request.
- ⚡ **Zero Full-Page Flashes**: Only the targeted island subtree is patched in the DOM.

---

## 🚀 Step 1: Map the Server Endpoint

In your `Program.cs`, register the LaughTale refresh route:

```csharp
var app = builder.Build();

app.UseStaticFiles();
app.MapRazorPages();

// Maps POST /_laughtale/island/{name}
app.MapLaughTaleIslandRefresh();

app.Run();
```

---

## 🚀 Step 2: Trigger Refresh from Client

Every mounted island element exposes an `island.refresh()` handle on its DOM element:

```typescript
// Trigger a refresh with optional updated props
const islandEl = document.querySelector('[data-island="task-matrix"]') as any;

if (islandEl && islandEl.island) {
    await islandEl.island.refresh({
        filterStatus: 'Active',
        page: 2
    });
}
```

---

## 🚀 Step 3: Trigger Refresh via Declarative Directives

You can also trigger an island refresh directly in Razor markup using LaughTale's `l-on:click` directive:

```razor
<div class="toolbar">
    <button type="button" 
            class="p-button" 
            l-on:click="$island('task-matrix').refresh({ filter: 'completed' })">
        Show Completed
    </button>
</div>

<island name="task-matrix" props="@Model.MatrixProps" hydrate="Load">
    <!-- Server-rendered task table -->
</island>
```

---

## 🔍 How DOM Morphing Works Under the Hood

When `island.refresh()` is called:
1. It records the active `document.activeElement`, its CSS selector path, and `selectionStart` / `selectionEnd`.
2. It issues a `POST /_laughtale/island/{name}` carrying the updated props and antiforgery headers.
3. It parses the incoming server HTML into a detached DOM document.
4. It synchronizes attributes, updates changed child nodes, and triggers re-hydration.
5. It restores focus and cursor selection back to the active element.

---
title: "Declarative Directives (l-*)"
description: "Master reference for LaughTale's rich client reactivity and HTMX-style HTML swapping engine directly inside C# Razor views."
order: 7
section: "Core Concepts"
---

# Declarative Directives (`l-*`)

LaughTale provides a lightweight, Alpine/HTMX-inspired declarative directive engine (`l-*`).

Directives enable you to build interactive client reactivity, two-way data bindings, event listeners, input masks, and background server HTML swapping **directly in standard Razor `.cshtml` markup** without needing to author, compile, or bundle separate TypeScript or JavaScript files.

---

## ⚡ Directives Reference Table

| Directive | Purpose | Example |
|---|---|---|
| **`l-state`** | Initializes local reactive state using a JavaScript Proxy. | `l-state='{ count: 0, query: "" }'` |
| **`l-bind`** | Dynamic attribute and text interpolation. | `l-bind:title="item.name"` or `l-bind="count"` |
| **`l-model`** | Two-way data binding on form inputs. | `<input l-model="query" />` |
| **`l-on:event`** | Event listeners with modifiers (`.prevent`, `.stop`, `.enter`). | `l-on:click="count++"` or `l-on:keydown.enter="submit()"` |
| **`l-show` / `l-hide`** | Conditional DOM visibility toggling (`display: none`). | `l-show="count > 5"` |
| **`l-class`** | Conditional class list bindings based on object keys. | `l-class='{ "active": isActive, "danger": hasError }'` |
| **`l-style`** | Dynamic inline style bindings. | `l-style='{ width: progress + "%" }'` |
| **`l-get` / `l-post`** | HTMX-style server fragment fetcher. | `<button l-get="/partials/users" l-target="#user-list">Load</button>` |
| **`l-target`** | Target DOM selector for server fragment replacement. | `l-target="#content-area"` |
| **`l-swap`** | Swap strategy (`innerHTML`, `outerHTML`, `beforeend`). | `l-swap="outerHTML"` |
| **`l-indicator`** | Shows/hides a loading spinner element during HTTP fetch. | `l-indicator="#loading-spinner"` |
| **`l-mask`** | Pattern-based input formatting. | `l-mask="(999) 999-9999"` |
| **`l-copy`** | One-click clipboard copy utility. | `<button l-copy="npm install laughtale">Copy</button>` |
| **`l-feedback`** | Temporary text feedback after a copy action. | `l-feedback="Copied!"` |
| **`l-emit` / `l-listen`** | Declarative inter-directive event bus. | `l-on:click="l-emit('user-updated', { id: 123 })"` |

---

## 🎮 Concrete Examples

### 1. Reactive Counter & Conditional Message
```razor
<div l-state="{ count: 0 }" class="p-card">
    <div class="flex items-center gap-4">
        <button type="button" class="p-button" l-on:click="count--">-</button>
        <span class="font-bold text-xl" l-bind="count">0</span>
        <button type="button" class="p-button" l-on:click="count++">+</button>
    </div>

    <div l-show="count >= 10" class="p-message p-message-success mt-4">
        🎉 Milestone reached: 10 or more!
    </div>
</div>
```

### 2. Live Search with Debounced Server Swap
```razor
<div class="search-box">
    <input type="text" 
           class="p-inputtext" 
           placeholder="Search customers..." 
           l-get="/customers/search" 
           l-target="#search-results" 
           l-trigger="input changed delay:300ms" 
           l-indicator="#search-spinner" />

    <span id="search-spinner" class="p-spinner hidden">Searching...</span>
</div>

<div id="search-results">
    <!-- Server fragment swapped in here -->
</div>
```

### 3. One-Click Code Snippet Copy Button
```razor
<div class="code-block relative">
    <pre><code>dotnet new laughtale-web -n MyApp</code></pre>
    <button type="button" 
            class="p-button p-button-sm absolute top-2 right-2" 
            l-copy="dotnet new laughtale-web -n MyApp" 
            l-feedback="Copied!">
        Copy
    </button>
</div>
```

---

## 🛡️ Security & AST Sandboxing

LaughTale executes `l-*` expressions inside an **AST Sandboxed Interpreter** that guarantees safety:
- ❌ **Prototype Pollution Blocked**: Access to `__proto__`, `constructor`, or `prototype` is rejected.
- ❌ **Global Escapes Blocked**: Access to `window`, `document`, `eval`, or `Function` is prohibited.
- ❌ **Inline Script Injection Blocked**: Dynamic attribute bindings with `javascript:` or `onerror` are automatically neutralized.

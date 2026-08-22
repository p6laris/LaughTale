---
title: "Declarative Directives (Zero-JS Engine)"
description: "Build reactive UI & HTMX-style server fragment actions directly in C# Razor"
order: 6
section: "Zero-JS Architecture"
---

# Declarative Directives (Zero-JS Engine)

SoftMax.LaughTale includes a built-in, sub-1.5 KB **Declarative Micro-Directives Engine** that brings Alpine.js & HTMX-style interactivity directly into your C# Razor views.

You **never create, configure, or compile TypeScript/JavaScript files**. You write standard Razor markup with `l-*` attributes.

---

## 🎨 1. Reactive State Directives

| Directive | Description | Example |
|---|---|---|
| `l-state` | Initializes a reactive JavaScript `Proxy` data scope | `l-state='{ "count": 0 }'` |
| `l-bind` | Binds text or attribute to a dynamic expression | `<span l-bind="count">0</span>` |
| `l-model` | Two-way data binding for `<input>`, `<select>`, `<textarea>` | `<input type="number" l-model="count" />` |
| `l-on:event` | Attaches event listener (`click`, `input`, `change`, `keydown.enter`) | `l-on:click="count++"` |
| `l-show` / `l-hide` | Conditional visibility toggling | `<div l-show="count > 0">Active</div>` |
| `l-class` | Dynamic CSS class toggling from condition object | `l-class='{ "active": open }'` |

---

## 🌐 2. HTMX-Style Server Actions

Fetch server-rendered C# Razor fragments and seamlessly morph them into the page without full reloads:

| Directive | Description | Example |
|---|---|---|
| `l-get` | Sends background HTTP GET to server endpoint | `l-get="/api/search"` |
| `l-post` | Sends background HTTP POST with form payload | `l-post="/api/users/delete"` |
| `l-target` | CSS selector of target container to update | `l-target="#results-box"` |
| `l-swap` | Swap mode (`innerHTML`, `outerHTML`, `beforeend`, `afterbegin`) | `l-swap="outerHTML"` |
| `l-trigger` | Custom trigger with modifiers (`delay:300ms`, `throttle:500ms`) | `l-trigger="keyup delay:300ms"` |
| `l-indicator`| Shows/hides loading spinner element during request | `l-indicator="#spinner"` |

---

## 🧰 3. Ready-Made Micro-Utilities

* **Pattern Masking (`l-mask`)**:
  ```razor
  <!-- Automatically formats phone number as user types -->
  <input type="text" l-mask="(999) 999-9999" placeholder="(555) 000-0000" />
  ```

* **Clipboard Copy (`l-copy`)**:
  ```razor
  <code id="api-key">sk_live_9482740192847291</code>
  <button l-copy="#api-key" l-feedback="Copied to Clipboard!">Copy</button>
  ```

* **Toast Event Dispatcher (`l-on:click="$emit('toast', ...)"`)**:
  ```razor
  <button l-on:click="$emit('toast', { title: 'Verified', severity: 'success' })">
      Show Toast
  </button>
  ```

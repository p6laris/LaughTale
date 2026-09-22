---
title: Declarative Directives (l-*)
description: Complete reference guide for LaughTale reactive directives — l-model, l-on, l-show, l-if, l-bind, l-text, l-ref, and l-transition.
order: 7
icon: terminal
category: Framework Architecture
---

# ⚡ Declarative Directives (`l-*`)

LaughTale includes a lightweight, ultra-fast declarative directive engine (inspired by modern reactive paradigms) that lets you add client-side interactivity to any standard HTML or Razor markup with **zero build step** and **zero boilerplate**.

---

## 📋 Directives Overview

| Directive | Purpose | Example |
| :--- | :--- | :--- |
| **`l-model`** | Two-way reactive data binding | `l-model="username"` |
| **`l-on:[event]`** | Event listeners with modifiers | `l-on:click.prevent="submitForm()"` |
| **`l-show`** | Toggles CSS visibility (`display: none`) | `l-show="isOpen"` |
| **`l-if`** | Conditionally adds/removes from DOM | `l-if="user.isLoggedIn"` |
| **`l-bind:[attr]`**| Dynamically binds HTML attributes | `l-bind:class="{ active: isSelected }"` |
| **`l-text`** | Sets safe text content | `l-text="message"` |
| **`l-html`** | Injects sanitized HTML | `l-html="safeRichContent"` |
| **`l-ref`** | Exposes direct DOM reference | `l-ref="inputField"` |
| **`l-transition`**| Animated entry and exit effects | `l-transition.fade` |
| **`l-get`/`l-post`/`l-put`/`l-delete`** | HTMX-style server fragment actions | `l-post="/cart/add" l-target="#cart"` |

---

## 1. `l-model` (Two-Way Binding)

Synchronizes an input element with a reactive state variable:

```html
<div data-island="search-box">
    <input type="text" l-model="query" placeholder="Type something..." class="p-inputtext" />
    <p>Searching for: <strong l-text="query"></strong></p>
</div>
```

Supported on:
- Text inputs (`<input type="text">`, `<textarea>`)
- Number inputs (`<input type="number">`)
- Checkboxes (`<input type="checkbox">` → boolean or array)
- Radio buttons (`<input type="radio">`)
- Select dropdowns (`<select>`)

---

## 2. `l-on:[event]` (Event Handlers & Modifiers)

Attach event listeners directly in markup with powerful chainable modifiers:

```html
<!-- Prevent default form submission -->
<form l-on:submit.prevent="saveData()">
    <!-- Debounced search input (fires 300ms after user stops typing) -->
    <input type="text" l-on:input.debounce.300ms="searchApi($event.target.value)" />

    <!-- Click handler with stop propagation -->
    <button type="button" l-on:click.stop="openModal()">Open</button>

    <!-- Trigger only once -->
    <button type="button" l-on:click.once="trackClick()">Vote</button>
</form>
```

### Supported Event Modifiers:
- `.prevent` — Calls `event.preventDefault()`
- `.stop` — Calls `event.stopPropagation()`
- `.once` — Executes handler at most once
- `.debounce.300ms` — Debounces execution by specified milliseconds
- `.throttle.500ms` — Throttles rapid events (e.g. scroll, mousemove)
- `.self` — Only triggers if `event.target === event.currentTarget`
- `.window` — Listens on global `window` object (e.g. `l-on:keydown.escape.window="close()"`)

---

## 3. `l-show` & `l-if` (Conditional Display)

Toggle UI visibility based on truthy/falsy expressions:

```html
<!-- l-show toggles CSS display: none (fast for frequent toggles) -->
<div l-show="isExpanded" class="p-card">
    <p>This content expands and collapses smoothly.</p>
</div>

<!-- l-if completely mounts and unmounts DOM node -->
<div l-if="isAdmin">
    <button class="p-button p-button-danger">Delete Database</button>
</div>
```

---

## 4. `l-bind:[attr]` (Dynamic Attributes)

Bind HTML classes, inline styles, URLs, or disabled states dynamically:

```html
<!-- Class Object Syntax -->
<div l-bind:class="{ 'border-primary': isFocused, 'opacity-50': isDisabled }"></div>

<!-- Dynamic Disabled State -->
<button l-bind:disabled="isSubmitting" class="p-button">Submit</button>

<!-- Dynamic Image Source & Alt Text -->
<img l-bind:src="user.avatarUrl" l-bind:alt="user.fullName" />
```

---

## 5. `l-transition` (Smooth Enter & Exit Animations)

Apply CSS transitions automatically when elements enter or leave via `l-show` or `l-if`:

```html
<div l-show="isOpen" 
     l-transition:enter="transition ease-out duration-200"
     l-transition:enter-start="opacity-0 scale-95"
     l-transition:enter-end="opacity-100 scale-100"
     l-transition:leave="transition ease-in duration-150"
     l-transition:leave-start="opacity-100 scale-100"
     l-transition:leave-end="opacity-0 scale-95"
     class="p-dialog">
    <p>Modal dialog with smooth scale and fade animation!</p>
</div>
```

---

## 6. Server Actions (`l-get`/`l-post`/`l-put`/`l-delete`) — HTMX-Style AJAX

If you know [htmx](https://htmx.org), you already know this. Any element can request a server-rendered
HTML fragment and swap it directly into the page — no client-side framework, no JSON API, no manual
`fetch()` wiring:

```html
<button l-post="/cart/add?id=42" l-target="#cart-summary" l-swap="outerHTML">
    Add to Cart
</button>

<div id="cart-summary">
    <!-- Razor Page handler's response HTML lands here -->
</div>
```

| Attribute | Purpose | Default |
| :--- | :--- | :--- |
| `l-get` / `l-post` / `l-put` / `l-delete` | HTTP method + URL to request | — (required, pick one) |
| `l-target` | CSS selector for the element to swap | the triggering element itself |
| `l-swap` | `innerHTML` \| `outerHTML` \| `beforeend` \| `afterbegin` \| `beforebegin` \| `afterend` \| `none` | `innerHTML` |
| `l-trigger` | DOM event that fires the request, plus `delay:<ms>` | `submit` for `<form>`, `input` for `<input>`, else `click` |
| `l-confirm` | `window.confirm()` message shown before the request fires | — (skipped if absent) |
| `l-indicator` | CSS selector for an element to show (`display: block`) while the request is in flight | — |

```html
<!-- Debounced live search: waits 300ms after the user stops typing -->
<input type="text" name="query" l-get="/search" l-target="#results" l-trigger="input delay:300ms" />
<div id="results"></div>

<!-- Confirm before a destructive action, with a loading spinner -->
<button l-delete="/items/42" l-target="#row-42" l-swap="outerHTML"
        l-confirm="Delete this item?" l-indicator="#spinner">
    Delete
</button>
<span id="spinner" style="display:none">Deleting…</span>
```

A `<form>` submits its own `FormData` as the request body (`GET` forms encode it into the query string
instead, matching native HTML form semantics); a single `<input>`/`<select>`/`<textarea>` sends its own
`name=value`. Every request carries an `X-LaughTale-Request: true` header so a Razor Page handler can
tell a fragment request apart from a full-page navigation and return just the partial. While a request
is in flight, every submit control in scope (`button[type="submit"]`, `input[type="submit"]`, a bare
`<button>`) is disabled to prevent a double-submit, and both the form and the triggering element get a
`data-lt-submitting="true"` attribute you can target in CSS for a busy/dimmed state — both are cleared
automatically when the request settles, success or failure.

## 7. Security Sandbox (Zero `eval()`)

Unlike other template directive engines that rely on dangerous `new Function()` or `eval()` execution, LaughTale compiles all directive expressions through a **Strict AST Tokenizer Sandbox**:
- **100% CSP Compliant**: Runs flawlessly under strict Content Security Policies with `unsafe-eval` disabled. Alpine.js and most of its peers require `unsafe-eval` in your CSP — LaughTale never does, at the parser level (there is no `eval`/`new Function` call anywhere in this engine's source, not just a policy that happens not to use one).
- **Zero Prototype Pollution**: Prevents malicious access to `window`, `document.cookie`, `__proto__`, or constructor scopes, enforced independently at parse time (structural name blocklist) AND at evaluation time (global-escape name blocklist) — see `LaughTale.Client/src/directives/expression/GRAMMAR.md` in the source tree for the complete, fuzz-tested list of every blocked name and construct.

---
title: "Declarative Directives (Zero-JS Engine)"
description: "Build reactive UI, keyboard shortcuts, tooltips, storage sync, and HTMX actions in pure C# Razor"
order: 6
section: "Zero-JS Architecture"
---

# Declarative Directives (Zero-JS Engine)

SoftMax.LaughTale includes a built-in **Declarative Micro-Directives Engine** that brings Alpine.js & HTMX-style superpowers directly into your C# Razor views.

You **never create, configure, or compile TypeScript/JavaScript files**. You write standard Razor markup with `l-*` attributes.

---

## 🎮 Interactive Live Directive Demos

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1.5rem;">

    <!-- 1. Live Reactivity & Storage Persistence (l-state, l-model, l-persist) -->
    <div l-state='{ "licenses": 5, "pricePerSeat": 120 }' l-persist="demo_pricing_calc" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1.25rem;">
        <div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900); margin-bottom: 0.5rem;">1. Reactive State &amp; LocalStorage Sync (<code style="font-size: 0.75rem;">l-state</code>, <code style="font-size: 0.75rem;">l-persist</code>)</div>
        <p style="font-size: 0.75rem; color: var(--p-surface-500); margin-bottom: 0.75rem;">Changes save to localStorage and survive page reloads:</p>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
            <label style="font-size: 0.8125rem; color: var(--p-surface-600);">Seats:</label>
            <input type="number" l-model="licenses" min="1" max="100" style="padding: 0.35rem 0.5rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); width: 80px;" />
            <span style="font-size: 0.8125rem; color: var(--p-surface-500);">&times; $120/seat</span>
        </div>
        <div style="font-size: 1.125rem; font-weight: 800; color: var(--p-primary-600);">
            Total: $<span l-bind="(licenses * pricePerSeat).toLocaleString()">600</span> /mo
        </div>
    </div>

    <!-- 2. Tooltips & Badges (l-tooltip, l-badge) -->
    <div style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1.25rem;">
        <div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900); margin-bottom: 0.5rem;">2. Aura Floating Tooltips &amp; Badges (<code style="font-size: 0.75rem;">l-tooltip</code>, <code style="font-size: 0.75rem;">l-badge</code>)</div>
        <p style="font-size: 0.75rem; color: var(--p-surface-500); margin-bottom: 0.75rem;">Hover over buttons to see animated Aura tooltips and status badges:</p>
        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <button type="button" l-tooltip="Export Audit Log as Encrypted PDF" l-badge="PDF" l-badge.info class="p-button p-button-secondary">
                Export Audit Logs 📄
            </button>
            <button type="button" l-tooltip.bottom="Zero-Trust HSM Level 4 Key" l-badge.dot l-badge.success class="p-button p-button-primary">
                Hardware Token 🔒
            </button>
            <button type="button" l-tooltip.right="3 critical security alerts" l-badge="3" l-badge.danger class="p-button p-button-secondary">
                Security Alerts 🔔
            </button>
        </div>
    </div>

    <!-- 3. Pattern Masking & Clipboard Copy (l-mask, l-copy) -->
    <div style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1.25rem;">
        <div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900); margin-bottom: 0.5rem;">3. Pattern Input Masking &amp; Clipboard Copy (<code style="font-size: 0.75rem;">l-mask</code>, <code style="font-size: 0.75rem;">l-copy</code>)</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            <div>
                <label style="font-size: 0.75rem; color: var(--p-surface-500); display: block; margin-bottom: 0.25rem;">Type numbers; auto-formats into telephone format:</label>
                <input type="text" l-mask="(999) 999-9999" placeholder="(555) 123-4567" style="width: 100%; padding: 0.45rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); font-size: 0.875rem;" />
            </div>
            <div>
                <label style="font-size: 0.75rem; color: var(--p-surface-500); display: block; margin-bottom: 0.25rem;">Copy cryptographic token with instant feedback:</label>
                <div style="display: flex; gap: 0.5rem;">
                    <code id="api-key-demo" style="background: var(--p-surface-100); padding: 0.45rem 0.65rem; border-radius: 4px; border: 1px solid var(--p-border-color); font-size: 0.75rem; flex: 1; overflow: hidden; text-overflow: ellipsis;">sec_live_894819204</code>
                    <button type="button" l-copy="#api-key-demo" l-feedback="✓ Copied!" class="p-button p-button-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;">Copy</button>
                </div>
            </div>
        </div>
    </div>

</div>

---

## 📋 Complete Directives Reference

### 1. Reactivity & State
| Directive | Description | Example |
|---|---|---|
| `l-state` | Initializes a reactive JavaScript `Proxy` data scope | `l-state='{ "count": 0 }'` |
| `l-persist` | Saves state to `localStorage` or `sessionStorage` (`l-persist.session`) | `l-persist="user_prefs"` |
| `l-bind` | Binds text or attribute to dynamic expression | `<span l-bind="count">0</span>` |
| `l-bind:attr` | Binds HTML attribute conditionally | `l-bind:disabled="count === 0"` |
| `l-model` | Two-way data binding for input, select, textarea | `<input type="number" l-model="count" />` |
| `l-show` / `l-hide` | Toggles display none based on boolean expression | `<div l-show="count > 0">Active</div>` |
| `l-class` | Dynamic CSS class toggling object | `l-class='{ "active": isActive }'` |
| `l-style` | Dynamic inline CSS style object | `l-style='{ "color": statusColor }'` |

### 2. Events & Keyboard Shortcuts
| Directive | Description | Example |
|---|---|---|
| `l-on:event` | Attaches event listener with modifiers (`.prevent`, `.stop`, `.once`, `.window`) | `l-on:click="count++"` |
| `l-on:event.debounce` | Rate-limits execution with millisecond timer | `l-on:input.debounce.300ms="query = $el.value"` |
| `l-on:event.throttle` | Throttles rapid events (scroll/resize) | `l-on:scroll.throttle.100ms="updateScroll()"` |
| `l-hotkey` / `l-shortcut` | Binds global or local keyboard shortcuts (`Ctrl+K`, `Escape`, `Shift+Enter`) | `l-hotkey="Ctrl+K"` |
| `l-outside` | Executes statement when clicking outside the element | `l-outside="isOpen = false"` |
| `l-listen:channel` | Listens to LaughTale Event Bus channels | `l-listen:user-login="isLoggedIn = true"` |
| `l-emit` | Dispatches event to LaughTale Event Bus on click | `l-emit="refresh-grid"` |

### 3. Visuals, Tooltips & Navigation
| Directive | Description | Example |
|---|---|---|
| `l-tooltip` | Floating Aura tooltip (`.top`, `.bottom`, `.left`, `.right`) | `l-tooltip="Download PDF"` |
| `l-badge` | Attaches badge or status dot (`.dot`, `.success`, `.danger`, `.info`) | `l-badge="5" l-badge.danger` |
| `l-scroll-to` | Smoothly scrolls to target anchor or top/bottom | `l-scroll-to="#section"` / `l-scroll-to="top"` |
| `l-teleport` | Teleports element into `body` or target selector | `l-teleport="body"` |
| `l-poll` | Declarative interval polling without JavaScript intervals | `l-poll.5s="$emit('refresh')"` |
| `l-intersect` | Trigger statements when element enters viewport | `l-intersect.once="isVisible = true"` |
| `l-mask` | Auto-formatting input mask pattern | `l-mask="(999) 999-9999"` |
| `l-copy` | Copies text or input value to clipboard with feedback | `l-copy="#secret" l-feedback="Copied!"` |

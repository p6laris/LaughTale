---
title: "Message Alert"
description: "Inline notification message with semantic severities, outlined/simple variants, closable actions, and form validation integration"
order: 44
section: "Metrics & Visual Media"
---

# Message

Message component is used to display inline notification messages with severity levels, outlined and simple variants, sizes, closable actions, life timers, and form validation integration.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; max-width: 32rem; margin-left: auto; margin-right: auto;">
    <island name="message" props-json='{"severity": "success", "closable": true, "icon": "check", "text": "Your account is now ready."}' hydrate="Load"></island>
    <island name="message" props-json='{"severity": "info", "closable": true, "icon": "sparkles", "text": "Upgrade now and save %5."}' hydrate="Load"></island>
    <island name="message" props-json='{"severity": "warn", "closable": true, "icon": "receipt", "text": "Your subscription is about to expire."}' hydrate="Load"></island>
    <island name="message" props-json='{"severity": "error", "closable": true, "icon": "alertTriangle", "text": "Something went wrong."}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<island-message severity="info" closable="true" icon="sparkles" text="Upgrade now and save %5." />
```

Or using slot / inner text:

```razor
<island-message severity="success" closable="true">
    Your account is now ready.
</island-message>
```

---

## 🎨 Severities

The `severity` option specifies the semantic color palette and tone:
- `info`: Informational updates (blue/cyan)
- `success`: Successful operations (emerald)
- `warn`: Warnings and alerts (amber)
- `error`: Error and failure states (rose)
- `secondary`: Neutral processing updates (slate)
- `contrast`: High-contrast dark/light badge (surface-900)

```razor
<island-message severity="success" text="Your account is now ready." />
<island-message severity="info" text="Upgrade now and save %5." />
<island-message severity="warn" text="Your subscription is about to expire." />
<island-message severity="error" text="Something went wrong." />
<island-message severity="secondary" spin="true" icon="loader2" text="Processing may take a few moments." />
<island-message severity="contrast" icon="wifi" text="You're currently in offline mode." />
```

---

## 🔲 Variants (Outlined & Simple)

Configure `variant="outlined"` or `variant="simple"`:

```razor
<!-- Outlined Variant -->
<island-message severity="info" variant="outlined" text="Upgrade now and save %5." />

<!-- Simple Variant (Ideal for Form Validation) -->
<island-message severity="error" variant="simple" size="small" text="Username is required" />
```

---

## 📏 Sizes

Choose between `small`, default, and `large`:

```razor
<island-message severity="info" size="small" text="Small Message" />
<island-message severity="info" text="Default Message" />
<island-message severity="info" size="large" text="Large Message" />
```

---

## ⏳ Auto-Dismiss Life Timer

Messages can automatically close after the delay specified in `life` (milliseconds):

```razor
<island-message severity="success" life="3000" text="Disappears in 3 seconds" />
```

---

## ⌨️ Accessibility

- Screen readers identify Message with `role="alert"`, `aria-live="assertive"`, and `aria-atomic="true"`.
- Close button is accessible with `Enter` and `Space` keys.

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `severity` | `string` | `"info"` | Severity type: `info`, `success`, `warn`, `error`, `secondary`, `contrast`. |
| `variant` | `string` | `null` | Variant style: `outlined`, `simple`, or default filled. |
| `size` | `string` | `null` | Size metric: `small` or `large`. |
| `closable` | `bool` | `false` | Displays an action button to dismiss the message. |
| `life` | `int?` | `null` | Delay in milliseconds before automatically closing the message. |
| `icon` | `string` | `null` | Custom Lucide SVG icon name or markup. |
| `avatar` | `string` | `null` | User avatar image URL. |
| `spin` | `bool` | `false` | Enables 360° continuous rotation on the icon. |
| `text` / `content` | `string` | `null` | Message body text or HTML markup. |

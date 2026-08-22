---
title: "Number & Currency Input"
description: "Formatted numeric and currency input with thousands separators and step buttons"
order: 7
section: "Form & Input Controls"
---

# Number & Currency Input

The `<island-number />` and `<island-currency />` TagHelpers render formatted numeric, currency, and percentage inputs styled in Aura.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1.25rem;">
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Live Currency Input ($ USD)</div>
        <island name="input-number" props-json='{"value": 2450.50, "currency": "USD", "mode": "currency", "showButtons": true}' hydrate="Load"></island>
    </div>
    <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.5rem;">Live Percentage Input (%)</div>
        <island name="input-number" props-json='{"value": 45, "mode": "percent", "min": 0, "max": 100, "step": 5, "showButtons": true}' hydrate="Load"></island>
    </div>
</div>

---

## 💵 Currency Formatting

```razor
<island-currency value="2450.50" 
                 currency="USD" 
                 target-input="InvoiceAmount" 
                 step="50" 
                 hydrate="Load" />
```

### Supported Currencies:
* `USD` (`$ 1,250.00`)
* `EUR` (`€ 1,250.00`)
* `IQD` (`IQD 1,250.00`)
* Custom prefixes: `prefix="£ "`

---

## 🔢 Pure Decimal & Percent

```razor
<!-- Decimal with step buttons -->
<island-number value="15.5" 
               min="0" 
               max="100" 
               step="0.5" 
               decimals="1" 
               target-input="TaxRate" 
               hydrate="Load" />

<!-- Percentage Mode -->
<island-number value="45" 
               mode="percent" 
               target-input="DiscountPct" 
               hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `double?` | `null` | Initial numeric value. |
| `currency` | `string` | `"USD"` | Currency code (`USD`, `EUR`, `IQD`). |
| `mode` | `string` | `"decimal"` | `"decimal"`, `"currency"`, or `"percent"`. |
| `prefix` / `suffix` | `string?` | `null` | Custom string before or after the number. |
| `step` | `double` | `1` | Increment/decrement step amount. |
| `min` / `max` | `double?` | `null` | Boundary constraints. |
| `decimals` | `int?` | `2` (currency) | Decimal digits precision. |
| `show-buttons` | `bool` | `true` | Show or hide ▲ / ▼ step buttons. |
| `target-input` | `string?` | `null` | Form input name to bind raw numeric string. |

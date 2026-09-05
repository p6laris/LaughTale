# Native Form Association in LaughTale

Feature: `045-form-association`  
Status: Standard Architecture

LaughTale form controls participate natively in HTML `<form>` submissions on both server-rendered (no-JS) and hydrated client-rendered paths. All 29 interactive form components adopt a uniform headless architecture driven by server-rendered inputs and the client `useFormField` composable.

---

## 1. Overview & Guarantees

1. **No-JS Form Submission**: Every form control contributes its form field element into the initial HTML response before any JavaScript downloads or executes. Forms post model values natively in zero-script environments.
2. **Non-Destructive Hydration**: Client component hydration adopts the existing server-rendered form field node rather than creating new `<input>` elements or replacing the field. The identical DOM node persists across hydration and subsequent component re-renders.
3. **Strict Parity**: The form payload submitted by a hydrated form matches the server-rendered no-JS submission key-for-key and value-for-value.
4. **Idempotence & Lifecycle**: Re-rendering or refreshing an island maintains exactly one field element per control (plus companion for boolean controls). Island teardown completely removes the associated field with no leaks.

---

## 2. Model Binding & Name Resolution Precedence

Field names resolve according to Contract C1:

| Precedence | Source | Example |
|---|---|---|
| **1 (Highest)** | Explicit `name` attribute | `<island-select name="Region" />` |
| **2** | `asp-for` ModelExpression | `<island-select asp-for="Order.Region" />` → `name="Order.Region"` |
| **3 (Error)** | None | Renders no field; compiler emits build-time diagnostic `LTI005` |

> [!NOTE]
> **No Generic Literal Defaults**: Previous versions used hard-coded default names such as `select_value`, `slider_value`, or `mask_value`. These defaults have been eliminated. Multiple instances of a control on a single page will never silently overwrite each other. An omitted name is an authoring error surfaced at compile time.

---

## 3. Cardinality Shapes & Wire Serialization

Serialization is governed by the declared `FormCardinality` in the `[FormControl]` attribute:

### `Single`
One field, one value.
```html
<input type="hidden" name="Customer.Email" value="user@example.com" data-lt-field />
```
- When empty, the field submits `value=""` so the server can distinguish "cleared" from "absent".
- Controls using `Single`: `input-text`, `textarea`, `input-password`, `input-number`, `input-mask`, `input-otp`, `color-picker`, `knob`, `rating`, `autocomplete`, `cascade-select`, `inplace`, `paginator`.
- **Sensitive Fields**: Per Contract C4, `input-password` renders with `value=""` in the initial server markup to prevent credential exposure in HTML source.

### `Multiple`
Repeated fields under the same name — **never** a delimiter-joined string:
```html
<input type="hidden" name="Order.Tags" value="urgent" data-lt-field />
<input type="hidden" name="Order.Tags" value="export" data-lt-field />
```
- Standard ASP.NET Core model binding populates `List<T>` / `T[]` directly from repeated form parameters.
- Values containing commas or special characters are preserved losslessly without escaping.
- An empty selection submits no fields for that key, conforming to native `<select multiple>` semantics.
- Controls using `Multiple`: `select`, `multiselect`, `listbox`, `select-button`, `tree-select`, `datepicker`, `slider`, `orderlist`, `picklist`, `orgchart`, `dropzone`, `input-tags`.

### `Boolean`
Checked/unchecked companion pattern (matching ASP.NET Core `<input asp-for>` checkbox behavior):
```html
<input type="hidden" name="Order.Express" value="false" data-lt-field-companion />
<input type="hidden" name="Order.Express" value="true" data-lt-field />
```
- In HTML form submission with duplicate keys, last-value-wins in model binding.
- When unchecked, the primary field is disabled or omitted, submitting `false`.
- When checked, the primary field is active, submitting `["false", "true"]` which binds to `true`.
- Standalone radio buttons submit `data-radio-name` with the companion pattern, submitting `false` when unselected and the assigned option value when selected.
- Controls using `Boolean`: `checkbox`, `radio-button`, `toggle-switch`, `toggle-button`.

---

## 4. Client Integration: `useFormField` Composable

Client island components interact with form fields exclusively through the headless `useFormField` composable (`src/composables/useFormField.ts`).

### Usage Example
```typescript
import { useFormField } from '../composables/useFormField';

export default function MyCustomIsland(container: HTMLElement, props: MyProps, ctx?: IslandContext) {
    const formField = useFormField(container, ctx, {
        cardinality: 'Single',
        name: props.name
    });

    // Read initial value from server-rendered field or props
    const initialVal = props.value ?? formField.getValue();

    function render() {
        // Protect field during DOM updates
        formField.detach();

        container.innerHTML = `<input class="my-visible-input" value="${initialVal}">`;

        // Re-attach adopted field after DOM updates
        formField.reattach();
    }

    function onUserChange(newVal: string) {
        // Update serialized hidden/native field
        formField.setValue(newVal);
    }
}
```

### Guarantees
- **Zero Client Field Creation**: Never calls `document.createElement('input')`. If no server-rendered field is found in the container, logs a warning and gracefully degrades.
- **Container Scoped**: Queries strictly within `:scope [data-lt-field]`, preventing cross-island field pollution.
- **Form Reset Integration**: Binds to native `form.reset` events, automatically synchronizing visible DOM state with restored server values.

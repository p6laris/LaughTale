---
title: "Dialog Modal Window"
description: "Zero-layout-shift modal dialog with backdrop blur, focus trapping, ESC dismiss, maximize toggling, and server-rendered Razor body slots."
order: 29
section: "Overlays & Dialogs"
---

# Dialog Modal Window

Dialog is an enterprise overlay window component supporting backdrop blurs, animated entrances, keyboard focus trapping, modal maximization, and server-rendered C# Razor slot content.

---

## 🎮 Interactive Live Demos

### 1. Basic Server Slot Modal

```razor
@page
@model DialogPageModel

<!-- Trigger Button -->
<button type="button" 
        class="p-button p-button-primary" 
        onclick="document.dispatchEvent(new CustomEvent('dialog:open:user-profile'))">
    Open User Profile
</button>

<!-- Dialog Island Container -->
<island-dialog id="user-profile" 
               header="Operator Profile" 
               modal="true" 
               dismissable-mask="true" 
               maximizable="true" 
               style="width: 500px;">
    
    <!-- Server-rendered body content -->
    <div class="p-4">
        <p class="text-sm text-muted mb-4">Update your enterprise operator credentials below.</p>
        
        <div class="form-group mb-3">
            <label class="block text-xs font-semibold mb-1">Operator ID</label>
            <input type="text" class="p-inputtext w-full" value="USR-9901" readonly />
        </div>

        <div class="form-group mb-3">
            <label class="block text-xs font-semibold mb-1">Clearance Level</label>
            <span class="aura-tag tag-indigo">Tier 4 (Kernel Access)</span>
        </div>
    </div>

    <!-- Server-rendered footer actions -->
    <div slot="footer" class="flex justify-end gap-2 p-3 bg-surface-50 border-t border-border">
        <button type="button" class="p-button p-button-secondary" onclick="$dialog('user-profile').close()">Cancel</button>
        <button type="button" class="p-button p-button-primary" onclick="$dialog('user-profile').close()">Save Changes</button>
    </div>
</island-dialog>
```

---

## ⚙️ C# TagHelper Attributes & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier used for opening/closing events. |
| `header` | `string` | `null` | Title displayed in the modal header bar. |
| `modal` | `bool` | `true` | Displays a backdrop overlay behind the dialog. |
| `dismissable-mask` | `bool` | `true` | Closes dialog when clicking on the backdrop mask. |
| `close-on-escape` | `bool` | `true` | Closes dialog when pressing the <kbd>Esc</kbd> key. |
| `maximizable` | `bool` | `false` | Displays a maximize/restore icon button in the header. |
| `draggable` | `bool` | `true` | Enables dragging dialog window via its header. |
| `position` | `string` | `"center"` | Modal position (`"center"`, `"top"`, `"bottom"`, `"left"`, `"right"`). |

---

## ♿ Accessibility Contract

* **Focus Trapping**: Focus is automatically trapped inside the active dialog window.
* **ARIA Roles**: Emits `role="dialog"` and `aria-modal="true"`.
* **Esc Dismiss**: Pressing <kbd>Esc</kbd> returns focus back to the triggering element.

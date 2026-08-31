---
title: Dialog Component
description: Accessible modal window overlay supporting custom headers, focus trapping, smooth entry/exit animations, and responsive breakpoints.
order: 22
icon: window
category: Overlays & Dialogs
---

# 🪟 Dialog Component

`<island-dialog />` renders an accessible modal window with automatic focus management, Escape key dismiss, backdrop blur, and smooth scale transitions.

---

## ⚡ 1. Basic Usage

```razor
<!-- Trigger Button -->
<island-button label="Open Settings" icon="settings" l-on:click="$dialog('account-dialog').open()" />

<!-- Dialog Container -->
<island-dialog id="account-dialog" 
               header="Account Preferences" 
               modal="true" 
               dismissable-mask="true" 
               close-on-escape="true">
    <p class="text-surface-600 mb-4">Update your profile settings and notifications below:</p>
    
    <div class="space-y-3">
        <label class="block text-sm font-semibold">Display Name</label>
        <input type="text" class="p-inputtext w-full" value="Alice Morgan" />
    </div>

    <div slot="footer" class="flex justify-end gap-2 mt-6">
        <button class="p-button p-button-secondary" l-on:click="$dialog('account-dialog').close()">Cancel</button>
        <button class="p-button p-button-primary" l-on:click="$dialog('account-dialog').close()">Save Changes</button>
    </div>
</island-dialog>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `required` | Unique DOM identifier for programmatic control |
| `header` | `string` | `null` | Title text in modal header |
| `modal` | `bool` | `true` | Display semi-transparent backdrop overlay |
| `dismissable-mask`| `bool` | `true` | Close modal when clicking on backdrop |
| `close-on-escape` | `bool` | `true` | Close modal on Escape key press |
| `closable` | `bool` | `true` | Display close (X) icon in header |
| `draggable` | `bool` | `false` | Allow dragging modal across viewport |
| `position` | `center \| top \| bottom` | `center` | Modal viewport position |

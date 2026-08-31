---
title: Dialog Component
description: Accessible modal window overlay supporting custom headers, focus trapping, smooth entry/exit animations, and responsive breakpoints.
order: 22
icon: window
category: Overlays & Dialogs
---

# 🪟 Dialog Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 420px; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: 8px; padding: 1.25rem; box-shadow: var(--p-shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h4 style="margin: 0; font-weight: 700;">Edit User Permissions</h4>
            <span style="color: var(--p-text-muted); cursor: pointer;">✕</span>
        </div>
        <p style="font-size: 0.875rem; color: var(--p-text-muted); margin-bottom: 1.25rem;">Update the role assignments and security policies for this account.</p>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button type="button" class="p-button p-button-secondary">Cancel</button>
            <button type="button" class="p-button p-button-primary">Save Changes</button>
        </div>
    </div>
</div>


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

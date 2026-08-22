---
title: "ConfirmPopup Overlay"
description: "Floating confirmation popover anchored directly to target buttons"
order: 28
section: "Navigation & Overlays"
---

# ConfirmPopup Overlay

The `<island-confirm-popup />` TagHelper provides a confirmation tooltip anchored directly above or below any button before executing destructive actions.

---

## 🚀 Basic Usage

```razor
<!-- Target Button -->
<button id="delete-user-btn" class="p-button p-button-secondary">
    Delete Account 🗑️
</button>

<!-- Anchored ConfirmPopup -->
<island-confirm-popup target-selector="#delete-user-btn" 
                      message="Are you sure you want to permanently delete this account?" 
                      accept-text="Yes, Delete" 
                      reject-text="Cancel" 
                      action-name="delete_account" 
                      hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `target-selector` | `string` | `""` | CSS selector of the trigger button element. |
| `message` | `string` | `"Are you sure?"` | Confirmation message text. |
| `accept-text` | `string` | `"Confirm"` | Text on the confirmation button. |
| `reject-text` | `string` | `"Cancel"` | Text on the dismissal button. |
| `action-name` | `string?` | `null` | Action identifier sent in `confirm:accept` event. |

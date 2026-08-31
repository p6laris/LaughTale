---
title: Drawer Component
description: Off-canvas sidebar panel sliding from left, right, top, or bottom with RTL mirroring and smooth backdrop overlay.
order: 25
icon: sidebar
category: Overlays & Dialogs
---

# 🚪 Drawer Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button type="button" class="p-button p-button-primary" onclick="document.dispatchEvent(new CustomEvent('drawer:open', { detail: { position: 'left' } }))">Open Left Drawer</button>
        <button type="button" class="p-button p-button-secondary" onclick="document.dispatchEvent(new CustomEvent('drawer:open', { detail: { position: 'right' } }))">Open Right Drawer</button>
    </div>
</div>


`<island-drawer />` renders an off-canvas drawer sliding into the viewport from the left, right, top, or bottom. In Kurdish / Arabic RTL mode, horizontal directions automatically mirror.

---

## ⚡ 1. Basic Usage

```razor
<!-- Trigger Button -->
<island-button label="Open Navigation" icon="menu" l-on:click="$drawer('nav-drawer').open()" />

<!-- Drawer Panel -->
<island-drawer id="nav-drawer" 
               position="left" 
               dismissable="true" 
               modal="true">
    <div class="p-4">
        <h3 class="text-xl font-bold mb-4">Application Menu</h3>
        <ul class="space-y-2">
            <li><a href="/dashboard" class="block p-2 rounded hover:bg-surface-100">Dashboard</a></li>
            <li><a href="/customers" class="block p-2 rounded hover:bg-surface-100">Customers</a></li>
            <li><a href="/reports" class="block p-2 rounded hover:bg-surface-100">Analytics Reports</a></li>
            <li><a href="/settings" class="block p-2 rounded hover:bg-surface-100">System Settings</a></li>
        </ul>
    </div>
</island-drawer>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `required` | Unique DOM identifier for programmatic control |
| `position` | `left \| right \| top \| bottom \| full` | `left` | Viewport slide-in edge |
| `modal` | `bool` | `true` | Display semi-transparent backdrop overlay |
| `dismissable` | `bool` | `true` | Close when clicking on backdrop |
| `close-on-escape` | `bool` | `true` | Close when pressing Escape key |

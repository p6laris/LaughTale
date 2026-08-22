---
title: "Server Slot Projection"
description: "Wrapping arbitrary server-rendered C# HTML inside client TypeScript islands"
order: 4
section: "Advanced Architecture"
---

# Server Slot Projection

One of the most powerful capabilities of SoftMax.LaughTale is **Server Slot Projection**.

A TypeScript island can act as an interactive shell (e.g. a Modal Dialog, Collapsible Accordion, or Flyout Drawer) that wraps arbitrary server-rendered Razor HTML, preserving full server security and zero client overhead for the slot body.

---

## 🔐 Live Server Slot Modal Demo

Click the button below to inspect a modal dialog whose body is rendered on the server in C#:

<island name="modal-dialog" props='{"triggerButtonText": "Open Policy Dialog", "dialogTitle": "Security Verification Policy"}' hydrate="Interaction">
    <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1rem;">
        <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-900);">Projected C# Slot Body</h4>
        <p style="font-size: 0.75rem; color: var(--p-surface-600); margin-top: 0.25rem;">
            This content was rendered server-side by ASP.NET Core and projected into the client TypeScript dialog!
        </p>
    </div>
</island>

---

## 💻 Razor Usage

```razor
<island name="modal-dialog" 
        props="@(new SecurityModalProps("Open Agreement", "Terms of Service"))" 
        hydrate="Interaction">
    
    <!-- Arbitrary C# Razor content projected into default slot -->
    <div class="legal-notice">
        <p>Current Server Timestamp: @DateTime.UtcNow.ToString("O")</p>
    </div>
    
</island>
```

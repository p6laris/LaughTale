---
title: Slots & Content Projection
description: Project server-rendered Razor HTML, icons, custom buttons, and templates directly into client islands with named slots.
order: 6
icon: layout
category: Framework Architecture
---

# 🧩 Slots & Content Projection

Content projection allows you to pass **rich server-rendered Razor markup** directly into client islands. The server renders the HTML child nodes, and the client island projects them into designated `<slot>` locations without destroying or re-rendering them.

---

## ⚡ 1. Default Slot

Any HTML placed inside an `<island>` TagHelper is projected as the default slot content:

```razor
<island name="collapsible-card" hydrate="Interaction">
    <!-- Server-rendered Razor markup inside the slot -->
    <h3 class="text-xl font-bold">@Model.Customer.Name</h3>
    <p class="text-surface-600">Account Tier: <strong>@Model.Customer.Tier</strong></p>
    <a href="/customers/@Model.Customer.Id" class="text-primary-600 underline">View Profile</a>
</island>
```

In your TypeScript island:
```typescript
export default function CollapsibleCard(container: HTMLElement, props: any, ctx?: IslandContext) {
    // Preserve the original server-rendered children
    const slotContent = container.innerHTML;

    container.innerHTML = `
        <div class="p-card border rounded-xl overflow-hidden shadow-sm">
            <div class="p-4 bg-surface-50 flex justify-between items-center cursor-pointer header">
                <span class="font-bold">Customer Overview</span>
                <span class="chevron">▼</span>
            </div>
            <div class="p-4 body">
                ${slotContent}
            </div>
        </div>
    `;
}
```

---

## 🏷️ 2. Named Slots (`slot="header"`, `slot="footer"`)

You can project multiple designated template regions using the `slot` attribute:

```razor
<island name="modal-dialog" hydrate="Interaction">
    <!-- Header Slot -->
    <div slot="header" class="flex items-center gap-2">
        <span class="p-badge p-badge-danger">Urgent</span>
        <h4 class="font-bold">Confirm Deletion</h4>
    </div>

    <!-- Body Slot (Default) -->
    <p>Are you sure you want to permanently remove this record?</p>

    <!-- Footer Slot -->
    <div slot="footer" class="flex justify-end gap-2">
        <button class="p-button p-button-secondary">Cancel</button>
        <button class="p-button p-button-danger">Confirm Delete</button>
    </div>
</island>
```

In your TypeScript island:
```typescript
export default function ModalDialog(container: HTMLElement, props: any, ctx?: IslandContext) {
    const headerSlot = container.querySelector('[slot="header"]')?.innerHTML || '';
    const footerSlot = container.querySelector('[slot="footer"]')?.innerHTML || '';
    const bodySlot = Array.from(container.children)
        .filter(el => !el.hasAttribute('slot'))
        .map(el => el.outerHTML)
        .join('');

    container.innerHTML = `
        <div class="dialog-modal">
            <div class="dialog-header">${headerSlot}</div>
            <div class="dialog-body">${bodySlot}</div>
            <div class="dialog-footer">${footerSlot}</div>
        </div>
    `;
}
```

---

## 🛡️ 3. Benefits of Slot Projection

1. **Zero Client Serialization**: You don't need to convert complex Razor markup into JSON strings.
2. **SEO & Accessibility**: Projected content is part of the initial server HTML, indexed immediately by search engines.
3. **Razor Ergonomics**: Use standard Razor syntax (`@if`, `@foreach`, `@DateTime.Now`) inside your projected slots!

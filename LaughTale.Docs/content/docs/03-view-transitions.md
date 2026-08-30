---
title: "View Transitions & MPA Router"
description: "SPA-like navigation fluidity on top of multi-page ASP.NET Core Razor Pages using View Transitions and intelligent prefetching."
order: 3
section: "Core Concepts"
---

# View Transitions & MPA Router

LaughTale combines the simplicity and reliability of Multi-Page Applications (MPAs) with the seamless, fluid transitions of Single-Page Applications (SPAs) through its built-in **View Transitions Router**.

---

## ⚡ How It Works

When a user clicks a link:
1. LaughTale intercepts the click.
2. It checks its in-memory **Prefetch Cache** (which was already fetched when the user hovered over the link).
3. It uses the native **W3C View Transitions API** (`document.startViewTransition`) to cross-fade old DOM with new server HTML.
4. Persistent islands (like audio players or persistent chat drawers decorated with `persist="id"`) are preserved across the navigation without re-initializing.

---

## ⚙️ Enabling View Transitions

In your `Program.cs`:

```csharp
builder.Services.AddLaughTale(options =>
{
    // Enable seamless page transitions
    options.ViewTransitions.Enabled = true;
    
    // Enable hover-based prefetching
    options.Prefetch.Enabled = true;
    options.Prefetch.HoverDelayMs = 65; // Prefetch after 65ms hover
});
```

In your client initialization (`src/main.ts`):

```typescript
import { enableViewTransitions } from 'laughtale';

// Initialize the MPA router
enableViewTransitions({
    prefetch: true,
    hoverDelay: 65,
    onNavigate: (toUrl) => {
        console.log(`Navigating to ${toUrl}`);
    }
});
```

---

## 🎵 Persistent Islands Across Navigations

To keep an island alive across page changes (preserving internal state, playing media, or active WebSockets), assign a unique `persist` key:

```razor
<!-- Layout.cshtml -->
<island name="persistent-audio-player" 
        props="@Model.CurrentTrack" 
        persist="global-audio-player" 
        hydrate="Load" />
```

When navigating between `/dashboard` and `/reports`, the `global-audio-player` DOM node is physically swapped into the incoming page without pausing playback or resetting its React/Vue/Vanilla internal state.

---

## 🎨 Custom Transition Animations

You can customize the transition style using standard CSS View Transition pseudo-elements:

```css
::view-transition-old(root) {
    animation: fade-out 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
    animation: fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes fade-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-4px); }
}

@keyframes fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}
```

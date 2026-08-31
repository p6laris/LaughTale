---
title: View Transitions & Persistent Islands
description: Enable seamless, app-like multi-page navigation across ASP.NET Core Razor Pages with the View Transitions API and persistent state islands.
order: 4
icon: play
category: Framework Architecture
---

# 🎬 View Transitions & Persistent Islands

One of the biggest historical drawbacks of multi-page applications (MPAs) has been the jarring white screen flash during page navigation. 

LaughTale solves this natively using the **W3C View Transitions API** paired with **Persistent Island Preservation**, giving your ASP.NET Core apps the silky smoothness of an SPA with none of the complexity.

---

## ⚡ 1. Enabling View Transitions

View Transitions are enabled globally in `Program.cs`:

```csharp
builder.Services.AddLaughTale(options =>
{
    options.EnableViewTransitions = true;
});
```

And in your `_Layout.cshtml`, the client runtime automatically intercepts standard link clicks (`<a href="...">`) and executes a seamless DOM swap:

```html
<meta name="view-transition" content="same-origin" />
```

---

## 🔒 2. Persistent State Islands (`persist="id"`)

Sometimes you have an interactive island that needs to **stay alive and preserve state** even when navigating across different Razor pages:
- A music / podcast audio player that never stops playing.
- A persistent chat drawer or AI assistant widget.
- Real-time telemetry cards and notification badges.

To persist an island, provide a unique `persist` key:

```razor
<!-- In _Layout.cshtml or any Page -->
<island name="persistent-player" 
        props="@Model.CurrentTrack" 
        persist="global-audio-player" 
        hydrate="Load" />
```

### How It Works Under the Hood:
1. When user clicks a link to navigate to `/dashboard` from `/home`:
2. LaughTale captures the live DOM node and JavaScript instance of `global-audio-player`.
3. The new page HTML is fetched via background streaming.
4. The View Transition animation smoothly cross-fades the page contents.
5. The persistent island is re-grafted into the new DOM tree **without interrupting audio playback, resetting timer state, or dropping WebSockets!**

---

## 🎨 3. Customizing Transition Animations

LaughTale ships with pre-configured CSS transition animations that you can customize in your stylesheets:

```css
/* Smooth Cross-Fade */
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 0.25s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide in from right */
@keyframes slide-from-right {
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

::view-transition-new(main-content) {
    animation: slide-from-right 0.3s ease-out;
}
```

---

## 🚫 4. Opting Out of View Transitions

If a specific link needs a traditional full browser reload (e.g. file downloads, external redirects, logout):

```html
<a href="/logout" data-no-transition>Sign Out</a>
<a href="/reports/download.pdf" target="_blank">Download PDF</a>
```

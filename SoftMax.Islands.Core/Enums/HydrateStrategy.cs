namespace SoftMax.Islands.Core.Enums;

/// <summary>
/// Defines the client-side hydration strategy for an Island component.
/// </summary>
public enum HydrateStrategy
{
    /// <summary>
    /// Hydrates immediately when the DOM is ready (DOMContentLoaded).
    /// Best for above-the-fold critical interactive elements (e.g. search bars, hero widgets).
    /// </summary>
    Load,

    /// <summary>
    /// Hydrates during browser idle time using requestIdleCallback (fallback to setTimeout).
    /// Best for non-critical elements that don't need instant interactivity.
    /// </summary>
    Idle,

    /// <summary>
    /// Hydrates ONLY when the element enters or approaches the viewport (IntersectionObserver).
    /// Best for below-the-fold widgets, comment sections, and mid-page forms.
    /// </summary>
    Visible,

    /// <summary>
    /// Hydrates when a specific CSS media query matches (e.g. "(max-width: 768px)").
    /// Best for mobile-only drawers or desktop-only toolbars.
    /// </summary>
    Media,

    /// <summary>
    /// Hydrates on first user interaction (mouseenter, focus, or click).
    /// Best for dropdown menus and modal popups.
    /// </summary>
    Interaction,

    /// <summary>
    /// Pure Server-Side Rendering (SSR). Zero JavaScript is ever executed for this island.
    /// </summary>
    Never
}

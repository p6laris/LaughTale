---
title: "Carousel Slider"
description: "Native CSS scroll-snap content slider featuring start/center/end alignment, partial slides, vertical orientation, loop wrap, variable item widths, and synchronized thumbnail galleries"
order: 46
section: "Metrics & Visual Media"
---

# Carousel

Carousel is a content slider featuring various customization options, built with native CSS scroll-snap for high-performance 60fps momentum swiping on touch, mouse wheel, and pointer devices.

---

## 🎮 Interactive Live Demos

### 1. Basic

Composition-based carousel using native scroll-snap with sub-components for root, content, items, navigation, and indicators.

<island-carousel demo-type="basic" align="center" />

---

### 2. Alignment & Partial Slides

Use `align` to control snap alignment (`start`, `center`, `end`) and `slidesPerPage` to show partial peek slides (e.g. `1.5`).

<island-carousel demo-type="alignment" align="start" slides-per-page="1.5" />

---

### 3. Vertical Orientation

Set `orientation="vertical"` for a vertical carousel layout with top and bottom chevron navigators.

<island-carousel demo-type="orientation" orientation="vertical" slides-per-page="1.3" />

---

### 4. Continuous Loop

Enable continuous looping with `loop="true"` to wrap around at the ends.

<island-carousel demo-type="loop" align="center" loop="true" slides-per-page="1.75" />

---

### 5. Variable Size (`autoSize`)

Enable `autoSize="true"` to allow items with varying intrinsic widths instead of a fixed fractional page width.

<island-carousel demo-type="variable" align="center" auto-size="true" />

---

### 6. Synchronized Thumbnail Gallery

Two carousels synchronized via slide input to create a responsive gallery with thumbnail strip navigation.

<island-carousel demo-type="gallery" align="center" />

---

## 🚀 Razor Usage

```razor
<!-- Basic Carousel -->
<island-carousel demo-type="basic" align="center" />

<!-- Partial Slides & Alignment -->
<island-carousel align="start" slides-per-page="1.5" />

<!-- Vertical Carousel -->
<island-carousel orientation="vertical" slides-per-page="1.3" />

<!-- Continuous Looping -->
<island-carousel loop="true" slides-per-page="1.75" />

<!-- Variable Item Widths -->
<island-carousel auto-size="true" />

<!-- Synchronized Gallery -->
<island-carousel demo-type="gallery" />
```

---

## ⌨️ Accessibility

- `role="region"`, `aria-roledescription="carousel"`, `aria-label="Content Slider"`.
- Slides use `role="group"`, `aria-roledescription="slide"`, and `aria-label="Slide X of Y"`.
- Navigators feature `aria-label="Previous slide"` and `aria-label="Next slide"`.
- Active indicator pill is marked with `aria-current="true"`.
- Supports keyboard navigation: `ArrowRight`/`ArrowLeft` (or `ArrowDown`/`ArrowUp`), `Tab`, `Home`, `End`, and `Enter`/`Space`.

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `align` | `string` | `"center"` | Scroll-snap alignment: `start`, `center`, `end`. |
| `orientation` | `string` | `"horizontal"` | Layout orientation: `horizontal` or `vertical`. |
| `slides-per-page` | `double?` | `1` | Fractional or integer number of slides visible per page. |
| `loop` | `bool` | `false` | Continuous wrap-around navigation. |
| `auto-size` | `bool` | `false` | Use intrinsic item widths instead of fixed page fractions. |
| `spacing` | `int` | `16` | Gap between slides in pixels. |
| `slide` | `int?` | `0` | Controlled slide index for synchronization. |
| `demo-type` | `string?` | `null` | Preconfigured demo preset (`basic`, `alignment`, `orientation`, `loop`, `variable`, `gallery`). |
| `show-indicators` | `bool` | `true` | Show bottom indicator pill buttons. |
| `show-navigators` | `bool` | `true` | Show prev/next round chevron buttons. |

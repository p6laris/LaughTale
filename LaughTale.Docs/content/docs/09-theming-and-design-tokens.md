---
title: Theming & Design Tokens
description: Master LaughTale semantic CSS design tokens, Dark Mode synchronization, font tokens, and live visual customization with Theme Studio.
order: 10
icon: palette
category: Framework Architecture
---

# 🎨 Theming & Design Tokens

LaughTale is built around the **Aura Design System** using standard CSS Custom Properties (Variables). You can customize the look and feel of every component globally, per page, or per island with **zero CSS recompilation**.

---

## 🌈 1. Semantic Token Hierarchy

All LaughTale styles derive from semantic `--lt-*` CSS variables:

### Primary Palette Tokens
Controls buttons, active paginator badges, focus rings, sliders, and selection highlights:

```css
:root {
    --lt-primary-50:  #ecfdf5;
    --lt-primary-100: #d1fae5;
    --lt-primary-200: #a7f3d0;
    --lt-primary-300: #6ee7b7;
    --lt-primary-400: #34d399;
    --lt-primary-500: #10b981; /* Default Brand Emerald */
    --lt-primary-600: #059669;
    --lt-primary-700: #047857;
    --lt-primary-800: #065f46;
    --lt-primary-900: #064e3b;
    --lt-primary-950: #022c22;
}
```

### Surface & Neutral Tokens
Controls backgrounds, table rows, cards, popovers, and borders:

```css
:root {
    --lt-surface-0:   #ffffff;
    --lt-surface-50:  #f8fafc;
    --lt-surface-100: #f1f5f9;
    --lt-surface-200: #e2e8f0;
    --lt-surface-300: #cbd5e1;
    --lt-surface-400: #94a3b8;
    --lt-surface-500: #64748b;
    --lt-surface-600: #475569;
    --lt-surface-700: #334155;
    --lt-surface-800: #1e293b;
    --lt-surface-900: #0f172a;
    --lt-surface-950: #020617;
}
```

---

## 🌙 2. Seamless Dark Mode

LaughTale components adapt instantly to Dark Mode. In Dark Mode, surface variables automatically invert:

```css
html.dark, [data-theme="dark"] {
    --lt-surface-0:   #090d16;
    --lt-surface-50:  #0f172a;
    --lt-surface-100: #1e293b;
    --lt-surface-200: #334155;
    --lt-surface-900: #f8fafc;
    --lt-surface-950: #ffffff;
}
```

### Preventing Dark Mode Flash (FOUC)
Add this small inline script inside your `<head>` tag in `_Layout.cshtml`:

```html
<script>
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
</script>
```

---

## 🔤 3. Typography & Speda Font Tokens

```css
:root {
    --lt-font-family: 'Inter', system-ui, -apple-system, sans-serif;
    --lt-font-mono: 'JetBrains Mono', monospace;
}

/* Kurdish / RTL Typography Override */
:root[lang^="ku"], :root[lang^="ckb"], [dir="rtl"] {
    --lt-font-family: 'Speda', 'Inter', system-ui, sans-serif;
}
```

---

## 🛠️ 4. Live Visual Theme Studio

LaughTale includes an interactive **Theme Studio** component (`<island-theme-studio />`) that lets users and designers tweak palettes in real time:

- **Color Presets**: Emerald, Indigo, Rose, Amber, Cyan, Purple, Sky.
- **Surface Presets**: Slate, Zinc, Neutral, Stone.
- **Radius Presets**: None (`0px`), Small (`4px`), Medium (`8px`), Large (`12px`), Full.
- **Export Theme**: Generates ready-to-use CSS tokens to paste directly into `site.css`.

To enable Theme Studio in your app:

```razor
<!-- Add anywhere in _Layout.cshtml -->
<island-theme-studio />
```

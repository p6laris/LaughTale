# 🏝️ LaughTale Multi-Framework Examples

This directory contains standalone, copy-pasteable examples for integrating frontend frameworks into your **ASP.NET Core Razor Pages / Blazor SSR** applications with **LaughTale**.

---

## 📁 Available Examples

| Example | Framework | Size | Key Capabilities |
|---|---|---|---|
| **[`react-island/`](./react-island)** | **React 18 & 19** | Full | React Hooks (`useState`, `useEffect`), JSX Virtual DOM, slot projection, `AbortSignal` lifecycle teardown. |
| **[`vue-island/`](./vue-island)** | **Vue 3** | Full | Composition API (`ref`, `computed`), template reactivity, and `app.unmount()` cleanup. |
| **[`svelte-island/`](./svelte-island)** | **Svelte 4 & 5** | Minimal | Svelte 5 Runes, zero-virtual-DOM compiled speed, and `$destroy()` / `unmount()` handling. |
| **[`preact-island/`](./preact-island)** | **Preact** | **3 KB** | React-compatible virtual DOM for extreme bundle size and performance constraints. |
| **[`vanilla-island/`](./vanilla-island)** | **Vanilla TS** | **0 KB** | Raw Web APIs, zero dependencies, and instant synchronous execution. |

---

## ⚡ Running the Live Interactive Lab

You can see all 5 frameworks running concurrently on the same page in the live showcase:

```bash
# Run the Showcase app
dotnet run --project LaughTale.Showcase

# Navigate to the Polyglot Lab in your browser
# http://localhost:5000/polyglot
```

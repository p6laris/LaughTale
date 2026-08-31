---
title: Client-Side Composables & Hooks
description: Master LaughTale client composables — useVirtualizer, useFocusTrap, useEventListener, useTheme, useLocalStorage, and useDebounce.
order: 50
icon: zap
category: Framework Architecture
---

# 🪝 Client-Side Composables & Hooks

LaughTale includes a modular suite of lightweight TypeScript composables that you can use inside your custom islands or Vanilla components.

---

## 📋 Available Composables

### 1. `useVirtualizer` (100,000+ Row Virtual Scrolling)
Efficiently renders only visible DOM rows within a scrollable viewport:

```typescript
import { useVirtualizer } from 'laughtale';

const virtualizer = useVirtualizer({
    count: 100000,
    estimateSize: () => 48,
    getScrollElement: () => scrollContainer
});

virtualizer.getVirtualItems().forEach(item => {
    // Render item...
});
```

---

### 2. `useFocusTrap` (Modal Dialog Accessibility)
Traps keyboard tab navigation inside dialogs and drawers for WCAG 2.1 compliance:

```typescript
import { useFocusTrap } from 'laughtale';

const trap = useFocusTrap(modalElement);
trap.activate();

// Later when closing:
trap.deactivate();
```

---

### 3. `useTheme` (Dark Mode & Token Switching)
Programmatically inspect and toggle Dark/Light mode:

```typescript
import { useTheme } from 'laughtale';

const { isDark, toggleTheme, setPrimaryColor } = useTheme();

console.log('Current mode:', isDark.value ? 'Dark' : 'Light');
toggleTheme();
```

---

### 4. `useEventListener` & `useDebounce`
Safe event attachments and value debouncing:

```typescript
import { useEventListener, useDebounce } from 'laughtale';

useEventListener(window, 'resize', () => recalculate(), { signal: ctx.signal });
const debouncedSearch = useDebounce((query) => executeSearch(query), 300);
```

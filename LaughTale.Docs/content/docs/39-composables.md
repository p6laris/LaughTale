---
title: "Headless Composables & Animations"
description: "Framework-agnostic UI primitives: useDisclosure, useFocusTrap, useFloatingPosition, useSpring, and useAutoAnimate"
order: 39
section: "Composables & Architecture"
---

# Headless Composables & Animations

LaughTale provides a suite of **framework-agnostic headless primitives and composable animations** inspired by VueUse and Radix UI.

They separate **pure state and behavior logic** from markup and styling.

---

## 🧩 1. Headless UI Primitives

```typescript
import {
    useDisclosure,
    useFocusTrap,
    useFloatingPosition,
    useVirtualizer,
    useDragGesture,
    useHotkeys,
    useClickOutside,
    useScrollLock
} from '@softmax/islands';
```

### `useDisclosure`
Manages open/closed states for modals, drawers, dropdowns, and collapsible panels:
```typescript
const { isOpen, open, close, toggle, onChange } = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed')
});
```

### `useFocusTrap`
Accessible keyboard navigation trap for dialogs & sheets:
```typescript
const focusTrap = useFocusTrap(dialogElement, {
    autoFocus: true,
    restoreFocus: true
});

focusTrap.activate();
focusTrap.deactivate();
```

---

## ✨ 2. Composable Physics-Based Animations

```typescript
import { useSpring, useTransition, useAutoAnimate, useStagger } from '@softmax/islands';
```

### `useSpring`
Harmonic spring solver for fluid, momentum-driven interactions:
```typescript
const spring = useSpring(0, { stiffness: 180, damping: 24 });
spring.onUpdate((val) => {
    dialElement.style.transform = `rotate(${val}deg)`;
});
spring.set(90);
```

### `useAutoAnimate`
FLIP-based zero-config automatic layout animations:
```typescript
// Automatically animates children when items are added, deleted, or reordered!
useAutoAnimate(listContainer, { duration: 250 });
```

// ../SoftMax.LaughTale.Client/src/composables/useDisclosure.ts
function useDisclosure(options = {}) {
  let isOpen = Boolean(options.defaultIsOpen);
  const listeners = /* @__PURE__ */ new Set();
  function notify() {
    options.onToggle?.(isOpen);
    listeners.forEach((fn) => fn(isOpen));
  }
  function open() {
    if (!isOpen) {
      isOpen = true;
      options.onOpen?.();
      notify();
    }
  }
  function close() {
    if (isOpen) {
      isOpen = false;
      options.onClose?.();
      notify();
    }
  }
  function toggle() {
    if (isOpen) close();
    else open();
  }
  function setOpen(value) {
    if (value) open();
    else close();
  }
  function onChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  return {
    get isOpen() {
      return isOpen;
    },
    open,
    close,
    toggle,
    setOpen,
    onChange
  };
}

// ../SoftMax.LaughTale.Client/src/composables/useScrollLock.ts
var lockCount = 0;
var originalOverflow = "";
var originalPaddingRight = "";
function useScrollLock() {
  function lock() {
    if (typeof document === "undefined") return;
    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    lockCount++;
  }
  function unlock() {
    if (typeof document === "undefined") return;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    }
  }
  return { lock, unlock };
}

export {
  useDisclosure,
  useScrollLock
};
//# sourceMappingURL=chunk-ZZO6ZCC7.js.map

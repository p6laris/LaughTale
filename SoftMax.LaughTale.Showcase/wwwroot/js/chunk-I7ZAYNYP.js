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
  useScrollLock
};
//# sourceMappingURL=chunk-I7ZAYNYP.js.map

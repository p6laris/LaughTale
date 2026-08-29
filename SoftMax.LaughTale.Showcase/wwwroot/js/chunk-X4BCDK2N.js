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

// ../SoftMax.LaughTale.Client/src/composables/useClipboard.ts
function useClipboard(options = {}) {
  const timeout = options.timeout ?? 2e3;
  let isCopied = false;
  let timer = null;
  async function copy(text) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      isCopied = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        isCopied = false;
      }, timeout);
      return true;
    } catch {
      isCopied = false;
      return false;
    }
  }
  return {
    copy,
    get isCopied() {
      return isCopied;
    },
    destroy: () => {
      if (timer) clearTimeout(timer);
    }
  };
}

export {
  useScrollLock,
  useClipboard
};
//# sourceMappingURL=chunk-X4BCDK2N.js.map

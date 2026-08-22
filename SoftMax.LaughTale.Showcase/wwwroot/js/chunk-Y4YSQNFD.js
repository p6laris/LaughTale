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
  useClipboard
};
//# sourceMappingURL=chunk-Y4YSQNFD.js.map

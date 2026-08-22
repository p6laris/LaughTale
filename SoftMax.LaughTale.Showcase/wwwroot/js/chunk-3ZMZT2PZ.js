// ../SoftMax.LaughTale.Client/src/composables/useControllableState.ts
function useControllableState(options) {
  const isControlled = options.value !== void 0;
  let internalValue = options.defaultValue !== void 0 ? options.defaultValue : options.value;
  function getValue() {
    return isControlled ? options.value : internalValue;
  }
  function setValue(nextValue) {
    const resolved = typeof nextValue === "function" ? nextValue(getValue()) : nextValue;
    if (!isControlled) {
      internalValue = resolved;
    }
    options.onChange?.(resolved);
  }
  return [getValue, setValue];
}

export {
  useControllableState
};
//# sourceMappingURL=chunk-3ZMZT2PZ.js.map

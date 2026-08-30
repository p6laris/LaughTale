/**
 * LaughTale: Headless useControllableState Composable
 * Supports both controlled and uncontrolled component state with change notifications.
 */

export interface UseControllableStateOptions<T> {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
}

export function useControllableState<T>(options: UseControllableStateOptions<T>) {
    const isControlled = options.value !== undefined;
    let internalValue = options.defaultValue !== undefined ? options.defaultValue : options.value;

    function getValue(): T {
        return (isControlled ? options.value : internalValue) as T;
    }

    function setValue(nextValue: T | ((prev: T) => T)): void {
        const resolved = typeof nextValue === 'function' ? (nextValue as (prev: T) => T)(getValue()) : nextValue;

        if (!isControlled) {
            internalValue = resolved;
        }

        options.onChange?.(resolved);
    }

    return [getValue, setValue] as const;
}

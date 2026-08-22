/**
 * SoftMax.LaughTale: Composable useClipboard
 * Headless clipboard manager with copying state, reset timers, and fallback execution.
 */

export interface UseClipboardOptions {
    timeout?: number; // ms to keep copied state true
}

export function useClipboard(options: UseClipboardOptions = {}) {
    const timeout = options.timeout ?? 2000;
    let isCopied = false;
    let timer: any = null;

    async function copy(text: string): Promise<boolean> {
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else if (typeof document !== 'undefined') {
                // Fallback for non-secure contexts or legacy browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
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

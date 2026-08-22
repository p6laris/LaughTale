/**
 * SoftMax.LaughTale: Input Pattern Masking Directive (l-mask)
 * Automatically formats phone numbers, dates, credit cards, and postal codes on user input.
 */

export function bindInputMask(input: HTMLInputElement): void {
    const pattern = input.getAttribute('l-mask');
    if (!pattern) return;

    input.addEventListener('input', () => {
        const raw = input.value.replace(/[^a-zA-Z0-9]/g, '');
        let formatted = '';
        let rawIdx = 0;

        for (let i = 0; i < pattern.length && rawIdx < raw.length; i++) {
            const maskChar = pattern[i];

            if (maskChar === '9') {
                while (rawIdx < raw.length && !/\d/.test(raw[rawIdx])) rawIdx++;
                if (rawIdx < raw.length) formatted += raw[rawIdx++];
            } else if (maskChar === 'a') {
                while (rawIdx < raw.length && !/[a-zA-Z]/.test(raw[rawIdx])) rawIdx++;
                if (rawIdx < raw.length) formatted += raw[rawIdx++];
            } else if (maskChar === '*') {
                formatted += raw[rawIdx++];
            } else {
                formatted += maskChar;
                if (raw[rawIdx] === maskChar) rawIdx++;
            }
        }

        input.value = formatted;
    });
}

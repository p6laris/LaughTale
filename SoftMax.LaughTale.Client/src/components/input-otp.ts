/**
 * SoftMax.LaughTale: Enterprise OTP Verification Input Component (Aura InputOtp inspired)
 */

export interface InputOtpProps {
    targetInputName?: string;
    length?: number;
    mask?: boolean;
    disabled?: boolean;
}

export default function InputOtpIsland(container: HTMLElement, props: InputOtpProps) {
    const length = props.length || 6;
    let values: string[] = new Array(length).fill('');

    function render() {
        const boxes = Array.from({ length }, (_, i) => `
            <input type="${props.mask ? 'password' : 'text'}" 
                   class="otp-box otp-digit-input" 
                   data-index="${i}" 
                   maxlength="1" 
                   inputmode="numeric" 
                   pattern="[0-9]*" 
                   value="${values[i] || ''}" 
                   ${props.disabled ? 'disabled' : ''} 
                   style="width: 2.75rem; height: 3.25rem; text-align: center; font-size: 1.25rem; font-weight: 700; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); color: var(--p-text-color); outline: none; transition: all 0.15s ease;" />
        `).join('');

        container.innerHTML = `
            <div class="laughtale-input-otp" style="display: inline-flex; gap: 0.5rem; align-items: center;">
                ${boxes}
            </div>
        `;

        const inputs = container.querySelectorAll<HTMLInputElement>('.otp-box');

        inputs.forEach((input, idx) => {
            // Focus ring
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--p-primary-600)';
                input.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
                input.select();
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = 'var(--p-border-color)';
                input.style.boxShadow = 'none';
            });

            input.addEventListener('input', (e) => {
                const val = (e.target as HTMLInputElement).value;
                if (/^\d$/.test(val)) {
                    values[idx] = val;
                    if (idx < length - 1) inputs[idx + 1].focus();
                } else if (val === '') {
                    values[idx] = '';
                } else {
                    input.value = values[idx] || '';
                }
                syncOtp();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && idx > 0) {
                    inputs[idx - 1].focus();
                } else if (e.key === 'ArrowLeft' && idx > 0) {
                    inputs[idx - 1].focus();
                } else if (e.key === 'ArrowRight' && idx < length - 1) {
                    inputs[idx + 1].focus();
                }
            });

            // Paste code handler (e.g. paste "123456")
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || (window as any).clipboardData)?.getData('text') || '';
                const digits = paste.replace(/\D/g, '').slice(0, length);
                digits.split('').forEach((d: string, i: number) => {
                    values[i] = d;
                    if (inputs[i]) inputs[i].value = d;
                });
                syncOtp();
                if (digits.length === length) {
                    inputs[length - 1].focus();
                }
            });
        });
    }

    function syncOtp() {
        const fullCode = values.join('');
        if (props.targetInputName) {
            let hidden = document.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = fullCode;
        }

        container.dispatchEvent(new CustomEvent('otp:change', {
            bubbles: true,
            detail: { value: fullCode, isComplete: fullCode.length === length }
        }));
    }

    render();
    syncOtp();
}

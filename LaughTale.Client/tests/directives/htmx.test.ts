import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bindServerAction } from '../../src/directives/htmx.ts';

// A plain button (not a real <form> submit) deliberately throughout this file - htmx.ts's
// FORM-specific branch builds a FormData from the element, and happy-dom's FormData/HTMLFormElement
// interop doesn't support that construction in this test environment (see directives.test.ts's
// identical, pre-existing note on the same limitation). Binding to the button and triggering its
// default 'click' path avoids that branch entirely while still exercising the same
// closest('form')-based submit-control disabling this suite is testing.
describe('Server Fragment Action Engine Suite (ROADMAP.v5.md Part F - submit state)', () => {
    it('disables submit controls for the duration of the request and re-enables them afterward', async () => {
        document.body.innerHTML = `
            <form id="f">
                <button type="submit" id="other-btn">Other</button>
                <button id="btn" l-post="/submit" l-target="#btn" l-swap="none">Save</button>
            </form>
        `;
        const btn = document.getElementById('btn') as HTMLButtonElement;
        const otherBtn = document.getElementById('other-btn') as HTMLButtonElement;
        bindServerAction(btn);

        const originalFetch = globalThis.fetch;
        let resolveFetch: (v: any) => void;
        (globalThis as any).fetch = () => new Promise((resolve) => { resolveFetch = resolve; });

        try {
            btn.click();
            await new Promise((r) => setTimeout(r, 0));

            assert.equal(btn.disabled, true, 'The triggering button must be disabled while the request is in flight');
            assert.equal(otherBtn.disabled, true, 'Every submit control in the same form must be disabled, not just the triggering one');

            resolveFetch!({ text: async () => '' });
            await new Promise((r) => setTimeout(r, 0));
            await new Promise((r) => setTimeout(r, 0));

            assert.equal(btn.disabled, false, 'Must be re-enabled once the request completes');
            assert.equal(otherBtn.disabled, false, 'Must be re-enabled once the request completes');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it('does not re-enable a submit control that was already disabled before the request', async () => {
        document.body.innerHTML = `
            <form id="f2">
                <button type="submit" id="other-btn2" disabled>Other</button>
                <button id="btn2" l-post="/submit" l-target="#btn2" l-swap="none">Save</button>
            </form>
        `;
        const btn = document.getElementById('btn2') as HTMLButtonElement;
        const otherBtn = document.getElementById('other-btn2') as HTMLButtonElement;
        bindServerAction(btn);

        const originalFetch = globalThis.fetch;
        (globalThis as any).fetch = async () => ({ text: async () => '' });

        try {
            btn.click();
            await new Promise((r) => setTimeout(r, 0));
            await new Promise((r) => setTimeout(r, 0));

            assert.equal(otherBtn.disabled, true, 'A control that was already disabled must stay disabled');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it('sets data-lt-submitting on both the closest form and the triggering element, clearing it on completion', async () => {
        document.body.innerHTML = `
            <form id="f3">
                <button id="btn3" l-post="/submit" l-target="#btn3" l-swap="none">Save</button>
            </form>
        `;
        const form = document.getElementById('f3') as HTMLFormElement;
        const btn = document.getElementById('btn3') as HTMLButtonElement;
        bindServerAction(btn);

        const originalFetch = globalThis.fetch;
        let resolveFetch: (v: any) => void;
        (globalThis as any).fetch = () => new Promise((resolve) => { resolveFetch = resolve; });

        try {
            btn.click();
            await new Promise((r) => setTimeout(r, 0));
            assert.equal(form.getAttribute('data-lt-submitting'), 'true');
            assert.equal(btn.getAttribute('data-lt-submitting'), 'true');

            resolveFetch!({ text: async () => '' });
            await new Promise((r) => setTimeout(r, 0));
            await new Promise((r) => setTimeout(r, 0));

            assert.equal(form.hasAttribute('data-lt-submitting'), false, 'data-lt-submitting must be cleared on the form after the request settles');
            assert.equal(btn.hasAttribute('data-lt-submitting'), false, 'data-lt-submitting must be cleared on the triggering element after the request settles');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});

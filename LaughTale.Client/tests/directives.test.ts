import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { initDirectives } from '../src/directives/index.ts';

describe('LaughTale Declarative Directives Suite', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
        sessionStorage.clear();
    });

    it('should initialize reactive state with l-state and update l-bind', async () => {
        document.body.innerHTML = `
            <div id="scope" l-state='{ "count": 10 }'>
                <span id="counter" l-bind="count">0</span>
                <button id="btn" l-on:click="count++">Increment</button>
            </div>
        `;

        initDirectives(document.body);
        await new Promise(r => setTimeout(r, 10));

        const counter = document.getElementById('counter')!;
        const btn = document.getElementById('btn')!;

        assert.strictEqual(counter.textContent, '10');

        btn.click();
        await new Promise(r => setTimeout(r, 10));

        assert.strictEqual(counter.textContent, '11');
    });

    it('should handle two-way data binding with l-model', async () => {
        document.body.innerHTML = `
            <div l-state='{ "username": "Alice" }'>
                <input id="inp" type="text" l-model="username" />
                <span id="display" l-bind="username"></span>
            </div>
        `;

        initDirectives(document.body);
        await new Promise(r => setTimeout(r, 10));

        const inp = document.getElementById('inp') as HTMLInputElement;
        const display = document.getElementById('display')!;

        assert.strictEqual(inp.value, 'Alice');
        assert.strictEqual(display.textContent, 'Alice');

        inp.value = 'Bob';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 10));

        assert.strictEqual(display.textContent, 'Bob');
    });

    it('should persist and load state from localStorage with l-persist', async () => {
        localStorage.setItem('user_test_prefs', JSON.stringify({ theme: 'dark', zoom: 120 }));

        document.body.innerHTML = `
            <div l-state='{ "theme": "light", "zoom": 100 }' l-persist="user_test_prefs">
                <span id="theme-text" l-bind="theme"></span>
            </div>
        `;

        initDirectives(document.body);
        await new Promise(r => setTimeout(r, 10));

        const themeText = document.getElementById('theme-text')!;
        assert.strictEqual(themeText.textContent, 'dark');
    });

    it('should toggle conditional visibility with l-show and l-hide', async () => {
        document.body.innerHTML = `
            <div l-state='{ "visible": false }'>
                <div id="show-box" l-show="visible">Box</div>
                <div id="hide-box" l-hide="visible">Hidden</div>
                <button id="toggle-btn" l-on:click="visible = true">Show</button>
            </div>
        `;

        initDirectives(document.body);
        await new Promise(r => setTimeout(r, 10));

        const showBox = document.getElementById('show-box')!;
        const hideBox = document.getElementById('hide-box')!;
        const toggleBtn = document.getElementById('toggle-btn')!;

        assert.strictEqual(showBox.style.display, 'none');
        assert.strictEqual(hideBox.style.display, '');

        toggleBtn.click();
        await new Promise(r => setTimeout(r, 10));

        assert.strictEqual(showBox.style.display, '');
        assert.strictEqual(hideBox.style.display, 'none');
    });

    it('should trigger hotkeys globally with l-hotkey', async () => {
        let hotkeyTriggered = false;

        document.body.innerHTML = `
            <div l-state='{ "saved": false }'>
                <button id="save-btn" l-hotkey="Ctrl+S" l-on:hotkey="saved = true">Save</button>
                <span id="status" l-bind="saved ? 'Saved' : 'Pending'"></span>
            </div>
        `;

        initDirectives(document.body);
        await new Promise(r => setTimeout(r, 10));

        // Dispatch Ctrl+S on window
        window.dispatchEvent(new KeyboardEvent('keydown', {
            key: 's',
            ctrlKey: true,
            bubbles: true
        }));

        await new Promise(r => setTimeout(r, 10));
        const status = document.getElementById('status')!;
        assert.strictEqual(status.textContent, 'Saved');
    });

    it('should attach status badges with l-badge', async () => {
        document.body.innerHTML = `
            <button id="alert-btn" l-badge="5" l-badge.danger>Notifications</button>
        `;

        initDirectives(document.body);
        await new Promise(r => setTimeout(r, 10));

        const badge = document.querySelector('.aura-directive-badge') as HTMLElement;
        assert.ok(badge, 'Badge element should be created');
        assert.strictEqual(badge.textContent, '5');
        assert.ok(badge.classList.contains('badge-danger'));
    });

    it('should handle pattern masking with l-mask', async () => {
        document.body.innerHTML = `
            <input id="phone" type="text" l-mask="(999) 999-9999" />
        `;

        initDirectives(document.body);
        await new Promise(r => setTimeout(r, 10));

        const input = document.getElementById('phone') as HTMLInputElement;
        input.value = '5551234567';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        assert.strictEqual(input.value, '(555) 123-4567');
    });

    it('calling initDirectives() twice binds l-post twice - the underlying property that made this module\'s former auto-run-on-import side effect dangerous (ROADMAP.v5.md Part G/L)', async () => {
        // This file's own former "Auto-run on DOM ready" block (removed - see the comment left in
        // its place in src/directives/index.ts) called initDirectives() automatically whenever this
        // module was imported, IN ADDITION TO every consuming app's own explicit call - found via a
        // real live-browser test of a real <island-form> Server Action, where a single genuine form
        // submit fired two independent fetch() calls. A Node/happy-dom test can't faithfully
        // reproduce THAT exact failure mode (document.readyState/DOMContentLoaded timing here
        // doesn't match a real browser closely enough - which is exactly why nothing in this test
        // suite caught the real bug). What IS provable here, and is the actual reason the fix
        // matters: initDirectives() has no idempotency guard at all, so ANY duplicate call -
        // whether from a redundant auto-run or a caller invoking it twice by accident - double-binds
        // every directive it finds. Removing the redundant automatic call was correct specifically
        // because it eliminates the one duplicate call every real consumer was unknowingly making.
        // A plain button (not a <form>) deliberately - htmx.ts's FORM-specific branch builds a
        // FormData from the element, and happy-dom's FormData/HTMLFormElement interop doesn't
        // support that construction in this test environment (a real, separate environment
        // limitation, not a product bug - confirmed by the identical construction working fine in
        // the real live-browser verification of the actual Server Actions feature). A button falls
        // through to the (identical, unaffected-by-that-limitation) default 'click'-triggered path,
        // which is all that's needed to prove the double-binding property under test here.
        document.body.innerHTML = `
            <button id="action-btn" l-post="/api/test" l-target="#action-btn" l-swap="none">Go</button>
        `;

        let fetchCallCount = 0;
        const originalFetch = globalThis.fetch;
        (globalThis as any).fetch = async () => {
            fetchCallCount++;
            return { text: async () => '' } as Response;
        };

        try {
            const button = document.getElementById('action-btn') as HTMLButtonElement;

            initDirectives(document.body);
            initDirectives(document.body); // the exact shape of the bug: a second, redundant call

            button.click();
            await new Promise(r => setTimeout(r, 10));

            assert.strictEqual(fetchCallCount, 2, 'two initDirectives() calls must produce two bound click listeners - proving why the redundant automatic call had to go, not just the explicit one apps already made correctly');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});

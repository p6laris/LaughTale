import { test, expect } from '@playwright/test';

test.describe('Native Form Association: no-script conformance (SC-001)', () => {
    test.use({ javaScriptEnabled: false });

    test('no-script form posts all 29 fields with model values without JavaScript', async ({ page }) => {
        // Navigate to the conformance fixture page
        await page.goto('/form-conformance');

        const form = page.locator('#conformance-form');
        await expect(form).toBeVisible();

        // 1. Initial DOM check: the 29 controls should have server-rendered form fields
        const serverFields = form.locator('[data-lt-field]');
        const renderedCount = await serverFields.count();

        // 2. Submit form with native HTTP POST (no JavaScript active)
        const [postRequest] = await Promise.all([
            page.waitForRequest(req => req.method() === 'POST' && req.url().includes('/form-conformance')),
            page.click('#submit-btn'),
        ]);

        const postData = postRequest.postData() || '';
        const params = new URLSearchParams(postData);

        // Expected in-scope controls (exactly 29)
        const expectedFields = [
            'InputText',
            'Textarea',
            'InputPassword',
            'InputNumber',
            'InputMask',
            'InputOtp',
            'InputTags',
            'ColorPicker',
            'Knob',
            'Rating',
            'Checkbox',
            'RadioButton',
            'ToggleSwitch',
            'ToggleButton',
            'SelectButton',
            'Select',
            'MultiSelect',
            'Listbox',
            'CascadeSelect',
            'TreeSelect',
            'AutoComplete',
            'DatePicker',
            'Slider',
            'OrderList',
            'PickList',
            'OrgChart',
            'Paginator',
            'Dropzone',
            'Inplace'
        ];

        let presentCount = 0;
        const missingFields: string[] = [];
        for (const field of expectedFields) {
            if (params.has(field)) {
                presentCount++;
            } else {
                missingFields.push(field);
            }
        }

        // At this phase, without [FormControl] on the props records,
        // Assert that all 29 controls contribute fields to the POST
        expect(presentCount, `Expected 29 controls in POST payload, but found ${presentCount}. Missing: ${missingFields.join(', ')}`).toBe(29);
    });
});

test.describe('Native Form Association: hydration & idempotence (US2)', () => {
    test.use({ javaScriptEnabled: true });

    test('refresh: 50 in-place island refreshes leave exactly one field per control (plus companion where Boolean)', async ({ page }) => {
        // 50 x 29 = 1,450 sequential awaited rehydrateIsland() calls in one page.evaluate - this is
        // real, legitimately heavy work, not a hang. The default 30s test timeout was never actually
        // exercised in CI until this repo's first real Playwright CI run (see ROADMAP.v5.md Part C /
        // the CI-pipeline fix): WebKit's Linux port is measurably slower than Chromium/Firefox for
        // this many sequential DOM/event-loop round-trips under a shared CI runner's resource
        // constraints, and consistently exceeded 30s there while comfortably passing elsewhere.
        test.setTimeout(90_000);

        await page.goto('/form-conformance');

        const form = page.locator('#conformance-form');
        await expect(form).toBeVisible();

        // Wait for hydration to initialize
        await page.waitForFunction(() => (window as any).LaughTale !== undefined);

        // Perform 50 in-place island refreshes on all 29 form controls
        await page.evaluate(async () => {
            const islands = Array.from(document.querySelectorAll<HTMLElement>('#conformance-form [data-island]'));
            for (let i = 0; i < 50; i++) {
                for (const island of islands) {
                    await (window as any).LaughTale.rehydrateIsland(island);
                }
            }
        });

        const expectedControls = [
            { id: 'ctrl-input-text', name: 'InputText', boolean: false, count: 1 },
            { id: 'ctrl-textarea', name: 'Textarea', boolean: false, count: 1 },
            { id: 'ctrl-input-password', name: 'InputPassword', boolean: false, count: 1 },
            { id: 'ctrl-input-number', name: 'InputNumber', boolean: false, count: 1 },
            { id: 'ctrl-input-mask', name: 'InputMask', boolean: false, count: 1 },
            { id: 'ctrl-input-otp', name: 'InputOtp', boolean: false, count: 1 },
            { id: 'ctrl-input-tags', name: 'InputTags', boolean: false, count: 2 },
            { id: 'ctrl-color-picker', name: 'ColorPicker', boolean: false, count: 1 },
            { id: 'ctrl-knob', name: 'Knob', boolean: false, count: 1 },
            { id: 'ctrl-rating', name: 'Rating', boolean: false, count: 1 },
            { id: 'ctrl-checkbox', name: 'Checkbox', boolean: true, count: 1 },
            { id: 'ctrl-radio-button', name: 'RadioButton', boolean: true, count: 1 },
            { id: 'ctrl-toggle-switch', name: 'ToggleSwitch', boolean: true, count: 1 },
            { id: 'ctrl-toggle-button', name: 'ToggleButton', boolean: true, count: 1 },
            { id: 'ctrl-select-button', name: 'SelectButton', boolean: false, count: 2 },
            { id: 'ctrl-select', name: 'Select', boolean: false, count: 1 },
            { id: 'ctrl-multiselect', name: 'MultiSelect', boolean: false, count: 2 },
            { id: 'ctrl-listbox', name: 'Listbox', boolean: false, count: 1 },
            { id: 'ctrl-cascade-select', name: 'CascadeSelect', boolean: false, count: 1 },
            { id: 'ctrl-tree-select', name: 'TreeSelect', boolean: false, count: 1 },
            { id: 'ctrl-autocomplete', name: 'AutoComplete', boolean: false, count: 1 },
            { id: 'ctrl-datepicker', name: 'DatePicker', boolean: false, count: 1 },
            { id: 'ctrl-slider', name: 'Slider', boolean: false, count: 2 },
            { id: 'ctrl-orderlist', name: 'OrderList', boolean: false, count: 3 },
            { id: 'ctrl-picklist', name: 'PickList', boolean: false, count: 2 },
            { id: 'ctrl-orgchart', name: 'OrgChart', boolean: false, count: 1 },
            { id: 'ctrl-paginator', name: 'Paginator', boolean: false, count: 1 },
            { id: 'ctrl-dropzone', name: 'Dropzone', boolean: false, count: 1 },
            { id: 'ctrl-inplace', name: 'Inplace', boolean: false, count: 1 }
        ];

        // Assert expected fields per control (plus companion where boolean), and data-lt-ssr-hydrated="true"
        for (const ctrl of expectedControls) {
            const expectedCount = ctrl.count ?? 1;
            const island = form.locator(`#${ctrl.id}`);
            const field = island.locator('[data-lt-field]');
            await expect(field, `Control ${ctrl.name} must have ${expectedCount} field(s) with [data-lt-field]`).toHaveCount(expectedCount);
            for (let i = 0; i < expectedCount; i++) {
                await expect(field.nth(i), `Control ${ctrl.name} field[${i}] must have data-lt-ssr-hydrated="true"`).toHaveAttribute('data-lt-ssr-hydrated', 'true');
            }

            if (ctrl.boolean) {
                const companion = island.locator('[data-lt-field-companion]');
                await expect(companion, `Boolean control ${ctrl.name} must have exactly one companion with [data-lt-field-companion]`).toHaveCount(1);
            }
        }
    });

    test('teardown: after island teardown no field belonging to it remains in the document (FR-011)', async ({ page }) => {
        await page.goto('/form-conformance');

        const form = page.locator('#conformance-form');
        await expect(form).toBeVisible();

        await page.waitForFunction(() => (window as any).LaughTale !== undefined);

        const testControls = [
            { id: 'ctrl-input-text', name: 'InputText' },
            { id: 'ctrl-inplace', name: 'Inplace' },
            { id: 'ctrl-checkbox', name: 'Checkbox' }
        ];

        for (const ctrl of testControls) {
            await page.evaluate((id) => {
                const island = document.getElementById(id);
                if (island) {
                    (window as any).LaughTale.teardownIsland(island);
                    island.remove();
                }
            }, ctrl.id);

            const remaining = page.locator(`[name="${ctrl.name}"]`);
            await expect(remaining, `Field for ${ctrl.name} must not outlive torn-down island`).toHaveCount(0);
        }
    });
});

test.describe('Native Form Association: interactive & submitted parity (US3)', () => {
    test('parity: no-script and hydrated form submission produce identical FormData (FR-014)', async ({ browser }) => {
        // 1. Submit with no JavaScript
        const noJsContext = await browser.newContext({ javaScriptEnabled: false });
        const noJsPage = await noJsContext.newPage();
        await noJsPage.goto('/form-conformance');
        const [noJsReq] = await Promise.all([
            noJsPage.waitForRequest(req => req.method() === 'POST' && req.url().includes('/form-conformance')),
            noJsPage.click('#submit-btn'),
        ]);
        const noJsData = new URLSearchParams(noJsReq.postData() || '');
        await noJsContext.close();

        // 2. Submit with JavaScript enabled (hydrated)
        const jsContext = await browser.newContext({ javaScriptEnabled: true });
        const jsPage = await jsContext.newPage();
        await jsPage.goto('/form-conformance');
        await jsPage.waitForFunction(() => (window as any).LaughTale !== undefined);
        const [jsReq] = await Promise.all([
            jsPage.waitForRequest(req => req.method() === 'POST' && req.url().includes('/form-conformance')),
            jsPage.click('#submit-btn'),
        ]);
        const jsData = new URLSearchParams(jsReq.postData() || '');
        await jsContext.close();

        // 3. Diff the two sets of parameters key-for-key and value-for-value
        const allKeys = Array.from(new Set([...noJsData.keys(), ...jsData.keys()])).filter(k => k !== '__RequestVerificationToken');
        expect(allKeys.length).toBeGreaterThanOrEqual(29);

        for (const key of allKeys) {
            const noJsValues = noJsData.getAll(key).sort();
            const jsValues = jsData.getAll(key).sort();
            expect(jsValues, `Field '${key}' mismatch between no-JS and hydrated`).toEqual(noJsValues);
        }
    });

    test('reset: form reset restores controls to server-rendered values in submitted data and DOM (FR-015)', async ({ page }) => {
        await page.goto('/form-conformance');
        await page.waitForFunction(() => (window as any).LaughTale !== undefined);

        const form = page.locator('#conformance-form');
        await expect(form).toBeVisible();

        // 1. Mutate a text control
        const textInput = page.locator('#ctrl-input-text input.p-inputtext');
        await textInput.fill('Mutated Input Text');
        await expect(textInput).toHaveValue('Mutated Input Text');

        // 2. Mutate an inplace control
        const inplaceDisplay = page.locator('#ctrl-inplace .p-inplace-display');
        await inplaceDisplay.click();
        const inplaceInput = page.locator('#ctrl-inplace .p-inplace-input');
        await inplaceInput.fill('Mutated Inplace Text');
        await page.click('#ctrl-inplace .p-inplace-save-btn');

        // 3. Verify mutated values in hidden fields
        const textHidden = page.locator('#ctrl-input-text input[name="InputText"]');
        await expect(textHidden).toHaveValue('Mutated Input Text');

        const inplaceHidden = page.locator('#ctrl-inplace input[name="Inplace"]');
        await expect(inplaceHidden).toHaveValue('Mutated Inplace Text');

        // 4. Trigger native form reset
        await page.evaluate(() => {
            const f = document.querySelector<HTMLFormElement>('#conformance-form');
            f?.reset();
        });

        // 5. Assert fields in DOM restored to server-rendered initial values
        await expect(textHidden).toHaveValue('LaughTale Conformance Text');
        await expect(inplaceHidden).toHaveValue('Inplace Text Value');

        // 6. Submit form and verify submitted payload matches initial values
        const [postRequest] = await Promise.all([
            page.waitForRequest(req => req.method() === 'POST' && req.url().includes('/form-conformance')),
            page.click('#submit-btn'),
        ]);

        const postData = new URLSearchParams(postRequest.postData() || '');
        expect(postData.get('InputText')).toBe('LaughTale Conformance Text');
        expect(postData.get('Inplace')).toBe('Inplace Text Value');
    });
});

test.describe('Native Form Association: edge cases (T035)', () => {
    test.use({ javaScriptEnabled: true });

    test('edge cases: duplicate resolved names, old delimiter preservation, control outside form, late hydration, and unparseable values', async ({ page }) => {
        await page.goto('/form-conformance');
        await page.waitForFunction(() => (window as any).LaughTale !== undefined);

        // 1. Duplicate resolved names:
        // Two controls (#ctrl-edge-dup-1 and #ctrl-edge-dup-2) share name "DuplicateField".
        // Both fields exist in DOM and neither is overwritten by the other.
        const dupFields = page.locator('#edge-cases-form [name="DuplicateField"]');
        await expect(dupFields).toHaveCount(2);

        // 2. Control outside any form (#ctrl-edge-outside):
        // Hydrates cleanly without parent form; field is present with model value.
        const outsideField = page.locator('#ctrl-edge-outside [data-lt-field]');
        await expect(outsideField).toHaveCount(1);
        await expect(outsideField).toHaveValue('Outside Form Value');

        // 3. Value containing old delimiter (#ctrl-edge-delimiter):
        // Multi-value tags contain commas ("tag,with,comma", "another,tag").
        // Emitted as repeated fields, never joined by comma.
        const delimiterFields = page.locator('#edge-cases-form [name="DelimiterTags"]');
        await expect(delimiterFields).toHaveCount(2);

        // 4. Server value client cannot represent (#ctrl-edge-unparseable):
        // Server rendered "completely-invalid-date-xyz". Hydration does not clear or corrupt it.
        const unparseableField = page.locator('#edge-cases-form [name="UnparseableDate"]');
        await expect(unparseableField).toHaveValue('completely-invalid-date-xyz');

        // 5. Late hydration / field submittable throughout (#ctrl-edge-late-hydrate):
        // Field exists with server initial value throughout lifecycle.
        const lateHydrateField = page.locator('#edge-cases-form [name="LateHydrateText"]');
        await expect(lateHydrateField).toHaveValue('LateHydrateInitial');

        // Submit edge-cases form and verify submitted payload
        const [postRequest] = await Promise.all([
            page.waitForRequest(req => req.method() === 'POST' && req.url().includes('/form-conformance')),
            page.click('#edge-submit-btn'),
        ]);

        const postData = new URLSearchParams(postRequest.postData() || '');

        // 1. Both duplicate values present in submitted payload
        const dupValues = postData.getAll('DuplicateField');
        expect(dupValues).toEqual(['FirstDuplicate', 'SecondDuplicate']);

        // 2. Outside form field NOT submitted with edge-cases-form
        expect(postData.has('OutsideFormText')).toBe(false);

        // 3. Values with embedded commas preserved without splitting or loss
        const delimValues = postData.getAll('DelimiterTags');
        expect(delimValues).toEqual(['tag,with,comma', 'another,tag']);

        // 4. Unparseable server value submitted intact
        expect(postData.get('UnparseableDate')).toBe('completely-invalid-date-xyz');

        // 5. Late hydrate value submitted intact
        expect(postData.get('LateHydrateText')).toBe('LateHydrateInitial');
    });
});



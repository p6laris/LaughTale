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
            { id: 'ctrl-input-text', name: 'InputText', boolean: false },
            { id: 'ctrl-textarea', name: 'Textarea', boolean: false },
            { id: 'ctrl-input-password', name: 'InputPassword', boolean: false },
            { id: 'ctrl-input-number', name: 'InputNumber', boolean: false },
            { id: 'ctrl-input-mask', name: 'InputMask', boolean: false },
            { id: 'ctrl-input-otp', name: 'InputOtp', boolean: false },
            { id: 'ctrl-input-tags', name: 'InputTags', boolean: false },
            { id: 'ctrl-color-picker', name: 'ColorPicker', boolean: false },
            { id: 'ctrl-knob', name: 'Knob', boolean: false },
            { id: 'ctrl-rating', name: 'Rating', boolean: false },
            { id: 'ctrl-checkbox', name: 'Checkbox', boolean: true },
            { id: 'ctrl-radio-button', name: 'RadioButton', boolean: true },
            { id: 'ctrl-toggle-switch', name: 'ToggleSwitch', boolean: true },
            { id: 'ctrl-toggle-button', name: 'ToggleButton', boolean: true },
            { id: 'ctrl-select-button', name: 'SelectButton', boolean: false },
            { id: 'ctrl-select', name: 'Select', boolean: false },
            { id: 'ctrl-multiselect', name: 'MultiSelect', boolean: false },
            { id: 'ctrl-listbox', name: 'Listbox', boolean: false },
            { id: 'ctrl-cascade-select', name: 'CascadeSelect', boolean: false },
            { id: 'ctrl-tree-select', name: 'TreeSelect', boolean: false },
            { id: 'ctrl-autocomplete', name: 'AutoComplete', boolean: false },
            { id: 'ctrl-datepicker', name: 'DatePicker', boolean: false },
            { id: 'ctrl-slider', name: 'Slider', boolean: false },
            { id: 'ctrl-orderlist', name: 'OrderList', boolean: false },
            { id: 'ctrl-picklist', name: 'PickList', boolean: false },
            { id: 'ctrl-orgchart', name: 'OrgChart', boolean: false },
            { id: 'ctrl-paginator', name: 'Paginator', boolean: false },
            { id: 'ctrl-dropzone', name: 'Dropzone', boolean: false },
            { id: 'ctrl-inplace', name: 'Inplace', boolean: false }
        ];

        // Assert exactly one field per control (plus companion where boolean), and data-lt-ssr-hydrated="true"
        for (const ctrl of expectedControls) {
            const island = form.locator(`#${ctrl.id}`);
            const field = island.locator('[data-lt-field]');
            await expect(field, `Control ${ctrl.name} must have exactly one field with [data-lt-field]`).toHaveCount(1);
            await expect(field, `Control ${ctrl.name} field must have data-lt-ssr-hydrated="true"`).toHaveAttribute('data-lt-ssr-hydrated', 'true');

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



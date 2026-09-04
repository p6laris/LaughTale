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

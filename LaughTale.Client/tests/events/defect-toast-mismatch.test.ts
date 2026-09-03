import { describe, it } from 'node:test';
import assert from 'node:assert';
import '../setup';
import TieredMenuIsland from '../../src/components/tieredmenu';
import ToastIsland from '../../src/components/toast';

describe('Defect 2 Reproduction: TieredMenu to Toast Event Target Mismatch (T007)', () => {
    it('tieredmenu export dispatches to window, toast listens on document: toast does not receive event', () => {
        const toastContainer = document.createElement('div');
        document.body.appendChild(toastContainer);
        ToastIsland(toastContainer, {});

        let documentReceivedToast = false;
        let windowReceivedToast = false;

        document.addEventListener('toast:show', () => {
            documentReceivedToast = true;
        });
        window.addEventListener('toast:show', () => {
            windowReceivedToast = true;
        });

        const menuContainer = document.createElement('div');
        document.body.appendChild(menuContainer);
        TieredMenuIsland(menuContainer, {
            model: [
                { label: 'Export', icon: 'upload', command: 'upload' }
            ]
        });

        // Click the Export item
        const exportItem = menuContainer.querySelector<HTMLElement>('.p-tieredmenu-item-link');
        assert.ok(exportItem, 'Export item must exist');
        exportItem.click();

        console.log(`[Defect 2] windowReceivedToast: ${windowReceivedToast}, documentReceivedToast: ${documentReceivedToast}`);
        
        // Window received it because tieredmenu dispatched to window
        assert.strictEqual(windowReceivedToast, true, 'window should receive the event');
        // Document did NOT receive it because dispatching to window does not reach document
        assert.strictEqual(documentReceivedToast, false, 'document should NOT receive the event due to target mismatch');

        // Toast container DOM did not render any toast message
        const toastMsg = toastContainer.querySelector('.p-toast-message');
        assert.strictEqual(toastMsg, null, 'no toast message appears in toast container');

        document.body.removeChild(toastContainer);
        document.body.removeChild(menuContainer);
    });
});

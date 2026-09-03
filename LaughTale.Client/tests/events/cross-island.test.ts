import { describe, it } from 'node:test';
import assert from 'node:assert';
import '../setup';
import TieredMenuIsland from '../../src/components/tieredmenu';
import ToastIsland from '../../src/components/toast';

describe('Cross-Island Bus Communication Suite (T038)', () => {
    it('toast appears when tieredmenu triggers export action via island bus', () => {
        const toastContainer = document.createElement('div');
        document.body.appendChild(toastContainer);
        ToastIsland(toastContainer, {});

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

        // Check if toast message appeared
        const toastMsg = toastContainer.querySelector('.p-toast-message');
        assert.ok(toastMsg, 'toast message must appear in DOM when tieredmenu exports');

        document.body.removeChild(toastContainer);
        document.body.removeChild(menuContainer);
    });
});

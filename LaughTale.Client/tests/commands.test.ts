/**
 * LaughTale: Client Command Registry & Action Handling Tests (LT-102)
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
    registerCommand,
    unregisterCommand,
    getCommand,
    executeCommand,
    clearCommands,
    listCommands
} from '../src/runtime/commands.ts';

import SpeedDialIsland from '../src/components/speed-dial.ts';
import SplitButtonIsland from '../src/components/split-button.ts';

describe('Client Command Registry & Component Action Suite (LT-102)', () => {

    beforeEach(() => {
        clearCommands();
        document.body.innerHTML = '';
    });

    it('registerCommand and executeCommand: executes named handler with payload', () => {
        let executedPayload: any = null;
        registerCommand('exportPdf', (item) => {
            executedPayload = item;
        });

        assert.equal(getCommand('exportPdf') !== undefined, true);
        assert.deepEqual(listCommands(), ['exportPdf']);

        const success = executeCommand('exportPdf', { id: 123, label: 'Download' });
        assert.equal(success, true);
        assert.deepEqual(executedPayload, { id: 123, label: 'Download' });
    });

    it('unregisterCommand: removes command from registry', () => {
        registerCommand('deleteRecord', () => {});
        assert.equal(unregisterCommand('deleteRecord'), true);
        assert.equal(getCommand('deleteRecord'), undefined);
        assert.equal(executeCommand('deleteRecord'), false);
    });

    it('executeCommand fallback: unknown command safely no-ops', () => {
        const success = executeCommand('nonExistentCommand', { data: 'test' });
        assert.equal(success, false);
    });

    it('executeCommand: handles runtime errors in handler gracefully', () => {
        registerCommand('brokenHandler', () => {
            throw new Error('Explosion inside handler');
        });

        const success = executeCommand('brokenHandler');
        assert.equal(success, false);
    });

    it('Security: malicious JS string in command key is treated purely as lookup key and never evaluated', () => {
        const attackVectors = [
            'alert(document.cookie)',
            'window.location = "http://evil.com"',
            '() => { return globalThis; }',
            '[].constructor.constructor("return process")()'
        ];

        for (const attack of attackVectors) {
            const success = executeCommand(attack, { label: 'Injected' });
            assert.equal(success, false);
        }
    });

    it('SpeedDial: executes registered command on action click', () => {
        let actionTriggered: any = null;
        registerCommand('speedDialAction', (item) => {
            actionTriggered = item;
        });

        const container = document.createElement('div');
        document.body.appendChild(container);

        SpeedDialIsland(container, {
            model: [
                { id: '1', label: 'Save', command: 'speedDialAction' }
            ]
        });

        const actionBtn = container.querySelector<HTMLElement>('.p-speeddial-action');
        assert.ok(actionBtn);
        actionBtn.click();

        assert.ok(actionTriggered);
        assert.equal(actionTriggered.label, 'Save');
    });

    it('SplitButton: executes registered command on menu item click', () => {
        let splitActionTriggered: any = null;
        registerCommand('splitAction', (item) => {
            splitActionTriggered = item;
        });

        const container = document.createElement('div');
        document.body.appendChild(container);

        SplitButtonIsland(container, {
            label: 'Save',
            model: [
                { label: 'Export', command: 'splitAction' }
            ]
        });

        const dropdownBtn = container.querySelector<HTMLElement>('.p-splitbutton-dropdown');
        assert.ok(dropdownBtn);
        dropdownBtn.click();

        const menuItems = container.querySelectorAll<HTMLElement>('.p-menu-item-link');
        assert.ok(menuItems.length > 0);
        menuItems[0].click();

        assert.ok(splitActionTriggered);
        assert.equal(splitActionTriggered.label, 'Export');
    });
});

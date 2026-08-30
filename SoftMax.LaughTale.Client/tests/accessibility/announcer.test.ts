import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    announce,
    clearAnnouncements,
    getAnnouncerElement
} from '../../src/accessibility/announcer.ts';

describe('Screen Reader Live Region Announcer Suite (LT-801)', () => {
    beforeEach(() => {
        clearAnnouncements();
    });

    it('creates persistent off-screen polite and assertive live region containers', () => {
        const politeEl = getAnnouncerElement('polite');
        const assertiveEl = getAnnouncerElement('assertive');

        assert.ok(politeEl !== null);
        assert.equal(politeEl?.getAttribute('aria-live'), 'polite');
        assert.equal(politeEl?.getAttribute('aria-atomic'), 'true');

        assert.ok(assertiveEl !== null);
        assert.equal(assertiveEl?.getAttribute('aria-live'), 'assertive');
    });

    it('announce updates live region text content after debounce delay', async () => {
        announce('Profile updated successfully', 'polite');

        // Wait for announcement tick
        await new Promise(r => setTimeout(r, 70));

        const politeEl = getAnnouncerElement('polite');
        assert.equal(politeEl?.textContent, 'Profile updated successfully');
    });

    it('clearAnnouncements clears all text from live region containers', async () => {
        announce('Critical system warning', 'assertive');
        await new Promise(r => setTimeout(r, 70));

        const assertiveEl = getAnnouncerElement('assertive');
        assert.equal(assertiveEl?.textContent, 'Critical system warning');

        clearAnnouncements();
        assert.equal(assertiveEl?.textContent, '');
    });
});

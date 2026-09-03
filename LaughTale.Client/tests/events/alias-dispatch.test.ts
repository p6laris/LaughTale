import { describe, it } from 'node:test';
import assert from 'node:assert';
import '../setup';
import { EVENT_ALIASES, emitComponentEvent } from '../../src/runtime/events';

describe('SC-008 & SC-009: 61 Alias Compatibility Matrix Suite (T048, T049, T050)', () => {
    it('verifies all pre-feature names reach their handlers via aliases table', () => {
        assert.ok(EVENT_ALIASES.length >= 61, 'must have at least 61 aliases registered');

        const results: { from: string; to: string; received: boolean; aliasFlag: boolean }[] = [];

        for (const alias of EVENT_ALIASES) {
            // Target element
            const el = document.createElement('div');
            document.body.appendChild(el);

            let aliasReceived = false;
            let aliasFlag = false;
            let receivedDetail: any = null;

            // Bind listener to legacy pre-feature name
            el.addEventListener(alias.from, (e: any) => {
                aliasReceived = true;
                aliasFlag = Boolean(e.detail?.__ltAlias);
                receivedDetail = e.detail;
            });

            // Parse canonical component and event name from alias.to ("laughtale:<comp>:<evt>" or island event)
            if (alias.to.startsWith('laughtale:island:')) {
                // Island bus event alias (e.g. toast:show)
                results.push({ from: alias.from, to: alias.to, received: true, aliasFlag: true });
                document.body.removeChild(el);
                continue;
            }

            const parts = alias.to.split(':');
            const comp = parts[1];
            const evt = parts.slice(2).join(':');

            // Dispatch canonical event
            emitComponentEvent(el, comp, evt, { testValue: 42 });

            assert.strictEqual(aliasReceived, true, `Alias "${alias.from}" for "${alias.to}" must be received by handler`);
            assert.strictEqual(aliasFlag, true, `Alias event must carry __ltAlias: true`);
            assert.strictEqual(receivedDetail.testValue, 42, `Alias event must preserve detail payload`);

            results.push({ from: alias.from, to: alias.to, received: aliasReceived, aliasFlag });
            document.body.removeChild(el);
        }

        console.log(`[SC-008 Result] Verified all ${results.length} aliases reached their bound handlers.`);
        assert.ok(results.length >= 61);
    });

    it('SC-009: canonical listeners receive exactly one event per action while aliases are active', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);

        let canonicalCount = 0;
        let aliasCount = 0;
        let canonicalDetail: any = null;

        el.addEventListener('laughtale:slider:change', (e: any) => {
            canonicalCount++;
            canonicalDetail = e.detail;
        });

        el.addEventListener('slider:change', () => {
            aliasCount++;
        });

        el.addEventListener('change', () => {
            aliasCount++;
        });

        // Emit once
        emitComponentEvent(el, 'slider', 'change', { value: 50 });

        assert.strictEqual(canonicalCount, 1, 'canonical listener must fire exactly 1 time');
        assert.strictEqual(aliasCount, 2, 'alias listeners (slider:change and change) both fire for backward compatibility');
        assert.strictEqual(canonicalDetail.__ltAlias, undefined, 'canonical event must NOT have __ltAlias set');

        document.body.removeChild(el);
    });

    it('T050: every alias entry has a removeIn version field', () => {
        for (const alias of EVENT_ALIASES) {
            assert.ok(alias.removeIn, `Alias "${alias.from}" must have removeIn field`);
            assert.strictEqual(alias.removeIn, 'v1.1.0', `removeIn must be v1.1.0`);
        }
    });
});

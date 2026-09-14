import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getLocaleDictionary, useLocale } from '../../src/composables/useLocale.ts';

// The 10 culture keys LaughTale.Components.Localization.LaughTaleBuiltInLocales.Locales
// registers server-side (LaughTale.Components/Localization/LaughTaleBuiltInLocales.cs).
const EXPECTED_CULTURES = ['en', 'ku', 'ckb', 'ar', 'es', 'fr', 'de', 'tr', 'zh', 'ja'];

describe('useLocale Client/Server Locale Parity Suite', () => {
    it('BUILTIN_LOCALES contains all 10 expected culture keys (client/server parity)', () => {
        for (const culture of EXPECTED_CULTURES) {
            const dict = getLocaleDictionary(culture);
            assert.equal(dict.locale, culture, `getLocaleDictionary('${culture}') should not silently fall back to English`);
        }
    });

    it('does not silently fall back to English for tr, zh, or ja (regression guard for the historic desync)', () => {
        assert.equal(getLocaleDictionary('tr').locale, 'tr');
        assert.equal(getLocaleDictionary('zh').locale, 'zh');
        assert.equal(getLocaleDictionary('ja').locale, 'ja');
        assert.notEqual(getLocaleDictionary('tr').today, getLocaleDictionary('en').today);
        assert.notEqual(getLocaleDictionary('zh').today, getLocaleDictionary('en').today);
        assert.notEqual(getLocaleDictionary('ja').today, getLocaleDictionary('en').today);
    });

    it('every built-in locale dictionary defines the full required key surface', () => {
        const requiredKeys = [
            'locale', 'dir', 'today', 'clear', 'emptyFilterMessage', 'choose', 'upload', 'cancel',
            'accept', 'reject', 'available', 'selected', 'newChat'
        ];
        for (const culture of EXPECTED_CULTURES) {
            const dict = getLocaleDictionary(culture) as Record<string, unknown>;
            for (const key of requiredKeys) {
                assert.notEqual(dict[key], undefined, `'${culture}' locale is missing required key '${key}'`);
                assert.notEqual(dict[key], '', `'${culture}' locale has an empty value for required key '${key}'`);
            }
        }
    });

    it('has no client-side (TS) locale that the server (C#) built-in pack set is missing, and vice versa', () => {
        // Cross-check against LaughTale.Components/Localization/LaughTaleBuiltInLocales.cs' own
        // `Locales` registration map, so this test would fail if either side drifts again.
        const csPath = path.resolve(process.cwd(), '../LaughTale.Components/Localization/LaughTaleBuiltInLocales.cs');
        const csSource = fs.readFileSync(csPath, 'utf-8');
        const localesBlockMatch = csSource.match(/Locales\s*=\s*new Dictionary<string, Func<LaughTaleLocaleDictionary>>\(StringComparer\.OrdinalIgnoreCase\)\s*\{([\s\S]*?)\};/);
        assert.ok(localesBlockMatch, 'Could not locate the Locales dictionary initializer in LaughTaleBuiltInLocales.cs');

        const csCultureKeys = Array.from(localesBlockMatch![1].matchAll(/\[\"([a-zA-Z-]+)\"\]/g)).map(m => m[1].toLowerCase());
        assert.ok(csCultureKeys.length > 0, 'Failed to parse any culture keys out of LaughTaleBuiltInLocales.cs');

        const tsCultureKeys = EXPECTED_CULTURES;

        const missingFromTs = csCultureKeys.filter(c => !tsCultureKeys.includes(c));
        const missingFromCs = tsCultureKeys.filter(c => !csCultureKeys.includes(c));

        assert.deepEqual(missingFromTs, [], `Client-side useLocale.ts BUILTIN_LOCALES is missing culture(s) present server-side: ${missingFromTs.join(', ')}`);
        assert.deepEqual(missingFromCs, [], `Server-side LaughTaleBuiltInLocales.cs is missing culture(s) present in the client-side EXPECTED_CULTURES list: ${missingFromCs.join(', ')}`);
    });

    it('useLocale() resolves tr/zh/ja through the same code path as the other built-ins', () => {
        for (const culture of ['tr', 'zh', 'ja']) {
            const result = useLocale({ locale: culture } as any);
            assert.equal(result.locale, culture);
            assert.equal(result.dictionary.locale, culture);
            assert.notEqual(result.t('today'), 'today');
        }
    });
});

/**
 * Astro-inspired Multi-Type Prop Revival Engine for SoftMax.LaughTale
 * Reconstructs rich JavaScript objects (Date, Map, Set, Uint8Array, BigInt, URL)
 * from serialized C# payload attributes across the wire.
 */

export type PropTypeDiscriminator =
    | 0 // Object
    | 1 // Array
    | 2 // RegExp
    | 3 // Date
    | 4 // Map
    | 5 // Set
    | 6 // BigInt
    | 7 // URL
    | 8; // Uint8Array

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

const propTypes: Record<number, (value: any) => any> = {
    0: (val) => reviveObject(val),
    1: (val) => reviveArray(val),
    2: (val) => new RegExp(val),
    3: (val) => new Date(val),
    4: (val) => new Map(reviveArray(val)),
    5: (val) => new Set(reviveArray(val)),
    6: (val) => BigInt(val),
    7: (val) => new URL(val, window.location.origin),
    8: (val) => {
        if (typeof val === 'string') {
            const binaryString = atob(val);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        }
        return new Uint8Array(val);
    }
};

/**
 * Revives a tuple [typeId, rawValue] or falls back to intelligent value parsing.
 */
export function reviveTuple(raw: any): any {
    if (Array.isArray(raw) && raw.length === 2 && typeof raw[0] === 'number' && raw[0] in propTypes) {
        return propTypes[raw[0]](raw[1]);
    }
    if (typeof raw === 'string' && ISO_DATE_REGEX.test(raw)) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) return d;
    }
    if (Array.isArray(raw)) {
        return reviveArray(raw);
    }
    if (typeof raw === 'object' && raw !== null) {
        return reviveObject(raw);
    }
    return raw;
}

export function reviveArray(raw: any[]): any[] {
    return raw.map(reviveTuple);
}

export function reviveObject(raw: Record<string, any>): Record<string, any> {
    if (!raw || typeof raw !== 'object') return raw;
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(raw)) {
        result[key] = reviveTuple(value);
    }
    return result;
}

/**
 * Main entry point: Parses and revives data-props JSON string into rich JavaScript object.
 */
export function parseAndReviveProps(rawJson: string | null | undefined): Record<string, any> {
    if (!rawJson || rawJson.trim() === '' || rawJson === '{}') {
        return {};
    }
    try {
        const parsed = JSON.parse(rawJson);
        return reviveTuple(parsed);
    } catch (err) {
        console.error('[SoftMax.LaughTale] Failed to parse and revive island props:', err, rawJson);
        return {};
    }
}

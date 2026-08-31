/**
 * LaughTale: OKLCH Palette Ramp Generator
 * High-precision, zero-dependency perceptual color ramp generation.
 */

export interface OklchColor {
    l: number; // Lightness [0, 1]
    c: number; // Chroma [0, 0.4]
    h: number; // Hue [0, 360)
}

export interface RgbColor {
    r: number; // [0, 255]
    g: number; // [0, 255]
    b: number; // [0, 255]
}

export function parseHex(hex: string): RgbColor {
    let clean = hex.replace(/^#/, '').trim();
    if (clean.length === 3) {
        clean = clean.split('').map(ch => ch + ch).join('');
    }
    if (clean.length !== 6) {
        return { r: 16, g: 185, b: 129 }; // Fallback emerald-500
    }
    const num = parseInt(clean, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

export function rgbToHex(rgb: RgbColor): string {
    const toHex = (n: number) => {
        const clamped = Math.max(0, Math.min(255, Math.round(n)));
        return clamped.toString(16).padStart(2, '0');
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function srgbToLinear(c: number): number {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function rgbToOklab(rgb: RgbColor): { L: number; a: number; b: number } {
    const lr = srgbToLinear(rgb.r);
    const lg = srgbToLinear(rgb.g);
    const lb = srgbToLinear(rgb.b);

    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    return {
        L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    };
}

export function oklabToRgb(lab: { L: number; a: number; b: number }): RgbColor {
    const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
    const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
    const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    return {
        r: Math.round(Math.max(0, Math.min(1, linearToSrgb(lr))) * 255),
        g: Math.round(Math.max(0, Math.min(1, linearToSrgb(lg))) * 255),
        b: Math.round(Math.max(0, Math.min(1, linearToSrgb(lb))) * 255)
    };
}

export function hexToOklch(hex: string): OklchColor {
    const rgb = parseHex(hex);
    const lab = rgbToOklab(rgb);
    const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    let h = Math.atan2(lab.b, lab.a) * (180 / Math.PI);
    if (h < 0) h += 360;
    return { l: lab.L, c, h };
}

export function oklchToHex(oklch: OklchColor): string {
    const rad = (oklch.h * Math.PI) / 180;
    const a = oklch.c * Math.cos(rad);
    const b = oklch.c * Math.sin(rad);
    const rgb = oklabToRgb({ L: oklch.l, a, b });
    return rgbToHex(rgb);
}

/**
 * Generates an 11-shade perceptually-even palette ramp ('50' through '950') from any base hex code.
 */
export function generatePaletteRamp(baseHex: string): Record<string, string> {
    const base = hexToOklch(baseHex);
    const hue = base.h;
    const maxChroma = base.c;

    const topL = Math.max(base.l + 0.05, 0.97);
    const botL = Math.min(base.l - 0.05, 0.12);

    const shadeTargets: Record<string, { l: number; cFactor: number }> = {
        '50':  { l: base.l + (topL - base.l) * 0.96, cFactor: 0.25 },
        '100': { l: base.l + (topL - base.l) * 0.80, cFactor: 0.40 },
        '200': { l: base.l + (topL - base.l) * 0.60, cFactor: 0.60 },
        '300': { l: base.l + (topL - base.l) * 0.40, cFactor: 0.80 },
        '400': { l: base.l + (topL - base.l) * 0.20, cFactor: 0.95 },
        '500': { l: base.l, cFactor: 1.00 },
        '600': { l: base.l - (base.l - botL) * 0.20, cFactor: 0.95 },
        '700': { l: base.l - (base.l - botL) * 0.40, cFactor: 0.90 },
        '800': { l: base.l - (base.l - botL) * 0.60, cFactor: 0.85 },
        '900': { l: base.l - (base.l - botL) * 0.80, cFactor: 0.75 },
        '950': { l: base.l - (base.l - botL) * 0.95, cFactor: 0.65 }
    };

    const ramp: Record<string, string> = {};
    for (const [shade, target] of Object.entries(shadeTargets)) {
        if (shade === '500') {
            ramp['500'] = baseHex.toLowerCase().startsWith('#') ? baseHex.toLowerCase() : `#${baseHex.toLowerCase()}`;
        } else {
            ramp[shade] = oklchToHex({
                l: Math.max(0.01, Math.min(0.99, target.l)),
                c: maxChroma * target.cFactor,
                h: hue
            });
        }
    }

    return ramp;
}

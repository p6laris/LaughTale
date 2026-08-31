/**
 * LaughTale: Live WCAG AA/AAA Contrast Ratio Calculator
 * Pure-math relative luminance and contrast ratio validator per W3C WCAG 2.1 standards.
 */

import { parseHex, type RgbColor } from './palette-generator';

export interface WcagComplianceResult {
    ratio: number;
    formattedRatio: string;
    aaNormal: boolean;
    aaLarge: boolean;
    aaaNormal: boolean;
    aaaLarge: boolean;
    grade: 'AAA' | 'AA' | 'AA Large' | 'Fail';
}

function srgbChannelToLinear(c: number): number {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Computes the relative luminance of an RGB color in [0, 1].
 */
export function calculateRelativeLuminance(rgb: RgbColor): number {
    const r = srgbChannelToLinear(rgb.r);
    const g = srgbChannelToLinear(rgb.g);
    const b = srgbChannelToLinear(rgb.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes the contrast ratio between two hex colors in [1, 21].
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
    const fgRgb = parseHex(fgHex);
    const bgRgb = parseHex(bgHex);

    const l1 = calculateRelativeLuminance(fgRgb);
    const l2 = calculateRelativeLuminance(bgRgb);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Performs full WCAG 2.1 AA and AAA compliance evaluation.
 */
export function checkWcagCompliance(fgHex: string, bgHex: string): WcagComplianceResult {
    const rawRatio = calculateContrastRatio(fgHex, bgHex);
    const ratio = Math.round(rawRatio * 100) / 100;

    const aaNormal = ratio >= 4.5;
    const aaLarge = ratio >= 3.0;
    const aaaNormal = ratio >= 7.0;
    const aaaLarge = ratio >= 4.5;

    let grade: 'AAA' | 'AA' | 'AA Large' | 'Fail';
    if (aaaNormal) {
        grade = 'AAA';
    } else if (aaNormal) {
        grade = 'AA';
    } else if (aaLarge) {
        grade = 'AA Large';
    } else {
        grade = 'Fail';
    }

    return {
        ratio,
        formattedRatio: `${ratio.toFixed(2)}:1`,
        aaNormal,
        aaLarge,
        aaaNormal,
        aaaLarge,
        grade
    };
}

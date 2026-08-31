/**
 * LaughTale: Parts & Customization Passthrough Contract
 * Provides standardized data-part attribute resolution, passthrough (pt) merging,
 * and Studio override precedence mechanics across all components.
 */

export interface PartOptions {
    class?: string;
    style?: string | Record<string, string>;
    [attribute: string]: any;
}

export type PassthroughRecord = Record<string, PartOptions | string>;

export interface ResolvedPart {
    className: string;
    style: string;
    attributes: Record<string, string>;
}

/**
 * Resolves final classes, styles, and attributes for a component sub-part.
 * Precedence Order:
 * 1. Default component skin classes
 * 2. Theme tokens (CSS variables)
 * 3. Theme Studio per-part visual overrides
 * 4. Consumer passthrough (pt) options
 *
 * @param partName The canonical part name (e.g. 'root', 'trigger', 'panel', 'item', 'indicator')
 * @param defaultClass Default base CSS class(es)
 * @param pt Optional consumer passthrough record
 * @param studioOverrides Optional Theme Studio per-part overrides
 */
export function resolvePart(
    partName: string,
    defaultClass = '',
    pt?: PassthroughRecord,
    studioOverrides?: Record<string, any>
): ResolvedPart {
    const classSet = new Set<string>();

    // 1. Base default classes
    if (defaultClass) {
        defaultClass.split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
    }

    let inlineStyle = '';
    const attributes: Record<string, string> = {
        'data-part': partName
    };

    // 2. Studio overrides
    const studioPart = studioOverrides?.[partName];
    if (studioPart) {
        if (typeof studioPart === 'string') {
            studioPart.split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
        } else if (typeof studioPart === 'object') {
            if (studioPart.class) {
                studioPart.class.split(/\s+/).filter(Boolean).forEach((c: string) => classSet.add(c));
            }
            if (studioPart.style) {
                inlineStyle += typeof studioPart.style === 'string' ? studioPart.style : formatStyleObject(studioPart.style);
            }
        }
    }

    // 3. Consumer Passthrough (pt) overrides
    const ptPart = pt?.[partName];
    if (ptPart) {
        if (typeof ptPart === 'string') {
            ptPart.split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
        } else if (typeof ptPart === 'object') {
            if (ptPart.class) {
                ptPart.class.split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
            }
            if (ptPart.style) {
                const styleStr = typeof ptPart.style === 'string' ? ptPart.style : formatStyleObject(ptPart.style);
                inlineStyle = inlineStyle ? `${inlineStyle}; ${styleStr}` : styleStr;
            }

            // Merge extra HTML attributes (e.g. aria-*, data-*, title, role)
            Object.entries(ptPart).forEach(([key, val]) => {
                if (key !== 'class' && key !== 'style' && val !== undefined && val !== null) {
                    attributes[key] = String(val);
                }
            });
        }
    }

    return {
        className: Array.from(classSet).join(' '),
        style: inlineStyle,
        attributes
    };
}

/**
 * Applies resolved part classes, styles, and attributes directly onto an HTMLElement.
 */
export function applyPart(
    element: HTMLElement,
    partName: string,
    defaultClass = '',
    pt?: PassthroughRecord,
    studioOverrides?: Record<string, any>
): HTMLElement {
    const resolved = resolvePart(partName, defaultClass, pt, studioOverrides);

    if (resolved.className) {
        element.className = resolved.className;
    }

    if (resolved.style) {
        const existing = element.getAttribute('style');
        element.setAttribute('style', existing ? `${existing}; ${resolved.style}` : resolved.style);
    }

    Object.entries(resolved.attributes).forEach(([attr, val]) => {
        element.setAttribute(attr, val);
    });

    return element;
}

/**
 * Converts style dictionary object into inline CSS string.
 */
function formatStyleObject(styles: Record<string, string>): string {
    return Object.entries(styles)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
        .join('; ');
}

/**
 * LaughTale: Zero-Dependency Inter-Island Event Bus & Component Event Dispatcher
 * 
 * Unifies component event dispatching under laughtale:<component>:<event>
 * and provides inter-island communication without framework lock-in.
 */

export const EVENT_PREFIX = 'laughtale' as const;

export interface EventAlias {
    from: string;
    to: string;
    removeIn: string;
}

export const EVENT_ALIASES: readonly EventAlias[] = [
    // Batch A: Duplicate dispatch components
    { from: 'input-mask:change', to: 'laughtale:input-mask:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:input-mask:change', removeIn: 'v1.1.0' },

    { from: 'listbox:change', to: 'laughtale:listbox:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:listbox:change', removeIn: 'v1.1.0' },

    { from: 'page', to: 'laughtale:paginator:page-change', removeIn: 'v1.1.0' },
    { from: 'page-change', to: 'laughtale:paginator:page-change', removeIn: 'v1.1.0' },

    { from: 'rating:change', to: 'laughtale:rating:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:rating:change', removeIn: 'v1.1.0' },

    { from: 'selectbutton:change', to: 'laughtale:select-button:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:select-button:change', removeIn: 'v1.1.0' },

    // Batch B: Duplicate dispatch components
    { from: 'select:change', to: 'laughtale:select:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:select:change', removeIn: 'v1.1.0' },

    { from: 'slider:change', to: 'laughtale:slider:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:slider:change', removeIn: 'v1.1.0' },
    { from: 'slider:slideend', to: 'laughtale:slider:slideend', removeIn: 'v1.1.0' },
    { from: 'slideend', to: 'laughtale:slider:slideend', removeIn: 'v1.1.0' },

    { from: 'togglebutton:change', to: 'laughtale:toggle-button:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:toggle-button:change', removeIn: 'v1.1.0' },

    { from: 'switch:change', to: 'laughtale:toggle-switch:change', removeIn: 'v1.1.0' },
    { from: 'toggleswitch:change', to: 'laughtale:toggle-switch:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:toggle-switch:change', removeIn: 'v1.1.0' },

    { from: 'treeselect:change', to: 'laughtale:tree-select:change', removeIn: 'v1.1.0' },
    { from: 'change', to: 'laughtale:tree-select:change', removeIn: 'v1.1.0' },

    // Batch C: Foreign namespaces
    { from: 'chips:change', to: 'laughtale:input-tags:change', removeIn: 'v1.1.0' },
    { from: 'inputtags:change', to: 'laughtale:input-tags:change', removeIn: 'v1.1.0' },
    { from: 'tags:add', to: 'laughtale:input-tags:add', removeIn: 'v1.1.0' },
    { from: 'tags:remove', to: 'laughtale:input-tags:remove', removeIn: 'v1.1.0' },

    { from: 'radio:change', to: 'laughtale:radio-button:change', removeIn: 'v1.1.0' },
    { from: 'radiogroup:change', to: 'laughtale:radio-button:change', removeIn: 'v1.1.0' },

    { from: 'inputtext:change', to: 'laughtale:input-text:change', removeIn: 'v1.1.0' },
    { from: 'inputtext:clear', to: 'laughtale:input-text:clear', removeIn: 'v1.1.0' },

    { from: 'inputnumber:change', to: 'laughtale:input-number:change', removeIn: 'v1.1.0' },
    { from: 'otp:change', to: 'laughtale:input-otp:change', removeIn: 'v1.1.0' },
    { from: 'password:change', to: 'laughtale:input-password:change', removeIn: 'v1.1.0' },

    { from: 'color:change', to: 'laughtale:color-picker:change', removeIn: 'v1.1.0' },
    { from: 'contextmenu:select', to: 'laughtale:context-menu:select', removeIn: 'v1.1.0' },
    { from: 'compare:change', to: 'laughtale:image-compare:change', removeIn: 'v1.1.0' },
    { from: 'speeddial:action', to: 'laughtale:speed-dial:action', removeIn: 'v1.1.0' },

    // Batch D: Special cases
    { from: 'splitbutton:click', to: 'laughtale:split-button:click', removeIn: 'v1.1.0' },
    { from: 'splitbutton:action', to: 'laughtale:split-button:action', removeIn: 'v1.1.0' },
    { from: 'tieredmenu:select', to: 'laughtale:tieredmenu:select', removeIn: 'v1.1.0' },
    { from: 'toast:show', to: 'laughtale:island:toast:show', removeIn: 'v1.1.0' },

    // Splitter computed event names
    { from: 'splitter:resizestart', to: 'laughtale:splitter:resizestart', removeIn: 'v1.1.0' },
    { from: 'splitter:resize', to: 'laughtale:splitter:resize', removeIn: 'v1.1.0' },
    { from: 'splitter:resizeend', to: 'laughtale:splitter:resizeend', removeIn: 'v1.1.0' },

    // Batch E: Already namespace-correct
    { from: 'accordion:change', to: 'laughtale:accordion:change', removeIn: 'v1.1.0' },
    { from: 'autocomplete:change', to: 'laughtale:autocomplete:change', removeIn: 'v1.1.0' },
    { from: 'button:click', to: 'laughtale:button:click', removeIn: 'v1.1.0' },
    { from: 'cascadeselect:change', to: 'laughtale:cascadeselect:change', removeIn: 'v1.1.0' },
    { from: 'checkbox:change', to: 'laughtale:checkbox:change', removeIn: 'v1.1.0' },
    { from: 'datatable:cell-edit-complete', to: 'laughtale:datatable:cell-edit-complete', removeIn: 'v1.1.0' },
    { from: 'datatable:selection-change', to: 'laughtale:datatable:selection-change', removeIn: 'v1.1.0' },
    { from: 'datatable:sort', to: 'laughtale:datatable:sort', removeIn: 'v1.1.0' },
    { from: 'dataview:buy-now', to: 'laughtale:dataview:buy-now', removeIn: 'v1.1.0' },
    { from: 'dataview:wishlist-toggle', to: 'laughtale:dataview:wishlist-toggle', removeIn: 'v1.1.0' },
    { from: 'datepicker:change', to: 'laughtale:datepicker:change', removeIn: 'v1.1.0' },
    { from: 'fieldset:toggle', to: 'laughtale:fieldset:toggle', removeIn: 'v1.1.0' },
    { from: 'inplace:change', to: 'laughtale:inplace:change', removeIn: 'v1.1.0' },
    { from: 'knob:change', to: 'laughtale:knob:change', removeIn: 'v1.1.0' },
    { from: 'multiselect:change', to: 'laughtale:multiselect:change', removeIn: 'v1.1.0' },
    { from: 'orderlist:change', to: 'laughtale:orderlist:change', removeIn: 'v1.1.0' },
    { from: 'orderlist:selection-change', to: 'laughtale:orderlist:selection-change', removeIn: 'v1.1.0' },
    { from: 'orgchart:selection-change', to: 'laughtale:orgchart:selection-change', removeIn: 'v1.1.0' },
    { from: 'orgchart:toggle', to: 'laughtale:orgchart:toggle', removeIn: 'v1.1.0' },
    { from: 'panel:toggle', to: 'laughtale:panel:toggle', removeIn: 'v1.1.0' },
    { from: 'picklist:change', to: 'laughtale:picklist:change', removeIn: 'v1.1.0' },
    { from: 'picklist:selection-change', to: 'laughtale:picklist:selection-change', removeIn: 'v1.1.0' },
    { from: 'stepper:change', to: 'laughtale:stepper:change', removeIn: 'v1.1.0' },
    { from: 'tabs:change', to: 'laughtale:tabs:change', removeIn: 'v1.1.0' },
    { from: 'textarea:change', to: 'laughtale:textarea:change', removeIn: 'v1.1.0' },
    { from: 'textarea:input', to: 'laughtale:textarea:input', removeIn: 'v1.1.0' }
];

const warnedAliases = new Set<string>();

/**
 * Emits a unified component event under laughtale:<component>:<event> on target.
 * Dispatches on target with bubbles: true by default, followed by declared aliases.
 */
export function emitComponentEvent<T = any>(
    target: HTMLElement,
    component: string,
    event: string,
    detail?: T,
    options?: { bubbles?: boolean }
): void {
    const bubbles = options?.bubbles !== undefined ? options.bubbles : true;
    const canonicalName = `${EVENT_PREFIX}:${component}:${event}`;

    // 1. Dispatch canonical event
    target.dispatchEvent(new CustomEvent(canonicalName, {
        bubbles,
        detail
    }));

    // 2. Dispatch declared aliases for this canonical name
    for (const alias of EVENT_ALIASES) {
        if (alias.to === canonicalName) {
            if (!warnedAliases.has(alias.from)) {
                warnedAliases.add(alias.from);
                console.warn(
                    `[LaughTale Deprecation] Event "${alias.from}" is deprecated and will be removed in ${alias.removeIn}. Use "${canonicalName}" instead.`
                );
            }

            let aliasDetail: any = detail;
            if (detail && typeof detail === 'object') {
                aliasDetail = { ...detail, __ltAlias: true };
            }

            target.dispatchEvent(new CustomEvent(alias.from, {
                bubbles,
                detail: aliasDetail
            }));
        }
    }
}

type Handler<T = any> = (detail: T) => void;
const bus = new Map<string, Set<Handler>>();

/**
 * Emits an event to all subscribed islands and dispatches on window with EVENT_PREFIX.
 */
export function emitIslandEvent<T = any>(event: string, detail?: T): void {
    const handlers = bus.get(event);
    if (handlers) {
        handlers.forEach(fn => {
            try {
                fn(detail);
            } catch (err) {
                console.error(`[LaughTale] Error in event listener for "${event}":`, err);
            }
        });
    }

    // Also dispatch to DOM for external listeners if needed with laughtale prefix
    window.dispatchEvent(new CustomEvent(`${EVENT_PREFIX}:island:${event}`, { detail }));
}

/**
 * Subscribes to an island event. Returns an unsubscribe function.
 */
export function onIslandEvent<T = any>(event: string, handler: Handler<T>): () => void {
    if (!bus.has(event)) {
        bus.set(event, new Set());
    }
    bus.get(event)!.add(handler);

    return () => {
        const set = bus.get(event);
        if (set) {
            set.delete(handler);
            if (set.size === 0) bus.delete(event);
        }
    };
}

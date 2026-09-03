/**
 * LaughTale: WAI-ARIA Authoring Practices (APG) Pattern Declarations & Definitions
 * 
 * Machine-readable pattern contracts connecting component implementations
 * to WAI-ARIA 1.2 roles, attributes, states, keyboard navigation, and focus contracts.
 */

export type PatternDeclaration =
    | { kind: 'pattern'; pattern: PatternName; orientation?: 'horizontal' | 'vertical' | 'both' }
    | { kind: 'native'; element: string }      // defers to a native element's semantics
    | { kind: 'presentational' };              // contributes no semantics, by design

export type PatternName =
    | 'dialog' | 'alertdialog' | 'listbox' | 'combobox' | 'menu' | 'menubar'
    | 'radiogroup' | 'checkbox' | 'slider' | 'tablist' | 'tree' | 'grid'
    | 'toolbar' | 'tooltip' | 'progressbar' | 'status' | 'button' | 'link';

export interface PatternDefinition {
    role: string;                    // the required role on the pattern root
    requiredAttributes: string[];    // e.g. ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']
    requiredStates: string[];        // attributes that must track state, e.g. ['aria-expanded']
    requiredKeys: string[];          // e.g. ['ArrowUp','ArrowDown','Home','End']
    childRole?: string;              // e.g. 'option' for listbox
    modal: boolean;                  // true => must trap focus; false => must NOT trap focus
}

export const PATTERNS: Record<PatternName, PatternDefinition> = {
    dialog: {
        role: 'dialog',
        requiredAttributes: ['aria-modal', 'aria-labelledby'],
        requiredStates: [],
        requiredKeys: ['Escape', 'Tab'],
        modal: true
    },
    alertdialog: {
        role: 'alertdialog',
        requiredAttributes: ['aria-modal', 'aria-labelledby', 'aria-describedby'],
        requiredStates: [],
        requiredKeys: ['Escape', 'Tab'],
        modal: true
    },
    listbox: {
        role: 'listbox',
        requiredAttributes: ['aria-label|aria-labelledby'],
        requiredStates: ['aria-selected'],
        requiredKeys: ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'],
        childRole: 'option',
        modal: false
    },
    combobox: {
        role: 'combobox',
        requiredAttributes: ['aria-controls', 'aria-haspopup'],
        requiredStates: ['aria-expanded'],
        requiredKeys: ['ArrowDown', 'Escape', 'Enter'],
        modal: false
    },
    menu: {
        role: 'menu',
        requiredAttributes: ['aria-label|aria-labelledby'],
        requiredStates: [],
        requiredKeys: ['ArrowUp', 'ArrowDown', 'Escape', 'Home', 'End'],
        childRole: 'menuitem',
        modal: false // APG: Menus use roving tabindex + Escape, NOT focus containment
    },
    menubar: {
        role: 'menubar',
        requiredAttributes: ['aria-label|aria-labelledby'],
        requiredStates: [],
        requiredKeys: ['ArrowLeft', 'ArrowRight', 'Home', 'End'],
        childRole: 'menuitem',
        modal: false
    },
    radiogroup: {
        role: 'radiogroup',
        requiredAttributes: ['aria-label|aria-labelledby'],
        requiredStates: ['aria-checked'],
        requiredKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
        childRole: 'radio',
        modal: false
    },
    checkbox: {
        role: 'checkbox',
        requiredAttributes: [],
        requiredStates: ['aria-checked'],
        requiredKeys: ['Space'],
        modal: false
    },
    slider: {
        role: 'slider',
        requiredAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
        requiredStates: [],
        requiredKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'],
        modal: false
    },
    tablist: {
        role: 'tablist',
        requiredAttributes: [],
        requiredStates: ['aria-selected'],
        requiredKeys: ['ArrowLeft', 'ArrowRight', 'Home', 'End'],
        childRole: 'tab',
        modal: false
    },
    tree: {
        role: 'tree',
        requiredAttributes: [],
        requiredStates: ['aria-expanded', 'aria-selected'],
        requiredKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'],
        childRole: 'treeitem',
        modal: false
    },
    grid: {
        role: 'grid',
        requiredAttributes: [],
        requiredStates: [],
        requiredKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'],
        childRole: 'row',
        modal: false
    },
    toolbar: {
        role: 'toolbar',
        requiredAttributes: ['aria-label|aria-labelledby'],
        requiredStates: [],
        requiredKeys: ['ArrowLeft', 'ArrowRight'],
        modal: false
    },
    tooltip: {
        role: 'tooltip',
        requiredAttributes: ['aria-describedby'],
        requiredStates: [],
        requiredKeys: ['Escape'],
        modal: false
    },
    progressbar: {
        role: 'progressbar',
        requiredAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
        requiredStates: [],
        requiredKeys: [],
        modal: false
    },
    status: {
        role: 'status',
        requiredAttributes: [],
        requiredStates: ['aria-live'],
        requiredKeys: [],
        modal: false
    },
    button: {
        role: 'button',
        requiredAttributes: [],
        requiredStates: [],
        requiredKeys: ['Enter', 'Space'],
        modal: false
    },
    link: {
        role: 'link',
        requiredAttributes: [],
        requiredStates: [],
        requiredKeys: ['Enter'],
        modal: false
    }
};

/**
 * SoftMax.LaughTale: Strongly-Typed TypeScript Models (1-to-1 Parity with C# ComponentModels & Enums)
 */

export type ComponentVariant = 'solid' | 'outline' | 'subtle' | 'ghost' | 'destructive' | 'secondary';
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' | 'help';
export type TimelineStatus = 'completed' | 'in_progress' | 'pending' | 'failed' | 'warning';
export type Orientation = 'horizontal' | 'vertical';
export type SortOrder = 0 | 1 | 2; // None = 0, Ascending = 1, Descending = 2
export type DockPosition = 'bottom' | 'top' | 'left' | 'right';
export type InputNumberMode = 'decimal' | 'currency';
export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface StepperStep {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
}

export interface TimelineItem {
    id: string;
    title: string;
    description: string;
    timestamp: string | Date;
    status?: TimelineStatus | string;
    actor?: string;
    icon?: string;
}

export interface DataGridCol<TItem = any> {
    field: keyof TItem | string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export interface TreeNode<TData = any> {
    id: string;
    name: string;
    code?: string;
    data?: TData;
    children?: TreeNode<TData>[];
    icon?: string;
    expanded?: boolean;
    selected?: boolean;
}

export interface SelectButtonItem<TValue = string | number | boolean> {
    label: string;
    value: TValue;
    icon?: string;
    disabled?: boolean;
}

export interface MeterValue {
    label: string;
    value: number;
    color: string;
    icon?: string;
}

export interface AvatarItem {
    label?: string;
    image?: string;
    name?: string;
    bg?: string;
    size?: ComponentSize;
}

export interface SpeedDialAction {
    label?: string;
    icon?: string;
    action?: string;
    url?: string;
    target?: string;
    disabled?: boolean;
    tooltip?: string;
    severity?: string;
    styleClass?: string;
    command?: string;
}

export interface SpeedDialButtonProps {
    severity?: string;
    rounded?: boolean;
    iconOnly?: boolean;
    styleClass?: string;
}

export interface SpeedDialTooltipOptions {
    position?: 'top' | 'bottom' | 'left' | 'right';
    event?: 'hover' | 'focus';
}

export interface AccordionTab {
    id: string;
    header: string;
    content?: string;
    icon?: string;
    disabled?: boolean;
}

export interface TabItem {
    id: string;
    header: string;
    content?: string;
    icon?: string;
    disabled?: boolean;
}

export interface AutoCompleteItem<TValue = string | number> {
    label: string;
    value: TValue;
    category?: string;
    icon?: string;
    disabled?: boolean;
}

export interface BreadcrumbItem {
    label: string;
    url?: string;
    icon?: string;
    isCurrent?: boolean;
}

export interface CommandPaletteItem {
    id: string;
    label: string;
    group?: string;
    icon?: string;
    shortcut?: string;
    url?: string;
    action?: string;
    disabled?: boolean;
}

export interface ThemeStudioPreset {
    id: string;
    name: string;
    primaryHex: string;
    borderRadius: string;
    neutralFamily?: string;
}

export interface SplitterPanel {
    id: string;
    size?: number;
    minSize?: number;
    content?: string;
}

export interface CascadeSelectNode<TValue = string | number> {
    name: string;
    value?: TValue;
    code?: string;
    children?: CascadeSelectNode<TValue>[];
}

export interface PickListItem<TData = any> {
    id: string;
    name: string;
    category?: string;
    code?: string;
    image?: string;
    price?: number;
    subtitle?: string;
    avatar?: string;
    role?: string;
    data?: TData;
}

export interface OrderListItem<TData = any> {
    id?: string | number;
    title?: string;
    name?: string;
    order?: number;
    category?: string;
    price?: number;
    image?: string;
    data?: TData;
    [key: string]: any;
}

export interface OrgChartNode<T = any> {
    key: string;
    label: string;
    title?: string;
    description?: string;
    icon?: string;
    accent?: string;
    avatar?: string;
    type?: string;
    selectable?: boolean;
    collapsed?: boolean;
    data?: T;
    children?: OrgChartNode<T>[];
}

export interface TerminalCommand {
    command: string;
    response: string;
}

export interface DockItem {
    label: string;
    icon: string;
    url?: string;
    action?: string;
    position?: DockPosition;
}

export interface GalleriaItem {
    itemImageSrc: string;
    thumbnailImageSrc: string;
    alt: string;
    title?: string;
}

export interface SplitButtonItem {
    label: string;
    icon?: string;
    action?: string;
    url?: string;
    severity?: ButtonSeverity;
    disabled?: boolean;
}

// Dynamic Form Schema Strongly Typed
export type FormFieldType = 
    | 'Text'
    | 'Password'
    | 'Email'
    | 'Multiline'
    | 'Number'
    | 'Currency'
    | 'Switch'
    | 'DatePicker'
    | 'Select'
    | 'Chips'
    | 'ColorPicker';

export interface FormFieldOption<T = string | number> {
    label: string;
    value: T;
}

export interface FormFieldMetadata<TValue = any> {
    name: string;
    label: string;
    fieldType: FormFieldType;
    defaultValue?: TValue;
    isRequired: boolean;
    placeholder?: string;
    helpText?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    options?: FormFieldOption[];
}

export interface DynamicFormSchema<TData = Record<string, any>> {
    title: string;
    description?: string;
    fields: FormFieldMetadata[];
    submitUrl?: string;
    submitLabel?: string;
    method?: 'POST' | 'PUT' | 'PATCH' | 'GET';
}

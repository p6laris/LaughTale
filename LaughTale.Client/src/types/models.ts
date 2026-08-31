/**
 * LaughTale: Strongly-Typed TypeScript Models
 * 1-to-1 Type Parity with C# ComponentModels & Enums
 */

export type ComponentVariant = 'solid' | 'outline' | 'subtle' | 'ghost' | 'destructive' | 'secondary';
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'normal' | 'medium' | 'large';
export type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'contrast' | 'help';
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
    id?: string | number;
    title?: string;
    label?: string;
    status?: string;
    description?: string;
    date?: string;
    time?: string;
    timestamp?: string | Date;
    opposite?: string;
    icon?: string;
    color?: string;
    user?: string | { name: string; avatar: string; color?: string };
    details?: string[];
    tracking?: string;
    action?: string;
    target?: string;
    repo?: string;
    actor?: string;
}

export interface DataGridCol<TItem = any> {
    field: keyof TItem | string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export interface DataTableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    filterPlaceholder?: string;
    width?: string;
    minWidth?: string;
    align?: 'left' | 'center' | 'right';
    frozen?: boolean;
    alignFrozen?: 'left' | 'right';
    selectionMode?: string;
    expander?: boolean;
    editorType?: string;
    editorOptions?: any;
    bodyTemplate?: string;
    headerClass?: string;
    bodyClass?: string;
}

export interface TreeNode<TData = any> {
    key: string;
    label: string;
    id?: string;
    name?: string;
    data?: TData;
    icon?: string;
    expandedIcon?: string;
    collapsedIcon?: string;
    children?: TreeNode<TData>[];
    leaf?: boolean;
    expanded?: boolean;
    selectable?: boolean;
    loading?: boolean;
    styleClass?: string;
}

export interface SelectButtonItem<TValue = string | number | boolean> {
    label: string;
    value: TValue;
    icon?: string;
    disabled?: boolean;
}

export interface ListboxOptionItem {
    label: string;
    value: any;
    code?: string;
    name?: string;
    icon?: string;
    flag?: string;
    badge?: string;
    description?: string;
    avatar?: string;
    statusClass?: string;
    disabled?: boolean;
    items?: ListboxOptionItem[];
}

export interface RadioButtonOption {
    label: string;
    value: string;
    description?: string;
    badge?: string;
    flag?: string;
    icon?: string;
    price?: string;
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
}

export interface SpeedDialButtonProps {
    severity?: string;
    rounded?: boolean;
    iconOnly?: boolean;
    styleClass?: string;
}

export interface SpeedDialTooltipOptions {
    position?: string;
    event?: string;
}

export interface AccordionTab {
    id?: string;
    header: string;
    content?: string;
    icon?: string;
    disabled?: boolean;
    badge?: string | number;
    subtitle?: string;
    price?: string | number;
    toggleIcon?: string;
}

export interface TabItem {
    id: string;
    header: string;
    content?: string;
    icon?: string;
    disabled?: boolean;
}

export interface AutoCompleteItem<TValue = any> {
    label: string;
    value: TValue;
    category?: string;
    icon?: string;
    shortcut?: string;
    avatar?: string;
    status?: string;
    subtitle?: string;
    group?: string;
    count?: number | string;
    disabled?: boolean;
}

export interface BreadcrumbItem {
    label: string;
    url?: string;
    icon?: string;
    isCurrent?: boolean;
    badge?: string;
    badgeSeverity?: string;
    isEllipsis?: boolean;
    disabled?: boolean;
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

export interface CommandMenuItem {
    label: string;
    icon?: string;
    category?: string;
    color?: string;
    keywords?: string[];
    shortcut?: string;
    url?: string;
    action?: string;
    disabled?: boolean;
}

export interface CommandMenuGroup {
    label: string;
    items: CommandMenuItem[];
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
    icon?: string;
    image?: string;
    disabled?: boolean;
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

export interface MenuItem {
    label?: string;
    icon?: string;
    command?: string | ((...args: any[]) => void);
    url?: string;
    action?: string;
    items?: MenuItem[];
    key?: string;
    shortcut?: string;
    badge?: string | number;
    route?: string;
    target?: string;
    toggleable?: boolean;
    linkClass?: string;
    checked?: boolean;
    radioGroup?: string;
    radioSelected?: boolean;
    separator?: boolean;
    disabled?: boolean;
    visible?: boolean;
    style?: string;
    class?: string;
    badgeSeverity?: string;
    expanded?: boolean;
    [key: string]: any;
}

export interface CarouselItem {
    image?: string;
    title?: string;
    description?: string;
    url?: string;
}

export interface SidebarItem {
    label: string;
    icon?: string;
    url?: string;
    active?: boolean;
    items?: SidebarItem[];
    badge?: string;
    expanded?: boolean;
    to?: string;
    href?: string;
    badgeClass?: string;
    disabled?: boolean;
    separator?: boolean;
    header?: boolean;
    [key: string]: any;
}

export interface SidebarSubItem {
    label: string;
    isActive?: boolean;
    url?: string;
    subItems?: SidebarSubItem[];
}

export interface SidebarItemModel {
    label: string;
    icon?: string;
    badge?: string;
    isActive?: boolean;
    url?: string;
    subItems?: SidebarSubItem[];
    defaultOpen?: boolean;
}

export interface SidebarGroupModel {
    label: string;
    items: SidebarItemModel[];
}

export interface SplitButtonItem {
    label?: string;
    icon?: string;
    action?: string;
    command?: string | ((...args: any[]) => void);
    url?: string;
    route?: string;
    target?: string;
    severity?: ButtonSeverity | string;
    disabled?: boolean;
    separator?: boolean;
    items?: SplitButtonItem[];
    [key: string]: any;
}

export interface TreeTableColumn {
    field: string;
    header: string;
    expander?: boolean;
    sortable?: boolean;
    frozen?: boolean;
    alignFrozen?: 'left' | 'right';
    width?: string;
    minWidth?: string;
    filterMatchMode?: string;
}

export interface TreeTableNode<TData = any> {
    key: string;
    data: TData;
    children?: TreeTableNode<TData>[];
    leaf?: boolean;
    expanded?: boolean;
    selectable?: boolean;
    loading?: boolean;
    icon?: string;
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

export interface AccordionProps {
    tabs?: AccordionTab[];
    multiple?: boolean;
    controlled?: boolean;
    withRadio?: boolean;
    customIndicator?: 'css' | 'match';
    value?: string | number | (string | number)[];
    activeIndex?: number | number[];
}




# LaughTale Component API Consistency Audit (LT-1608)

**Total Components Scanned:** 76
**Total Prop Declarations:** 934
**Aliased/Synonym Normalizations:** 69

## Canonical Property Conventions

| Canonical Prop | Aliased Synonyms | Purpose |
| :--- | :--- | :--- |
| `data` | `value`, `dataset`, `rows` | Primary tabular/data-bound collection |
| `options` | `items`, `choices`, `elements` | Selectable options array |
| `disabled` | `isDisabled`, `disabledState` | Disabled interactive state |
| `readonly` | `isReadonly`, `readOnlyState` | Readonly state |
| `visible` | `isOpen`, `shown`, `showModal` | Visibility toggle |
| `loading` | `isLoading`, `busy` | Loading indicator state |
| `closable` | `dismissable`, `isClosable`, `canClose` | Dismissable / closable |
| `severity` | `variant`, `intent`, `level` | Visual status theme |

## Component Breakdown

### `accordion` (9 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `tabs` | `AccordionTab[]` |
| `multiple` | `boolean` |
| `controlled` | `boolean` |
| `withRadio` | `boolean` |
| `customIndicator` | `'css' \| 'match'` |
| `value` | `string \| number \| (string \| number)[]` |
| `activeIndex` | `number \| number[]` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `autocomplete` (20 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `items` (canonical: `options`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `items` | `AutoCompleteItem[]` |
| `suggestions` | `AutoCompleteItem[]` |
| `placeholder` | `string` |
| `targetInputName` | `string` |
| `value` | `string \| string[]` |
| `disabled` | `boolean` |
| `dropdown` | `boolean` |
| `showClear` | `boolean` |
| `forceSelection` | `boolean` |
| `multiple` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `variant` | `'outlined' \| 'filled'` |
| `invalid` | `boolean` |
| `fluid` | `boolean` |
| `loading` | `boolean` |
| `scrollHeight` | `string` |
| `optionGroupLabel` | `string` |
| `optionGroupChildren` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `avatar-group` (5 props)
| Prop Name | Type |
| :--- | :--- |
| `avatars` | `AvatarItem[]` |
| `max` | `number` |
| `size` | `'sm' \| 'md' \| 'lg'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `blockui` (4 props)
| Prop Name | Type |
| :--- | :--- |
| `blocked` | `boolean` |
| `message` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `breadcrumb` (7 props)
> **Synonym Aliases:**
> - Uses `items` (canonical: `options`)

| Prop Name | Type |
| :--- | :--- |
| `items` | `BreadcrumbItem[]` |
| `home` | `{` |
| `icon` | `string` |
| `url` | `string` |
| `label` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `button` (23 props)
> **Synonym Aliases:**
> - Uses `variant` (canonical: `severity`) *(supports both via alias fallback)*

| Prop Name | Type |
| :--- | :--- |
| `label` | `string` |
| `icon` | `string` |
| `iconPos` | `'left' \| 'right' \| 'top' \| 'bottom'` |
| `iconOnly` | `boolean` |
| `loading` | `boolean` |
| `loadingIcon` | `string` |
| `disabled` | `boolean` |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast'` |
| `variant` | `'filled' \| 'outlined' \| 'text' \| 'link'` |
| `raised` | `boolean` |
| `rounded` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `badge` | `string` |
| `badgeSeverity` | `string` |
| `badgeClass` | `string` |
| `type` | `string` |
| `as` | `string` |
| `href` | `string` |
| `target` | `string` |
| `ariaLabel` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `carousel` (17 props)
> **Synonym Aliases:**
> - Uses `items` (canonical: `options`)

| Prop Name | Type |
| :--- | :--- |
| `items` | `any[]` |
| `align` | `'start' \| 'center' \| 'end'` |
| `orientation` | `'horizontal' \| 'vertical'` |
| `slidesPerPage` | `number` |
| `loop` | `boolean` |
| `autoSize` | `boolean` |
| `spacing` | `number` |
| `slide` | `number` |
| `autoplayInterval` | `number` |
| `showIndicators` | `boolean` |
| `showNavigators` | `boolean` |
| `demoType` | `'basic' \| 'alignment' \| 'orientation' \| 'loop' \| 'variable' \| 'gallery'` |
| `galleryImages` | `string[]` |
| `class` | `string` |
| `style` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `checkbox` (14 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `checked` | `boolean` |
| `indeterminate` | `boolean` |
| `binary` | `boolean` |
| `label` | `string` |
| `value` | `string` |
| `name` | `string` |
| `inputId` | `string` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `variant` | `'outlined' \| 'filled'` |
| `targetInputName` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `color-picker` (5 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string` |
| `targetInputName` | `string` |
| `disabled` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `command` (10 props)
| Prop Name | Type |
| :--- | :--- |
| `model` | `any[]` |
| `placeholder` | `string` |
| `search` | `string` |
| `filter` | `'default' \| 'fuzzy'` |
| `withDialog` | `boolean` |
| `hotkey` | `string` |
| `customTemplate` | `boolean` |
| `emptyMessage` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `confirm-dialog` (7 props)
| Prop Name | Type |
| :--- | :--- |
| `group` | `string` |
| `position` | `string` |
| `ariaLabel` | `string` |
| `dismissableMask` | `boolean` |
| `closeOnEscape` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `confirm-popup` (8 props)
| Prop Name | Type |
| :--- | :--- |
| `group` | `string` |
| `targetSelector` | `string` |
| `message` | `string` |
| `acceptText` | `string` |
| `rejectText` | `string` |
| `actionName` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `context-menu` (15 props)
> **Synonym Aliases:**
> - Uses `items` (canonical: `options`)

| Prop Name | Type |
| :--- | :--- |
| `model` | `ContextMenuItem[]` |
| `items` | `ContextMenuItem[]` |
| `targetSelector` | `string` |
| `target` | `string` |
| `global` | `boolean` |
| `breakpoint` | `string` |
| `autoZIndex` | `boolean` |
| `baseZIndex` | `number` |
| `demoType` | `'basic' \| 'submenus' \| 'global' \| 'template' \| 'command' \| 'router'` |
| `class` | `string` |
| `style` | `string` |
| `ariaLabel` | `string` |
| `ariaLabelledby` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `datatable` (34 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`) *(supports both via alias fallback)*
> - Uses `rows` (canonical: `data`) *(supports both via alias fallback)*

| Prop Name | Type |
| :--- | :--- |
| `value` | `Record<string, any>[]` |
| `data` | `Record<string, any>[]` |
| `columns` | `DataTableColumn[]` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `showGridlines` | `boolean` |
| `stripedRows` | `boolean` |
| `selectionMode` | `'single' \| 'multiple'` |
| `metaKeySelection` | `boolean` |
| `dataKey` | `string` |
| `paginator` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |
| `rows` | `number` |
| `first` | `number` |
| `rowsPerPageOptions` | `number[]` |
| `currentPageReportTemplate` | `string` |
| `sortMode` | `'single' \| 'multiple'` |
| `removableSort` | `boolean` |
| `sortField` | `string` |
| `sortOrder` | `number` |
| `filterDisplay` | `'none' \| 'row'` |
| `globalFilterFields` | `string[]` |
| `scrollable` | `boolean` |
| `scrollHeight` | `string` |
| `editMode` | `'cell'` |
| `loading` | `boolean` |
| `loadingMode` | `'overlay' \| 'skeleton'` |
| `exportFilename` | `string` |
| `emptyMessage` | `string` |
| `tableStyle` | `string` |
| `title` | `string` |
| `interactiveSize` | `boolean` |
| `showRefresh` | `boolean` |
| `showExport` | `boolean` |

### `dataview` (15 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `rows` (canonical: `data`)
> - Uses `items` (canonical: `options`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `DataViewItem[]` |
| `items` | `DataViewItem[]` |
| `layout` | `'list' \| 'grid'` |
| `paginator` | `boolean` |
| `rows` | `number` |
| `first` | `number` |
| `rowsPerPageOptions` | `number[]` |
| `sortField` | `string` |
| `sortOrder` | `number` |
| `showLayoutSwitcher` | `boolean` |
| `showSort` | `boolean` |
| `loading` | `boolean` |
| `title` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `datepicker` (21 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `targetInputName` | `string` |
| `value` | `string \| string[]` |
| `placeholder` | `string` |
| `dateFormat` | `string` |
| `selectionMode` | `'single' \| 'multiple' \| 'range'` |
| `view` | `'date' \| 'month' \| 'year'` |
| `minDate` | `string` |
| `maxDate` | `string` |
| `showButtonBar` | `boolean` |
| `showTime` | `boolean` |
| `timeOnly` | `boolean` |
| `hourFormat` | `'12' \| '24'` |
| `inline` | `boolean` |
| `showIcon` | `boolean` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `fluid` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `variant` | `'outlined' \| 'filled'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `dialog` (14 props)
| Prop Name | Type |
| :--- | :--- |
| `header` | `string` |
| `visible` | `boolean` |
| `modal` | `boolean` |
| `dismissableMask` | `boolean` |
| `draggable` | `boolean` |
| `maximizable` | `boolean` |
| `position` | `string` |
| `closable` | `boolean` |
| `closeOnEscape` | `boolean` |
| `style` | `string` |
| `class` | `string` |
| `width` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `divider` (5 props)
| Prop Name | Type |
| :--- | :--- |
| `layout` | `'horizontal' \| 'vertical'` |
| `type` | `'solid' \| 'dotted' \| 'dashed'` |
| `align` | `'left' \| 'center' \| 'right' \| 'top' \| 'bottom'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `drawer` (15 props)
| Prop Name | Type |
| :--- | :--- |
| `id` | `string` |
| `header` | `string` |
| `title` | `string` |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom' \| 'full'` |
| `visible` | `boolean` |
| `modal` | `boolean` |
| `dismissableMask` | `boolean` |
| `closable` | `boolean` |
| `closeOnEscape` | `boolean` |
| `width` | `string` |
| `height` | `string` |
| `style` | `string` |
| `class` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `dropzone` (6 props)
| Prop Name | Type |
| :--- | :--- |
| `targetInputName` | `string` |
| `allowedExtensions` | `string` |
| `maxSizeMb` | `number` |
| `dropPrompt` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `fieldset` (7 props)
| Prop Name | Type |
| :--- | :--- |
| `legend` | `string` |
| `toggleable` | `boolean` |
| `collapsed` | `boolean` |
| `controlled` | `boolean` |
| `toggleIcon` | `'plusMinus' \| 'chevron'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `fileupload` (22 props)
| Prop Name | Type |
| :--- | :--- |
| `id` | `string` |
| `mode` | `'basic' \| 'advanced' \| 'custom'` |
| `name` | `string` |
| `url` | `string` |
| `accept` | `string` |
| `maxFileSize` | `number` |
| `multiple` | `boolean` |
| `auto` | `boolean` |
| `customUpload` | `boolean` |
| `chooseLabel` | `string` |
| `uploadLabel` | `string` |
| `cancelLabel` | `string` |
| `previewImages` | `boolean` |
| `emptyTitle` | `string` |
| `emptySubtitle` | `string` |
| `initialFile` | `{` |
| `name` | `string` |
| `size` | `number` |
| `previewUrl` | `string` |
| `status` | `'pending' \| 'completed' \| 'uploading'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `float-label` (6 props)
> **Synonym Aliases:**
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `label` | `string` |
| `variant` | `'over' \| 'in' \| 'on'` |
| `for` | `string` |
| `invalid` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `galleria` (4 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `GalleriaItem[]` |
| `autoPlay` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `ifta-label` (5 props)
| Prop Name | Type |
| :--- | :--- |
| `label` | `string` |
| `for` | `string` |
| `invalid` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `image-compare` (21 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `modelValue` | `number` |
| `value` | `number` |
| `min` | `number` |
| `max` | `number` |
| `step` | `number` |
| `orientation` | `'horizontal' \| 'vertical'` |
| `slideOnHover` | `boolean` |
| `disabled` | `boolean` |
| `readonly` | `boolean` |
| `invalid` | `boolean` |
| `beforeImage` | `string` |
| `afterImage` | `string` |
| `beforeLabel` | `string` |
| `afterLabel` | `string` |
| `customHandle` | `boolean` |
| `demoType` | `'basic' \| 'custom-handle' \| 'hover' \| 'vertical' \| 'with-chart' \| 'controlled' \| 'template'` |
| `class` | `string` |
| `style` | `string` |
| `ariaLabel` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `inplace` (6 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string` |
| `targetInputName` | `string` |
| `placeholder` | `string` |
| `disabled` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `input-group` (4 props)
| Prop Name | Type |
| :--- | :--- |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `input-mask` (17 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `mask` | `string` |
| `value` | `string` |
| `placeholder` | `string` |
| `slotChar` | `string` |
| `autoClear` | `boolean` |
| `unmask` | `boolean` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `disabled` | `boolean` |
| `readonly` | `boolean` |
| `invalid` | `boolean` |
| `inputId` | `string` |
| `name` | `string` |
| `targetInputName` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `input-number` (28 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `targetInputName` | `string` |
| `inputId` | `string` |
| `value` | `number \| null` |
| `mode` | `'decimal' \| 'currency'` |
| `currency` | `string` |
| `currencyDisplay` | `'symbol' \| 'code' \| 'name'` |
| `locale` | `string` |
| `useGrouping` | `boolean \| string` |
| `minFractionDigits` | `number` |
| `maxFractionDigits` | `number` |
| `prefix` | `string` |
| `suffix` | `string` |
| `min` | `number` |
| `max` | `number` |
| `step` | `number` |
| `showButtons` | `boolean \| string` |
| `buttonLayout` | `'stacked' \| 'horizontal' \| 'vertical'` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean \| string` |
| `invalid` | `boolean \| string` |
| `showClear` | `boolean \| string` |
| `placeholder` | `string` |
| `disabled` | `boolean \| string` |
| `inputClass` | `string` |
| `inputStyle` | `Record<string, string> \| string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `input-otp` (16 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `targetInputName` | `string` |
| `inputId` | `string` |
| `value` | `string` |
| `length` | `number \| string` |
| `mask` | `boolean \| string` |
| `integerOnly` | `boolean \| string` |
| `grouped` | `boolean \| string` |
| `separator` | `string` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `disabled` | `boolean \| string` |
| `readonlyMode` | `boolean \| string` |
| `invalid` | `boolean \| string` |
| `autofocus` | `boolean \| string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `input-password` (21 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `targetInputName` | `string` |
| `inputId` | `string` |
| `value` | `string` |
| `placeholder` | `string` |
| `toggleMask` | `boolean \| string` |
| `showMeter` | `boolean \| string` |
| `showRequirements` | `boolean \| string` |
| `requirementsMode` | `'chips' \| 'list' \| 'popover'` |
| `feedback` | `boolean \| string` |
| `minLength` | `number \| string` |
| `icon` | `string` |
| `showClear` | `boolean \| string` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean \| string` |
| `disabled` | `boolean \| string` |
| `readonlyMode` | `boolean \| string` |
| `invalid` | `boolean \| string` |
| `inputClass` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `input-tags` (20 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `values` | `string[] \| string` |
| `value` | `string[] \| string` |
| `placeholder` | `string` |
| `separator` | `string` |
| `delimiter` | `string` |
| `addOnPaste` | `boolean` |
| `allowDuplicate` | `boolean` |
| `max` | `number` |
| `typeahead` | `boolean` |
| `suggestions` | `string[] \| string` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `disabled` | `boolean` |
| `readonlyMode` | `boolean` |
| `invalid` | `boolean` |
| `targetInputName` | `string` |
| `inputId` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `input-text` (24 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string` |
| `placeholder` | `string` |
| `type` | `string` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `disabled` | `boolean` |
| `readonlyMode` | `boolean` |
| `invalid` | `boolean` |
| `showClear` | `boolean` |
| `clearable` | `boolean` |
| `iconLeft` | `string` |
| `iconRight` | `string` |
| `icon` | `string` |
| `targetInputName` | `string` |
| `name` | `string` |
| `inputId` | `string` |
| `id` | `string` |
| `ariaLabel` | `string` |
| `ariaLabelledBy` | `string` |
| `ariaDescribedBy` | `string` |
| `helpText` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `knob` (7 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `number` |
| `min` | `number` |
| `max` | `number` |
| `step` | `number` |
| `size` | `number` |
| `color` | `string` |
| `valueTemplate` | `string` |

### `listbox` (34 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `options` | `(ListboxOptionItem \| string)[]` |
| `value` | `any` |
| `selectedValue` | `any` |
| `multiple` | `boolean` |
| `metaKeySelection` | `boolean` |
| `checkbox` | `boolean` |
| `checkmark` | `boolean` |
| `highlightOnSelect` | `boolean` |
| `filter` | `boolean` |
| `filterPlaceholder` | `string` |
| `filterMatchMode` | `'contains' \| 'startsWith'` |
| `optionLabel` | `string` |
| `optionValue` | `string` |
| `optionDisabled` | `string` |
| `optionGroupLabel` | `string` |
| `optionGroupChildren` | `string` |
| `scrollHeight` | `string` |
| `striped` | `boolean` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `inputId` | `string` |
| `name` | `string` |
| `targetInputName` | `string` |
| `header` | `string` |
| `headerCount` | `string` |
| `footer` | `string` |
| `autoOptionFocus` | `boolean` |
| `selectOnFocus` | `boolean` |
| `focusOnHover` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `menu` (10 props)
> **Synonym Aliases:**
> - Uses `items` (canonical: `options`)

| Prop Name | Type |
| :--- | :--- |
| `model` | `MenuItemData[]` |
| `items` | `MenuItemData[]` |
| `popup` | `boolean` |
| `triggerId` | `string` |
| `expandedKeys` | `Record<string, boolean>` |
| `customTemplate` | `boolean` |
| `class` | `string` |
| `style` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `menubar` (7 props)
> **Synonym Aliases:**
> - Uses `items` (canonical: `options`)

| Prop Name | Type |
| :--- | :--- |
| `model` | `MenubarItem[]` |
| `items` | `MenubarItem[]` |
| `customTemplate` | `boolean` |
| `class` | `string` |
| `style` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `message` (17 props)
> **Synonym Aliases:**
> - Uses `variant` (canonical: `severity`) *(supports both via alias fallback)*

| Prop Name | Type |
| :--- | :--- |
| `severity` | `'info' \| 'success' \| 'warn' \| 'error' \| 'secondary' \| 'contrast'` |
| `variant` | `'outlined' \| 'simple' \| 'filled'` |
| `size` | `'small' \| 'large'` |
| `closable` | `boolean` |
| `life` | `number` |
| `icon` | `string` |
| `closeIcon` | `string` |
| `text` | `string` |
| `content` | `string` |
| `avatar` | `string` |
| `spin` | `boolean` |
| `class` | `string` |
| `style` | `string` |
| `dynamic` | `boolean` |
| `messages` | `Array<{ severity: string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `meter-group` (5 props)
| Prop Name | Type |
| :--- | :--- |
| `values` | `MeterValue[]` |
| `title` | `string` |
| `showLabels` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `paginator` (17 props)
> **Synonym Aliases:**
> - Uses `rows` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `totalRecords` | `number` |
| `rows` | `number` |
| `first` | `number` |
| `pageLinkSize` | `number` |
| `rowsPerPageOptions` | `number[]` |
| `template` | `string` |
| `currentPageReportTemplate` | `string` |
| `showFirstLast` | `boolean` |
| `showJumpToPageDropdown` | `boolean` |
| `showJumpToPageInput` | `boolean` |
| `showSlider` | `boolean` |
| `compact` | `boolean` |
| `targetInputName` | `string` |
| `targetSelector` | `string` |
| `images` | `string[]` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `panel` (7 props)
| Prop Name | Type |
| :--- | :--- |
| `header` | `string` |
| `toggleable` | `boolean` |
| `collapsed` | `boolean` |
| `controlled` | `boolean` |
| `toggleIcon` | `'plusMinus' \| 'chevron'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `popover` (8 props)
> **Synonym Aliases:**
> - Uses `dismissable` (canonical: `closable`)

| Prop Name | Type |
| :--- | :--- |
| `id` | `string` |
| `triggerId` | `string` |
| `placement` | `'bottom' \| 'top' \| 'left' \| 'right'` |
| `showArrow` | `boolean` |
| `dismissable` | `boolean` |
| `closeOnEscape` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `progress-bar` (7 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `number` |
| `mode` | `'determinate' \| 'indeterminate'` |
| `showValue` | `boolean` |
| `height` | `string` |
| `color` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `radio-button` (22 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `checked` | `boolean` |
| `label` | `string` |
| `name` | `string` |
| `value` | `string` |
| `description` | `string` |
| `badge` | `string` |
| `flag` | `string` |
| `icon` | `string` |
| `price` | `string` |
| `card` | `boolean` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `disabled` | `boolean` |
| `readonly` | `boolean` |
| `invalid` | `boolean` |
| `inputId` | `string` |
| `targetInputName` | `string` |
| `options` | `(RadioButtonOption \| string)[]` |
| `selectedValue` | `string` |
| `layout` | `'horizontal' \| 'vertical'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `rating` (17 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `number` |
| `stars` | `number` |
| `allowHalf` | `boolean` |
| `cancel` | `boolean` |
| `allowCancel` | `boolean` |
| `orientation` | `'horizontal' \| 'vertical'` |
| `readonlyMode` | `boolean` |
| `readonly` | `boolean` |
| `disabled` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `mode` | `'stars' \| 'emoji' \| 'template'` |
| `emojis` | `string[] \| string` |
| `targetInputName` | `string` |
| `name` | `string` |
| `inputId` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `scroll-top` (4 props)
| Prop Name | Type |
| :--- | :--- |
| `threshold` | `number` |
| `behavior` | `'smooth' \| 'auto'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `scrollarea` (5 props)
> **Synonym Aliases:**
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` |
| `variant` | `'auto' \| 'hover' \| 'scroll' \| 'always' \| 'hidden'` |
| `mask` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `select-button` (16 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `items` (canonical: `options`) *(supports both via alias fallback)*

| Prop Name | Type |
| :--- | :--- |
| `options` | `(SelectButtonOption \| string)[]` |
| `items` | `(SelectButtonOption \| string)[]` |
| `value` | `any` |
| `selectedValue` | `any` |
| `values` | `any[]` |
| `multiple` | `boolean` |
| `unselectable` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `name` | `string` |
| `targetInputName` | `string` |
| `inputId` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `select` (28 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `options` | `(SelectOption \| string)[]` |
| `value` | `any` |
| `selectedValue` | `any` |
| `placeholder` | `string` |
| `multiple` | `boolean` |
| `checkmark` | `boolean` |
| `checkbox` | `boolean` |
| `display` | `'comma' \| 'chip'` |
| `filter` | `boolean` |
| `filterPlaceholder` | `string` |
| `filterBy` | `string` |
| `showClear` | `boolean` |
| `editable` | `boolean` |
| `loading` | `boolean` |
| `scrollHeight` | `string` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `invalid` | `boolean` |
| `disabled` | `boolean` |
| `readonly` | `boolean` |
| `inputId` | `string` |
| `name` | `string` |
| `targetInputName` | `string` |
| `header` | `string` |
| `footer` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `sidebar` (25 props)
> **Synonym Aliases:**
> - Uses `items` (canonical: `options`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `items` | `SidebarItem[]` |
| `title` | `string` |
| `searchable` | `boolean` |
| `position` | `'left' \| 'right'` |
| `collapsed` | `boolean` |
| `id` | `string` |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` |
| `collapsible` | `'none' \| 'offcanvas' \| 'icon'` |
| `side` | `'left' \| 'right'` |
| `overlay` | `boolean` |
| `openOnHover` | `boolean` |
| `backdrop` | `boolean` |
| `open` | `boolean` |
| `width` | `string` |
| `iconWidth` | `string` |
| `demoType` | `'variants' \| 'menu' \| 'responsive' \| 'dual' \| 'multi' \| 'nested' \| 'chat' \| 'app'` |
| `groups` | `SidebarGroupModel[]` |
| `headerTitle` | `string` |
| `headerLogo` | `string` |
| `headerColor` | `string` |
| `showControls` | `boolean` |
| `class` | `string` |
| `style` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `skeleton` (6 props)
| Prop Name | Type |
| :--- | :--- |
| `shape` | `'rectangle' \| 'circle'` |
| `width` | `string` |
| `height` | `string` |
| `borderRadius` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `slider` (18 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `number \| number[] \| string` |
| `values` | `number[]` |
| `min` | `number` |
| `max` | `number` |
| `step` | `number` |
| `range` | `boolean` |
| `minStepsBetweenHandles` | `number` |
| `orientation` | `'horizontal' \| 'vertical'` |
| `disabled` | `boolean` |
| `disabledMinHandle` | `boolean` |
| `disabledMaxHandle` | `boolean` |
| `targetInputName` | `string` |
| `name` | `string` |
| `inputId` | `string` |
| `ariaLabel` | `string` |
| `ariaLabelledBy` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `speed-dial` (6 props)
| Prop Name | Type |
| :--- | :--- |
| `severity` | `string` |
| `rounded` | `boolean` |
| `iconOnly` | `boolean` |
| `styleClass` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `split-button` (18 props)
| Prop Name | Type |
| :--- | :--- |
| `label` | `string` |
| `icon` | `string` |
| `dropdownIcon` | `string` |
| `model` | `SplitButtonItem[]` |
| `severity` | `ButtonSeverity` |
| `raised` | `boolean` |
| `rounded` | `boolean` |
| `text` | `boolean` |
| `outlined` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `disabled` | `boolean` |
| `fluid` | `boolean` |
| `buttonProps` | `Record<string, any>` |
| `menuButtonProps` | `Record<string, any>` |
| `appendTo` | `string` |
| `action` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `splitter` (7 props)
| Prop Name | Type |
| :--- | :--- |
| `layout` | `'horizontal' \| 'vertical'` |
| `sizes` | `number[]` |
| `disabled` | `boolean` |
| `stateKey` | `string` |
| `stateStorage` | `'local' \| 'session'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `stepper` (5 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string \| number` |
| `linear` | `boolean` |
| `layout` | `'horizontal' \| 'vertical'` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `tabs` (6 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string \| number` |
| `scrollable` | `boolean` |
| `selectOnFocus` | `boolean` |
| `lazy` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `tag` (6 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string` |
| `severity` | `'success' \| 'info' \| 'warning' \| 'danger' \| 'secondary' \| 'contrast'` |
| `rounded` | `boolean` |
| `icon` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `textarea` (16 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `rows` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string` |
| `placeholder` | `string` |
| `rows` | `number` |
| `cols` | `number` |
| `maxLength` | `number` |
| `autoResize` | `boolean` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `fluid` | `boolean` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `variant` | `'outlined' \| 'filled'` |
| `targetInputName` | `string` |
| `name` | `string` |
| `inputId` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `theme-studio` (3 props)
| Prop Name | Type |
| :--- | :--- |
| `defaultOpen` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `tieredmenu` (16 props)
> **Synonym Aliases:**
> - Uses `items` (canonical: `options`)

| Prop Name | Type |
| :--- | :--- |
| `model` | `MenuItem[]` |
| `items` | `MenuItem[]` |
| `popup` | `boolean` |
| `triggerId` | `string` |
| `triggerText` | `string` |
| `triggerIcon` | `string` |
| `triggerVariant` | `string` |
| `triggerSeverity` | `string` |
| `customTemplate` | `boolean` |
| `autoZIndex` | `boolean` |
| `baseZIndex` | `number` |
| `breakpoint` | `string` |
| `class` | `string` |
| `style` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `timeline` (9 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `any[]` |
| `events` | `any[]` |
| `align` | `'left' \| 'right' \| 'alternate' \| 'top' \| 'bottom'` |
| `layout` | `'vertical' \| 'horizontal'` |
| `title` | `string` |
| `interactive` | `boolean` |
| `activityFeed` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `toast` (10 props)
| Prop Name | Type |
| :--- | :--- |
| `group` | `string` |
| `position` | `'top-right' \| 'top-left' \| 'top-center' \| 'bottom-right' \| 'bottom-left' \| 'bottom-center' \| 'center'` |
| `limit` | `number` |
| `gap` | `number` |
| `autoZIndex` | `boolean` |
| `baseZIndex` | `number` |
| `class` | `string` |
| `style` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `toggle-button` (18 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `checked` | `boolean` |
| `value` | `boolean \| string` |
| `onLabel` | `string` |
| `offLabel` | `string` |
| `onIcon` | `string` |
| `offIcon` | `string` |
| `icon` | `string` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `name` | `string` |
| `targetInputName` | `string` |
| `inputId` | `string` |
| `ariaLabel` | `string` |
| `ariaLabelledBy` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `toggle-switch` (17 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `checked` | `boolean` |
| `value` | `boolean \| string` |
| `label` | `string` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `checkedIcon` | `string` |
| `uncheckedIcon` | `string` |
| `icon` | `string` |
| `inputId` | `string` |
| `name` | `string` |
| `targetInputName` | `string` |
| `ariaLabel` | `string` |
| `ariaLabelledBy` | `string` |
| `sliderClass` | `string` |
| `handleClass` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `toolbar` (3 props)
| Prop Name | Type |
| :--- | :--- |
| `ariaLabel` | `string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `tooltip-component` (11 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `string` |
| `text` | `string` |
| `target` | `string` |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` |
| `showDelay` | `number` |
| `hideDelay` | `number` |
| `event` | `'hover' \| 'focus' \| 'both'` |
| `autoHide` | `boolean` |
| `escape` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `tree-select` (28 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)
> - Uses `variant` (canonical: `severity`)

| Prop Name | Type |
| :--- | :--- |
| `nodes` | `TreeNodeItem[]` |
| `options` | `TreeNodeItem[]` |
| `departments` | `TreeNodeItem[]` |
| `value` | `string \| string[] \| Record<string, boolean>` |
| `selectedValue` | `string \| string[] \| Record<string, boolean>` |
| `selectionMode` | `'single' \| 'multiple' \| 'checkbox'` |
| `display` | `'comma' \| 'chip'` |
| `placeholder` | `string` |
| `filter` | `boolean` |
| `filterBy` | `string` |
| `filterMode` | `'lenient' \| 'strict'` |
| `filterPlaceholder` | `string` |
| `filterInputAutoFocus` | `boolean` |
| `showClear` | `boolean` |
| `clearable` | `boolean` |
| `variant` | `'outlined' \| 'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `fluid` | `boolean` |
| `disabled` | `boolean` |
| `invalid` | `boolean` |
| `inputId` | `string` |
| `name` | `string` |
| `targetInputName` | `string` |
| `header` | `string` |
| `footer` | `string` |
| `metaKeySelection` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `tree` (25 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `TreeNode[]` |
| `nodes` | `TreeNode[]` |
| `selectionMode` | `'single' \| 'multiple' \| 'checkbox' \| null` |
| `selectionKeys` | `any` |
| `expandedKeys` | `Record<string, boolean>` |
| `filter` | `boolean` |
| `filterPlaceholder` | `string` |
| `filterMode` | `'lenient' \| 'strict'` |
| `metaKeySelection` | `boolean` |
| `loading` | `boolean` |
| `loadingMode` | `'mask' \| 'icon'` |
| `draggableNodes` | `boolean` |
| `droppableNodes` | `boolean` |
| `draggableScope` | `string` |
| `droppableScope` | `string \| string[]` |
| `toggleIcon` | `'chevron' \| 'plusMinus' \| 'circle'` |
| `showSelectAll` | `boolean` |
| `showControls` | `boolean` |
| `keyboardInfo` | `boolean` |
| `lazy` | `boolean` |
| `skeleton` | `boolean` |
| `emptyMessage` | `string` |
| `events` | `boolean` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |

### `treetable` (15 props)
> **Synonym Aliases:**
> - Uses `value` (canonical: `data`)

| Prop Name | Type |
| :--- | :--- |
| `value` | `any[]` |
| `nodes` | `any[]` |
| `columns` | `TreeTableColumn[]` |
| `size` | `'small' \| 'normal' \| 'large'` |
| `showGridlines` | `boolean` |
| `selectionMode` | `'single' \| 'multiple' \| 'checkbox' \| null` |
| `selectionKeys` | `any` |
| `expandedKeys` | `Record<string, boolean>` |
| `metaKeySelection` | `boolean` |
| `sortMode` | `'single' \| 'multiple'` |
| `sortField` | `string` |
| `sortOrder` | `number` |
| `multiSortMeta` | `{ field: string` |
| `pt` | `PassthroughRecord` |
| `studioOverrides` | `Record<string, any>` |


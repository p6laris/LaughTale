---
title: Enterprise UI Components Overview
description: Explore LaughTale's comprehensive catalog of 76+ Aura UI components covering forms, data grids, navigation, overlays, and charts.
order: 8
icon: layout
category: Framework Architecture
---

# 🎨 Enterprise UI Components Overview

LaughTale includes a complete suite of **76+ enterprise-grade Aura UI components** designed for ASP.NET Core. Every component supports:
- **Server-Side Rendering (SSR)** baseline for instant zero-FOUC paint.
- **Progressive Hydration** (`Load`, `Idle`, `Visible`, `Media`, `Interaction`).
- **Dark/Light Mode** token synchronization.
- **Kurdish / Arabic RTL** bi-directional layout mirroring.

---

## 🗂️ Component Categories

### 1. Data Grids & Trees
- **DataTable (`<island-datatable />`)**: High-performance grid with client/server lazy loading, multi-column sorting, row filtering, checkbox selection, and CSV export.
- **TreeTable (`<island-treetable />`)**: Hierarchical tree grid with recursive node expansion and indentation.
- **TreeSelect (`<island-tree-select />`)**: Multi-level hierarchical dropdown picker.
- **DataView (`<island-dataview />`)**: Grid and list layouts with built-in paginators.

### 2. Form & Input Controls
- **InputNumber (`<island-input-number />`)**: Currency, percentage, and numeric stepper inputs.
- **DatePicker (`<island-datepicker />`)**: Gregorian calendar picker with weekend overrides and range selection.
- **InputOtp (`<island-input-otp />`)**: 4 to 8 digit one-time password input with auto-focus shifting.
- **ToggleSwitch (`<island-toggle-switch />`)**: Accessible animated boolean toggle.
- **FileUpload (`<island-fileupload />`)**: Drag-and-drop file uploader with chunking and progress bars.
- **Select (`<island-select />`)**: High-speed dropdown with search filtering and virtualization.
- **AutoComplete (`<island-autocomplete />`)**: Real-time async search with keyboard suggestions.
- **Slider (`<island-slider />`) & Knob (`<island-knob />`)**: Range and radial value controls.
- **ColorPicker (`<island-color-picker />`)**: Inline and popup RGB/Hex color selector.

### 3. Overlays & Dialogs
- **Dialog (`<island-dialog />`)**: Accessible modal dialog with focus traps and smooth scale transitions.
- **Drawer / Sidebar (`<island-drawer />`)**: Slide-out panels from left, right, top, or bottom.
- **ConfirmDialog & ConfirmPopup**: Declarative confirmation prompts for destructive actions.
- **Popover & Tooltip**: Floating contextual hint containers.

### 4. Navigation & Steppers
- **Stepper (`<island-stepper />`)**: Multi-step checkout and onboarding wizards with step validation.
- **Menubar & TieredMenu**: Desktop top navigation and nested cascading menus.
- **Tabs (`<island-tabs />`) & Accordion (`<island-accordion />`)**: Tabbed and collapsible content panels.
- **Breadcrumb (`<island-breadcrumb />`)**: Hierarchical route trail navigation.

### 5. Media, Feedback & Telemetry
- **Timeline (`<island-timeline />`)**: Chronological audit trails and activity logs with left/right/alternate alignment.
- **MeterGroup & ProgressBar**: Segmented capacity metrics and linear loading bars.
- **ImageCompare (`<island-image-compare />`)**: Before/after image slider.
- **Toast & Message**: Dynamic alerts with severity levels (`success`, `info`, `warn`, `danger`).
- **ThemeStudio (`<island-theme-studio />`)**: Real-time palette and design token customizer.

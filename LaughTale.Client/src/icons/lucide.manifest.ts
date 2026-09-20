/**
 * LaughTale: Extra Icon Sprite References
 *
 * `scripts/gen-icons.mjs` builds the sprite by statically regex-scanning the repo for LITERAL
 * icon-name strings at a `getLucideIcon("...")`/`LucideIcons.xxx`/`icon="..."` call site. It can't
 * see an icon name that only exists as a *variable* at the point `getLucideIcon` is actually called
 * — which is exactly how nav/menu/command-palette/speed-dial/breadcrumb/tiered-menu items work:
 * their icon field is demo data (`NavigationData.cs`, `Components.cshtml.cs`, etc.) read at runtime
 * via `LucideIcons[item.icon]` (a dynamic property access on the `LucideIcons` Proxy in `lucide.ts`).
 * Those icons render correctly at runtime (the Proxy resolves any string), but never make it into the
 * generated sprite, so `<use href="#id">` points at nothing and the icon is invisible.
 *
 * This file is never imported by anything - it exists purely so the scanner's regex has a literal
 * string to find for each of these otherwise-invisible-to-static-analysis icon names. Add an entry
 * here whenever a new icon name is introduced only as demo/nav data rather than a literal call site.
 */
import { getLucideIcon } from './lucide';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _extraIconRefs = [
    getLucideIcon('activity'),
    getLucideIcon('shield-alert'),
    getLucideIcon('list-filter'),
    getLucideIcon('folder-tree'),
    getLucideIcon('check-circle'),
    getLucideIcon('gauge'),
    getLucideIcon('table-2'),
    getLucideIcon('grid'),
    getLucideIcon('columns-3'),
    getLucideIcon('arrow-left-right'),
    getLucideIcon('square'),
    getLucideIcon('compass'),
    getLucideIcon('more-horizontal'),
    getLucideIcon('list-ordered'),
    getLucideIcon('sidebar'),
    getLucideIcon('message-square'),
    getLucideIcon('gallery-thumbnails'),
    getLucideIcon('upload-cloud'),
    getLucideIcon('align-left'),
    getLucideIcon('align-center'),
    getLucideIcon('align-right'),
    getLucideIcon('align-justify'),
    getLucideIcon('link'),
    getLucideIcon('briefcase'),
    getLucideIcon('bar-chart-3'),
    getLucideIcon('undo'),
    getLucideIcon('rotate-ccw'),
    getLucideIcon('scissors'),
    getLucideIcon('clipboard'),
    getLucideIcon('printer'),
    getLucideIcon('file-edit'),
    getLucideIcon('cloud-download'),
    getLucideIcon('monitor'),
    getLucideIcon('git-commit'),
    getLucideIcon('download-cloud'),
    getLucideIcon('book-open'),
    getLucideIcon('git-branch'),
    getLucideIcon('bold'),
    getLucideIcon('italic'),
    getLucideIcon('map'),
    getLucideIcon('maximize-2'),
    getLucideIcon('minimize-2'),
    getLucideIcon('calculator'),
    getLucideIcon('trending-up'),
    getLucideIcon('power'),
    getLucideIcon('user-minus'),
    getLucideIcon('filter'),
    getLucideIcon('calendar-plus'),
    getLucideIcon('calendar-minus'),
    getLucideIcon('archive')
];

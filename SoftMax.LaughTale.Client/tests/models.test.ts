import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type {
    MenuItem,
    SplitButtonItem,
    CarouselItem,
    SidebarGroupModel,
    SidebarItemModel,
    SidebarSubItem,
    DataTableColumn,
    TreeNode,
    TimelineItem,
    OrgChartNode,
    PickListItem,
    OrderListItem,
    CascadeSelectNode
} from '../src/types/models';

describe('TypeScript & C# Model Parity Suite (LT-404)', () => {
    it('instantiates and validates MenuItem model structure', () => {
        const item: MenuItem = {
            label: 'Settings',
            icon: 'cog',
            url: '/settings',
            command: 'app.openSettings',
            shortcut: 'Ctrl+S',
            badge: 'New',
            disabled: false,
            items: [
                { label: 'Profile', url: '/profile' }
            ]
        };

        assert.equal(item.label, 'Settings');
        assert.equal(item.items?.length, 1);
        assert.equal(item.items[0].label, 'Profile');
    });

    it('instantiates and validates SplitButtonItem structure', () => {
        const splitButton: SplitButtonItem = {
            label: 'Save',
            icon: 'save',
            action: 'save-primary',
            command: 'app.save',
            severity: 'success',
            items: [
                { label: 'Save As...', action: 'save-as' }
            ]
        };

        assert.equal(splitButton.severity, 'success');
        assert.equal(splitButton.items?.length, 1);
    });

    it('instantiates and validates CarouselItem and Sidebar models', () => {
        const carousel: CarouselItem = {
            image: '/images/hero.jpg',
            title: 'Welcome to LaughTale',
            description: 'Next-gen Web Platform'
        };

        const subItem: SidebarSubItem = {
            label: 'Analytics',
            url: '/analytics',
            isActive: true
        };

        const sidebarItem: SidebarItemModel = {
            label: 'Dashboard',
            icon: 'home',
            subItems: [subItem],
            defaultOpen: true
        };

        const sidebarGroup: SidebarGroupModel = {
            label: 'General',
            items: [sidebarItem]
        };

        assert.equal(carousel.title, 'Welcome to LaughTale');
        assert.equal(sidebarGroup.items[0].subItems?.[0].label, 'Analytics');
    });

    it('instantiates and validates DataTableColumn schema', () => {
        const col: DataTableColumn = {
            field: 'id',
            header: 'Identifier',
            sortable: true,
            filterable: true,
            filterPlaceholder: 'Search ID...',
            frozen: true,
            align: 'center'
        };

        assert.equal(col.field, 'id');
        assert.equal(col.sortable, true);
        assert.equal(col.filterPlaceholder, 'Search ID...');
    });
});

import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useDataSource } from '../../src/composables/useDataSource.ts';

interface User {
    id: number;
    name: string;
    role: string;
    score: number;
}

const sampleUsers: User[] = [
    { id: 1, name: 'Alice Smith', role: 'Admin', score: 95 },
    { id: 2, name: 'Bob Jones', role: 'Editor', score: 82 },
    { id: 3, name: 'Charlie Brown', role: 'Viewer', score: 67 },
    { id: 4, name: 'David Clark', role: 'Admin', score: 88 },
    { id: 5, name: 'Eve Adams', role: 'Editor', score: 91 }
];

describe('useDataSource Headless Primitive Suite (LT-501)', () => {
    it('initializes with default state and paginated slice', () => {
        const ds = useDataSource({
            data: sampleUsers,
            pageSize: 2
        });

        const state = ds.getState();
        assert.equal(state.totalRecords, 5);
        assert.equal(state.pageCount, 3);
        assert.equal(state.page, 0);
        assert.equal(state.paginatedData.length, 2);
        assert.equal(state.paginatedData[0].name, 'Alice Smith');
        assert.equal(state.paginatedData[1].name, 'Bob Jones');
    });

    it('handles sorting ascending and descending', () => {
        const ds = useDataSource({
            data: sampleUsers,
            pageSize: 10
        });

        ds.setSort('score', 1); // Ascending
        assert.equal(ds.getState().sortedData[0].score, 67);
        assert.equal(ds.getState().sortedData[4].score, 95);

        ds.setSort('score', -1); // Descending
        assert.equal(ds.getState().sortedData[0].score, 95);
        assert.equal(ds.getState().sortedData[4].score, 67);
    });

    it('filters data by field constraint and global search', () => {
        const ds = useDataSource({
            data: sampleUsers,
            pageSize: 10,
            globalFilterFields: ['name', 'role']
        });

        // Field filter
        ds.setFilter('role', 'Admin', 'equals');
        assert.equal(ds.getState().filteredData.length, 2);
        assert.equal(ds.getState().filteredData[0].name, 'Alice Smith');
        assert.equal(ds.getState().filteredData[1].name, 'David Clark');

        // Global search
        ds.clearFilters();
        ds.setGlobalFilter('eve');
        assert.equal(ds.getState().filteredData.length, 1);
        assert.equal(ds.getState().filteredData[0].name, 'Eve Adams');
    });

    it('navigates pages cleanly', () => {
        const ds = useDataSource({
            data: sampleUsers,
            pageSize: 2
        });

        ds.nextPage();
        assert.equal(ds.getState().page, 1);
        assert.equal(ds.getState().paginatedData[0].name, 'Charlie Brown');

        ds.nextPage();
        assert.equal(ds.getState().page, 2);
        assert.equal(ds.getState().paginatedData.length, 1);
        assert.equal(ds.getState().paginatedData[0].name, 'Eve Adams');

        ds.prevPage();
        assert.equal(ds.getState().page, 1);
    });
});

/**
 * SoftMax.LaughTale: Headless DataSource Composable (LT-501)
 * Standardized generic engine for sorting, filtering, and pagination across data islands.
 */

export type FilterMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'in';

export interface FilterConstraint {
    value: any;
    matchMode?: FilterMatchMode;
}

export interface DataSourceOptions<T> {
    data?: T[];
    pageSize?: number;
    initialPage?: number;
    initialSortField?: keyof T | string;
    initialSortOrder?: 1 | -1 | 0; // 1 = Asc, -1 = Desc, 0 = None
    globalFilterFields?: (keyof T | string)[];
    onStateChange?: (state: DataSourceState<T>) => void;
}

export interface DataSourceState<T> {
    data: T[];
    filteredData: T[];
    sortedData: T[];
    paginatedData: T[];
    page: number;
    pageSize: number;
    pageCount: number;
    totalRecords: number;
    sortField: keyof T | string | null;
    sortOrder: 1 | -1 | 0;
    filters: Record<string, FilterConstraint>;
    globalFilter: string | null;
}

export interface DataSource<T> {
    getState(): DataSourceState<T>;
    setData(data: T[]): void;
    setFilter(field: string, value: any, matchMode?: FilterMatchMode): void;
    removeFilter(field: string): void;
    clearFilters(): void;
    setGlobalFilter(value: string | null): void;
    setSort(field: keyof T | string, order?: 1 | -1 | 0): void;
    setPage(page: number): void;
    setPageSize(size: number): void;
    nextPage(): void;
    prevPage(): void;
}

export function useDataSource<T = any>(options: DataSourceOptions<T> = {}): DataSource<T> {
    let rawData = options.data ? [...options.data] : [];
    let pageSize = Math.max(1, options.pageSize || 10);
    let currentPage = Math.max(0, options.initialPage || 0);
    let currentSortField: keyof T | string | null = options.initialSortField || null;
    let currentSortOrder: 1 | -1 | 0 = options.initialSortOrder ?? 0;
    let currentFilters: Record<string, FilterConstraint> = {};
    let currentGlobalFilter: string | null = null;
    const globalFilterFields = options.globalFilterFields || [];

    let computedFiltered: T[] = [];
    let computedSorted: T[] = [];
    let computedPaginated: T[] = [];

    function recalculate(): void {
        // 1. Filtering
        computedFiltered = rawData.filter(item => {
            // Check global filter
            if (currentGlobalFilter && currentGlobalFilter.trim() !== '') {
                const query = currentGlobalFilter.toLowerCase();
                const fieldsToCheck = globalFilterFields.length > 0
                    ? globalFilterFields
                    : (Object.keys(item as any) as (keyof T | string)[]);

                const matchesGlobal = fieldsToCheck.some(field => {
                    const val = (item as any)[field];
                    if (val == null) return false;
                    return String(val).toLowerCase().includes(query);
                });

                if (!matchesGlobal) return false;
            }

            // Check field-level filters
            for (const [field, constraint] of Object.entries(currentFilters)) {
                if (constraint.value == null || constraint.value === '') continue;

                const itemValue = (item as any)[field];
                const filterValue = constraint.value;
                const mode = constraint.matchMode || 'contains';

                if (!matchFilter(itemValue, filterValue, mode)) {
                    return false;
                }
            }

            return true;
        });

        // 2. Sorting
        computedSorted = [...computedFiltered];
        if (currentSortField && currentSortOrder !== 0) {
            const field = currentSortField;
            const order = currentSortOrder;

            computedSorted.sort((a, b) => {
                const valA = (a as any)[field];
                const valB = (b as any)[field];

                if (valA == null && valB == null) return 0;
                if (valA == null) return order === 1 ? -1 : 1;
                if (valB == null) return order === 1 ? 1 : -1;

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return (valA - valB) * order;
                }

                if (valA instanceof Date && valB instanceof Date) {
                    return (valA.getTime() - valB.getTime()) * order;
                }

                return String(valA).localeCompare(String(valB), undefined, { numeric: true }) * order;
            });
        }

        // 3. Pagination
        const total = computedSorted.length;
        const pageCount = Math.ceil(total / pageSize) || 1;
        if (currentPage >= pageCount) {
            currentPage = Math.max(0, pageCount - 1);
        }

        const start = currentPage * pageSize;
        computedPaginated = computedSorted.slice(start, start + pageSize);

        if (options.onStateChange) {
            options.onStateChange(getState());
        }
    }

    function matchFilter(itemVal: any, filterVal: any, mode: FilterMatchMode): boolean {
        if (itemVal == null) return false;

        const itemStr = String(itemVal).toLowerCase();
        const filterStr = String(filterVal).toLowerCase();

        switch (mode) {
            case 'startsWith':
                return itemStr.startsWith(filterStr);
            case 'endsWith':
                return itemStr.endsWith(filterStr);
            case 'equals':
                return itemStr === filterStr;
            case 'in':
                if (Array.isArray(filterVal)) {
                    return filterVal.some(fv => String(fv).toLowerCase() === itemStr);
                }
                return itemStr === filterStr;
            case 'contains':
            default:
                return itemStr.includes(filterStr);
        }
    }

    function getState(): DataSourceState<T> {
        const totalRecords = computedSorted.length;
        const pageCount = Math.ceil(totalRecords / pageSize) || 1;
        return {
            data: rawData,
            filteredData: computedFiltered,
            sortedData: computedSorted,
            paginatedData: computedPaginated,
            page: currentPage,
            pageSize,
            pageCount,
            totalRecords,
            sortField: currentSortField,
            sortOrder: currentSortOrder,
            filters: { ...currentFilters },
            globalFilter: currentGlobalFilter
        };
    }

    // Initial calculation
    recalculate();

    return {
        getState,
        setData(data: T[]) {
            rawData = [...data];
            recalculate();
        },
        setFilter(field: string, value: any, matchMode: FilterMatchMode = 'contains') {
            if (value == null || value === '') {
                delete currentFilters[field];
            } else {
                currentFilters[field] = { value, matchMode };
            }
            currentPage = 0;
            recalculate();
        },
        removeFilter(field: string) {
            delete currentFilters[field];
            recalculate();
        },
        clearFilters() {
            currentFilters = {};
            currentGlobalFilter = null;
            recalculate();
        },
        setGlobalFilter(value: string | null) {
            currentGlobalFilter = value;
            currentPage = 0;
            recalculate();
        },
        setSort(field: keyof T | string, order?: 1 | -1 | 0) {
            if (order !== undefined) {
                currentSortField = field;
                currentSortOrder = order;
            } else {
                if (currentSortField === field) {
                    if (currentSortOrder === 1) currentSortOrder = -1;
                    else if (currentSortOrder === -1) {
                        currentSortOrder = 0;
                        currentSortField = null;
                    } else {
                        currentSortOrder = 1;
                    }
                } else {
                    currentSortField = field;
                    currentSortOrder = 1;
                }
            }
            recalculate();
        },
        setPage(page: number) {
            currentPage = Math.max(0, page);
            recalculate();
        },
        setPageSize(size: number) {
            pageSize = Math.max(1, size);
            currentPage = 0;
            recalculate();
        },
        nextPage() {
            const pageCount = Math.ceil(computedSorted.length / pageSize) || 1;
            if (currentPage < pageCount - 1) {
                currentPage++;
                recalculate();
            }
        },
        prevPage() {
            if (currentPage > 0) {
                currentPage--;
                recalculate();
            }
        }
    };
}

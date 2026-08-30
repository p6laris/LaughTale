/**
 * LaughTale: Standard Component State Contracts (LT-504)
 * Unified interface for loading, error, empty, and disabled states across islands.
 */

export interface ComponentStateProps {
    loading?: boolean;
    error?: string | Error | null;
    emptyMessage?: string;
    disabled?: boolean;
}

export interface SkeletonOptions {
    lines?: number;
    height?: string;
    className?: string;
}

export interface StateMessageOptions {
    message?: string;
    icon?: string;
    className?: string;
}

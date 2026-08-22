/**
 * SoftMax.LaughTale: Composable useId
 * Unique ID generator.
 */

let counter = 0;

export function useId(prefix: string = 'aura'): string {
  return `${prefix}-${++counter}-${Math.random().toString(36).slice(2, 7)}`;
}

export type PartialUnknown<T> = {
  [P in keyof T]?: unknown;
};

export type Predicate<T> = (value: unknown) => value is T;

export function isPartialUnknown<T>(value: unknown): value is PartialUnknown<T> {
  return typeof value === 'object' && value !== null;
}

export function isArrayOf<T>(value: unknown, predicate: Predicate<T>): value is T[] {
  return Array.isArray(value) && value.every(predicate);
}

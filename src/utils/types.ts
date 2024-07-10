export type PartialUnknown<T> = {
  [P in keyof T]?: unknown;
};

export const isPartialUnknown = <T>(
  value: unknown,
): value is PartialUnknown<T> => {
  return typeof value === 'object' && value !== null;
};

export const isArrayOf = <T>(
  value: unknown,
  predicate: (value: unknown) => value is T,
): value is T[] => Array.isArray(value) && value.every(predicate);

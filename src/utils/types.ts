export type PartialUnknown<T> = {
    [P in keyof T]?: unknown;
};

export const isPartialUnknown = <T>(value: unknown): value is PartialUnknown<T> => {
    return typeof value === 'object' && value !== null;
};

export const isArrayOf = <T>(value: unknown, predicate: (value: unknown) => value is T): value is T[] =>
    Array.isArray(value) && value.every(predicate);

export interface Category {
    id: number;
    name: string;
}
export const isCategory = (value: unknown): value is Category =>
    isPartialUnknown<Category>(value) && typeof value.id === 'number' && typeof value.name === 'string';

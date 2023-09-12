export type ReadFile = <T>(filename: string) => Promise<T | undefined>;
export type WriteFile = <T>(filename: string, data: T) => Promise<void>;

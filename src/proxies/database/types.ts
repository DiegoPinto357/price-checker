export interface FindOptions<T> {
  projection: Partial<Record<keyof T, 0 | 1>>;
}

export interface FindOneOptions<T> {
  projection: Partial<Record<keyof T, 0 | 1>>;
}

export interface UpdateOneOptions {
  upsert?: boolean;
}

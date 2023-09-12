export type Find = <T>(
  databaseName: string,
  collectionName: string,
  filter?: Partial<FilterOperations<T> & T>,
  options?: FindOptions<T>
) => Promise<T[]>;

export type FindOne = <T>(
  databaseName: string,
  collectionName: string,
  filter: Partial<T>,
  options?: FindOneOptions<T>
) => Promise<T | null>;

// TODO implement on backend
export type Insert = <T>(
  databaseName: string,
  collectionName: string,
  documents: T[]
) => Promise<{ insertedId: string } | undefined>;

export type InsertOne = <T>(
  databaseName: string,
  collectionName: string,
  document: T
) => Promise<{ insertedId: string } | undefined>;

export type UpdateOne = <T>(
  databaseName: string,
  collectionName: string,
  filter: Partial<T>,
  update: Record<string, Partial<T>>,
  options?: UpdateOneOptions
) => Promise<
  | {
      matchedCount: number;
      modifiedCount: number;
      upsertedId?: string;
    }
  | undefined
>;

export interface FilterOperations<T> {
  $or: Partial<T>[];
}

export interface FindOptions<T> {
  projection: Partial<Record<keyof T, 0 | 1>>;
}

export interface FindOneOptions<T> {
  projection: Partial<Record<keyof T, 0 | 1>>;
}

export interface UpdateOneOptions {
  upsert?: boolean;
}

import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();

export interface DatabaseProxy {
  find: <T>(
    databaseName: string,
    collectionName: string,
    filter?: object
  ) => Promise<T[]>;
  findOne: <T>(
    databaseName: string,
    collectionName: string,
    filter: object
  ) => Promise<T | null>;
  // TODO implement on backend
  insert: <T>(
    databaseName: string,
    collectionName: string,
    documents: T[]
  ) => Promise<{ insertedId: string }>;
  insertOne: <T>(
    databaseName: string,
    collectionName: string,
    document: T
  ) => Promise<{ insertedId: string }>;
  updateOne: <T>(
    databaseName: string,
    collectionName: string,
    filter: Partial<T>,
    update: Record<string, Partial<T>>
  ) => Promise<{
    matchedCount: number;
    modifiedCount: number;
    upsertedId?: string;
  }>;
}

export default platform === 'web'
  ? ((await import('./databaseHttp')).default as unknown as DatabaseProxy)
  : ((await import('./databaseIpc')).default as unknown as DatabaseProxy);

import ipc from '../../ipc';
import { FindOptions, FindOneOptions, UpdateOneOptions } from './types';

const find = async <T>(
  databaseName: string,
  collectionName: string,
  filter: object,
  options?: FindOptions<T>
): Promise<T[]> => {
  return await ipc.send('post:database/find', {
    databaseName,
    collectionName,
    filter,
    options,
  });
};

const findOne = <T>(
  databaseName: string,
  collectionName: string,
  filter: object,
  options?: FindOneOptions<T>
): Promise<T | null> =>
  ipc.send('post:database/findOne', {
    databaseName,
    collectionName,
    filter,
    options,
  });

const insert = <T>(
  databaseName: string,
  collectionName: string,
  documents: T[]
) =>
  ipc.send('post:database/insert', {
    databaseName,
    collectionName,
    documents,
  });

const insertOne = async <T>(
  databaseName: string,
  collectionName: string,
  document: T
): Promise<{ insertedId: string } | undefined> => {
  return await ipc.send('post:database/insertOne', {
    databaseName,
    collectionName,
    document,
  });
};

const updateOne = <T>(
  databaseName: string,
  collectionName: string,
  filter: Partial<T>,
  update: Record<string, Partial<T>>,
  options?: UpdateOneOptions
): Promise<
  | { matchedCount: number; modifiedCount: number; upsertedId?: string }
  | undefined
> =>
  ipc.send('post:database/updateOne', {
    databaseName,
    collectionName,
    filter,
    update,
    options,
  });

export default {
  find,
  findOne,
  insert,
  insertOne,
  updateOne,
};

import axios from 'axios';
import { getServerHost } from '../../config';
import { FindOptions, FindOneOptions, UpdateOneOptions } from './types';

const find = async <T>(
  databaseName: string,
  collectionName: string,
  filter?: object,
  options?: FindOptions<T>
): Promise<T[]> => {
  try {
    const serverHost = await getServerHost();
    const { data } = await axios.post(`${serverHost}/database/find`, {
      databaseName,
      collectionName,
      filter,
      options,
    });
    return data as T[];
  } catch (error) {
    return [];
  }
};

const findOne = async <T>(
  databaseName: string,
  collectionName: string,
  filter: object,
  options?: FindOneOptions<T>
): Promise<T | null> => {
  try {
    const serverHost = await getServerHost();
    const { data } = await axios.post(`${serverHost}/database/findOne`, {
      databaseName,
      collectionName,
      filter,
      options,
    });
    return data as T;
  } catch (error) {
    return null;
  }
};

const insert = async <T>(
  databaseName: string,
  collectionName: string,
  documents: T[]
) => {
  try {
    const serverHost = await getServerHost();
    const { data } = await axios.post(`${serverHost}/database/insert`, {
      databaseName,
      collectionName,
      documents,
    });
    return data;
  } catch (error) {
    return;
  }
};

const insertOne = async <T>(
  databaseName: string,
  collectionName: string,
  document: T
): Promise<{ insertedId: string } | undefined> => {
  try {
    const serverHost = await getServerHost();
    const { data } = await axios.post(`${serverHost}/database/insertOne`, {
      databaseName,
      collectionName,
      document,
    });
    return data;
  } catch (error) {
    return;
  }
};

const updateOne = async <T>(
  databaseName: string,
  collectionName: string,
  filter: Partial<T>,
  update: Record<string, Partial<T>>,
  options?: UpdateOneOptions
): Promise<
  | { matchedCount: number; modifiedCount: number; upsertedId?: string }
  | undefined
> => {
  try {
    const serverHost = await getServerHost();
    const { data } = await axios.post(`${serverHost}/database/updateOne`, {
      databaseName,
      collectionName,
      filter,
      update,
      options,
    });
    return data;
  } catch (error) {
    return;
  }
};

export default {
  find,
  findOne,
  insert,
  insertOne,
  updateOne,
};

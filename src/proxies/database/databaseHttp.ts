import axios from 'axios';
import { FindOptions, FindOneOptions, UpdateOneOptions } from './types';

const serverHost = 'http://127.0.0.1:3001';

const find = async <T>(
  databaseName: string,
  collectionName: string,
  filter?: object,
  options?: FindOptions<T>
): Promise<T[]> => {
  try {
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
): Promise<{ insertId: string } | undefined> => {
  try {
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
): Promise<{ insertId: string } | undefined> => {
  try {
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

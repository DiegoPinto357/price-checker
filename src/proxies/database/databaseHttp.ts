import axios from 'axios';

const serverHost = 'http://127.0.0.1:3001';

const find = async <T>(
  databaseName: string,
  collectionName: string,
  filter: object
): Promise<T[]> => {
  try {
    const { data } = await axios.post(`${serverHost}/database/find`, {
      databaseName,
      collectionName,
      filter,
    });
    return data as T[];
  } catch (error) {
    return [];
  }
};

const findOne = async <T>(
  databaseName: string,
  collectionName: string,
  filter: object
): Promise<T | null> => {
  try {
    const { data } = await axios.post(`${serverHost}/database/findOne`, {
      databaseName,
      collectionName,
      filter,
    });
    return data as T;
  } catch (error) {
    return null;
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
  update: Partial<T>
): Promise<{ insertId: string } | undefined> => {
  try {
    const { data } = await axios.post(`${serverHost}/database/updateOne`, {
      databaseName,
      collectionName,
      filter,
      update,
    });
    return data;
  } catch (error) {
    return;
  }
};

export default {
  find,
  findOne,
  insertOne,
  updateOne,
};

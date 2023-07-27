import axios from 'axios';

const find = async <T>(
  databaseName: string,
  collectionName: string,
  filter: object
): Promise<T[]> => {
  try {
    const { data } = await axios.post('http://127.0.0.1:3001/database/find', {
      databaseName,
      collectionName,
      filter,
    });
    return data as T[];
  } catch (error) {
    return [];
  }
};

export default {
  find,
};

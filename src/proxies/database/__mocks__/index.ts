import { v4 as uuid } from 'uuid';

interface DatabaseEntry {
  databaseName: string;
  collectionName: string;
  _id: string;
  data: unknown;
}

const dataBuffer: DatabaseEntry[] = [];

const getCollection = (databaseName: string, collectionName: string) =>
  dataBuffer
    .filter(
      item =>
        item.databaseName === databaseName &&
        item.collectionName === collectionName
    )
    .map(item => item.data);

const setDocument = <T>(
  databaseName: string,
  collectionName: string,
  data: T
) => {
  const _id = uuid();
  dataBuffer.push({ databaseName, collectionName, _id, data });
  return { insertId: _id };
};

const find = vi.fn(
  async <T>(databaseName: string, collectionName: string, filter?: object) => {
    const collection = getCollection(databaseName, collectionName) as T[];

    if (!filter) {
      return collection;
    }

    return [
      ...collection.filter(item =>
        Object.entries(filter).every(
          ([key, value]) => item[key as keyof T] === value
        )
      ),
    ];
  }
);

const findOne = vi.fn();

const insert = vi.fn(
  async <T>(databaseName: string, collectionName: string, documents: T[]) => {
    return Promise.resolve(
      documents.map(document =>
        setDocument(databaseName, collectionName, document)
      )
    );
  }
);

const insertOne = vi.fn(
  <T>(
    databaseName: string,
    collectionName: string,
    document: T
  ): Promise<{ insertId: string } | undefined> => {
    return Promise.resolve(setDocument(databaseName, collectionName, document));
  }
);

const updateOne = vi.fn();

export default {
  find,
  findOne,
  insert,
  insertOne,
  updateOne,
};

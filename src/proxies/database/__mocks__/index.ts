import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { FindOptions, FindOneOptions, UpdateOneOptions } from '../types';

type WithId<T> = { _id: string } & T;

interface DatabaseEntry {
  databaseName: string;
  collectionName: string;
  _id: string;
  data: WithId<object>;
}

let dataBuffer: DatabaseEntry[] = [];

const getCollection = (databaseName: string, collectionName: string) =>
  dataBuffer
    .filter(
      item =>
        item.databaseName === databaseName &&
        item.collectionName === collectionName
    )
    .map(item => item.data);

const insertDocument = <T>(
  databaseName: string,
  collectionName: string,
  data: T
) => {
  const _id = uuid();
  dataBuffer.push({
    databaseName,
    collectionName,
    _id,
    data: { _id, ..._.cloneDeep(data) },
  });
  return { insertId: _id };
};

const setDocument = <T>(id: string, data: T) => {
  const index = dataBuffer.findIndex(({ _id }) => _id === id);
  if (index === -1) return;
  dataBuffer[index].data = { _id: id, ...data };
};

// TODO return _id
const find = vi.fn(
  async <T>(
    databaseName: string,
    collectionName: string,
    filter?: object,
    options?: FindOptions<T>
  ) => {
    const collection = getCollection(databaseName, collectionName) as T[];

    if (!filter) {
      return collection;
    }

    const filteredData = _.cloneDeep(
      collection.filter(item =>
        Object.entries(filter).every(
          ([key, value]) => item[key as keyof T] === value
        )
      )
    );

    if (!options?.projection) {
      return filteredData;
    }

    return filteredData.map(item => {
      const projectionEntries = Object.entries(options?.projection) as [
        keyof T,
        0 | 1
      ][];
      projectionEntries.forEach(([key, value]) => {
        if (value === 0) {
          delete item[key];
        }
      });
      return { ...item };
    });
  }
);

// TODO return _id
const findOne = vi.fn(
  async <T>(
    databaseName: string,
    collectionName: string,
    filter?: object,
    options?: FindOneOptions<T>
  ) => {
    const collection = getCollection(databaseName, collectionName) as T[];

    if (!filter) {
      return collection[0];
    }

    const record = _.cloneDeep(
      collection.find(item =>
        Object.entries(filter).every(([key, value]) => {
          return item[key as keyof T] === value;
        })
      )
    );

    if (!record) {
      return;
    }

    if (!options?.projection) {
      return record;
    }

    const projectionEntries = Object.entries(options?.projection) as [
      keyof T,
      0 | 1
    ][];
    projectionEntries.forEach(([key, value]) => {
      if (value === 0) {
        delete record[key];
      }
    });

    return record;
  }
);

const insert = vi.fn(
  async <T>(databaseName: string, collectionName: string, documents: T[]) => {
    return Promise.resolve(
      documents.map(document =>
        insertDocument(databaseName, collectionName, document)
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
    return Promise.resolve(
      insertDocument(databaseName, collectionName, document)
    );
  }
);

const updateOne = vi.fn(
  async <T>(
    databaseName: string,
    collectionName: string,
    filter: Partial<T>,
    update: Record<string, Partial<T>>,
    options?: UpdateOneOptions
  ) => {
    let record = (await findOne(
      databaseName,
      collectionName,
      filter
    )) as WithId<DatabaseEntry>;

    if (!record) {
      if (!options?.upsert) {
        return { matchedCount: 0 };
      }

      const { insertId } = insertDocument(databaseName, collectionName, {});
      record = { _id: insertId } as WithId<DatabaseEntry>;
    }

    const operations = Object.entries(update);
    operations.forEach(([operation, params]) => {
      Object.entries(params).forEach(([key, value]) => {
        switch (operation) {
          case '$set':
            _.set(record, key, value);
            break;

          case '$inc': {
            const currentValue = _.get(record, key);
            _.set(record, key, currentValue + value);
            break;
          }

          case '$setOnInsert': {
            if (options?.upsert) {
              _.set(record, key, value);
            }
            break;
          }
        }
      });
    });

    setDocument(record._id, record);

    return { matchedCount: 1 };
  }
);

const clearRecords = () => (dataBuffer = []);

export default {
  find,
  findOne,
  insert,
  insertOne,
  updateOne,

  clearRecords,
};

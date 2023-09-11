import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import {
  FilterOperations,
  FindOptions,
  FindOneOptions,
  UpdateOneOptions,
} from '../types';
import { WithId } from '../../../types';

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

const resolveProjection = <T extends WithId<unknown>>(
  item: T,
  projection: FindOptions<T>['projection']
) => {
  const projectionEntries = Object.entries(projection) as [
    keyof WithId<T>,
    0 | 1
  ][];

  const includeAllFieldsByDefault = projectionEntries.every(
    entry => entry[1] === 0
  );

  const result = includeAllFieldsByDefault
    ? item
    : ({ _id: item._id } as WithId<T>);

  projectionEntries.forEach(([key, value]) => {
    if (value === 0) delete result[key];
    if (value === 1) result[key] = item[key];
  });
  return result;
};

// TODO return _id
const find = vi.fn(
  async <T>(
    databaseName: string,
    collectionName: string,
    filter?: Partial<FilterOperations<T> & T>,
    options?: FindOptions<T>
  ) => {
    const collection = getCollection(
      databaseName,
      collectionName
    ) as WithId<T>[];

    if (!filter) {
      return collection;
    }

    const filteredData = _.cloneDeep(
      collection.filter(item => {
        const orOperations = filter['$or'];

        if (orOperations) {
          return orOperations.some(subFilter =>
            Object.entries(subFilter).every(
              ([key, value]) => item[key as keyof T] === value
            )
          );
        }

        return Object.entries(filter).every(
          ([key, value]) => item[key as keyof T] === value
        );
      })
    );

    if (!options?.projection) {
      return filteredData;
    }

    return filteredData.map(item =>
      resolveProjection(item, options?.projection)
    );
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
    const collection = getCollection(
      databaseName,
      collectionName
    ) as WithId<T>[];

    if (!filter) {
      return collection[0];
    }

    const record = _.cloneDeep(
      collection.find(item =>
        Object.entries(filter).every(([key, value]) => {
          return item[key as keyof WithId<T>] === value;
        })
      )
    );

    if (!record) {
      return;
    }

    if (!options?.projection) {
      return record;
    }

    return resolveProjection(record, options?.projection);
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

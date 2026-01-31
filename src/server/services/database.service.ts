import {
  MongoClient,
  Filter,
  FindOptions,
  Document,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
} from 'mongodb';
import { getConfig } from '../config';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const getClient = async (): Promise<MongoClient> => {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
};

const getDatabaseName = (database: string): string => {
  const { sandboxMode } = getConfig();
  return sandboxMode ? `${database}-sandbox` : database;
};

export const find = async <T extends Document>(
  database: string,
  collection: string,
  filter?: Filter<T>,
  options?: { projection?: FindOptions['projection'] }
): Promise<T[]> => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection<T>(collection);

  const cursor = coll.find(filter || {});

  if (options?.projection) {
    cursor.project(options.projection);
  }

  return (await cursor.toArray()) as T[];
};

export const findOne = async <T extends Document>(
  database: string,
  collection: string,
  filter?: Filter<T>,
  options?: { projection?: FindOptions['projection'] }
): Promise<T | null> => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection<T>(collection);

  const findOptions: FindOptions = {};
  if (options?.projection) {
    findOptions.projection = options.projection;
  }

  return (await coll.findOne(filter || {}, findOptions)) as T | null;
};

export const insert = async <T extends Document>(
  database: string,
  collection: string,
  documents: OptionalUnlessRequiredId<T>[]
) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection<T>(collection);

  const result = await coll.insertMany(documents);

  return { data: result };
};

export const insertOne = async <T extends Document>(
  database: string,
  collection: string,
  document: OptionalUnlessRequiredId<T>
) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection<T>(collection);

  const result = await coll.insertOne(document);

  return { data: result };
};

export const updateOne = async <T extends Document>(
  database: string,
  collection: string,
  filter: Filter<T>,
  update: UpdateFilter<T>,
  options?: UpdateOptions
) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection<T>(collection);

  const result = await coll.updateOne(filter, update, options || {});

  return { data: result };
};

export default {
  find,
  findOne,
  insert,
  insertOne,
  updateOne,
};

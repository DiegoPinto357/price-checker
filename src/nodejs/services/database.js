/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require('../loadEnv');
const { MongoClient } = require('mongodb');
const { sandboxMode } = require('../config');

// MongoDB connection URI from environment variable
const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

// Initialize MongoDB connection
const getClient = async () => {
  if (!clientPromise) {
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
};

const getDatabaseName = database =>
  sandboxMode ? `${database}-sandbox` : database;

const find = async (database, collection, filter, options) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection(collection);
  
  const cursor = coll.find(filter || {});
  
  if (options?.projection) {
    cursor.project(options.projection);
  }
  
  return await cursor.toArray();
};

const findOne = async (database, collection, filter, options) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection(collection);
  
  const findOptions = {};
  if (options?.projection) {
    findOptions.projection = options.projection;
  }
  
  return await coll.findOne(filter || {}, findOptions);
};

const insert = async (database, collection, documents) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection(collection);
  
  const result = await coll.insertMany(documents);
  
  return { data: result };
};

const insertOne = async (database, collection, document) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection(collection);
  
  const result = await coll.insertOne(document);
  
  return { data: result };
};

const updateOne = async (database, collection, filter, update, options) => {
  const client = await getClient();
  const db = client.db(getDatabaseName(database));
  const coll = db.collection(collection);
  
  const result = await coll.updateOne(filter, update, options || {});
  
  return { data: result };
};

module.exports = {
  find,
  findOne,
  insert,
  insertOne,
  updateOne,
};

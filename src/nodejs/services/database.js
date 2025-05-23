/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require('../loadEnv');
const axios = require('axios');
const { sandboxMode } = require('../config');

const baseUrl =
  'https://sa-east-1.aws.data.mongodb-api.com/app/data-rcjlb/endpoint/data/v1/action';

const headers = {
  'Content-Type': 'application/json',
  apiKey: process.env.MONGODB_DATA_API_KEY,
};

const dataSource = 'Cluster0';

const getDatabaseName = database =>
  sandboxMode ? `${database}-sandbox` : database;

const find = async (database, collection, filter, options) => {
  const url = `${baseUrl}/find`;
  const { data } = await axios.post(
    url,
    {
      dataSource,
      database: getDatabaseName(database),
      collection,
      filter,
      projection: options?.projection,
    },
    { headers }
  );
  return data.documents;
};

const findOne = async (database, collection, filter, options) => {
  const url = `${baseUrl}/findOne`;
  const { data } = await axios.post(
    url,
    {
      dataSource,
      database: getDatabaseName(database),
      collection,
      filter,
      projection: options?.projection,
    },
    { headers }
  );
  return data.document;
};

const insert = async (database, collection, documents) => {
  const url = `${baseUrl}/insertMany`;
  return await axios.post(
    url,
    {
      dataSource,
      database: getDatabaseName(database),
      collection,
      documents,
    },
    { headers }
  );
};

const insertOne = async (database, collection, document) => {
  const url = `${baseUrl}/insertOne`;
  return await axios.post(
    url,
    {
      dataSource,
      database: getDatabaseName(database),
      collection,
      document,
    },
    { headers }
  );
};

const updateOne = async (database, collection, filter, update, options) => {
  const url = `${baseUrl}/updateOne`;
  return await axios.post(
    url,
    {
      dataSource,
      database: getDatabaseName(database),
      collection,
      filter,
      update,
      options,
    },
    { headers }
  );
};

module.exports = {
  find,
  findOne,
  insert,
  insertOne,
  updateOne,
};

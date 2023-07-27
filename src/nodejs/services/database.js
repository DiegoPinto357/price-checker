/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require('../loadEnv');
const axios = require('axios');

const baseUrl =
  'https://sa-east-1.aws.data.mongodb-api.com/app/data-rcjlb/endpoint/data/v1/action';

const headers = {
  'Content-Type': 'application/json',
  apiKey: process.env.MONGODB_DATA_API_KEY,
};

const dataSource = 'Cluster0';

const find = async (database, collection, filter) => {
  const url = `${baseUrl}/find`;
  const { data } = await axios.post(
    url,
    {
      dataSource,
      database,
      collection,
      filter,
    },
    { headers }
  );
  return data.documents;
};

const findOne = async (database, collection, filter) => {
  const url = `${baseUrl}/findOne`;
  const { data } = await axios.post(
    url,
    {
      dataSource,
      database,
      collection,
      filter,
    },
    { headers }
  );
  return data.document;
};

const insertOne = async (database, collection, document) => {
  const url = `${baseUrl}/insertOne`;
  return await axios.post(
    url,
    {
      dataSource,
      database,
      collection,
      document,
    },
    { headers }
  );
};

const updateOne = async (database, collection, filter, update) => {
  const url = `${baseUrl}/updateOne`;
  return await axios.post(
    url,
    {
      dataSource,
      database,
      collection,
      filter,
      update,
    },
    { headers }
  );
};

module.exports = {
  find,
  findOne,
  insertOne,
  updateOne,
};

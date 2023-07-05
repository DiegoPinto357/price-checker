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

const find = async (
  database,
  collection
  // filter: object,
  // options: object
) => {
  const url = `${baseUrl}/find`;
  const { data } = await axios.post(
    url,
    {
      dataSource: 'Cluster0',
      database,
      collection,
    },
    { headers }
  );
  return data.documents;
};

module.exports = {
  find,
};

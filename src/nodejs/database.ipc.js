/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const ipc = require('./ipc');
const database = require('./services/database');

ipc.on(
  'post:database/find',
  async ({ databaseName, collectionName, filter, options }, reply) => {
    const data = await database.find(
      databaseName,
      collectionName,
      filter,
      options
    );
    reply(data);
  }
);

ipc.on(
  'post:database/findOne',
  async ({ databaseName, collectionName, filter, options }, reply) => {
    const data = await database.findOne(
      databaseName,
      collectionName,
      filter,
      options
    );
    reply(data);
  }
);

ipc.on(
  'post:database/insert',
  async ({ databaseName, collectionName, documents }, reply) => {
    const { data } = await database.insert(
      databaseName,
      collectionName,
      documents
    );
    reply(data);
  }
);

ipc.on(
  'post:database/insertOne',
  async ({ databaseName, collectionName, document }, reply) => {
    const { data } = await database.insertOne(
      databaseName,
      collectionName,
      document
    );
    reply(data);
  }
);

ipc.on(
  'post:database/updateOne',
  async ({ databaseName, collectionName, filter, update, options }, reply) => {
    const { data } = await database.updateOne(
      databaseName,
      collectionName,
      filter,
      update,
      options
    );
    reply(data);
  }
);

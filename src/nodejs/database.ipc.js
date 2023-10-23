/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const ipc = require('./ipc');
const database = require('./services/database');

ipc.on(
  'post:database/findOne',
  async ({ databaseName, collectionName, filter, options }, reply) => {
    console.log({ databaseName, collectionName, filter, options });
    const data = await database.findOne(
      databaseName,
      collectionName,
      filter,
      options
    );
    reply(data);
  }
);

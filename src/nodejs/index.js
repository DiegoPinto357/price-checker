/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { channel } = require('bridge');
const nfParser = require('./nfParser');
const database = require('./services/database');

channel.addListener('/nf-data', async key => {
  console.log('[node] /nf-data event: ' + key);
  const data = await nfParser(key);
  console.log(data);
  channel.send('reply', data);
});

channel.addListener('/database/find', async (databaseName, collectionName) => {
  console.log('[node] /database/find event: ' + databaseName + collectionName);
  const data = await database.find(databaseName, collectionName);
  console.log(data);
  channel.send('reply-db', data);
});

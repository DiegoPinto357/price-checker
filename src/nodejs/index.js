/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const ipc = require('./ipc');
const nfParser = require('./nfParser');

ipc.on('get:nf-data', async (key, reply) => {
  console.log('[node] get:nf-data event: ' + key);
  const data = await nfParser(key);
  reply(data);
});

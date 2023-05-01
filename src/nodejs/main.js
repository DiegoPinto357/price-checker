/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { channel } = require('bridge');
const nfParser = require('./nfParser');

channel.addListener('/items', async key => {
  console.log('[node] /items event: ' + key);
  const data = await nfParser(key);
  console.log(data);
  channel.send('reply', data);
});

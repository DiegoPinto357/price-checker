/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { channel } = require('bridge');
const nfParser = require('./nfParser');

channel.addListener('/nf-data', async key => {
  console.log('[node] /nf-data event: ' + key);
  const data = await nfParser(key);
  console.log(data);
  channel.send('reply', data);
});

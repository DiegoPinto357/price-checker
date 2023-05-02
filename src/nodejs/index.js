/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const nfParser = require('./nfParser');

const nfKey =
  '43230401438784002060650050002209661478083301|2|1|1|5a7b0201011ca0acc439ef3ea9358b64131234e4';

(async () => {
  const data = await nfParser(nfKey);
  console.log(data);
})();

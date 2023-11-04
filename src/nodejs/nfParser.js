/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl =
  'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?p=';

const formatDecimal = value => value.replace('.', '').replace(',', '.');

const getPage = async key => {
  const url = `${baseUrl}${key}`;
  const { data } = await axios.get(url, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

const parseQrCode = key => {
  const items = key.split('|');
  return {
    key: items[0],
    version: items[1],
    env: items[2],
    csc: items[3],
    hash: items[4],
  };
};

const parseStoreData = raw => {
  const rawArray = raw.split('\n');
  return {
    cnpj: rawArray[2].trim(),
    incricaoEstadual: rawArray[3].match(/:\s(\d+)/)[1],
  };
};

const parseStoreAddress = raw => {
  return raw.replace(/\n(\s+)/gm, ' ');
};

const parseMetadata = raw => {
  const items = raw.split('\n');

  const number = items[1].match(/:\s([^]\d*)/)[1];
  const series = items[2].match(/:\s([^]\d*)/)[1];
  const date = items[3].match(/:\s([^]*)/)[1];

  return { number, series, date };
};

const parseProtocol = raw => raw.match(/:\s([^]\d*)/)[1];

const parsePage = page => {
  const $ = cheerio.load(page);

  const storeTable = $(
    '#respostaWS > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td'
  );

  const storeName = $($(storeTable).find('td')[1]).text();
  const storeDataRaw = $($(storeTable).find('td')[2]).text();
  const storeData = parseStoreData(storeDataRaw);
  const storeAddressRaw = $($(storeTable).find('td')[3]).text();
  const storeAddress = parseStoreAddress(storeAddressRaw);

  const store = { name: storeName, ...storeData, address: storeAddress };

  const infoTable = $(
    '#respostaWS > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody'
  );

  const metadataRaw = $($(infoTable).find('td')[0]).text();
  const metadata = parseMetadata(metadataRaw);

  const protocolRaw = $($(infoTable).find('td')[4]).text();
  const protocol = parseProtocol(protocolRaw);

  const itemsTable = $(
    '#respostaWS > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(5) > td > table > tbody > tr'
  );
  const items = [];

  itemsTable.each((index, element) => {
    if (index === 0) return;

    const item = {
      code: $($(element).find('td')[0]).text(),
      description: $($(element).find('td')[1]).text(),
      amount: +formatDecimal($($(element).find('td')[2]).text()),
      unit: $($(element).find('td')[3]).text(),
      value: +formatDecimal($($(element).find('td')[4]).text()),
      totalValue: +formatDecimal($($(element).find('td')[5]).text()),
    };
    items.push(item);
  });

  return { ...metadata, protocol, store, items };
};

module.exports = async key => {
  const page = await getPage(key);
  const qrCode = parseQrCode(key);
  const pageData = parsePage(page);
  return { ...qrCode, ...pageData };
};

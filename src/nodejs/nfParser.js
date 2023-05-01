/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl =
  'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?p=';

// const getKey = url => url.match(/\?p=([^&]*)/)[1];

const getPage = async key => {
  const url = `${baseUrl}${key}`;
  const { data } = await axios.get(url, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

const parseItems = page => {
  const $ = cheerio.load(page);
  const tableRows = $(
    '#respostaWS > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(5) > td > table > tbody > tr'
  );
  const items = [];

  tableRows.each((index, element) => {
    if (index === 0) return;

    const item = {
      code: $($(element).find('td')[0]).text(),
      description: $($(element).find('td')[1]).text(),
      amount: $($(element).find('td')[2]).text(),
      unit: $($(element).find('td')[3]).text(),
      value: $($(element).find('td')[4]).text(),
      totalValue: $($(element).find('td')[5]).text(),
    };
    items.push(item);
  });

  return items;
};

module.exports = async key => {
  const page = await getPage(key);
  return parseItems(page);
};

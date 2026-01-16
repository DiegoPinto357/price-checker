import axios from 'axios';
import * as cheerio from 'cheerio';

const baseUrl =
  'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?p=';

const formatDecimal = (value: string): string =>
  value.replace('.', '').replace(',', '.');

const getPage = async (key: string): Promise<string> => {
  const url = `${baseUrl}${key}`;
  const { data } = await axios.get<string>(url, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

interface QrCodeData {
  key: string;
  version: string;
  env: string;
  csc: string;
  hash: string;
}

const parseQrCode = (key: string): QrCodeData => {
  const items = key.split('|');
  return {
    key: items[0],
    version: items[1],
    env: items[2],
    csc: items[3],
    hash: items[4],
  };
};

type StoreData = {
  cnpj: string;
  incricaoEstadual: string;
};

const parseStoreData = (raw: string): StoreData => {
  const rawArray = raw.split('\n');
  const ieMatch = rawArray[3].match(/:\s(\d+)/);
  return {
    cnpj: rawArray[2].trim(),
    incricaoEstadual: ieMatch ? ieMatch[1] : '',
  };
};

const parseStoreAddress = (raw: string): string => {
  return raw.replace(/\n(\s+)/gm, ' ');
};

type Metadata = {
  number: string;
  series: string;
  date: string;
};

const parseMetadata = (raw: string): Metadata => {
  const items = raw.split('\n');

  const numberMatch = items[1].match(/:\s([^]\d*)/);
  const seriesMatch = items[2].match(/:\s([^]\d*)/);
  const dateMatch = items[3].match(/:\s([^]*)/);

  return {
    number: numberMatch ? numberMatch[1] : '',
    series: seriesMatch ? seriesMatch[1] : '',
    date: dateMatch ? dateMatch[1] : '',
  };
};

const parseProtocol = (raw: string): string => {
  const match = raw.match(/:\s([^]\d*)/);
  return match ? match[1] : '';
};

type Store = StoreData & {
  name: string;
  address: string;
};

type Item = {
  code: string;
  description: string;
  amount: number;
  unit: string;
  value: number;
  totalValue: number;
};

type PageData = Metadata & {
  protocol: string;
  store: Store;
  items: Item[];
};

const parsePage = (page: string): PageData => {
  const $ = cheerio.load(page);

  const storeTable = $(
    '#respostaWS > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td'
  );

  const storeName = $($(storeTable).find('td')[1]).text();
  const storeDataRaw = $($(storeTable).find('td')[2]).text();
  const storeData = parseStoreData(storeDataRaw);
  const storeAddressRaw = $($(storeTable).find('td')[3]).text();
  const storeAddress = parseStoreAddress(storeAddressRaw);

  const store: Store = { name: storeName, ...storeData, address: storeAddress };

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
  const items: Item[] = [];

  itemsTable.each((index, element) => {
    if (index === 0) return;

    const item: Item = {
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

export type NfData = QrCodeData & PageData;

export const parseNf = async (key: string): Promise<NfData> => {
  const page = await getPage(key);
  const qrCode = parseQrCode(key);
  const pageData = parsePage(page);
  return { ...qrCode, ...pageData };
};

export default parseNf;

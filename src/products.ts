import _ from 'lodash';
import { storage, database } from './proxies';
import { Nf, Product, ProductHistory, ProductHistoryItem } from './types';
import createCsv from './libs/csv';
import insertIndexEntry, { getIndexEntry } from './libs/insertIndexEntry';

// TODO possible duplication
interface IndexEntry {
  id: string;
  timestamp: number;
  hash: string;
}

const parseDate = (stringDate: string) => {
  const [date, time] = stringDate.split(' ');
  const dateParts = date.split('/');
  const timeParts = time.split(':');
  return new Date(
    parseInt(dateParts[2], 10),
    parseInt(dateParts[1], 10) - 1,
    parseInt(dateParts[0], 10),
    parseInt(timeParts[2], 10),
    parseInt(timeParts[1], 10),
    parseInt(timeParts[0], 10)
  );
};

const buildHistoryItem = (product: Product, nfData: Nf) => {
  return {
    nfKey: nfData.key,
    date: nfData.date,
    amount: product.amount,
    unit: product.unit,
    value: product.value,
    totalValue: product.totalValue,
  };
};

const mergeHistory = (
  currentRecord: ProductHistory,
  newProductHistoryItem: ProductHistoryItem
) => {
  const existingEntry = currentRecord.history.find(
    ({ nfKey }) => nfKey === newProductHistoryItem.nfKey
  );

  if (!existingEntry) {
    const mergedEntry = _.cloneDeep(currentRecord);

    mergedEntry.history.push(newProductHistoryItem);
    mergedEntry.history = mergedEntry.history.sort(
      (a: ProductHistoryItem, b: ProductHistoryItem) =>
        parseDate(a.date).getTime() - parseDate(b.date).getTime()
    );

    return mergedEntry;
  }

  return null;
};

export const saveProductsOnLocal = async (
  records: ProductHistory[],
  indexMetadata?: { timestamp: number; hash: string }[]
) => {
  if (!records.length) return;

  const indexFile = await createCsv('/products/index.csv');

  let hasNewData = false;
  for (const [index, record] of records.entries()) {
    const filename = `/products/${record.code}.json`;
    const currentFile = await storage.readFile<ProductHistory>(filename);

    let dataToSave: ProductHistory | null;

    if (currentFile) {
      dataToSave = mergeHistory(currentFile, record.history[0]);
    } else {
      dataToSave = record;
    }

    if (dataToSave) {
      insertIndexEntry(indexFile, dataToSave, 'code', {
        overwriteExisting: true,
        ...indexMetadata?.[index],
      });

      await storage.writeFile(filename, dataToSave);
      hasNewData = true;
    }
  }

  if (hasNewData) {
    await indexFile.save();
  }
};

const getRemoteProductItem = (code: string) =>
  database.findOne<ProductHistory>('products', 'items', {
    code,
  });

const getRemoteProductIndex = (id: string) =>
  database.findOne<IndexEntry>('products', 'index', {
    id,
  });

const updateRemoteProductItem = async (item: ProductHistory) =>
  database.updateOne<ProductHistory>(
    'products',
    'items',
    { code: item.code },
    {
      $set: {
        history: item.history,
      },
    }
  );

const updateRemoteProductIndex = async (
  item: ProductHistory,
  indexMetadata?: { timestamp: number; hash: string }
) =>
  database.updateOne<IndexEntry>(
    'products',
    'index',
    { id: item.code },
    {
      $set: {
        ...getIndexEntry(item, 'code', indexMetadata),
      },
    }
  );

export const saveProductsOnRemote = async (
  records: ProductHistory[],
  indexMetadata?: { timestamp: number; hash: string }[]
) => {
  if (!records.length) return;

  const indexEntriesToInsert: IndexEntry[] = [];
  const recordsToInsert: ProductHistory[] = [];

  for (const [index, record] of records.entries()) {
    const existingItem = await getRemoteProductItem(record.code);

    let recordToUpdate: ProductHistory | null = record;

    if (existingItem) {
      recordToUpdate = mergeHistory(existingItem, record.history[0]);
      if (recordToUpdate) {
        await updateRemoteProductItem(recordToUpdate);
      }
    } else {
      recordsToInsert.push(record);
    }

    const existingIndex = await getRemoteProductIndex(record.code);

    if (existingIndex) {
      if (recordToUpdate) {
        await updateRemoteProductIndex(recordToUpdate, indexMetadata?.[index]);
      }
    } else {
      indexEntriesToInsert.push(
        getIndexEntry(record, 'code', indexMetadata?.[index])
      );
    }
  }

  await Promise.all([
    indexEntriesToInsert.length
      ? database.insert<IndexEntry>('products', 'index', indexEntriesToInsert)
      : null,
    recordsToInsert.length
      ? database.insert<ProductHistory>('products', 'items', recordsToInsert)
      : null,
  ]);
};

// TODO optimize params - duplication
export const saveProducts = async (products: Product[], nfData: Nf) => {
  const mappedProducts = products.map(product => ({
    code: product.code,
    description: product.description,
    history: [buildHistoryItem(product, nfData)],
  }));

  await Promise.all([
    saveProductsOnLocal(mappedProducts),
    saveProductsOnRemote(mappedProducts),
  ]);
};

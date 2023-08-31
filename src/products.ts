import _ from 'lodash';
import { storage, database } from './proxies';
import {
  Nf,
  Product,
  ProductHistory,
  ProductHistoryItem,
  ProductHistoryWithIndex,
} from './types';
import createStorageIndex from './storageIndex';
import generateIndexEntry from './libs/generateIndexEntry';

type WithId<T> = { _id: string } & T;

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

const mergeHistory = <T extends ProductHistory>(
  currentRecord: T,
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

  const localIndex = await createStorageIndex('/products/index.csv');

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
      localIndex.set(
        dataToSave.code,
        generateIndexEntry(dataToSave, indexMetadata?.[index])
      );

      await storage.writeFile(filename, dataToSave);
      hasNewData = true;
    }
  }

  if (hasNewData) {
    await localIndex.save();
  }
};

const getRemoteProductItem = (code: string) =>
  database.findOne<WithId<ProductHistoryWithIndex>>(
    'items',
    'products',
    {
      code,
    },
    { projection: { _id: 0 } }
  );

const updateRemoteProductItem = async (item: ProductHistoryWithIndex) =>
  database.updateOne<ProductHistoryWithIndex>(
    'items',
    'products',
    { code: item.code },
    {
      $set: {
        index: item.index,
        history: item.history,
      },
    }
  );

export const saveProductsOnRemote = async (
  records: ProductHistory[],
  indexMetadata?: { timestamp: number; hash: string }[]
) => {
  if (!records.length) return;

  const recordsToInsert: ProductHistoryWithIndex[] = [];

  await Promise.all(
    records.map(async (record, loopIndex) => {
      const existingRecord = await getRemoteProductItem(record.code);

      if (existingRecord) {
        const mergedRecord = mergeHistory(existingRecord, record.history[0]);

        if (mergedRecord) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { index, ...mergedRecordWithoutIndex } = mergedRecord;
          const recordWithIndex = {
            ...mergedRecordWithoutIndex,
            index: generateIndexEntry(
              mergedRecordWithoutIndex,
              indexMetadata?.[loopIndex]
            ),
          };

          await updateRemoteProductItem(recordWithIndex);
        }

        return;
      }

      recordsToInsert.push({
        ...record,
        index: generateIndexEntry(record, indexMetadata?.[loopIndex]),
      });
    })
  );

  if (recordsToInsert.length) {
    await database.insert<ProductHistoryWithIndex>(
      'items',
      'products',
      recordsToInsert
    );
  }
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

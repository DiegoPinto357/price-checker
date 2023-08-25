import { storage, database } from './proxies';
import { Nf, Product, ProductHistory, ProductHistoryItem } from './types';
import createCsv from './libs/csv';
import insertIndexEntry, { getIndexEntry } from './libs/insertIndexEntry';

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

export const saveProductsOnLocal = async (
  records: ProductHistory[],
  indexMetadata?: { timestamp: number; hash: string }[]
) => {
  if (!records.length) return;

  const indexFile = await createCsv('/products/index.csv');

  for (const [index, record] of records.entries()) {
    insertIndexEntry(indexFile, record, 'code', {
      overwriteExisting: true,
      ...indexMetadata?.[index],
    });

    const filename = `/products/${record.code}.json`;
    await storage.writeFile(filename, record);
  }

  await indexFile.save();
};

export const saveProductsOnRemote = async (
  records: ProductHistory[],
  indexMetadata?: { timestamp: number; hash: string }[]
) => {
  if (!records.length) return;

  const indexEntries = records.map((record, index) =>
    getIndexEntry(record, 'code', indexMetadata?.[index])
  );

  await Promise.all([
    database.insert<ProductHistory>('products', 'items', records),
    database.insert<(typeof indexEntries)[0]>(
      'products',
      'index',
      indexEntries
    ),
  ]);
};

// TODO optimize params - duplication
export const saveProducts = async (products: Product[], nfData: Nf) => {
  const filesToSave: ProductHistory[] = [];

  for (const product of products) {
    const filename = `/products/${product.code}.json`;

    const currentFile = await storage.readFile<ProductHistory>(filename);

    if (currentFile) {
      const entryAlreadyExists = currentFile.history.find(
        ({ nfKey }) => nfKey === nfData.key
      );

      if (!entryAlreadyExists) {
        const historyItem = buildHistoryItem(product, nfData);

        currentFile.history.push(historyItem);
        currentFile.history = currentFile.history.sort(
          (a: ProductHistoryItem, b: ProductHistoryItem) =>
            parseDate(a.date).getTime() - parseDate(b.date).getTime()
        );

        filesToSave.push(currentFile);
      }
    } else {
      const productHistory: ProductHistory = {
        code: product.code,
        description: product.description,
        history: [buildHistoryItem(product, nfData)],
      };

      filesToSave.push(productHistory);
    }
  }

  await Promise.all([
    saveProductsOnLocal(filesToSave),
    saveProductsOnRemote(filesToSave),
  ]);
};

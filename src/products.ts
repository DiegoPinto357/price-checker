import md5 from 'md5';
import { storage } from './proxies';
import { Nf, Product, ProductHistory, ProductHistoryItem } from './types';
import createCsv from './libs/csv';

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

const insertIndexEntry = async (
  indexFile: Awaited<ReturnType<typeof createCsv>>,
  newData: ProductHistory,
  timestamp: number
) => {
  const hash = md5(JSON.stringify(newData));
  const indexEntry = `${newData.code}, ${timestamp}, ${hash}\n`;

  const existingEntryIndex = indexFile.findLineIndex(0, newData.code);
  if (existingEntryIndex !== -1) {
    return indexFile.replace(existingEntryIndex, indexEntry);
  }
  indexFile.appendLine(indexEntry);
};

// TODO optimize params - duplication
export const saveProducts = async (products: Product[], nfData: Nf) => {
  const indexFile = await createCsv('/products/index.csv');
  const timestamp = Date.now();

  for (const product of products) {
    const filename = `/products/${product.code}.json`;

    const currentFile = await storage.readFile<ProductHistory>(filename);
    if (currentFile) {
      const entryAlreadyExists = currentFile.history.find(
        ({ nfKey }) => nfKey === nfData.key
      );

      if (!entryAlreadyExists) {
        const historyItem = {
          nfKey: nfData.key,
          date: nfData.date,
          amount: product.amount,
          unit: product.unit,
          value: product.value,
          totalValue: product.totalValue,
        };

        currentFile.history.push(historyItem);
        currentFile.history = currentFile.history.sort(
          (a: ProductHistoryItem, b: ProductHistoryItem) =>
            parseDate(a.date).getTime() - parseDate(b.date).getTime()
        );
        await insertIndexEntry(indexFile, currentFile, timestamp);
        await storage.writeFile<ProductHistory>(filename, currentFile);
      }
    } else {
      const productHistory: ProductHistory = {
        code: product.code,
        description: product.description,
        history: [
          {
            nfKey: nfData.key,
            date: nfData.date,
            amount: product.amount,
            unit: product.unit,
            value: product.value,
            totalValue: product.totalValue,
          },
        ],
      };

      await insertIndexEntry(indexFile, productHistory, timestamp);
      await storage.writeFile<ProductHistory>(filename, productHistory);
    }
  }

  await indexFile.save();
};

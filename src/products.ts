import { storage } from './proxies';
import { Nf, Product, ProductHistory, ProductHistoryItem } from './types';

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

// TODO optimize params - duplication
export const saveProducts = async (products: Product[], nfData: Nf) => {
  for (const product of products) {
    const filename = `/products/${product.code}.json`;

    const historyItem = {
      nfKey: nfData.key,
      date: nfData.date,
      amount: product.amount,
      unit: product.unit,
      value: product.value,
      totalValue: product.totalValue,
    };

    const currentFile = await storage.readFile<ProductHistory>(filename);
    if (currentFile) {
      const entryAlreadyExists = currentFile.history.find(
        ({ nfKey }) => nfKey === nfData.key
      );

      if (!entryAlreadyExists) {
        currentFile.history.push(historyItem);
        currentFile.history = currentFile.history.sort(
          (a: ProductHistoryItem, b: ProductHistoryItem) =>
            parseDate(a.date).getTime() - parseDate(b.date).getTime()
        );
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

      await storage.writeFile<ProductHistory>(filename, productHistory);
    }
  }
};

import md5 from 'md5';
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

const csvFind = (content: string, colIndex: number, term: string) => {
  const lines = content.split('\n');
  let lineIndex = 0;
  const result = lines.some((line, index) => {
    const cols = line.split(',');
    lineIndex = index;
    return cols[colIndex].trim() === term;
  });
  return result ? lineIndex : -1;
};

const csvReplace = (
  content: string,
  lineIndex: number,
  newLineContent: string
) => {
  const lines = content.split('\n');
  lines[lineIndex] = newLineContent.trim();
  return lines.join('\n');
};

const generateIndexData = async (
  currentIndexData: string,
  newData: ProductHistory,
  timestamp: number
) => {
  const existingEntryIndex = csvFind(currentIndexData, 0, newData.code);

  const hash = md5(JSON.stringify(newData));
  const indexEntry = `${newData.code}, ${timestamp}, ${hash}\n`;

  if (existingEntryIndex !== -1) {
    return csvReplace(currentIndexData, existingEntryIndex, indexEntry);
  }
  return currentIndexData + indexEntry;
};

// TODO optimize params - duplication
export const saveProducts = async (products: Product[], nfData: Nf) => {
  const currentIndexFile = await storage.readFile<string>(
    '/products/index.csv'
  );
  let indexContent = currentIndexFile ? currentIndexFile : '';
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
        indexContent = await generateIndexData(
          indexContent,
          currentFile,
          timestamp
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

      indexContent = await generateIndexData(
        indexContent,
        productHistory,
        timestamp
      );
      await storage.writeFile<ProductHistory>(filename, productHistory);
    }
  }

  await storage.writeFile<string>('/products/index.csv', indexContent);
};

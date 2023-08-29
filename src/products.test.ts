import { Mock } from 'vitest';
import fs from 'fs';
import md5 from 'md5';
import { storage, database } from './proxies';
import { saveProducts } from './products';
import nfData from '../mockData/nf/nfData.json';
import remoteIndexFile from '../mockData/products/remoteIndex.json';

type MockStorage = typeof storage & { clearFiles: () => void };
type MockDatabase = typeof database & { clearRecords: () => void };

const mockStorage = storage as MockStorage;
const mockDatabase = database as MockDatabase;

vi.mock('./proxies/storage');
vi.mock('./proxies/database');

const localIndexFile = fs.readFileSync(
  './mockData/products/localIndex.csv',
  'utf-8'
);

describe('products', () => {
  describe('saveProducts', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      const date = new Date(2023, 6, 17, 18, 4, 26, 234);
      vi.setSystemTime(date);
      mockStorage.clearFiles();
      mockDatabase.clearRecords();
      vi.clearAllMocks();
    });

    it('adds new file for each new product', async () => {
      await saveProducts(nfData.items, nfData);

      const expectedProductsHistory = nfData.items.map(item => ({
        code: item.code,
        description: item.description,
        history: [
          {
            nfKey: nfData.key,
            date: nfData.date,
            amount: item.amount,
            unit: item.unit,
            value: item.value,
            totalValue: item.totalValue,
          },
        ],
      }));

      const localIndexResult = await storage.readFile('/products/index.csv');

      expect(localIndexResult).toBe(localIndexFile);

      nfData.items.forEach(async (item, index) => {
        const localItemsResult = await storage.readFile(
          `/products/${item.code}.json`
        );

        const remoteIndexResult = await database.findOne('products', 'index', {
          id: item.code,
        });

        const remoteItemResult = await database.findOne('products', 'items', {
          code: item.code,
        });

        expect(localItemsResult).toEqual(expectedProductsHistory[index]);
        expect(remoteIndexResult).toEqual(remoteIndexFile[index]);
        expect(remoteItemResult).toEqual(expectedProductsHistory[index]);
      });
    });

    // TODO update test to merge multiple products
    it('appends new item to existing product', async () => {
      const additionalNfData = {
        key: '43230693015006003210651210008545221815898394',
        version: '2',
        env: '1',
        csc: '1',
        hash: 'F45F565F22E7784B638952FF47C3870F93E7212C',
        number: '854522',
        series: '121',
        date: '15/06/2023 19:05:34',
        protocol: '143230954047438',
        store: {
          name: 'COMPANHIA ZAFFARI COMERCIO E INDUSTRIA',
          cnpj: '93.015.006/0032-10',
          incricaoEstadual: '0962638145',
          address: 'AV IPIRANGA, 5200, JARDIM BOTANICO, PORTO ALEGRE, RS',
        },
        items: [
          {
            code: '5601216120152',
            description: 'AZ POR ANDORINHA EV 500ML',
            amount: 1,
            unit: 'UN',
            value: 31.9,
            totalValue: 31.9,
          },
        ],
      };

      await saveProducts(nfData.items, nfData);

      const date = new Date(2023, 6, 20, 10, 2, 14, 357);
      vi.setSystemTime(date);

      (storage.writeFile as Mock).mockClear();
      (database.insert as Mock).mockClear();
      (database.updateOne as Mock).mockClear();

      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const localResult = await storage.readFile(
        '/products/5601216120152.json'
      );
      const remoteResult = await database.find('products', 'items', {
        code: '5601216120152',
      });
      const remoteIndex = await database.find('products', 'index', {
        id: '5601216120152',
      });

      const expectedResult = {
        code: '5601216120152',
        description: 'AZ POR ANDORINHA EV 500ML',
        history: [
          {
            nfKey: '43230693015006003210651210008545221815897062',
            date: '13/06/2023 20:19:31',
            amount: 1,
            unit: 'UN',
            value: 29.9,
            totalValue: 29.9,
          },
          {
            nfKey: '43230693015006003210651210008545221815898394',
            date: '15/06/2023 19:05:34',
            amount: 1,
            unit: 'UN',
            value: 31.9,
            totalValue: 31.9,
          },
        ],
      };

      const newHash = md5(JSON.stringify(expectedResult));
      const expectLocalIndexContent = localIndexFile.replace(
        '5601216120152, 1689627866234, cdd192a0f2e645dc6f1f8ff07ff9a861',
        `5601216120152, 1689858134357, ${newHash}`
      );

      expect(storage.writeFile).toBeCalledTimes(2);
      expect(storage.writeFile).toBeCalledWith(
        '/products/index.csv',
        expectLocalIndexContent
      );
      expect(localResult).toEqual(expectedResult);

      expect(database.insert).not.toBeCalled();
      expect(database.updateOne).toBeCalledTimes(2);
      expect(remoteResult).toHaveLength(1);
      expect(remoteResult[0]).toEqual(expectedResult);
      expect(remoteIndex).toHaveLength(1);
      expect(remoteIndex[0]).toEqual({
        id: '5601216120152',
        timestamp: 1689858134357,
        hash: newHash,
      });
    });

    it('does not appends an entry with same nf key', async () => {
      const additionalNfData = {
        key: '43230693015006003210651210008545221815897062',
        version: '2',
        env: '1',
        csc: '1',
        hash: 'F45F565F22E7784B638952FF47C3870F93E7212C',
        number: '854522',
        series: '121',
        date: '13/06/2023 20:19:31',
        protocol: '143230954047438',
        store: {
          name: 'COMPANHIA ZAFFARI COMERCIO E INDUSTRIA',
          cnpj: '93.015.006/0032-10',
          incricaoEstadual: '0962638145',
          address: 'AV IPIRANGA, 5200, JARDIM BOTANICO, PORTO ALEGRE, RS',
        },
        items: [
          {
            code: '5601216120152',
            description: 'AZ POR ANDORINHA EV 500ML',
            amount: 1,
            unit: 'UN',
            value: 31.9,
            totalValue: 31.9,
          },
        ],
      };

      await saveProducts(nfData.items, nfData);

      (storage.writeFile as Mock).mockClear();
      (database.insert as Mock).mockClear();
      (database.updateOne as Mock).mockClear();
      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      expect(storage.writeFile).not.toBeCalled();
      expect(database.insert).not.toBeCalled();
      expect(database.updateOne).not.toBeCalled();

      const localResult = await storage.readFile(
        '/products/5601216120152.json'
      );
      const remoteResult = await database.findOne('products', 'items', {
        code: '5601216120152',
      });

      const expectedResult = {
        code: '5601216120152',
        description: 'AZ POR ANDORINHA EV 500ML',
        history: [
          {
            nfKey: '43230693015006003210651210008545221815897062',
            date: '13/06/2023 20:19:31',
            amount: 1,
            unit: 'UN',
            value: 29.9,
            totalValue: 29.9,
          },
        ],
      };

      expect(localResult).toEqual(expectedResult);
      expect(remoteResult).toEqual(expectedResult);
    });

    it('sorts product history data as it is appended', async () => {
      const additionalNfData = {
        key: '43230693015006003210651210008545221815898394',
        version: '2',
        env: '1',
        csc: '1',
        hash: 'F45F565F22E7784B638952FF47C3870F93E7212C',
        number: '854522',
        series: '121',
        date: '08/06/2023 19:05:34',
        protocol: '143230954047438',
        store: {
          name: 'COMPANHIA ZAFFARI COMERCIO E INDUSTRIA',
          cnpj: '93.015.006/0032-10',
          incricaoEstadual: '0962638145',
          address: 'AV IPIRANGA, 5200, JARDIM BOTANICO, PORTO ALEGRE, RS',
        },
        items: [
          {
            code: '5601216120152',
            description: 'AZ POR ANDORINHA EV 500ML',
            amount: 1,
            unit: 'UN',
            value: 31.9,
            totalValue: 31.9,
          },
        ],
      };

      await saveProducts(nfData.items, nfData);

      (storage.writeFile as Mock).mockClear();
      (database.updateOne as Mock).mockClear();
      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const localResult = await storage.readFile(
        '/products/5601216120152.json'
      );
      const remoteResult = await database.findOne('products', 'items', {
        code: '5601216120152',
      });

      expect(storage.writeFile).toBeCalledTimes(2);
      expect(database.updateOne).toBeCalledTimes(2);

      const expectedResult = {
        code: '5601216120152',
        description: 'AZ POR ANDORINHA EV 500ML',
        history: [
          {
            nfKey: '43230693015006003210651210008545221815898394',
            date: '08/06/2023 19:05:34',
            amount: 1,
            unit: 'UN',
            value: 31.9,
            totalValue: 31.9,
          },
          {
            nfKey: '43230693015006003210651210008545221815897062',
            date: '13/06/2023 20:19:31',
            amount: 1,
            unit: 'UN',
            value: 29.9,
            totalValue: 29.9,
          },
        ],
      };

      expect(localResult).toEqual(expectedResult);
      expect(remoteResult).toEqual(expectedResult);
    });
  });
});

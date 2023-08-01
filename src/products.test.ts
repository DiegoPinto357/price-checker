import { Mock } from 'vitest';
import fs from 'fs';
import md5 from 'md5';
import { storage } from './proxies';
import { saveProducts } from './products';
import nfData from '../mockData/nf/nfData.json';

type MockStorage = typeof storage & { clearFiles: () => void };

vi.mock('./proxies/storage');

const defaultIndexFile = fs.readFileSync(
  './mockData/products/index.csv',
  'utf-8'
);

describe('products', () => {
  describe('saveProducts', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      const date = new Date(2023, 6, 17, 18, 4, 26, 234);
      vi.setSystemTime(date);
      (storage as MockStorage).clearFiles();
      vi.clearAllMocks();
    });

    it('adds new file for each new product', async () => {
      await saveProducts(nfData.items, nfData);

      expect(storage.writeFile).toBeCalledTimes(nfData.items.length + 1);
      nfData.items.forEach(item => {
        expect(storage.writeFile).toBeCalledWith(
          `/products/${item.code}.json`,
          {
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
          }
        );
      });

      expect(storage.writeFile).toBeCalledWith(
        '/products/index.csv',
        defaultIndexFile
      );
    });

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
      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const result = await storage.readFile('/products/5601216120152.json');

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

      expect(result).toEqual(expectedResult);

      const newHash = md5(JSON.stringify(expectedResult));
      const expectIndexContent = defaultIndexFile.replace(
        '5601216120152, 1689627866234, cdd192a0f2e645dc6f1f8ff07ff9a861',
        `5601216120152, 1689858134357, ${newHash}`
      );

      expect(storage.writeFile).toBeCalledTimes(2);
      expect(storage.writeFile).toBeCalledWith(
        '/products/index.csv',
        expectIndexContent
      );
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
      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const result = await storage.readFile('/products/5601216120152.json');

      expect(storage.writeFile).not.toBeCalled();
      expect(result).toEqual({
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
      });
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
      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const result = await storage.readFile('/products/5601216120152.json');

      expect(storage.writeFile).toBeCalledTimes(2);
      expect(result).toEqual({
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
      });
    });
  });
});

import { storage } from './proxies';
import { saveProducts } from './products';
import nfData from '../mockData/nf/nfData.json';

type MockStorage = typeof storage & { clearFiles: () => void };

vi.mock('./proxies/storage');

describe('products', () => {
  describe('saveProducts', () => {
    beforeEach(() => (storage as MockStorage).clearFiles());

    it('adds new file for each new product', async () => {
      await saveProducts(nfData.items, nfData);

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

      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const result = await storage.readFile('/products/5601216120152.json');

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
          {
            nfKey: '43230693015006003210651210008545221815898394',
            date: '15/06/2023 19:05:34',
            amount: 1,
            unit: 'UN',
            value: 31.9,
            totalValue: 31.9,
          },
        ],
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

      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const result = await storage.readFile('/products/5601216120152.json');

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

      const products = additionalNfData.items;
      await saveProducts(products, additionalNfData);

      const result = await storage.readFile('/products/5601216120152.json');

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

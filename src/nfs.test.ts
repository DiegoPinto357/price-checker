import { Mock } from 'vitest';
import { nf, storage } from './proxies';
import { getNfData, saveNf } from './nfs';
import nfData from '../mockData/nf/nfData.json';
import nfDataWithDuplication from '../mockData/nf/nfDataWithDuplication.json';

vi.mock('./proxies/nf');
vi.mock('./proxies/storage');

describe('nfs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    const date = new Date(2023, 6, 17, 18, 4, 26, 234);
    vi.setSystemTime(date);
  });

  describe('getNfData', () => {
    it('merges duplicated items', async () => {
      (nf.getNfData as Mock).mockResolvedValue(nfDataWithDuplication);

      const nfData = await getNfData(nfDataWithDuplication.key);

      const expectedProductList = [
        {
          code: '107686',
          description: 'CELECOXIBE 200MG 10 CAPSULAS RANBAXY GENERICO C1',
          amount: 1,
          unit: 'CAIXA',
          value: 48.47,
          totalValue: 48.47,
        },
        {
          code: '872640',
          description: 'LAMITOR CD 25MG 30 COMPRIMIDOS DISPERSIVEIS C1',
          amount: 2,
          unit: 'CAIXA',
          value: 39.47,
          totalValue: 78.94,
        },
      ];

      expect(nfData.items).toEqual(expectedProductList);
    });
  });

  describe('saveNf', () => {
    it('save nf file', async () => {
      await saveNf(nfData);

      expect(storage.writeFile).toBeCalledWith(
        `/nfs/${nfData.key}.json`,
        nfData
      );
      expect(storage.writeFile).toBeCalledWith(
        '/nfs/index.csv',
        '43230693015006003210651210008545221815897062, 1689627866234, a85bcdc4b11f56ebce0eea5fd6a9c6ed\n'
      );
    });

    it('does not add index entry if it already exists', async () => {
      const indefFilname = '/nfs/index.csv';
      const currentIndeFileContent =
        '43230693015006003210651210008545221815897062, 1689627665234, a85bcdc4b11f56ebce0eea5fd6a9c6ed\n';
      await storage.writeFile(indefFilname, currentIndeFileContent);

      await saveNf(nfData);

      const newIndexFileContent = await storage.readFile<string>(indefFilname);
      expect(newIndexFileContent).toBe(currentIndeFileContent);
    });
  });
});

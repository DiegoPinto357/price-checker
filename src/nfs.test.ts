import { Mock } from 'vitest';
import { nf, storage, database } from './proxies';
import { getNfData, saveNf } from './nfs';
import nfData from '../mockData/nf/nfData.json';
import nfDataWithDuplication from '../mockData/nf/nfDataWithDuplication.json';

type MockStorage = typeof storage & { clearFiles: () => void };
type MockDatabase = typeof database & { clearRecords: () => void };

const mockStorage = storage as MockStorage;
const mockDatabase = database as MockDatabase;

vi.mock('./proxies/nf');
vi.mock('./proxies/storage');
vi.mock('./proxies/database');

const indexEntryToCsvLine = (entry: {
  id: string;
  timestamp: number;
  hash: string;
}) => `${entry.id}, ${entry.timestamp}, ${entry.hash}\n`;

describe('nfs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    const date = new Date(2023, 6, 17, 18, 4, 26, 234);
    mockStorage.clearFiles();
    mockDatabase.clearRecords();
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
    const indexEntry = {
      id: '43230693015006003210651210008545221815897062',
      timestamp: 1689627866234,
      hash: 'a85bcdc4b11f56ebce0eea5fd6a9c6ed',
    };

    it('save nf file', async () => {
      await saveNf(nfData);

      expect(storage.writeFile).toBeCalledWith(
        `/nfs/${nfData.key}.json`,
        nfData
      );
      expect(storage.writeFile).toBeCalledWith(
        '/nfs/index.csv',
        indexEntryToCsvLine(indexEntry)
      );

      expect(database.insertOne).toBeCalledWith('nfs', 'index', indexEntry);
      expect(database.insertOne).toBeCalledWith('nfs', 'items', nfData);
    });

    it('does not add index entry if it already exists', async () => {
      const indexFilname = '/nfs/index.csv';
      const currentLocalIndexContent = indexEntryToCsvLine(indexEntry);
      await storage.writeFile(indexFilname, currentLocalIndexContent);

      const currentRemoteIndexContent = indexEntry;
      await database.insertOne('nfs', 'index', currentRemoteIndexContent);

      await saveNf(nfData);

      const newLocalIndexContent = await storage.readFile<string>(indexFilname);
      const newRemoteIndexContent = await database.find('nfs', 'index', {
        id: indexEntry.id,
      });

      expect(newLocalIndexContent).toBe(currentLocalIndexContent);
      expect(newRemoteIndexContent).toEqual([currentRemoteIndexContent]);
    });
  });
});

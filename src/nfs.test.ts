import { Mock } from 'vitest';
import { nf, storage, database } from './proxies';
import { getNfData, saveNf } from './nfs';
import nfData from '../mockData/nf/nfData.json';
import nfDataWithDuplication from '../mockData/nf/nfDataWithDuplication.json';
import { WithId, WithIndex } from './types';
import { Nf } from './types';

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
      timestamp: 1689627866234,
      hash: 'a85bcdc4b11f56ebce0eea5fd6a9c6ed',
    };

    it('save nf file', async () => {
      await saveNf(nfData);

      const localIndexResult = await storage.readFile('/nfs/index.csv');
      const localItemResult = await storage.readFile(`/nfs/${nfData.key}.json`);

      const remoteItemResult = await database.find(
        'items',
        'nfs',
        {},
        { projection: { _id: 0 } }
      );

      expect(localIndexResult).toBe(
        indexEntryToCsvLine({
          id: '43230693015006003210651210008545221815897062',
          ...indexEntry,
        })
      );
      expect(localItemResult).toEqual(nfData);

      expect(remoteItemResult).toHaveLength(1);
      expect(remoteItemResult[0]).toEqual({ ...nfData, index: indexEntry });
    });

    it('does not add index entry if it already exists', async () => {
      const indexFilename = '/nfs/index.csv';
      const currentLocalIndexContent = indexEntryToCsvLine({
        id: '43230693015006003210651210008545221815897062',
        ...indexEntry,
      });
      await storage.writeFile(indexFilename, currentLocalIndexContent);

      await database.insertOne('items', 'nfs', {
        ...nfData,
        index: indexEntry,
      });

      (storage.writeFile as Mock).mockClear();
      (database.insertOne as Mock).mockClear();

      await saveNf(nfData);

      const newLocalIndexContent = await storage.readFile<string>(
        indexFilename
      );
      const newRemoteItemContent = await database.find<WithId<WithIndex<Nf>>>(
        'items',
        'nfs',
        {
          key: nfData.key,
        },
        { projection: { _id: 0 } }
      );

      expect(storage.writeFile).not.toBeCalled();
      expect(database.insertOne).not.toBeCalled();
      expect(newLocalIndexContent).toBe(currentLocalIndexContent);
      expect(newRemoteItemContent).toHaveLength(1);
      expect(newRemoteItemContent[0]).toEqual({ ...nfData, index: indexEntry });
    });
  });
});

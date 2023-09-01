import createStorageIndex from './storageIndex';
import { storage, database } from './proxies';
import dataSync from './dataSync';
import baseIndexObject from '../mockData/dataSync/baseIndex.json';

vi.mock('./proxies/storage');
vi.mock('./proxies/database');

type StorageMock = typeof storage & { clearFiles: () => void };
type DatabaseMock = typeof database & { clearRecords: () => void };

interface IndexEntryValue {
  timestamp: number;
  hash: string;
}

const setupRemote = async (
  collectionName: string,
  indexEntries: Map<string, IndexEntryValue>
) => {
  const remoteFiles = Array.from(indexEntries).map(
    ([id, { timestamp, hash }]) => ({
      code: id,
      index: {
        timestamp,
        hash,
      },
      description: '',
      history: [],
    })
  );
  await database.insert('items', collectionName, remoteFiles);
};

const setupLocal = async (
  dataFolder: string,
  indexEntries: Map<string, IndexEntryValue>
) => {
  const csvIndex =
    Array.from(indexEntries).reduce(
      (csvContent, [id, { timestamp, hash }]) =>
        `${csvContent}\n${id}, ${timestamp}, ${hash}`,
      ''
    ) + '\n';
  await storage.writeFile('/products/index.csv', csvIndex);

  const files = Array.from(indexEntries).map(([id]) => ({
    code: id,
    description: '',
    history: [],
  }));

  for (const file of files) {
    await storage.writeFile(`/${dataFolder}/${file.code}.json`, file);
  }
};

const baseIndex = new Map(Object.entries(baseIndexObject));

describe('dataSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const date = new Date(2023, 6, 17, 18, 4, 26, 234);
    vi.setSystemTime(date);
    vi.clearAllMocks();
    (storage as StorageMock).clearFiles();
    (database as DatabaseMock).clearRecords();
  });

  it('pulls missing data from remote', async () => {
    const remoteIndex = baseIndex;
    const entriesToRemove = [
      '7896333041307',
      '7896333041383',
      '2989530000002',
      '7898994521204',
      '2022640000002',
    ];

    const localIndex = new Map(baseIndex);
    entriesToRemove.forEach(entry => localIndex.delete(entry));

    const missingEntries = entriesToRemove.map(entry => ({
      id: entry,
      index: { ...baseIndex.get(entry) },
    }));

    await setupRemote('products', remoteIndex);
    await setupLocal('products', localIndex);

    await dataSync.startSync();

    const newLocalIndex = await createStorageIndex('/products/index.csv');

    missingEntries.forEach(async missingEntry => {
      const localItem = await storage.readFile(
        `/products/${missingEntry.id}.json`
      );

      expect(localItem).toEqual({
        code: missingEntry.id,
        description: '',
        history: [],
      });

      expect(newLocalIndex.get(missingEntry.id)).toEqual(missingEntry.index);
    });
  });

  it('pushes missing data to remote', async () => {
    const localIndex = baseIndex;
    const entriesToRemove = [
      '7896333041307',
      '7896333041383',
      '2989530000002',
      '7898994521204',
      '2022640000002',
    ];

    const remoteIndex = new Map(baseIndex);
    entriesToRemove.forEach(entry => remoteIndex.delete(entry));

    const missingEntries = entriesToRemove.map(entry => ({
      id: entry,
      index: { ...baseIndex.get(entry) },
    }));

    await setupRemote('products', remoteIndex);
    await setupLocal('products', localIndex);

    await dataSync.startSync();

    missingEntries.forEach(async missingEntry => {
      const remoteItem = await database.find(
        'items',
        'products',
        {
          code: missingEntry.id,
        },
        { projection: { _id: 0 } }
      );

      expect(remoteItem).toHaveLength(1);
      expect(remoteItem[0]).toEqual({
        code: missingEntry.id,
        index: missingEntry.index,
        description: '',
        history: [],
      });
    });
  });

  // describe('merges product history data', () => {});

  // describe('resolves conflicts on product history', () => {});
  // rebuild local index (missing file OR index entry)
});

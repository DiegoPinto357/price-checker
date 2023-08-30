import fs from 'fs';
import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';
import dataSync from './dataSync';

vi.mock('./proxies/storage');
vi.mock('./proxies/database');

type StorageMock = typeof storage & { clearFiles: () => void };
type DatabaseMock = typeof database & { clearRecords: () => void };

interface IndexEntry {
  id: string;
  timestamp: number;
  hash: string;
}

const parseCsvIndex = (indexContent: string) => {
  const parsedIndex = parseCsv<Record<keyof IndexEntry, string>>(indexContent, [
    'id',
    'timestamp',
    'hash',
  ]);
  return parsedIndex.map(entry => ({
    ...entry,
    timestamp: parseInt(entry.timestamp),
  }));
};

const removeItemsFromIndex = (
  indexEntries: IndexEntry[],
  itemsToRemove: number[]
) => indexEntries.filter((_line, index) => !itemsToRemove.includes(index));

const getEntriesFromIndex = (entries: IndexEntry[], entriesIndex: number[]) =>
  entries.filter((_entry, index) => entriesIndex.includes(index));

const hasIndexEntry = (entries: IndexEntry[], entry: IndexEntry) => {
  return entries.some(
    ({ id, timestamp, hash }) =>
      id === entry.id && timestamp === entry.timestamp && hash === entry.hash
  );
};

const setupRemote = async (
  collectionName: string,
  indexEntries: IndexEntry[]
) => {
  const remoteFiles = indexEntries.map(({ id, timestamp, hash }) => ({
    code: id,
    index: {
      timestamp,
      hash,
    },
    description: '',
    history: [],
  }));
  await database.insert('items', collectionName, remoteFiles);
};

const setupLocal = async (dataFolder: string, indexEntries: IndexEntry[]) => {
  const csvIndex =
    indexEntries.reduce(
      (csvContent, { id, timestamp, hash }) =>
        `${csvContent}\n${id}, ${timestamp}, ${hash}`,
      ''
    ) + '\n';
  await storage.writeFile('/products/index.csv', csvIndex);

  const files = indexEntries.map(({ id }) => ({
    code: id,
    description: '',
    history: [],
  }));

  for (const file of files) {
    await storage.writeFile(`/${dataFolder}/${file.code}.json`, file);
  }
};

const baseIndex = parseCsvIndex(
  fs.readFileSync('./mockData/products/localIndex.csv', 'utf-8')
);

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
    const entriesToRemove = [0, 4, 6, 9];
    const localIndex = removeItemsFromIndex(remoteIndex, entriesToRemove);
    const missingEntries = getEntriesFromIndex(baseIndex, entriesToRemove);

    await setupRemote('products', remoteIndex);
    await setupLocal('products', localIndex);

    await dataSync.startSync();

    const newLocalIndex = parseCsvIndex(
      await storage.readFile<string>('/products/index.csv')
    );

    missingEntries.forEach(async missingEntry => {
      const localItem = await storage.readFile(
        `/products/${missingEntry.id}.json`
      );

      expect(localItem).toEqual({
        code: missingEntry.id,
        description: '',
        history: [],
      });

      expect(hasIndexEntry(newLocalIndex, missingEntry)).toBeTruthy();
    });
  });

  it('pushes missing data to remote', async () => {
    const entriesToRemove = [0, 4, 6, 9];
    const remoteIndex = removeItemsFromIndex(baseIndex, [0, 4, 6, 9]);
    const localIndex = baseIndex;
    const missingEntries = getEntriesFromIndex(baseIndex, entriesToRemove);

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
        index: {
          timestamp: missingEntry.timestamp,
          hash: missingEntry.hash,
        },
        description: '',
        history: [],
      });
    });
  });

  // describe('merges product history data', () => {});

  // describe('resolves conflicts on product history', () => {});
  // rebuild local index (missing file OR index entry)
});

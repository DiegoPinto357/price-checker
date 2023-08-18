import fs from 'fs';
import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';
import dataSync from './dataSync';
import { Mock } from 'vitest';

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
  databaseName: string,
  indexEntries: IndexEntry[]
) => {
  await database.insert(databaseName, 'index', indexEntries);

  const remoteFiles = indexEntries.map(({ id }) => ({
    code: id,
    description: '',
    history: [],
  }));
  await database.insert(databaseName, 'items', remoteFiles);
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
  fs.readFileSync('./mockData/products/index.csv', 'utf-8')
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

    (storage.writeFile as Mock).mockClear();

    await dataSync.startSync();

    expect(storage.writeFile).toBeCalledTimes(missingEntries.length + 1);
    expect(database.findOne).toBeCalledTimes(missingEntries.length);

    const newLocalIndex = parseCsvIndex(
      await storage.readFile<string>('/products/index.csv')
    );

    missingEntries.forEach(missingEntry => {
      expect(database.findOne).toBeCalledWith('products', 'items', {
        code: missingEntry.id,
      });

      expect(storage.writeFile).toBeCalledWith(
        `/products/${missingEntry.id}.json`,
        {
          code: missingEntry.id,
          description: '',
          history: [],
        }
      );

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

    (storage.writeFile as Mock).mockClear();
    (database.insert as Mock).mockClear();

    await dataSync.startSync();

    expect(storage.readFile).toBeCalledTimes(missingEntries.length + 1);
    expect(database.insert).toBeCalledTimes(2);
    expect(database.insert).toBeCalledWith('products', 'index', missingEntries);
    expect(database.insert).toBeCalledWith(
      'products',
      'items',
      missingEntries.map(({ id }) => ({
        code: id,
        description: '',
        history: [],
      }))
    );

    const newRemoteIndex = await database.find<IndexEntry>('products', 'index');

    missingEntries.forEach(missingEntry => {
      expect(storage.readFile).toBeCalledWith(
        `/products/${missingEntry.id}.json`
      );

      expect(hasIndexEntry(newRemoteIndex, missingEntry)).toBeTruthy();
    });
  });

  // describe('merges product history data', () => {});

  // describe('resolves conflicts on product history', () => {});
});

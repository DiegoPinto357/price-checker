import fs from 'fs';
import { parseCsv, parseCsvLine } from './libs/csv';
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

const indexFile = fs.readFileSync('./mockData/products/index.csv', 'utf-8');

const removeItemsFromIndex = (
  indexContent: string,
  linesToRemove: number[]
) => {
  const lines = indexContent.split('\n');
  // linesToRemove.forEach(index => lines.splice(index, 1));
  const filteredLines = lines.filter(
    (_line, index) => !linesToRemove.includes(index)
  );
  return filteredLines.join('\n');
};

const getIndexEntryFromCsv = (indexCsvLine: string) => {
  const parsedEntry = parseCsvLine<IndexEntry>(indexCsvLine, [
    'id',
    'timestamp',
    'hash',
  ]);
  return { ...parsedEntry, timestamp: parseInt(parsedEntry.timestamp) };
};

const getEntriesFromIndex = (indexContent: string, entriesIndex: number[]) => {
  const lines = indexContent.split('\n');
  const selectedEntries = lines.filter((_line, index) =>
    entriesIndex.includes(index)
  );
  return selectedEntries.map(line => getIndexEntryFromCsv(line));
};

const hasIndexEntryCsv = (indexContent: string, entry: IndexEntry) => {
  const lines = indexContent.split('\n');
  const entries = lines.map(line => getIndexEntryFromCsv(line));
  return entries.some(
    ({ id, timestamp, hash }) =>
      id === entry.id && timestamp === entry.timestamp && hash === entry.hash
  );
};

const hasIndexEntry = (entries: IndexEntry[], entry: IndexEntry) => {
  return entries.some(
    ({ id, timestamp, hash }) =>
      id === entry.id && timestamp === entry.timestamp && hash === entry.hash
  );
};

const setupRemote = async (databaseName: string, indexContent: string) => {
  const rawEntries = parseCsv<{ id: string; timestamp: string; hash: string }>(
    indexContent,
    ['id', 'timestamp', 'hash']
  );
  const entries = rawEntries.map(entry => ({
    ...entry,
    timestamp: parseInt(entry.timestamp),
  }));
  await database.insert(databaseName, 'index', entries);

  const remoteFiles = entries.map(({ id }) => ({
    code: id,
    description: '',
    history: [],
  }));
  await database.insert(databaseName, 'items', remoteFiles);
};

const setupLocal = async (dataFolder: string, indexContent: string) => {
  await storage.writeFile('/products/index.csv', indexContent);

  const rawIndexEntries = parseCsv<{
    id: string;
    timestamp: string;
    hash: string;
  }>(indexContent, ['id', 'timestamp', 'hash']);
  const indexEntries = rawIndexEntries.map(entry => ({
    ...entry,
    timestamp: parseInt(entry.timestamp),
  }));

  const files = indexEntries.map(({ id }) => ({
    code: id,
    description: '',
    history: [],
  }));

  for (const file of files) {
    await storage.writeFile(`/${dataFolder}/${file.code}.json`, file);
  }
};

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
    const remoteIndex = indexFile;
    const linesToRemove = [0, 4, 6, 9];
    const localIndex = removeItemsFromIndex(indexFile, linesToRemove);
    const missingEntries = getEntriesFromIndex(indexFile, linesToRemove);

    await setupRemote('products', remoteIndex);
    await setupLocal('products', localIndex);

    (storage.writeFile as Mock).mockClear();

    await dataSync.startSync();

    expect(storage.writeFile).toBeCalledTimes(missingEntries.length + 1);
    expect(database.findOne).toBeCalledTimes(missingEntries.length);

    const newLocalIndex = await storage.readFile<string>('/products/index.csv');

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

      expect(hasIndexEntryCsv(newLocalIndex, missingEntry)).toBeTruthy();
    });
  });

  it('pushes missing data to remote', async () => {
    const linesToRemove = [0, 4, 6, 9];
    const remoteIndex = removeItemsFromIndex(indexFile, [0, 4, 6, 9]);
    const localIndex = indexFile;
    const missingEntries = getEntriesFromIndex(indexFile, linesToRemove);

    await setupRemote('products', remoteIndex);
    await setupLocal('products', localIndex);

    (storage.writeFile as Mock).mockClear();

    await dataSync.startSync();

    expect(storage.readFile).toBeCalledTimes(missingEntries.length + 1);
    expect(database.insertOne).toBeCalledTimes(2 * missingEntries.length);

    const newRemoteIndex = await database.find<IndexEntry>('products', 'index');

    missingEntries.forEach(missingEntry => {
      expect(storage.readFile).toBeCalledWith(
        `/products/${missingEntry.id}.json`
      );

      expect(database.insertOne).toBeCalledWith('products', 'items', {
        code: missingEntry.id,
        description: '',
        history: [],
      });

      expect(database.insertOne).toBeCalledWith(
        'products',
        'index',
        missingEntry
      );

      expect(hasIndexEntry(newRemoteIndex, missingEntry)).toBeTruthy();
    });
  });

  // describe('merges product history data', () => {});

  // describe('resolves conflicts on product history', () => {});
});

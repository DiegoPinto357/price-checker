import fs from 'fs';
import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';
import dataSync from './dataSync';
import { Mock } from 'vitest';

vi.mock('./proxies/storage');
vi.mock('./proxies/database');

const indexFile = fs.readFileSync('./mockData/products/index.csv', 'utf-8');

const removeItemsFromIndex = (
  indexContent: string,
  linesToRemove: number[]
) => {
  const lines = indexContent.split('\n');
  linesToRemove.forEach(index => lines.splice(index, 1));
  return lines.join('\n');
};

const setupRemote = async (
  databaseName: string,
  collectionName: string,
  indexContent: string
) => {
  const rawEntries = parseCsv<{ id: string; timestamp: string; hash: string }>(
    indexContent,
    ['id', 'timestamp', 'hash']
  );
  const entries = rawEntries.map(entry => ({
    ...entry,
    timestamp: parseInt(entry.timestamp),
  }));
  await database.insert(databaseName, collectionName, entries);

  const remoteFiles = entries.map(({ id }) => ({
    code: id,
    description: '',
    history: [],
  }));
  await database.insert(databaseName, 'items', remoteFiles);
};

const setupLocal = async (indexContent: string) => {
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
    await storage.writeFile(`/products/${file.code}.json`, file);
  }
};

describe('dataSync', () => {
  it('pulls missing data from remote', async () => {
    const remoteIndex = indexFile;
    const localIndex = removeItemsFromIndex(indexFile, [0, 4, 6, 9]);

    await setupRemote('products', 'index', remoteIndex);
    await setupLocal(localIndex);

    (storage.writeFile as Mock).mockClear();

    await dataSync.startSync();

    const missingIds = [
      '7896333041307',
      '2064460000008',
      '7891025122432',
      '7898994521204',
    ];

    expect(storage.writeFile).toBeCalledTimes(missingIds.length + 1);
    expect(database.findOne).toBeCalledTimes(missingIds.length);

    missingIds.forEach(missingId => {
      expect(database.findOne).toBeCalledWith('products', 'items', {
        code: missingId,
      });
      expect(storage.writeFile).toBeCalledWith(`/products/${missingId}.json`, {
        code: missingId,
        description: '',
        history: [],
      });
    });
    expect(storage.writeFile).toBeCalledWith(
      '/products/index.csv',
      expect.any(String)
    );
  });

  // describe('pushes missing data in remote', () => {});

  // describe('merges product history data', () => {});

  // describe('resolves conflicts on product history', () => {});
});

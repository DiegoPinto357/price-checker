import fs from 'fs';
import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';
import dataSync from './dataSync';

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

const setRemoteIndex = async (
  databaseName: string,
  collectionName: string,
  indexContent: string
) => {
  const entries = parseCsv(indexContent, ['id', 'timestamp', 'hash']);
  return await database.insert(databaseName, collectionName, entries);
};

describe('dataSync', () => {
  it('pulls missing data from remote', async () => {
    const remoteIndex = indexFile;
    const localIndex = removeItemsFromIndex(indexFile, [0, 4, 6, 9]);

    await setRemoteIndex('products', 'index', remoteIndex);
    await storage.writeFile('/products/index.csv', localIndex);

    const { missingLocalFiles, missingRemoteFiles } =
      await dataSync.getMissingFiles();
    console.log(missingLocalFiles);
    console.log(missingRemoteFiles);

    // assert
    // local and remote indexes should be equal
    // localshould have the missing files
  });

  // describe('pushes missing data in remote', () => {});

  // describe('merges product history data', () => {});

  // describe('resolves conflicts on product history', () => {});
});

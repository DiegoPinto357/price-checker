import { saveProductRecords } from './products';
import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';
import { ProductHistory } from './types';

interface IndexEntry {
  id: string;
  timestamp: number;
  hash: string;
}

interface StringIndexEntry {
  id: string;
  timestamp: string;
  hash: string;
}

const getMissingFiles = async () => {
  const [rawLocalIndex, remoteIndex] = await Promise.all([
    // TODO use csv module to load the file
    storage.readFile<string>('/products/index.csv'),
    database.find<IndexEntry>('products', 'index'),
  ]);
  const parsedLocalIndex = parseCsv<StringIndexEntry>(rawLocalIndex, [
    'id',
    'timestamp',
    'hash',
  ]);
  const localIndex = parsedLocalIndex.map(entry => ({
    ...entry,
    timestamp: parseInt(entry.timestamp),
  }));

  const missingLocalFiles = remoteIndex.filter(
    remoteEntry =>
      !localIndex.find(localEntry => localEntry.id === remoteEntry.id)
  );

  const missingRemoteFiles = localIndex.filter(
    localEntry =>
      !remoteIndex.find(remoteEntry => remoteEntry.id === localEntry.id)
  );

  return { missingLocalFiles, missingRemoteFiles };
};

const pullFromRemote = async (entriesList: IndexEntry[]) => {
  const records = await Promise.all(
    entriesList.map(({ id }) =>
      database.findOne<ProductHistory>('products', 'items', { code: id })
    )
  );

  const validRecords = records.filter(
    (record): record is ProductHistory => !!record
  )!;

  if (validRecords.length) {
    const indexMetadata = entriesList.map(({ timestamp, hash }) => ({
      timestamp,
      hash,
    }));
    await saveProductRecords(validRecords, indexMetadata);
  }
};

const pushToRemote = async (entriesList: IndexEntry[]) => {
  const files = await Promise.all(
    entriesList.map(({ id }) =>
      storage.readFile<ProductHistory>(`/products/${id}.json`)
    )
  );

  await Promise.all(
    files.map(async (file, index) => {
      await database.insertOne<ProductHistory>('products', 'items', file);

      const indexEntry = entriesList[index];
      await database.insertOne<IndexEntry>('products', 'index', indexEntry);
    })
  );
};

const startSync = async () => {
  const { missingLocalFiles, missingRemoteFiles } = await getMissingFiles();

  if (missingLocalFiles.length) {
    await pullFromRemote(missingLocalFiles);
  }

  if (missingRemoteFiles.length) {
    await pushToRemote(missingRemoteFiles);
  }
};

export default {
  startSync,
};

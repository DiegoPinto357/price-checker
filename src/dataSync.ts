import { saveProductRecords } from './products';
import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';
import { ProductHistory } from './types';

interface IndexEntry {
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
  const parsedLocalIndex = parseCsv<IndexEntry>(rawLocalIndex, [
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

const pullFromRemote = async (idList: string[]) => {
  const records = await Promise.all(
    idList.map(id =>
      database.findOne<ProductHistory>('products', 'items', { code: id })
    )
  );

  const validRecords = records.filter(
    (record): record is ProductHistory => !!record
  )!;

  if (validRecords.length) {
    await saveProductRecords(validRecords);
  }
};

const startSync = async () => {
  const { missingLocalFiles, missingRemoteFiles } = await getMissingFiles();
  if (missingLocalFiles.length) {
    await pullFromRemote(missingLocalFiles.map(({ id }) => id));
  }
  console.log(missingLocalFiles);
  console.log(missingRemoteFiles);
};

export default {
  startSync,
};

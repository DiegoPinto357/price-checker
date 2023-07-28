import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';

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
  const localIndex = parseCsv<IndexEntry>(rawLocalIndex, [
    'id',
    'timestamp',
    'hash',
  ]);

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

export default {
  getMissingFiles,
};

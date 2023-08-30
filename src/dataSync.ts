import { saveProductsOnLocal, saveProductsOnRemote } from './products';
import { parseCsv } from './libs/csv';
import { storage, database } from './proxies';
import { ProductHistory, ProductHistoryWithIndex } from './types';

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

// TODO use a type decorator to add _id to existing types
interface ProductHistoryWithIndexFromDB extends ProductHistoryWithIndex {
  _id: string;
}

const getMissingFiles = async () => {
  const [rawLocalIndex, remoteItems] = await Promise.all([
    // TODO use csv module to load the file
    storage.readFile<string>('/products/index.csv'),
    database.find<ProductHistoryWithIndexFromDB>(
      'items',
      'products',
      {},
      { projection: { _id: 0, description: 0, history: 0 } }
    ),
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

  const remoteIndex = remoteItems.map(item => ({
    id: item.code,
    ...item.index,
  }));

  console.log({ localIndex, remoteIndex });

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
  // TODO method to get mising files already found the records, it can be passed to this method
  const records = (await Promise.all(
    entriesList.map(({ id }) =>
      database.findOne<ProductHistoryWithIndexFromDB>(
        'items',
        'products',
        { code: id },
        { projection: { _id: 0, index: 0 } }
      )
    )
  )) as ProductHistory[]; // TODO resahpe result internally based on projection

  const validRecords = records.filter(
    (record): record is ProductHistory => !!record
  )!;

  if (validRecords.length) {
    const indexMetadata = entriesList.map(({ timestamp, hash }) => ({
      timestamp,
      hash,
    }));
    await saveProductsOnLocal(validRecords, indexMetadata);
  }
};

const pushToRemote = async (entriesList: IndexEntry[]) => {
  const files = await Promise.all(
    entriesList.map(({ id }) =>
      storage.readFile<ProductHistory>(`/products/${id}.json`)
    )
  );

  await saveProductsOnRemote(files, entriesList);
};

const startSync = async () => {
  const { missingLocalFiles, missingRemoteFiles } = await getMissingFiles();
  console.log({ missingLocalFiles, missingRemoteFiles });

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

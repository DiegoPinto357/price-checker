import createStorageIndex from './storageIndex';
import { saveProductsOnLocal, saveProductsOnRemote } from './products';
import { storage, database } from './proxies';
import { ProductHistory, ProductHistoryWithIndex } from './types';

type IndexEntry = [string, { timestamp: number; hash: string }];

// TODO use a type decorator to add _id to existing types
interface ProductHistoryWithIndexFromDB extends ProductHistoryWithIndex {
  _id: string;
}

const getMissingFiles = async () => {
  const [localIndex, remoteItems] = await Promise.all([
    // TODO use csv module to load the file
    createStorageIndex('/products/index.csv'),
    database.find<ProductHistoryWithIndexFromDB>(
      'items',
      'products',
      {},
      { projection: { _id: 0, description: 0, history: 0 } }
    ),
  ]);

  const remoteIndex: IndexEntry[] = remoteItems.map(item => [
    item.code,
    item.index,
  ]);

  const missingLocalFiles = remoteIndex.filter(([id]) => !localIndex.get(id));

  const missingRemoteFiles = localIndex
    .getEntries()
    .filter(([id]) => !remoteIndex.find(remoteEntry => remoteEntry[0] === id));

  return { missingLocalFiles, missingRemoteFiles };
};

const pullFromRemote = async (entriesList: IndexEntry[]) => {
  // TODO method to get mising files already found the records, it can be passed to this method
  const records = (await Promise.all(
    entriesList.map(([id]) =>
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
    const indexMetadata = entriesList.map(entry => entry[1]);
    await saveProductsOnLocal(validRecords, indexMetadata);
  }
};

const pushToRemote = async (entriesList: IndexEntry[]) => {
  const files = await Promise.all(
    entriesList.map(([id]) =>
      storage.readFile<ProductHistory>(`/products/${id}.json`)
    )
  );

  const indexMetadata = entriesList.map(entry => entry[1]);
  await saveProductsOnRemote(files, indexMetadata);
};

const startSync = async () => {
  const { missingLocalFiles, missingRemoteFiles } = await getMissingFiles();
  console.dir({ missingLocalFiles, missingRemoteFiles }, { depth: null });

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

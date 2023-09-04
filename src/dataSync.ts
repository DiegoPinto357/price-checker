import createStorageIndex from './storageIndex';
import {
  saveProductsOnLocal,
  saveProductsOnRemote,
  mergeProducts,
} from './products';
import { storage, database } from './proxies';
import { WithId, ProductHistory, ProductHistoryWithIndex } from './types';

interface IndexData {
  timestamp: number;
  hash: string;
}

type IndexEntry = [string, IndexData];

const getMissingFiles = async () => {
  const [localIndex, remoteItems] = await Promise.all([
    createStorageIndex('/products/index.csv'),
    database.find<WithId<ProductHistoryWithIndex>>(
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

  const conflictingFiles = new Set<string>();

  const missingLocalFiles = remoteIndex.filter(([id, { hash }]) => {
    const localEntry = localIndex.get(id);

    if (localEntry && localEntry.hash !== hash) {
      conflictingFiles.add(id);
    }

    return !localEntry;
  });

  const missingRemoteFiles = localIndex
    .getEntries()
    .filter(([id]) => !remoteIndex.find(remoteEntry => remoteEntry[0] === id));

  return {
    missingLocalFiles,
    missingRemoteFiles,
    conflictingFiles: Array.from(conflictingFiles),
  };
};

const pullFromRemote = async (entriesList: IndexEntry[]) => {
  // TODO method to get mising files already found the records, it can be passed to this method
  const records = (await Promise.all(
    entriesList.map(([id]) =>
      database.findOne<WithId<ProductHistoryWithIndex>>(
        'items',
        'products',
        { code: id },
        { projection: { _id: 0, index: 0 } }
      )
    )
  )) as ProductHistory[];

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

const resolveConflicts = async (conflicts: string[]) => {
  const productsToUpdate: ProductHistory[] = [];

  for (const id of conflicts) {
    const [localFile, remoteRecord] = await Promise.all([
      storage.readFile<ProductHistory>(`/products/${id}.json`),
      database.findOne<WithId<ProductHistoryWithIndex>>(
        'items',
        'products',
        { code: id },
        { projection: { _id: 0, index: 0 } }
      ),
    ]);

    if (localFile && remoteRecord) {
      // merge will happen twice (products will do it again)
      const merged = mergeProducts(localFile, remoteRecord);
      productsToUpdate.push(merged);
    }
  }

  if (productsToUpdate.length) {
    await Promise.all([
      saveProductsOnLocal(productsToUpdate),
      saveProductsOnRemote(productsToUpdate),
    ]);
  }
};

const startSync = async () => {
  const { missingLocalFiles, missingRemoteFiles, conflictingFiles } =
    await getMissingFiles();
  console.dir(
    { missingLocalFiles, missingRemoteFiles, conflictingFiles },
    { depth: null }
  );

  if (missingLocalFiles.length) {
    await pullFromRemote(missingLocalFiles);
  }

  if (missingRemoteFiles.length) {
    await pushToRemote(missingRemoteFiles);
  }

  if (conflictingFiles.length) {
    await resolveConflicts(conflictingFiles);
  }
};

export default {
  startSync,
};

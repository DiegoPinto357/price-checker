import createStorageIndex from './storageIndex';
import {
  saveProductsOnLocal,
  saveProductsOnRemote,
  mergeProducts,
} from './products';
import { saveNfsOnLocal } from './nfs';
import { storage, database } from './proxies';
import { WithId, WithIndex, ProductHistory, Nf } from './types';

interface IndexData {
  timestamp: number;
  hash: string;
}

type IndexEntry = [string, IndexData];

const getMissingFiles = async (
  localIndex: Awaited<ReturnType<typeof createStorageIndex>>,
  remoteIndex: IndexEntry[]
) => {
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

const pullProductsFromRemote = async (entriesList: IndexEntry[]) => {
  // TODO method to get mising files already found the records, it can be passed to this method
  const records = (await Promise.all(
    entriesList.map(([id]) =>
      database.findOne<WithId<WithIndex<ProductHistory>>>(
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

const pushProductsToRemote = async (entriesList: IndexEntry[]) => {
  const files = await Promise.all(
    entriesList.map(([id]) =>
      storage.readFile<ProductHistory>(`/products/${id}.json`)
    )
  );

  const indexMetadata = entriesList.map(entry => entry[1]);
  await saveProductsOnRemote(files, indexMetadata);
};

const resolveProductsConflicts = async (conflicts: string[]) => {
  const productsToUpdate: ProductHistory[] = [];

  for (const id of conflicts) {
    const [localFile, remoteRecord] = await Promise.all([
      storage.readFile<ProductHistory>(`/products/${id}.json`),
      database.findOne<WithId<WithIndex<ProductHistory>>>(
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

const pullNfsFromRemote = async (entriesList: IndexEntry[]) => {
  // TODO method to get mising files already found the records, it can be passed to this method
  const records = (await Promise.all(
    entriesList.map(([id]) =>
      database.findOne<WithId<WithIndex<Nf>>>(
        'items',
        'nfs',
        { key: id },
        { projection: { _id: 0, index: 0 } }
      )
    )
  )) as Nf[];

  const validRecords = records.filter((record): record is Nf => !!record)!;

  if (validRecords.length) {
    const indexMetadata = entriesList.map(entry => entry[1]);
    await saveNfsOnLocal(validRecords, indexMetadata);
  }
};

const syncProducts = async () => {
  const [localIndex, remoteItems] = await Promise.all([
    createStorageIndex('/products/index.csv'),
    database.find<WithId<WithIndex<ProductHistory>>>(
      'items',
      'products',
      {},
      { projection: { _id: 0, code: 1, index: 1 } }
    ),
  ]);

  const remoteIndex: IndexEntry[] = remoteItems.map(item => [
    item.code,
    item.index,
  ]);

  const { missingLocalFiles, missingRemoteFiles, conflictingFiles } =
    await getMissingFiles(localIndex, remoteIndex);

  // console.dir(
  //   { missingLocalFiles, missingRemoteFiles, conflictingFiles },
  //   { depth: null }
  // );

  if (missingLocalFiles.length) {
    await pullProductsFromRemote(missingLocalFiles);
  }

  if (missingRemoteFiles.length) {
    await pushProductsToRemote(missingRemoteFiles);
  }

  if (conflictingFiles.length) {
    await resolveProductsConflicts(conflictingFiles);
  }
};

const syncNfs = async () => {
  const [localIndex, remoteItems] = await Promise.all([
    createStorageIndex('/nfs/index.csv'),
    database.find<WithId<WithIndex<Nf>>>(
      'items',
      'nfs',
      {},
      { projection: { _id: 0, key: 1, index: 1 } }
    ),
  ]);

  const remoteIndex: IndexEntry[] = remoteItems.map(item => [
    item.key,
    item.index,
  ]);

  const { missingLocalFiles, missingRemoteFiles, conflictingFiles } =
    await getMissingFiles(localIndex, remoteIndex);

  console.dir(
    { missingLocalFiles, missingRemoteFiles, conflictingFiles },
    { depth: null }
  );

  if (missingLocalFiles.length) {
    await pullNfsFromRemote(missingLocalFiles);
  }
};

const startSync = () => Promise.all([syncProducts(), syncNfs()]);

export default {
  startSync,
};

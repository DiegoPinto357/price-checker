import createStorageIndex from './storageIndex';
import {
  getProductsFromLocal,
  getProductsFromRemote,
  getProductsRemoteIndex,
  saveProductsOnLocal,
  saveProductsOnRemote,
  mergeProducts,
} from './products';
import {
  getNfsFromLocal,
  getNfsFromRemote,
  getNfsRemoteIndex,
  saveNfsOnLocal,
  saveNfsOnRemote,
} from './nfs';
import { ProductHistory, Nf } from './types';

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
  const products = await getProductsFromRemote(entriesList.map(([id]) => id));

  if (products.length) {
    const indexMetadata = entriesList.map(entry => entry[1]);
    await saveProductsOnLocal(products, { indexMetadata });
  }
};

const pushProductsToRemote = async (entriesList: IndexEntry[]) => {
  const files = await getProductsFromLocal(entriesList.map(([id]) => id));
  const validFiles = files.filter((file): file is ProductHistory => !!file)!;

  const indexMetadata = entriesList.map(entry => entry[1]);
  await saveProductsOnRemote(validFiles, { indexMetadata });
};

const resolveProductsConflicts = async (conflicts: string[]) => {
  const productsToUpdate: ProductHistory[] = [];
  const [remoteRecords, localFiles] = await Promise.all([
    getProductsFromRemote(conflicts),
    getProductsFromLocal(conflicts),
  ]);

  localFiles.forEach((localFile, index) => {
    const remoteRecord = remoteRecords[index];

    if (localFile && remoteRecord) {
      // TODO merge will happen twice (products will do it again)
      const merged = mergeProducts(localFile, remoteRecord);
      productsToUpdate.push(merged);
    }
  });

  if (productsToUpdate.length) {
    await Promise.all([
      saveProductsOnLocal(productsToUpdate, { overwrite: true }),
      saveProductsOnRemote(productsToUpdate),
    ]);
  }
};

const pullNfsFromRemote = async (entriesList: IndexEntry[]) => {
  const nfs = await getNfsFromRemote(entriesList.map(([id]) => id));

  if (nfs.length) {
    const indexMetadata = entriesList.map(entry => entry[1]);
    await saveNfsOnLocal(nfs, indexMetadata);
  }
};

const pushNfsToRemote = async (entriesList: IndexEntry[]) => {
  const files = await getNfsFromLocal(entriesList.map(([id]) => id));
  const validFiles = files.filter((file): file is Nf => !!file)!;

  const indexMetadata = entriesList.map(entry => entry[1]);
  await saveNfsOnRemote(validFiles, indexMetadata);
};

const syncProducts = async () => {
  const [localIndex, remoteIndex] = await Promise.all([
    createStorageIndex('/products/index.csv'),
    getProductsRemoteIndex(),
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
  const [localIndex, remoteIndex] = await Promise.all([
    createStorageIndex('/nfs/index.csv'),
    getNfsRemoteIndex(),
  ]);

  const { missingLocalFiles, missingRemoteFiles } = await getMissingFiles(
    localIndex,
    remoteIndex
  );

  // console.dir({ missingLocalFiles, missingRemoteFiles }, { depth: null });

  if (missingLocalFiles.length) {
    await pullNfsFromRemote(missingLocalFiles);
  }

  if (missingRemoteFiles.length) {
    await pushNfsToRemote(missingRemoteFiles);
  }
};

const startSync = () => Promise.all([syncProducts(), syncNfs()]);

export default {
  startSync,
};

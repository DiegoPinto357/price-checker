import { nf, storage, database } from './proxies';
import createStorageIndex from './storageIndex';
import generateIndexEntry from './libs/generateIndexEntry';
import { Nf, WithId, WithIndex } from './types';

const mergeProducts = (products: Nf['items']) =>
  products.reduce((merged, product) => {
    const existingProduct = merged.find(({ code }) => code === product.code);
    if (existingProduct) {
      existingProduct.amount += product.amount;
      existingProduct.totalValue += product.totalValue;
      return merged;
    }

    merged.push(product);
    return merged;
  }, [] as typeof products);

export const saveNfsOnLocal = async (
  nfs: Nf[],
  indexMetadata?: { timestamp: number; hash: string }[]
) => {
  if (!nfs.length) return;

  const localIndex = await createStorageIndex('/nfs/index.csv');

  let hasNewData = false;

  await Promise.all(
    nfs.map(async (nf, index) => {
      if (localIndex.get(nf.key)) return;
      hasNewData = true;

      const indexEntry = indexMetadata
        ? indexMetadata[index]
        : generateIndexEntry(nf);
      localIndex.set(nf.key, indexEntry);

      const filename = `/nfs/${nf.key}.json`;
      await storage.writeFile(filename, nf);
    })
  );

  if (hasNewData) {
    await localIndex.save();
  }
};

export const saveNfsOnRemote = async (
  nfs: Nf[],
  indexMetadata?: { timestamp: number; hash: string }[]
) => {
  if (!nfs.length) return;

  await Promise.all(
    nfs.map(async (nf, index) => {
      // TODO existing items are unlikely to happen, suggested to use update with upsert
      const existingEntry = await database.findOne<WithId<WithIndex<Nf>>>(
        'items',
        'nfs',
        {
          key: nf.key,
        },
        { projection: { _id: 0 } }
      );

      if (existingEntry) return;

      const indexEntry = indexMetadata
        ? indexMetadata[index]
        : generateIndexEntry(nf);

      await database.insertOne('items', 'nfs', {
        ...nf,
        index: indexEntry,
      });
    })
  );
};

export const getNfsFromLocal = (idList: string[]) =>
  Promise.all(idList.map(id => storage.readFile<Nf>(`/nfs/${id}.json`)));

export const getNfsFromRemote = async (idList: string[]) => {
  const records = (await database.find<WithId<WithIndex<Nf>>>(
    'items',
    'nfs',
    {
      $or: idList.map(id => ({ key: id })),
    },
    { projection: { _id: 0, index: 0 } }
  )) as Nf[];

  return records.filter((record): record is Nf => !!record)!;
};

export const getNfsRemoteIndex = async (): Promise<
  [string, { timestamp: number; hash: string }][]
> => {
  const records = await database.find<WithId<WithIndex<Nf>>>(
    'items',
    'nfs',
    {},
    { projection: { _id: 0, key: 1, index: 1 } }
  );

  return records.map(item => [item.key, item.index]);
};

export const getNfData = async (key: string) => {
  const nfData = await nf.getNfData(key);
  return { ...nfData, items: mergeProducts(nfData.items) };
};

export const saveNf = async (nf: Nf) => {
  await Promise.all([saveNfsOnLocal([nf]), saveNfsOnRemote([nf])]);
};

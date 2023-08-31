import { nf, storage, database } from './proxies';
import createStorageIndex from './storageIndex';
import generateIndexEntry from './libs/generateIndexEntry';
import { Nf } from './types';

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

const saveNfOnLocal = async (nf: Nf) => {
  const localIndex = await createStorageIndex('/nfs/index.csv');

  if (localIndex.get(nf.key)) return;

  localIndex.set(nf.key, generateIndexEntry(nf));

  const filename = `/nfs/${nf.key}.json`;
  await storage.writeFile(filename, nf);
  await localIndex.save();
};

const saveNfOnRemote = async (nf: Nf) => {
  const existingEntry = await database.findOne(
    'items',
    'nfs',
    {
      key: nf.key,
    },
    { projection: { _id: 0 } }
  );

  if (existingEntry) return;

  await database.insertOne('items', 'nfs', {
    ...nf,
    index: generateIndexEntry(nf),
  });
};

export const getNfData = async (key: string) => {
  const nfData = await nf.getNfData(key);
  return { ...nfData, items: mergeProducts(nfData.items) };
};

export const saveNf = async (nf: Nf) => {
  await Promise.all([saveNfOnLocal(nf), saveNfOnRemote(nf)]);
};

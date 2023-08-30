import { nf, storage, database } from './proxies';
import createCsv from './libs/csv';
import insertIndexEntry, { getIndexEntry } from './libs/insertIndexEntry';
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
  const indexFile = await createCsv('/nfs/index.csv');

  const { existingEntry } = insertIndexEntry(indexFile, nf, 'key');

  if (existingEntry) return;

  const filename = `/nfs/${nf.key}.json`;
  await storage.writeFile(filename, nf);
  await indexFile.save();
};

const saveNfOnRemote = async (nf: Nf) => {
  const existingEntry = await database.findOne('items', 'nfs', {
    key: nf.key,
  });

  if (existingEntry) return;

  await database.insertOne('items', 'nfs', { ...nf, index: getIndexEntry(nf) });
};

export const getNfData = async (key: string) => {
  const nfData = await nf.getNfData(key);
  return { ...nfData, items: mergeProducts(nfData.items) };
};

export const saveNf = async (nf: Nf) => {
  await Promise.all([saveNfOnLocal(nf), saveNfOnRemote(nf)]);
};

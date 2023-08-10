import { nf, storage } from './proxies';
import createCsv from './libs/csv';
import insertIndexEntry from './libs/insertIndexEntry';
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

export const getNfData = async (key: string) => {
  const nfData = await nf.getNfData(key);
  return { ...nfData, items: mergeProducts(nfData.items) };
};

export const saveNf = async (nf: Nf) => {
  const indexFile = await createCsv('/nfs/index.csv');

  const { existingEntry } = insertIndexEntry(indexFile, nf, 'key');

  const filename = `/nfs/${nf.key}.json`;
  await storage.writeFile(filename, nf);

  if (!existingEntry) {
    await indexFile.save();
  }
};

import { nf, storage } from './proxies';
import createCsv from './libs/csv';
import insertIndexEntry from './libs/insertIndexEntry';
import { Nf } from './types';

export const getNfData = nf.getNfData as (key: string) => Promise<Nf>;

export const saveNf = async (nf: Nf) => {
  const indexFile = await createCsv('/nfs/index.csv');

  const { existingEntry } = insertIndexEntry(indexFile, nf, 'key');

  const filename = `/nfs/${nf.key}.json`;
  await storage.writeFile(filename, nf);

  if (!existingEntry) {
    await indexFile.save();
  }
};

import md5 from 'md5';
import { nf, storage } from './proxies';
import createCsv from './libs/csv';
import { Nf } from './types';

export const getNfData = nf.getNfData as (key: string) => Promise<Nf>;

export const saveNf = async (nf: Nf) => {
  const indexFile = await createCsv('/nfs/index.csv');

  const existingEntryIndex = indexFile.findLineIndex(0, nf.key);
  if (existingEntryIndex === -1) {
    const hash = md5(JSON.stringify(nf));
    const timestamp = Date.now();
    const indexEntry = `${nf.key}, ${timestamp}, ${hash}\n`;
    indexFile.appendLine(indexEntry);
  }

  const filename = `/nfs/${nf.key}.json`;
  await storage.writeFile(filename, nf);

  if (existingEntryIndex === -1) {
    await indexFile.save();
  }
};

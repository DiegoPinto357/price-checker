import { nf, storage } from './proxies';
import { Nf } from './types';

export const getNfData = nf.getNfData;

export const saveNf = async (nf: Nf) => {
  const filename = `/nfs/${nf.key}.json`;
  return await storage.writeFile(filename, nf);
};

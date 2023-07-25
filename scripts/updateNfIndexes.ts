import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import insertIndexEntry from '../src/libs/insertIndexEntry.js';
import createCsv from '../src/libs/csv.js';
import { Nf } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const nfsDir = path.join(__dirname, '../userData/nfs');
  const filesList = await fs.readdir(nfsDir);
  const jsonFilesList = filesList.filter(
    filename => filename.split('.')[1] === 'json'
  );
  console.log('List of NF files:');
  console.log(jsonFilesList);

  const indexFile = await createCsv('nfs/index.csv');
  console.log('Current index.csv file:');
  console.log(indexFile.getContent());

  for (const filename of jsonFilesList) {
    const nfData = JSON.parse(
      await fs.readFile(path.join(nfsDir, filename), 'utf-8')
    );
    insertIndexEntry<Nf>(indexFile, nfData, 'key');
  }

  console.log('New index.csv file:');
  console.log(indexFile.getContent());

  await indexFile.save();
  console.log('New index.csv saved!');
})();

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import insertIndexEntry from '../src/libs/insertIndexEntry.js';
import createCsv from '../src/libs/csv.js';
import { ProductHistory } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const nfsDir = path.join(__dirname, '../userData/products');
  const filesList = await fs.readdir(nfsDir);
  const jsonFilesList = filesList.filter(
    filename => filename.split('.')[1] === 'json'
  );
  console.log('List of product files:');
  console.log(jsonFilesList);

  const indexFile = await createCsv('products/index.csv');
  console.log('Current index.csv file:');
  console.log(indexFile.getContent());

  for (const filename of jsonFilesList) {
    const product = JSON.parse(
      await fs.readFile(path.join(nfsDir, filename), 'utf-8')
    );
    insertIndexEntry<ProductHistory>(indexFile, product, 'code');
  }

  console.log('New index.csv file:');
  console.log(indexFile.getContent());

  await indexFile.save();
  console.log('New index.csv saved!');
})();

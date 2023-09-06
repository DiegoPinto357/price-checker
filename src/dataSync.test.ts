import _ from 'lodash';
import createStorageIndex from './storageIndex';
import { storage, database } from './proxies';
import dataSync from './dataSync';
import generateIndexEntry from './libs/generateIndexEntry';
import { WithId, WithIndex, ProductHistory, Nf } from './types';
import {
  baseProductIndex as baseProductIndexObject,
  baseNfIndex as baseNfIndexObject,
  product1,
  product2,
  mergedProduct,
} from '../mockData/dataSync';

vi.mock('./proxies/storage');
vi.mock('./proxies/database');

type StorageMock = typeof storage & { clearFiles: () => void };
type DatabaseMock = typeof database & { clearRecords: () => void };

interface IndexEntryValue {
  timestamp: number;
  hash: string;
}

const dummyProduct = { description: '', history: [] };

const dummyNf = {
  version: '',
  env: '',
  csc: '',
  hash: '',
  number: '',
  series: '',
  date: '',
  protocol: '',
  store: { name: '', cnpj: '', incricaoEstadual: '', address: '' },
  items: [],
};

const setupRemoteProducts = async (
  indexEntries: Map<string, IndexEntryValue>,
  files?: ProductHistory[]
) => {
  const remoteFiles = Array.from(indexEntries).map(
    ([id, { timestamp, hash }], index) => {
      const fileToSave = files ? files[index] : dummyProduct;
      return {
        ...fileToSave,
        code: id,
        index: {
          timestamp,
          hash,
        },
      };
    }
  );
  await database.insert('items', 'products', remoteFiles);
};

const setupRemoteNfs = async (
  indexEntries: Map<string, IndexEntryValue>,
  files?: Nf[]
) => {
  const remoteFiles = Array.from(indexEntries).map(
    ([id, { timestamp, hash }], index) => {
      const fileToSave = files ? files[index] : dummyNf;
      return {
        ...fileToSave,
        key: id,
        index: {
          timestamp,
          hash,
        },
      };
    }
  );
  await database.insert('items', 'nfs', remoteFiles);
};

const setupLocalProducts = async (
  indexEntries: Map<string, IndexEntryValue>,
  files?: ProductHistory[]
) => {
  const csvIndex =
    Array.from(indexEntries).reduce(
      (csvContent, [id, { timestamp, hash }]) =>
        `${csvContent}\n${id}, ${timestamp}, ${hash}`,
      ''
    ) + '\n';
  await storage.writeFile('/products/index.csv', csvIndex);

  const filesToSave = files
    ? files
    : Array.from(indexEntries).map(([id]) => ({
        code: id,
        ...dummyProduct,
      }));

  for (const file of filesToSave) {
    await storage.writeFile(`/products/${file.code}.json`, file);
  }
};

const setupLocalNfs = async (
  indexEntries: Map<string, IndexEntryValue>,
  files?: Nf[]
) => {
  const csvIndex =
    Array.from(indexEntries).reduce(
      (csvContent, [id, { timestamp, hash }]) =>
        `${csvContent}\n${id}, ${timestamp}, ${hash}`,
      ''
    ) + '\n';
  await storage.writeFile('/nfs/index.csv', csvIndex);

  const filesToSave = files
    ? files
    : Array.from(indexEntries).map(([id]) => ({
        key: id,
        ...dummyNf,
      }));

  for (const file of filesToSave) {
    await storage.writeFile(`/nfs/${file.key}.json`, file);
  }
};

const baseProductIndex = new Map(Object.entries(baseProductIndexObject));
const baseNfIndex = new Map(Object.entries(baseNfIndexObject));

describe('dataSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const date = new Date(2023, 6, 17, 18, 4, 26, 234);
    vi.setSystemTime(date);
    vi.clearAllMocks();
    (storage as StorageMock).clearFiles();
    (database as DatabaseMock).clearRecords();
  });

  // rebuild local index (missing file OR index entry)

  describe('products', () => {
    it('pulls missing data from remote', async () => {
      const remoteIndex = baseProductIndex;
      const entriesToRemove = [
        '7896333041307',
        '7896333041383',
        '2989530000002',
        '7898994521204',
        '2022640000002',
      ];

      const localIndex = new Map(baseProductIndex);
      entriesToRemove.forEach(entry => localIndex.delete(entry));

      const missingEntries = entriesToRemove.map(entry => ({
        id: entry,
        index: { ...baseProductIndex.get(entry) },
      }));

      await setupRemoteProducts(remoteIndex);
      await setupLocalProducts(localIndex);

      await dataSync.startSync();

      const newLocalIndex = await createStorageIndex('/products/index.csv');

      for (const missingEntry of missingEntries) {
        const localItem = await storage.readFile(
          `/products/${missingEntry.id}.json`
        );

        expect(localItem).toEqual({
          code: missingEntry.id,
          ...dummyProduct,
        });

        expect(newLocalIndex.get(missingEntry.id)).toEqual(missingEntry.index);
      }
    });

    it('pushes missing data to remote', async () => {
      const localIndex = baseProductIndex;
      const entriesToRemove = [
        '7896333041307',
        '7896333041383',
        '2989530000002',
        '7898994521204',
        '2022640000002',
      ];

      const remoteIndex = new Map(baseProductIndex);
      entriesToRemove.forEach(entry => remoteIndex.delete(entry));

      const missingEntries = entriesToRemove.map(entry => ({
        id: entry,
        index: { ...baseProductIndex.get(entry) },
      }));

      await setupRemoteProducts(remoteIndex);
      await setupLocalProducts(localIndex);

      await dataSync.startSync();

      for (const missingEntry of missingEntries) {
        const remoteItem = await database.find(
          'items',
          'products',
          {
            code: missingEntry.id,
          },
          { projection: { _id: 0 } }
        );

        expect(remoteItem).toHaveLength(1);
        expect(remoteItem[0]).toEqual({
          code: missingEntry.id,
          index: missingEntry.index,
          ...dummyProduct,
        });
      }
    });

    it('merges product history data', async () => {
      const remoteProduct = product1;
      const localProduct = product2;

      const localIndex = new Map([
        [localProduct.code, generateIndexEntry(localProduct)],
      ]);
      await setupLocalProducts(localIndex, [localProduct]);

      const remoteIndex = new Map([
        [remoteProduct.code, generateIndexEntry(remoteProduct)],
      ]);
      await setupRemoteProducts(remoteIndex, [remoteProduct]);

      await dataSync.startSync();

      const expectedProduct = mergedProduct;

      const resultLocalIndex = await createStorageIndex('/products/index.csv');
      const resultLocalItemIndex = resultLocalIndex.get(localProduct.code);

      const resultLocalItem = await storage.readFile(
        `/products/${localProduct.code}.json`
      );

      const resultRemoteItem = await database.find<
        WithId<WithIndex<ProductHistory>>
      >(
        'items',
        'products',
        {
          code: remoteProduct.code,
        },
        { projection: { _id: 0 } }
      );

      expect(resultLocalItemIndex).toEqual(resultRemoteItem[0].index);
      expect(resultLocalItem).toEqual(expectedProduct);
      expect(resultRemoteItem).toHaveLength(1);
      expect(_.omit(resultRemoteItem[0], 'index')).toEqual(expectedProduct);
    });

    // describe('resolves conflicts on product history', () => {});
  });

  describe('nfs', () => {
    it('pulls missing data from remote', async () => {
      const remoteIndex = baseNfIndex;
      const entriesToRemove = [
        '43230593015006003210651060002744541496656957',
        '43230593015006003210651220005531961557462753',
        '43230593015006003210651270008838621425327965',
        '43230693015006003210651240012627391776533210',
        '43230793015006004291651010004202201906299678',
      ];

      const localIndex = new Map(baseNfIndex);
      entriesToRemove.forEach(entry => localIndex.delete(entry));

      const missingEntries = entriesToRemove.map(entry => ({
        id: entry,
        index: { ...baseNfIndex.get(entry) },
      }));

      await setupRemoteNfs(remoteIndex);
      await setupLocalNfs(localIndex);

      await dataSync.startSync();

      const newLocalIndex = await createStorageIndex('/nfs/index.csv');

      for (const missingEntry of missingEntries) {
        const localItem = await storage.readFile(
          `/nfs/${missingEntry.id}.json`
        );

        expect(localItem).toEqual({
          key: missingEntry.id,
          ...dummyNf,
        });

        expect(newLocalIndex.get(missingEntry.id)).toEqual(missingEntry.index);
      }
    });

    // it('pushes missing data to remote', async () => {});
  });
});

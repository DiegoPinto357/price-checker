import _ from 'lodash';
import createStorageIndex from './storageIndex';
import { storage, database } from './proxies';
import dataSync from './dataSync';
import generateIndexEntry from './libs/generateIndexEntry';
import { WithId, ProductHistory, ProductHistoryWithIndex } from './types';
import {
  baseIndex as baseIndexObject,
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

const setupRemote = async (
  collectionName: string,
  indexEntries: Map<string, IndexEntryValue>,
  files?: ProductHistory[]
) => {
  const remoteFiles = Array.from(indexEntries).map(
    ([id, { timestamp, hash }], index) => {
      const fileToSave = files
        ? files[index]
        : { description: '', history: [] };
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
  await database.insert('items', collectionName, remoteFiles);
};

const setupLocal = async (
  dataFolder: string,
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
        description: '',
        history: [],
      }));

  for (const file of filesToSave) {
    await storage.writeFile(`/${dataFolder}/${file.code}.json`, file);
  }
};

const baseIndex = new Map(Object.entries(baseIndexObject));

describe('dataSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const date = new Date(2023, 6, 17, 18, 4, 26, 234);
    vi.setSystemTime(date);
    vi.clearAllMocks();
    (storage as StorageMock).clearFiles();
    (database as DatabaseMock).clearRecords();
  });

  it('pulls missing data from remote', async () => {
    const remoteIndex = baseIndex;
    const entriesToRemove = [
      '7896333041307',
      '7896333041383',
      '2989530000002',
      '7898994521204',
      '2022640000002',
    ];

    const localIndex = new Map(baseIndex);
    entriesToRemove.forEach(entry => localIndex.delete(entry));

    const missingEntries = entriesToRemove.map(entry => ({
      id: entry,
      index: { ...baseIndex.get(entry) },
    }));

    await setupRemote('products', remoteIndex);
    await setupLocal('products', localIndex);

    await dataSync.startSync();

    const newLocalIndex = await createStorageIndex('/products/index.csv');

    missingEntries.forEach(async missingEntry => {
      const localItem = await storage.readFile(
        `/products/${missingEntry.id}.json`
      );

      expect(localItem).toEqual({
        code: missingEntry.id,
        description: '',
        history: [],
      });

      expect(newLocalIndex.get(missingEntry.id)).toEqual(missingEntry.index);
    });
  });

  it('pushes missing data to remote', async () => {
    const localIndex = baseIndex;
    const entriesToRemove = [
      '7896333041307',
      '7896333041383',
      '2989530000002',
      '7898994521204',
      '2022640000002',
    ];

    const remoteIndex = new Map(baseIndex);
    entriesToRemove.forEach(entry => remoteIndex.delete(entry));

    const missingEntries = entriesToRemove.map(entry => ({
      id: entry,
      index: { ...baseIndex.get(entry) },
    }));

    await setupRemote('products', remoteIndex);
    await setupLocal('products', localIndex);

    await dataSync.startSync();

    missingEntries.forEach(async missingEntry => {
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
        description: '',
        history: [],
      });
    });
  });

  it('merges product history data', async () => {
    const remoteProduct = product1;
    const localProduct = product2;

    const localIndex = new Map([
      [localProduct.code, generateIndexEntry(localProduct)],
    ]);
    await setupLocal('products', localIndex, [localProduct]);

    const remoteIndex = new Map([
      [remoteProduct.code, generateIndexEntry(remoteProduct)],
    ]);
    await setupRemote('products', remoteIndex, [remoteProduct]);

    await dataSync.startSync();

    const expectedProduct = mergedProduct;

    const resultLocalIndex = await createStorageIndex('/products/index.csv');
    const resultLocalItemIndex = resultLocalIndex.get(localProduct.code);

    const resultLocalItem = await storage.readFile(
      `/products/${localProduct.code}.json`
    );

    const resultRemoteItem = await database.find<
      WithId<ProductHistoryWithIndex>
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
  // rebuild local index (missing file OR index entry)
});

import createCsv from './libs/csv';

interface ParsedIndexEntry {
  id: string;
  timestamp: string;
  hash: string;
}

interface MapValue {
  timestamp: number;
  hash: string;
}

export default async (filename: string) => {
  const indexFile = await createCsv(filename);
  const parsedIndex = indexFile.parse<ParsedIndexEntry>([
    'id',
    'timestamp',
    'hash',
  ]);

  const indexMap = new Map(
    parsedIndex.map(entry => [
      entry.id,
      {
        timestamp: parseInt(entry.timestamp),
        hash: entry.hash,
      },
    ])
  );

  const get = (key: string) => indexMap.get(key);

  const set = (key: string, value: MapValue) => {
    indexMap.set(key, value);
  };

  const getEntries = () => Array.from(indexMap);

  const save = async () => {
    indexFile.setContent(indexMap);
    await indexFile.save();
  };

  return {
    get,
    set,
    getEntries,
    save,
  };
};

import md5 from 'md5';
import createCsv from './csv';

interface GetIndexEntryOptions {
  timestamp?: number;
  hash?: string;
}
// TODO refactor module interface/exports
export const getIndexEntry = <Data>(
  data: Data,
  idKey: keyof Data,
  options?: GetIndexEntryOptions
) => {
  const id = data[idKey] as string;
  const timestamp = options?.timestamp ? options.timestamp : Date.now();
  const hash = options?.hash ? options?.hash : md5(JSON.stringify(data));
  return { id, timestamp, hash };
};

interface Options extends GetIndexEntryOptions {
  overwriteExisting: boolean;
}

export default <Data>(
  indexFile: Awaited<ReturnType<typeof createCsv>>,
  data: Data,
  idKey: keyof Data,
  options?: Options
) => {
  const { id, timestamp, hash } = getIndexEntry<Data>(data, idKey, {
    timestamp: options?.timestamp,
    hash: options?.hash,
  });

  const indexEntry = `${id}, ${timestamp}, ${hash}\n`;

  const existingEntryIndex = indexFile.findLineIndex(0, data[idKey] as string);
  if (existingEntryIndex !== -1) {
    if (options?.overwriteExisting) {
      indexFile.replace(existingEntryIndex, indexEntry);
    }
    return { existingEntry: true };
  }
  indexFile.appendLine(indexEntry);
  return { existingEntry: false };
};

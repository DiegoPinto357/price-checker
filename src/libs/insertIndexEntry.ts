import md5 from 'md5';
import createCsv from './csv';

interface Options {
  overwriteExisting: boolean;
}

export default <Data>(
  indexFile: Awaited<ReturnType<typeof createCsv>>,
  data: Data,
  idKey: keyof Data,
  options?: Options
) => {
  const timestamp = Date.now();
  const hash = md5(JSON.stringify(data));
  const indexEntry = `${data[idKey]}, ${timestamp}, ${hash}\n`;

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

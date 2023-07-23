import { storage } from '../proxies';

export default async (filename: string) => {
  const currentFile = await storage.readFile<string>(filename);
  let content = currentFile ? currentFile : '';

  const findLineIndex = (colIndex: number, term: string) => {
    const lines = content.split('\n');
    let lineIndex = 0;
    const result = lines.some((line, index) => {
      const cols = line.split(',');
      lineIndex = index;
      return cols[colIndex].trim() === term;
    });
    return result ? lineIndex : -1;
  };

  const replace = (lineIndex: number, newLineContent: string) => {
    const lines = content.split('\n');
    lines[lineIndex] = newLineContent.trim();
    content = lines.join('\n');
  };

  const appendLine = (lineContent: string) => {
    content = content + lineContent;
  };

  const getContent = () => content;

  const save = () => storage.writeFile<string>(filename, content);

  return {
    findLineIndex,
    replace,
    appendLine,
    getContent,
    save,
  };
};

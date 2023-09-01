import { storage } from '../proxies';

const parseCsvLine = <T>(csvLine: string, headers: Array<keyof T>) => {
  const items = csvLine.split(',').map(item => item.trim());

  return headers.reduce((obj, header, index) => {
    obj[header] = items[index];
    return obj;
  }, {} as Record<keyof T, string>);
};

export default async (filename: string) => {
  const currentFile = await storage.readFile<string>(filename);
  let content = currentFile ? currentFile : '';

  const parse = <T>(headers: Array<keyof T>) => {
    if (content.trim() === '') return [];
    return content
      .trim()
      .split('\n')
      .map(line => parseCsvLine<T>(line, headers));
  };

  const setContent = <K, V extends object>(data: Map<K, V>) => {
    content = '';
    data.forEach((valueObject, key) => {
      content += key;
      Object.values(valueObject).forEach(value => (content += `, ${value}`));
      content += `\n`;
    });
  };

  const save = () => storage.writeFile<string>(filename, content);

  return {
    parse,
    setContent,
    save,
  };
};

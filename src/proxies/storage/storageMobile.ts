import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import config from '../../nodejs/config.json';

const userDataFolder = config.sandboxMode
  ? '/PriceChecker-sandbox'
  : '/PriceChecker';

const getFullPath = (filename: string) => `${userDataFolder}${filename}`;

const readFile = async <T>(filename: string) => {
  try {
    const { data } = await Filesystem.readFile({
      path: getFullPath(filename),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    const fileExtension = filename.split('.')[1];
    return (fileExtension === 'json' ? JSON.parse(data as string) : data) as T;
  } catch (e) {
    console.log(`${filename} file not found.`);
  }
};

const writeFile = async <T>(filename: string, data: T) =>
  Filesystem.writeFile({
    path: getFullPath(filename), // TODO improve path join
    data: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
    recursive: true,
  });

export default {
  readFile,
  writeFile,
};

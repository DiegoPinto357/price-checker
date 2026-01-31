import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { getServerConfig } from '../serverConfig';
import logger from '../../libs/logger';

const getUserDataFolder = async () => {
  const config = await getServerConfig();
  return config.sandboxMode ? '/PriceChecker-sandbox' : '/PriceChecker';
};

const getFullPath = async (filename: string) => {
  const userDataFolder = await getUserDataFolder();
  return `${userDataFolder}${filename}`;
};

const readFile = async <T>(filename: string) => {
  try {
    const { data } = await Filesystem.readFile({
      path: await getFullPath(filename),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    const fileExtension = filename.split('.')[1];
    return (fileExtension === 'json' ? JSON.parse(data as string) : data) as T;
  } catch (e) {
    logger.log(`${filename} file not found.`);
  }
};

const writeFile = async <T>(filename: string, data: T) =>
  Filesystem.writeFile({
    path: await getFullPath(filename), // TODO improve path join
    data: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
    recursive: true,
  });

export default {
  readFile,
  writeFile,
};

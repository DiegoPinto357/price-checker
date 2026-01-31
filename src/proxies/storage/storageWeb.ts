import logger from '../../libs/logger';

const writeFile = async <T>(filename: string, data: T) => {
  try {
    const fileContent =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    localStorage.setItem(filename, fileContent);
  } catch (error) {
    logger.error(`Error writing file ${filename} to localStorage:`, error);
    throw error;
  }
};

const readFile = async <T>(filename: string) => {
  try {
    const fileContent = localStorage.getItem(filename);
    if (fileContent === null) {
      return undefined;
    }

    const fileExtension = filename.split('.').pop();
    return (fileExtension === 'json'
      ? JSON.parse(fileContent)
      : fileContent) as T;
  } catch (error) {
    logger.error(`Error reading file ${filename} from localStorage:`, error);
    return undefined;
  }
};

export default {
  writeFile,
  readFile,
};

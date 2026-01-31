import fs from 'fs/promises';
import coreFs from 'fs';
import path from 'path';
import { getConfig } from '../config/index.js';

const getUserDataFolder = (): string => {
  const { sandboxMode } = getConfig();
  return sandboxMode ? './userData-sandbox' : './userData';
};

export const writeFile = async (filename: string, data: unknown): Promise<void> => {
  const userDataFolder = getUserDataFolder();
  const fullPath = path.join(userDataFolder, filename);
  const { dir } = path.parse(fullPath);

  if (!coreFs.existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }

  const fileContent =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  await fs.writeFile(fullPath, fileContent, 'utf-8');
};

export const readFile = async (filename: string): Promise<unknown> => {
  const userDataFolder = getUserDataFolder();
  const fullPath = path.join(userDataFolder, filename);
  const fileContent = await fs.readFile(fullPath, 'utf-8');
  const fileExtension = filename.split('.').pop();
  return fileExtension === 'json' ? JSON.parse(fileContent) : fileContent;
};

export default {
  writeFile,
  readFile,
};

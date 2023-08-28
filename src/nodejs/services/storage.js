/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const coreFs = require('fs');
const path = require('path');
const { sandboxMode } = require('../config');

const fs = coreFs.promises;

const userDataFolder = sandboxMode ? './userData-sandbox' : './userData';

const writeFile = async (filename, data) => {
  const fullPath = path.join(userDataFolder, filename);
  const { dir } = path.parse(fullPath);

  if (!coreFs.existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }

  const fileContent =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  return await fs.writeFile(fullPath, fileContent, 'utf-8');
};

const readFile = async filename => {
  const fullPath = path.join(userDataFolder, filename);
  const fileContent = await fs.readFile(fullPath, 'utf-8');
  const fileExtension = filename.split('.')[1];
  return fileExtension === 'json' ? JSON.parse(fileContent) : fileContent;
};

module.exports = {
  writeFile,
  readFile,
};

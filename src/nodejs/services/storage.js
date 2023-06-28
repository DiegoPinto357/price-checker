/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const path = require('path');

const userDataFolder = './userData';

const writeFile = async (filename, data) => {
  const fullPath = path.join(userDataFolder, filename);
  return await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
};

const readFile = async filename => {
  const fullPath = path.join(userDataFolder, filename);
  return JSON.parse(await fs.readFile(fullPath, 'utf-8'));
};

module.exports = {
  writeFile,
  readFile,
};

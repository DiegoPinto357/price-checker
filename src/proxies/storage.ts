import axios from 'axios';

const writeFile = async (filename: string, data: unknown) =>
  await axios.post('http://127.0.0.1:3001/storage/write-file', {
    filename,
    data,
  });

export default {
  writeFile,
};

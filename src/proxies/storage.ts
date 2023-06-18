import axios from 'axios';

const writeFile = async <T>(filename: string, data: T) =>
  await axios.post('http://127.0.0.1:3001/storage/write-file', {
    filename,
    data,
  });

export default {
  writeFile,
};

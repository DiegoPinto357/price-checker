import axios from 'axios';

const writeFile = async <T>(filename: string, data: T) =>
  await axios.post('http://127.0.0.1:3002/storage/write-file', {
    filename,
    data,
  });

const readFile = async <T>(filename: string) => {
  try {
    const { data } = await axios.get(
      `http://127.0.0.1:3002/storage/read-file/${encodeURIComponent(filename)}`
    );
    return data as T;
  } catch (error) {
    return;
  }
};

export default {
  writeFile,
  readFile,
};

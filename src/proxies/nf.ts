import axios from 'axios';
import { Nf } from '../types';

const getNfData = async (key: string): Promise<Nf> => {
  const { data } = await axios.get('http://127.0.0.1:3002/nf-data', {
    params: { key },
  });
  return data;
};

export default {
  getNfData,
};

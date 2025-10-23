import axios from 'axios';
import { SERVER_HOST } from '../config';
import { Nf } from '../types';

const getNfData = async (key: string): Promise<Nf> => {
  const { data } = await axios.get(`${SERVER_HOST}/nf-data`, {
    params: { key },
  });
  return data;
};

export default {
  getNfData,
};

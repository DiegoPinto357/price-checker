import axios from 'axios';
import { getServerHost } from '../config';
import { Nf } from '../types';

const getNfData = async (key: string): Promise<Nf> => {
  const serverHost = await getServerHost();
  const { data } = await axios.get(`${serverHost}/nf-data`, {
    params: { key },
  });
  return data;
};

export default {
  getNfData,
};

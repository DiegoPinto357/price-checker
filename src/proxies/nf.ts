import { Capacitor } from '@capacitor/core';
import axios from 'axios';
import ipc from '../ipc';
import { Nf } from '../types';

const platform = Capacitor.getPlatform();

const getNfDataHttp = async (key: string): Promise<Nf> => {
  const { data } = await axios.get('http://127.0.0.1:3001/nf-data', {
    params: { key },
  });
  return data;
};

const getNfDataIpc = (key: string): Promise<Nf> =>
  ipc.send<Nf>(`get:nf-data`, key);

const getNfData = platform === 'web' ? getNfDataHttp : getNfDataIpc;

export default {
  getNfData,
};

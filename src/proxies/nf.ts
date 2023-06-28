import { Capacitor } from '@capacitor/core';
import { NodeJS } from 'capacitor-nodejs';
import axios from 'axios';
import { Nf } from '../types';

const platform = Capacitor.getPlatform();

const getNfDataHttp = async (key: string): Promise<Nf> => {
  const { data } = await axios.get('http://127.0.0.1:3001/nf-data', {
    params: { key },
  });
  return data;
};

const getNfDataIpc = (key: string): Promise<Nf> =>
  new Promise(resolve => {
    NodeJS.addListener('reply', event => {
      const data = event.args[0];
      resolve(data);
    });

    NodeJS.send({
      eventName: '/nf-data',
      args: [key],
    });
  });

const getNfData = platform === 'web' ? getNfDataHttp : getNfDataIpc;

export default {
  getNfData,
};

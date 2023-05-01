import { Capacitor } from '@capacitor/core';
import { NodeJS } from 'capacitor-nodejs';
import axios from 'axios';

const platform = Capacitor.getPlatform();

const getNfDataHttp = async (key: string) => {
  const { data } = await axios.get('http://127.0.0.1:3001/items', {
    params: { key },
  });
  return data;
};

const getNfDataIpc = (key: string) =>
  new Promise(resolve => {
    NodeJS.addListener('reply', event => {
      const data = event.args[0];
      console.log(data);
      resolve(data);
    });

    NodeJS.send({
      eventName: '/items',
      args: [key],
    });
  });

const getNfData = platform === 'web' ? getNfDataHttp : getNfDataIpc;

export default { getNfData };

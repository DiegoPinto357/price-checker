import { Capacitor } from '@capacitor/core';
import { NodeJS } from 'capacitor-nodejs';
import axios from 'axios';

const platform = Capacitor.getPlatform();

const findHttp = async (databaseName: string, collectionName: string) => {
  try {
    const { data } = await axios.post('http://127.0.0.1:3001/database/find', {
      databaseName,
      collectionName,
    });
    return data;
  } catch (error) {
    return;
  }
};

const findIpc = async (databaseName: string, collectionName: string) =>
  new Promise(resolve => {
    NodeJS.addListener('reply-db', event => {
      const data = event.args[0];
      resolve(data);
    });

    NodeJS.send({
      eventName: '/database/find',
      args: [databaseName, collectionName],
    });
  });

const find = platform === 'web' ? findHttp : findIpc;

export default {
  find,
};

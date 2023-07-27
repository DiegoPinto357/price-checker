import { NodeJS } from 'capacitor-nodejs';

const find = async <T>(
  databaseName: string,
  collectionName: string,
  filter: object
): Promise<T[]> =>
  new Promise(resolve => {
    NodeJS.addListener('reply-db', event => {
      const data = event.args[0];
      resolve(data as T[]);
    });

    NodeJS.send({
      eventName: '/database/find',
      args: [databaseName, collectionName, filter],
    });
  });

export default {
  find,
};

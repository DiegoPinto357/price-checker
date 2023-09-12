/* eslint-disable @typescript-eslint/no-empty-function */
import { NodeJS } from 'capacitor-nodejs';
import { FindOne, Insert, InsertOne, UpdateOne } from './types';

const find = async <T>(
  databaseName: string,
  collectionName: string,
  filter?: object
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
  findOne: (() => {}) as unknown as FindOne,
  insert: (() => {}) as unknown as Insert,
  insertOne: (() => {}) as unknown as InsertOne,
  updateOne: (() => {}) as unknown as UpdateOne,
};

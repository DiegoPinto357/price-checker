/* eslint-disable @typescript-eslint/no-empty-function */
import ipc from '../../ipc';
import { Find, FindOneOptions, Insert, InsertOne, UpdateOne } from './types';

// const find = async <T>(
//   databaseName: string,
//   collectionName: string,
//   filter?: object
// ): Promise<T[]> =>
//   new Promise(resolve => {
//     NodeJS.addListener('reply-db', event => {
//       const data = event.args[0];
//       resolve(data as T[]);
//     });

//     NodeJS.send({
//       eventName: '/database/find',
//       args: [databaseName, collectionName, filter],
//     });
//   });

const findOne = async <T>(
  databaseName: string,
  collectionName: string,
  filter: object,
  options?: FindOneOptions<T>
): Promise<T | null> => {
  return await ipc.send('post:database/findOne', {
    databaseName,
    collectionName,
    filter,
    options,
  });
};

export default {
  find: (() => {}) as unknown as Find,
  findOne,
  insert: (() => {}) as unknown as Insert,
  insertOne: (() => {}) as unknown as InsertOne,
  updateOne: (() => {}) as unknown as UpdateOne,
};

import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();

export interface DatabaseProxy {
  find: <T>(
    databaseName: string,
    collectionName: string,
    filter: object
  ) => Promise<T[]>;
}

export default platform === 'web'
  ? ((await import('./databaseHttp')).default as unknown as DatabaseProxy)
  : ((await import('./databaseIpc')).default as unknown as DatabaseProxy);
